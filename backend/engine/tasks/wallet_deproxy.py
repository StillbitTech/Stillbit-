
"""
Advanced proxy–wallet resolver.

Features
--------
• Two-phase resolution:
    1. Static map lookup   → known proxy → real address
    2. Fallback de-proxy   → unknown proxy → placeholder ("unknown_wallet")

• Streaming mode that keeps running counts and emits stats.

Usage
-----
    resolver = ProxyResolver(
        static_map={"proxy_liquid": "wallet_liquidity_pool"},
        placeholder="mystery_wallet",
    )

    resolved = resolver.resolve_chain(["proxy_liquid", "walletA", "proxy_X"])
    print(resolved)  # ['wallet_liquidity_pool', 'walletA', 'mystery_wallet']

    # bulk
    traces = [...]
    print(resolver.resolve_traces(traces, with_stats=True))
"""

from __future__ import annotations

import logging
from collections import Counter, defaultdict
from dataclasses import dataclass, field
from typing import Dict, List, Tuple

logger = logging.getLogger("proxy-resolver")
logger.setLevel(logging.INFO)
if not logger.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter("[%(levelname)s] %(message)s"))
    logger.addHandler(handler)


@dataclass(slots=True)
class ProxyResolver:
    static_map: Dict[str, str] = field(default_factory=dict)
    placeholder: str = "unknown_wallet"
    stats_enabled: bool = False

    # internal counters (populated if stats_enabled)
    _replacements: Counter[str] = field(init=False, default_factory=Counter)
    _total_processed: int = 0

    # --------------------------- Core methods --------------------------- #

    def resolve_wallet(self, addr: str) -> str:
        """Resolve a single address—static map first, then fallback."""
        if addr in self.static_map:
            resolved = self.static_map[addr]
            self._track(addr, resolved)
            return resolved

        if addr.startswith("proxy_"):
            self._track(addr, self.placeholder)
            return self.placeholder

        # non-proxy, unchanged
        return addr

    def resolve_chain(self, chain: List[str]) -> List[str]:
        """Resolve an ordered list of addresses."""
        return [self.resolve_wallet(a) for a in chain]

    def resolve_traces(
        self,
        traces: List[List[str]],
        *,
        with_stats: bool = False,
    ) -> Tuple[List[List[str]], Dict[str, int] | None]:
        """Resolve multiple traces; optionally return replacement stats."""
        resolved = [self.resolve_chain(t) for t in traces]
        stats = dict(self._replacements) if (with_stats and self.stats_enabled) else None
        return resolved, stats

    # -------------------------- Stats helpers -------------------------- #

    def enable_stats(self) -> None:
        self.stats_enabled = True

    def reset_stats(self) -> None:
        self._replacements.clear()
        self._total_processed = 0

    def _track(self, original: str, replacement: str) -> None:
        if not self.stats_enabled:
            return
        self._replacements[original] += 1
        self._total_processed += 1

    # ------------------------- Debug printing -------------------------- #

    def print_stats(self) -> None:
        if not self.stats_enabled:
            logger.info("Statistics disabled.")
            return
        logger.info("Total proxies processed: %d", self._total_processed)
        fo
