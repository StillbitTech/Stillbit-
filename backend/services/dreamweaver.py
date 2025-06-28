# market_oracle.py
"""
Market Oracle — enhanced market-signal evaluator.
Replaces the older pulseTrack / trendShift / liquidityFlow helpers.
"""

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum, auto
from typing import Dict


# ───────────────────────────── enums ───────────────────────────── #

class Signal(Enum):
    OK = "OK"
    NOTICE = "Notice"
    ALERT = "Alert"


# ──────────────────────────── model ───────────────────────────── #

@dataclass(slots=True)
class MarketSnapshot:
    total_volume: float
    transaction_frequency: float
    price_change_pct: float         # % change over interval
    previous_price: float
    previous_volume: float
    current_price: float
    token_volume: float
    market_liquidity: float


# ───────────────────────── core logic ─────────────────────────── #

def volatility_pulse(mkt: MarketSnapshot) -> Signal:
    if mkt.transaction_frequency == 0:
        return Signal.NOTICE
    index = mkt.total_volume / mkt.transaction_frequency
    factor = mkt.price_change_pct / (index or 1e-9)
    return Signal.ALERT if abs(factor) > 0.3 else Signal.OK


def trend_pioneer(mkt: MarketSnapshot) -> Signal:
    baseline = (mkt.previous_price * mkt.previous_volume) / 1_000 or 1e-9
    deviation = (mkt.current_price - baseline) / baseline
    return Signal.ALERT if abs(deviation) > 0.05 else Signal.OK


def liquidity_guard(mkt: MarketSnapshot) -> Signal:
    if mkt.market_liquidity == 0:
        return Signal.ALERT
    ratio = mkt.token_volume / mkt.market_liquidity
    if ratio < 0.05:
        return Signal.ALERT
    if ratio < 0.1:
        return Signal.NOTICE
    return Signal.OK


# ─────────────────────── summariser helper ────────────────────── #

def oracle_summary(mkt: Dict) -> dict:  # accepts plain dict input
    snap = MarketSnapshot(**mkt)        # unpack into dataclass
    summary = {
        "volatility": volatility_pulse(snap).value,
        "trend": trend_pioneer(snap).value,
        "liquidity": liquidity_guard(snap).value,
    }
    return summary
