interface TokenTraceEntry {
  timestamp: number
  priceUsd: number
  volume24h: number
  txCount: number
}

interface TokenTrend {
  volatility: number
  momentum: "up" | "down" | "flat"
  priceChangePct: number
}

export function analyzeTokenTrend(data: TokenTraceEntry[]): TokenTrend {
  if (data.length < 2) return { volatility: 0, momentum: "flat", priceChangePct: 0 }

  const first = data[0].priceUsd
  const last = data[data.length - 1].priceUsd

  const diff = last - first
  const changePct = (diff / first) * 100

  const volatility = parseFloat(
    (
      data.reduce((acc, d) => acc + Math.abs(d.priceUsd - first), 0) /
      (data.length * first)
    ).toFixed(4)
  )

  let momentum: "up" | "down" | "flat" = "flat"
  if (changePct > 5) momentum = "up"
  else if (changePct < -5) momentum = "down"

  return {
    volatility,
    momentum,
    priceChangePct: parseFloat(changePct.toFixed(2))
  }
}
