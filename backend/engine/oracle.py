
from dataclasses import dataclass
from enum import Enum, auto
from math import sqrt


class StabilityStatus(Enum):
  STABLE = "Stable"
  UNSTABLE = "Unstable"


class HealthStatus(Enum):
  HEALTHY = "Healthy"
  DEGRADED = "Degraded"


@dataclass
class AssetSnapshot:
  price: float
  price_fluctuation: float        # absolute value in quote currency
  price_volatility: float         # standard deviation or ATR
  market_depth: float             # liquidity depth
  demand_factor: float            # 0–1 normalised demand metric


def stability_core(asset: AssetSnapshot, threshold: float = 3_000.0) -> StabilityStatus:
  """
  Detect instability via price fluctuation × sqrt(depth).

  Larger depth dampens the effect of a given fluctuation.
  """
  index = asset.price_fluctuation * sqrt(max(asset.market_depth, 1))
  return StabilityStatus.UNSTABLE if index > threshold else StabilityStatus.STABLE


def secure_flow(asset: AssetSnapshot, min_health: float = 0.5) -> HealthStatus:
  """
  Compute asset health as (price × demand) / volatility.

  A low ratio indicates high volatility relative to demand and price.
  """
  if asset.price_volatility <= 0:
    return HealthStatus.DEGRADED

  index = (asset.price * asset.demand_factor) / asset.price_volatility
  return HealthStatus.DEGRADED if index < min_health else HealthStatus.HEALTHY
