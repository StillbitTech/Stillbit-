# tx_risk_evaluator.py
from dataclasses import dataclass
from enum import Enum
from time import time
from typing import List

# --------------------------- Enumerations --------------------------- #

class PathRating(Enum):
    NORMAL = "Normal Flow"
    OBSCURED = "Obscured Transaction Trail"
    SUSPICIOUS = "Suspicious Movement Detected"


class RiskRating(Enum):
    STABLE = "Stable"
    WATCHLIST = "Watchlist"
    CRITICAL = "Immediate Risk Alert"


# --------------------------- Configuration -------------------------- #

@dataclass(frozen=True)
class Rules:
    hop_obscured: int = 4
    hop_suspicious: int = 6
    min_proxies: int = 2

    density_watch: int = 150
    density_critical: int = 300

    token_age_limit: int = 5           # days
    recent_alert_limit: int = 2        # count


RULES = Rules()  # default rule-set


# ------------------------- Core functions --------------------------- #

def dark_track(path: List[str], cfg: Rules = RULES) -> PathRating:
    """Classify a transaction path by hop length and proxy count."""
    proxy_cnt = path.count("unknown_wallet")

    if len(path) >= cfg.hop_suspicious and proxy_cnt >= cfg.min_proxies:
        return PathRating.SUSPICIOUS
    if len(path) >= cfg.hop_obscured:
        return PathRating.OBSCURED
    return PathRating.NORMAL


def risk_alert(
    tx_density: float,
    token_age_days: int,
    recent_alerts: int,
    cfg: Rules = RULES,
) -> RiskRating:
    """Return overall risk score based on activity density and age."""
    if (
        tx_density > cfg.density_critical
        and token_age_days < cfg.token_age_limit
        and recent_alerts >= cfg.recent_alert_limit
    ):
        return RiskRating.CRITICAL
    if tx_density > cfg.density_watch:
        return RiskRating.WATCHLIST
    return RiskRating.STABLE


# ---------------------------- Utilities ----------------------------- #

def log_trace(event: str, meta: str) -> None:
    ts = int(time())
    print(f"[TRACE] {event} — {meta} @ {ts}")
