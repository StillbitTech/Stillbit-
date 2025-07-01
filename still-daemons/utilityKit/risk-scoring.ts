export interface SignalFactors {
  liquidityShift: number
  flashloanFlagged: boolean
  walletConcentration: number
  sybilScore: number
}

export enum ThreatLevel {
  Minimal = "Minimal",
  Moderate = "Moderate",
  High = "High",
  Critical = "Critical"
}

const SIGNAL_WEIGHTS = {
  liquidity: 0.3,
  flashloan: 0.3,
  concentration: 0.2,
  sybil: 0.2
}

export function evaluateThreatScore(f: SignalFactors): number {
  const raw =
    f.liquidityShift * SIGNAL_WEIGHTS.liquidity +
    (f.flashloanFlagged ? 1 : 0) * SIGNAL_WEIGHTS.flashloan +
    f.walletConcentration * SIGNAL_WEIGHTS.concentration +
    f.sybilScore * SIGNAL_WEIGHTS.sybil

  return Math.min(100, parseFloat((raw * 100).toFixed(1)))
}

export function threatLevel(score: number): ThreatLevel {
  if (score >= 85) return ThreatLevel.Critical
  if (score >= 60) return ThreatLevel.High
  if (score >= 35) return ThreatLevel.Moderate
  return ThreatLevel.Minimal
}
