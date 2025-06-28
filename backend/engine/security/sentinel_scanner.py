

from __future__ import annotations

import logging
from dataclasses import dataclass
from enum import Enum, auto
from time import time
from typing import List


# ────────────────────────────── logging ───────────────────────────── #

_log = logging.getLogger("sentinel")
if not _log.handlers:
    handler = logging.StreamHandler()
    handler.setFormatter(logging.Formatter("[%(asctime)s] %(levelname)s | %(message)s"))
    _log.addHandler(handler)
_log.setLevel(logging.INFO)


# ────────────────────────────── enums ─────────────────────────────── #

class PathState(Enum):
    NORMAL = auto()
    OBSCURED = auto()
    SUSPICIOUS = auto()


class RiskState(Enum):
    STABLE = auto()
    WATCHLIST = auto()
    CRITICAL = auto()


# ────────────────────────────── ruleset ───────────────────────────── #

@dataclass(slots=True, frozen=True)
class ScanRules:
    hop_obscured: int = 4
    hop_suspicious: int = 6
    min_proxies: int = 2

    density_watch: int = 150
    density_critical: int = 300

    token_age_limit: int = 5        # days
    alert_window_limit: int = 2     # recent alerts


RULES = ScanRules()


# ──────────────────────────── core logic ──────────────────────────── #

def evaluate_path(path: List[str], rules: ScanRules = RULES) -> PathState:
    proxies = path.count("unknown_wallet")
    if len(path) >= rules.hop_suspicious and proxies >= rules.min_proxies:
        return PathState.SUSPICIOUS
    if len(path) >= rules.hop_obscured:
        return PathState.OBSCURED
    return PathState.NORMAL


def evaluate_risk(
    tx_density: float,
    token_age_days: int,
    recent_alerts: int,
    rules: ScanRules = RULES,
) -> RiskState:
    if (
        tx_density > rules.density_critical
        and token_age_days < rules.token_age_limit
        and recent_alerts >= rules.alert_window_limit
    ):
        return RiskState.CRITICAL
    if tx_density > rules.density_watch:
        return RiskState.WATCHLIST
    return RiskState.STABLE


def trace(event: str, meta: str) -> None:
    _log.info("[TRACE] %s — %s @ %d", event, meta, int(time()))
