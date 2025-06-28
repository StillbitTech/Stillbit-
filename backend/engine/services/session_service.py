# session_service.py
"""
In-memory session manager with sliding expiration and concurrency safety.

Features
--------
• create / read / refresh / destroy session tokens
• per-session data payload (dict)
• automatic TTL eviction via background sweeper
• thread-safe using RLock
"""

from __future__ import annotations

import secrets
import threading
import time
from dataclasses import dataclass, field
from typing import Dict, Optional

_DEFAULT_TTL = 1_800        # 30 minutes
_SWEEP_INTERVAL = 60        # 1 minute


@dataclass(slots=True)
class Session:
    data: Dict[str, str] = field(default_factory=dict)
    expires_at: float = field(init=False)

    def __post_init__(self) -> None:
        self.touch()

    def touch(self, ttl: int = _DEFAULT_TTL) -> None:
        self.expires_at = time.time() + ttl


class SessionService:
    def __init__(self, ttl: int = _DEFAULT_TTL) -> None:
        self._ttl = ttl
        self._store: Dict[str, Session] = {}
        self._lock = threading.RLock()

        self._sweeper = threading.Thread(target=self._evict_loop, daemon=True)
        self._running = True
        self._sweeper.start()

    # ---------------------------------------------------------------- #
    #  Public API                                                      #
    # ---------------------------------------------------------------- #

    def create(self, payload: Optional[Dict[str, str]] = None) -> str:
        """Return new session token."""
        token = secrets.token_urlsafe(32)
        with self._lock:
            self._store[token] = Session(payload or {}, time.time() + self._ttl)
        return token

    def get(self, token: str) -> Optional[Dict[str, str]]:
        """Fetch session payload or None if expired/missing."""
        with self._lock:
            sess = self._store.get(token)
            if not sess or sess.expires_at < time.time():
                self._store.pop(token, None)
                return None
            return sess.
