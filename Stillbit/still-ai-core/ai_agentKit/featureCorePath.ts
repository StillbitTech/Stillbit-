interface Snapshot {
  time: number
  volume: number
  txCount: number
  walletSpread: number
}

export function extractCoreFeatures(data: Snapshot[]): number[] {
  return data.map((d) => d.volume + d.txCount + d.walletSpread)
}

export function detectFeaturePath(series: number[]): number[] {
  const path: number[] = []
  for (let i = 1; i < series.length; i++) {
    const delta = series[i] - series[i - 1]
    path.push(delta > 0 ? 1 : delta < 0 ? -1 : 0)
  }
  return path
}
