
from __future__ import annotations

import logging
from dataclasses import dataclass
from enum import Enum, auto
from time import time
from typing import List


# --------------------------------------------------------------------- #
#  Logging setup                                                        #
# --------------------------------------------------------------------- #

log = logging.getLogger("gatekeeper")
if not log.handlers:
    _h = logging.StreamHandler()
    _h.setFormatter(logging.Formatter("[%(asctime)s] %(levelname)s | %(message)s"))
    log.addHandler(_h)
log.setLevel(logging.INFO)


# --------------------------------------------------------------------- #
#  Enums & data-structures                                              #
# --------------------------------------------------------------------- #

class PathFlag(Enum):
    NORMAL = auto()
    OBSCURED = auto()
    SUSPICIOUS = auto()


class RiskFlag(Enum):
    STABLE = auto()
    WATCHLIST = auto()
    CRITICAL = auto()


@dataclass(slots=True, frozen=True)
class GateRules:
    hop_obscured: int = 4
    hop_suspicious: int = 6
    proxies_min: int = 2

    density_watch: int = 150
    density_critical: int = 300

    token_age_limit: int = 5       # days
    recent_alert_limit: int = 2    # count in last 24 h


# --------------------------------------------------------------------- #
#  Core engine                                                          #
# --------------------------------------------------------------------- #

@dataclass(slots=True)
class AccessGatekeeper:
    rules: GateRules = GateRules()

    # -------- path-level opacity analysis -------- #
    def path_score(self, hops: List[str]) -> PathFlag:
        proxies = hops.count("unknown_wallet")

        if len(hops) >= self.rules.hop_suspicious and proxies >= self.rules.proxies_min:
            return PathFlag.SUSPICIOUS
        if len(hops) >= self.rules.hop_obscured:
            return PathFlag.OBSCURED
        return PathFlag.NORMAL

    # -------- activity + age composite score ------ #
    def risk_score(
        self,
        tx_density: float,
        token_age_days: int,
        recent_alerts: int,
    ) -> RiskFlag:
        if (
            tx_density > self.rules.density_critical
            and token_age_days < self.rules.token_age_limit
            and recent_alerts >= self.rules.recent_alert_limit
        ):
            return RiskFlag.CRITICAL
        if tx_density > self.rules.density_watch:
            return RiskFlag.WATCHLIST
        return RiskFlag.STABLE

    # -------- convenient one-shot helper ---------- #
    def evaluate(
        self,
        hops: List[str],
        tx_density: float,
        token_age_days: int,
        recent_alerts: int,
    ) -> tuple[PathFlag, RiskFlag]:
        path_flag = self.path_score(hops)
        risk_flag = self.risk_score(tx_density, token_age_days, recent_alerts)
        self._trace("eval", f"path={path_flag.name} risk={risk_flag.name}")
        return path_flag, risk_flag

    @staticmethod
    def _trace(evt: str, meta: str) -> None:
        log.info("[GATE] %s — %s @ %d", evt, meta, int(time()))


# --------------------------------------------------------------------- #
#  Quick demo                                                           #
# --------------------------------------------------------------------- #

if __name__ == "__main__":
    gk = AccessGatekeeper()

    sample_hops = [
        "walletA",
        "unknown_wallet",
        "proxy_1",
        "walletB",
        "unknown_wallet",
        "walletC",
    ]
    gk.evaluate(
        hops=sample_hops,
        tx_density=310,
        token_age_days=2,
        recent_alerts=3,
    )
