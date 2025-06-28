import time
from typing import List


def weave_path(tx_path: List[str]) -> str:
    """
    Classify a transaction hop path.

    Returns:
        "Suspicious Movement Detected"
        "Obscured Transaction Trail"
        "Normal Flow"
    """
    if len(tx_path) > 5 and tx_path.count("unknown_wallet") >= 2:
        return "Suspicious Movement Detected"
    if len(tx_path) > 3:
        return "Obscured Transaction Trail"
    return "Normal Flow"


def weave_risk_alert(tx_density: float, token_age_days: int, recent_alerts: int) -> str:
    """
    Generate a risk flag based on density, token age, and recent alerts count.
    """
    if tx_density > 300 and token_age_days < 5 and recent_alerts >= 2:
        return "Immediate Risk Alert"
    if tx_density > 150:
        return "Watchlist"
    return "Stable"


def weave_log(event: str, metadata: str) -> None:
    """
    Minimal trace logger for Dreamweaver.
    """
    print(f"[DREAMWEAVER] {event} — {metadata} @ {int(time.time())}")
