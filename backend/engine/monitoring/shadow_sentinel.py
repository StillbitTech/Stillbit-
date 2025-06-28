import time
import random

def dark_track(tx_path):
    if len(tx_path) > 5 and tx_path.count('unknown_wallet') >= 2:
        return "Suspicious Movement Detected"
    elif len(tx_path) > 3:
        return "Obscured Transaction Trail"
    else:
        return "Normal Flow"# shadow_sentinel.py
"""
Shadow Sentinel — streamlined path-opacity and activity-risk evaluator
with structured logging and pluggable rule-set.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from enum import Enum, auto
from time import time
from typing import Iterable, List

# ─────────────────────────── logging setup ─────────────────────────── #

_log = logging.getLogger("shadow_sentinel")
if not _log.handlers:
    _h = logging.StreamHandler()
    _h.setFormatter(logging.Formatter("[%(asctime)s] %(levelname)s  %(message)s"))
    _log.addHandler(_h)
_log.setLevel(logging.INFO)

# ────────────────────────────── enums ─────────────────────────────── #

class PathFlag(Enum):
    NORMAL = auto()
    OBSCURED = auto()
    SUSPICIOUS = auto()

class RiskFlag(Enum):
    STABLE = auto()
    WATCH = auto()
    CRITICAL = auto()

# ─────────────────────────── rule-set dataclass ───────────────────── #

@dataclass(frozen=True, slots=True)
class SentinelRules:
    hop_obscured: int = 4            # path length where flow is considered obscured
    hop_suspicious: int = 6          # path length for suspicious flag
    proxy_min: int = 2               # min “unknown_wallet” entries for suspicion

    density_watch: int = 150         # tx / interval threshold for watch
    density_critical: int = 300      # tx / interval threshold for critical

    token_fresh_limit: int = 5       # days since mint to treat token as fresh
    alert_window_limit: int = 2      # prior alerts required for critical

DEFAULT_RULES = SentinelRules()

# ───────────────────────────── core api ───────────────────────────── #

def classify_path(
    hops: Iterable[str],
    *,
    rules: SentinelRules = DEFAULT_RULES
) -> PathFlag:
    """Return path opacity flag based on hop count and proxies."""
    chain: List[str] = list(hops)
    proxy_cnt = chain.count("unknown_wallet")

    if len(chain) >= rules.hop_suspicious and proxy_cnt >= rules.proxy_min:
        return PathFlag.SUSPICIOUS
    if len(chain) >= rules.hop_obscured:
        return PathFlag.OBSCURED
    return PathFlag.NORMAL


def classify_risk(
    tx_density: float,
    token_age_days: int,
    recent_alerts: int,
    *,
    rules: SentinelRules = DEFAULT_RULES
) -> RiskFlag:
    """Return overall activity risk flag."""
    if (
        tx_density > rules.density_critical
        and token_age_days < rules.token_fresh_limit
        and recent_alerts >= rules.alert_window_limit
    ):
        return RiskFlag.CRITICAL
    if tx_density > rules.density_watch:
        return RiskFlag.WATCH
    return RiskFlag.STABLE


def trace(event: str, detail: str) -> None:
    """Structured console trace helper."""
    _log.info("[TRACE] %s — %s @ %d", event, detail, int(time()))

# ───────────────────────────── demo block ─────────────────────────── #

if __name__ == "__main__":
    sample_path = [
        "walletA",
        "proxy_alpha",
        "unknown_wallet",
        "walletB",
        "unknown_wallet",
        "walletC",
    ]

    p_flag = classify_path(sample_path)
    r_flag = classify_risk(tx_density=320, token_age_days=2, recent_alerts=3)

    trace("analysis_complete", f"path_flag={p_flag.name} risk_flag={r_flag.name}")


def risk_alert(tx_density, token_age_days, recent_alerts):
    if tx_density > 300 and token_age_days < 5 and recent_alerts >= 2:
        return "Immediate Risk Alert"
    elif tx_density > 150:
        return "Watchlist"
    else:
        return "Stable"

def log_trace(event, metadata):
    print(f"[TRACE] {event} — {metadata} at {time.time()}")
