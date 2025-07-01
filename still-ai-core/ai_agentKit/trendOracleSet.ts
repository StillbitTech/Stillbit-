interface TrendPoint {
  timestamp: number
  metric: number
}

interface TrendResult {
  direction: "up" | "down" | "flat"
  momentum: number
  slope: number
}

export function analyzeTrend(points: TrendPoint[]): TrendResult {
  const n = points.length
  if (n < 2) return { direction: "flat", momentum: 0, slope: 0 }

  const xs = points.map(p => p.timestamp)
  const ys = points.map(p => p.metric)

  const meanX = xs.reduce((a, b) => a + b, 0) / n
  const meanY = ys.reduce((a, b) => a + b, 0) / n

  let num = 0, den = 0
  for (let i = 0; i < n; i++) {
    num += (xs[i] - meanX) * (ys[i] - meanY)
    den += (xs[i] - meanX) ** 2
  }

  const slope = den === 0 ? 0 : num / den
  const direction = slope > 0.2 ? "up" : slope < -0.2 ? "down" : "flat"
  const momentum = Math.abs(slope * 100)

  return { direction, momentum, slope: parseFloat(slope.toFixed(4)) }
}
