# veil_guard.py
"""
Veil Guard – on-chain path & risk evaluator

• Class-based API (`VeilGuard`) with configurable thresholds
• Path opacity scoring (proxy hops, length)
• Activity-density risk scoring (tx density, token age, alert history)
• Structured logging helper
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from enum import Enum, auto
from time import time
from typing import List


# ───────────────────────────── logging ───────────────────────────── #

_log = logging.getLogger("veil_guard")
if not _log.handlers:
    _h = logging.StreamHandler()
    _h.setFormatter(logging.Formatter("[%(asctime)s] %(levelname)s | %(message)s"))
    _log.addHandler(_h)
_log.setLevel(logging.INFO)


# ──────────────────────────── enums ──────────────────────────────── #

class PathFlag(Enum):
    NORMAL = "normal"
    OBSCURED = "obscured"
    SUSPICIOUS = "suspicious"


class RiskFlag(Enum):
    STABLE = "stable"
    WATCHLIST = "watchlist"
    CRITICAL = "critical"


# ──────────────────────────── rule set ───────────────────────────── #

@dataclass(slots=True, frozen=True)
class GuardRules:
    # path thresholds
    hop_obscured: int = 4
    hop_suspicious: int = 6
    min_proxies: int = 2

    # risk thresholds
    density_watch: int = 150
    density_critical: int = 300
    token_age_limit: int = 5        # days
    recent_alert_limit: int = 2     # prior alerts


# ──────────────────────────── core guard ─────────────────────────── #

@dataclass(slots=True)
class VeilGuard:
    rules: GuardRules = GuardRules()
    enable_log: bool = True

    # -------- path analysis -------- #
    def assess_path(self, hops: List[str]) -> PathFlag:
        proxy_cnt = hops.count("unknown_wallet")
        if len(hops) >= self.rules.hop_suspicious and proxy_cnt >= self.rules.min_proxies:
            return PathFlag.SUSPICIOUS
        if len(hops) >= self.rules.hop_obscured:
            return PathFlag.OBSCURED
        return PathFlag.NORMAL

    # -------- risk analysis -------- #
    def assess_risk(
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

    # -------- combined report -------- #
    def evaluate(
        self,
        hops: List[str],
        tx_density: float,
        token_age_days: int,
        recent_alerts: int,
    ) -> dict:
        path_flag = self.assess_path(hops)
        risk_flag = self.assess_risk(tx_density, token_age_days, recent_alerts)
        report = {
            "path_flag": path_flag.value,
            "risk_flag": risk_flag.value,
            "timestamp": int(time()),
        }
        if self.enable_log:
            _log.info(
                "[VEIL] path=%s risk=%s density=%.1f age=%sd alerts=%d",
                path_flag.value,
                risk_flag.value_
