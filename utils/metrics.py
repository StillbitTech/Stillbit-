

from __future__ import annotations

from dataclasses import dataclass
from enum import Enum, auto
from math import sqrt
from statistics import mean
from typing import List, Sequence


@dataclass(slots=True)
class MarketSeries:
    prices: List[float]
    volumes: List[int]  # or floats


# ────────────────────────── volatility ────────────────────────── #

def stdev_volatility(series: Sequence[float]) -> float:
    μ = mean(series)
    var = sum((p - μ) ** 2 for p in series) / len(series)
    return sqrt(var)


def ewma_volatility(series: Sequence[float], alpha: float = 0.2) -> float:
    """
    Exponentially weighted moving volatility.
    """
    if len(series) < 2:
        return 0.0
    μ = series[0]
    var = 0.0
    for p in series[1:]:
        μ_prev = μ
        μ = alpha * p + (1 - alpha) * μ_prev
        var = alpha * (p - μ) ** 2 + (1 - alpha) * var
    return sqrt(var)


# ────────────────────────── momentum ─────────────────────────── #

def momentum(series: Sequence[float], window: int | None = None) -> float:
    if len(series) < 2:
        return 0.0
    if window is None or window > len(series):
        window = len(series)
    return (series[-1] - series[-window]) / window


# ────────────────────────── health score ─────────────────────── #

def weighted_health(price: float, demand: float, volatility: float) -> float:
    """
    Clamp composite score to 0-1.
    """
    if volatility <= 0:
        return 1.0
    score = (price * demand) / volatility
    return max(0.0, min(score, 1.0))


# ────────────────────────── trend signal ─────────────────────── #

class Trend(Enum):
    NEUTRAL = auto()
    UPTREND = auto()
    DOWNTREND = auto()
    SIDEWAYS = auto()


def trend_signal(prices: Sequence[float]) -> Trend:
    if len(prices) < 3:
        return Trend.NEUTRAL
    if prices[-1] > prices[-2] > prices[-3]:
        return Trend.UPTREND
    if prices[-1] < prices[-2] < prices[-3]:
        return Trend.DOWNTREND
    return Trend.SIDEWAYS
