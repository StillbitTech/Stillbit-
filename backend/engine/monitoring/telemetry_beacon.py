# telemetry_beacon.py
"""
Telemetry Beacon — streaming telemetry collector and evaluator.
Replaces the simplistic dark_track / risk_alert utilities.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from enum import Enum, auto
from time import time
from typing import Iterable, List


# ───────────────────────────── logging ───────────────────────────── #

logger = logging.getLogger("telemetry_beacon")
if not logger.handlers:
    _h = logging.StreamHandler()
    _h.setFormatter(logging.Formatter("[%(asctime)s] %(levelname)s | %(message)s"))
    logger.addHandler(_h)
logger.setLevel(logging.INFO)


# ──────────────────────────── enums ──────────────────────────────── #

class FlowTag(Enum):
    NORMAL = auto()
    MASKED = auto()
    CRITICAL = auto()


class AlertTag(Enum):
    STABLE = auto()
    WATCH = auto()
    HOT = auto()


# ──────────────────────────── rule set ───────────────────────────── #

@dataclass(slots=True, frozen=True)
class BeaconRules:
    hop_masked: int = 4
    hop_critical: int = 6
    proxy_limit: int = 2

    density_watch: int = 150
    density_hot: int = 300
    token_age_cutoff: int = 5     # days
    recent_alert_cap: int = 2


RULES = BeaconRules()


# ──────────────────────────── core logic ─────────────────────────── #

def classify_flow(path: Iterable[str], rules: BeaconRules = RULES) -> FlowTag:
    hops = list(path)
    proxies = hops.count("unknown_wallet")

    if len(hops) >= rules.hop_critical and proxies >= rules.proxy_limit:
        return FlowTag.CRITICAL
    if len(hops) >= rules.hop_masked:
        return FlowTag.MASKED
    return FlowTag.NORMAL


def evaluate_alert(
    tx_density: float,
    token_age_days: int,
    recent_alerts: int,
    rules: BeaconRules = RULES,
) -> AlertTag:
    if (
        tx_density > rules.density_hot
        and token_age_days < rules.token_age_cutoff
        and recent_alerts >= rules.recent_alert_cap
    ):
        return AlertTag.HOT
    if tx_density > rules.density_watch:
        return AlertTag.WATCH
    return AlertTag.STABLE


def beacon_trace(event: str, details: str) -> None:
    logger.info("[BEACON] %s — %s @ %d", event, details, int(time()))
