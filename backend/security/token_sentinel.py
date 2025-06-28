# token_sentinel.py
"""
Token Sentinel — evaluates token stability and short-term volatility risk.

Improvements over the basic riskRadar / volatilityPredict:
• Typed dataclass for input snapshot
• Separate numerical score (0-100) plus qualitative flag
• Configurable thresholds via SentinelRules
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum, auto
from typing import Dict


class RiskFlag(Enum):
    STABLE = auto()
    MODERATE = auto()
    HIGH = auto()


@dataclass(slots=True, frozen=True)
class SentinelRules:
    price_hist_threshold: float = 0.10     # 10 %
    volatility_threshold: float = 0.50     # composite index
    max_score: int = 100


@dataclass(slots=True)
class TokenSnapshot:
    current_price: float
    previous_price: float
    liquidity_factor: float
    market_depth: float


# ──────────────────────────── core helpers ───────────────────────── #

def stability_score(snap: TokenSnapshot) -> float:
    """Absolute % deviation between successive prices."""
    if snap.previous_price == 0:
        return 1.0
    return abs(snap.current_price - snap.previous_price) / snap.previous_price


def volatility_index(snap: TokenSnapshot) -> float:
    """Price delta × liquidity impact."""
    delta = abs(snap.current_price - snap.previous_price)
    depth = snap.market_depth or 1e-9
    impact = snap.liquidity_factor / depth
    return delta * impact


# ───────────────────────────── evaluator ─────────────────────────── #

def evaluate_token(
    data: Dict,
    rules: SentinelRules = SentinelRules(),
) -> Dict[str, str | float]:
    snap = TokenSnapshot(**data)

    hist_score = stability_score(snap)
    vol_index = volatility_index(snap)

    flag = RiskFlag.STABLE
    if vol_index > rules.volatility_threshold or hist_score > rules.price_hist_threshold:
        flag = RiskFlag.HIGH
    elif vol_index > rules.volatility_threshold * 0.6:
        flag = RiskFlag.MODERATE

    # convert vol_index into a bounded 0-100 score
    score = min((vol_index / rules.volatility_threshold) * rules.max_score, 100)

    return {
        "stability_score": round(hist_score, 4),
        "volatility_index": round(vol_index, 4),
        "risk_score": round(score, 1),
        "risk_flag": flag.name.lower(),
    }
