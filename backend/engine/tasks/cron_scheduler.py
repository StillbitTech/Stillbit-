# tx_risk_engine.py

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from enum import Enum
from time import time
from typing import List

# ------------------------------------------------------------------ #
#  Logging                                                           #
# ------------------------------------------------------------------ #

logger = logging.getLogger("tx-risk")
handler = logging.StreamHandler()
handler.setFormatter(logging.Formatter("[%(asctime)s] %(levelname)s - %(message)s"))
if not logger.handlers:
    logger.addHandler(handler)
logger.setLevel(logging.INFO)


# ------------------------------------------------------------------ #
#  Enums                                                             #
# ------------------------------------------------------------------ #

class PathRating(Enum):
    NORMAL = "Normal Flow"
    OBSCURED = "Obscured Transaction Trail"
    SUSPICIOUS = "Suspicious Movement Detected"


class RiskRating(Enum):
    STABLE = "Stable"
    WATCHLIST = "Watchlist"
    CRITICAL = "Immediate Risk Alert"


# ------------------------------------------------------------------ #
#  Configurable rules                                                #
# ------------------------------------------------------------------ #

@dataclass(slots=True, frozen=True)
class RiskRules:
    hop_obscured: int = 4
    hop_suspicious: int = 6
    min_proxies: int = 2

    density_watch: int = 150
    density_critical: int = 300

    token_age_limit: int = 5         # days
    recent_alert_limit: int = 2      # previous alerts window


DEFAULT_RULES = RiskRules()


# ------------------------------------------------------------------ #
#  Core evaluator                                                    #
# ------------------------------------------------------------------ #

@dataclass(slots=True)
class TxRiskEngine:
    rules: RiskRules = field(default_factory=lambda: DEFAULT_RULES)

    # ---------- Path analysis ---------- #
    def dark_track(self, path: List[str]) -> PathRating:
        """Classify path opacity by length and proxy count."""
        proxies = path.count("unknown_wallet")
        hops = len(path)

        if hops >= self.rules.hop_suspicious and proxies >= self.rules.min_proxies:
            return PathRating.SUSPICIOUS
        if hops >= self.rules.hop_obscured:
            return PathRating.OBSCURED
        return PathRating.NORMAL

    # ---------- Density / age analysis ---------- #
    def risk_alert(
        self,
        tx_density: float,
        token_age_days: int,
        recent_alerts: int,
    ) -> RiskRating:
        """Assess risk from transaction density, token age, and alert history."""
        if (
            tx_density > self.rules.density_critical
            and token_age_days < self.rules.token_age_limit
            and recent_alerts >= self.rules.recent_alert_limit
        ):
            return RiskRating.CRITICAL
        if tx_density > self.rules.density_watch:
            return RiskRating.WATCHLIST
        return RiskRating.STABLE

    # ---------- Utility ---------- #
    @staticmethod
    def log_trace(event: str, meta: str) -> None:
        logger.info("[TRACE] %s — %s @ %d", event, meta, int(time()))


# ------------------------------------------------------------------ #
#  Demo (only runs if executed directly)                             #
# ------------------------------------------------------------------ #

if __name__ == "__main__":
    engine = TxRiskEngine()

    sample_path = [
        "walletA",
        "proxy_1",
        "unknown_wallet",
        "walletB",
        "unknown_wallet",
        "walletC",
    ]

    rating = engine.dark_track(sample_path)
    print("Path rating:", rating.value)

    risk = engine.risk_alert(tx_density=320, token_age_days=2, recent_alerts=3)
    print("Overall risk:", risk.value)

    engine.log_trace("demo_run", f"path={rating.name}, risk={risk.name}")
