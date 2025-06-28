
from __future__ import annotations

import base64
import hmac
import json
import secrets
import time
from dataclasses import dataclass, field
from hashlib import sha256
from typing import Dict, Optional

ALG = "HS256"                    # only HMAC-SHA256 for simplicity
_B64 = lambda b: base64.urlsafe_b64encode(b).rstrip(b"=").decode("ascii")


@dataclass(slots=True)
class TokenService:
    secret: str = field(repr=False)                   # signing key
    default_ttl: int = 900                            # 15 min
    blacklist: set[str] = field(default_factory=set)  # revoked jti values

    # ------------------------------------------------------------------ #
    #  Public API                                                        #
    # ------------------------------------------------------------------ #

    def issue(
        self,
        payload: Dict[str, str | int],
        ttl: Optional[int] = None,
    ) -> str:
        """
        Create a signed token. Adds `iat`, `exp`, and unique `jti`.
        """
        now = int(time.time())
        ttl = ttl if ttl is not None else self.default_ttl
        claims = {
            **payload,
            "iat": now,
            "exp": now + ttl,
            "jti": secrets.token_hex(8),
        }
        header = {"alg": ALG, "typ": "JWT"}

        segments = [
