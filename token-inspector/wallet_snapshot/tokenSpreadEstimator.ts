export interface TokenSpreadData {
  token: string
  low: number
  high: number
  current: number
  spread: number
}

export function calculateTokenSpread(
  token: string,
  low: number,
  high: number,
  current: number
): TokenSpreadData {
  const spread = high - low
  return {
    token,
    low,
    high,
    current,
    spread
  }
}

export function getSpreadRatio(data: TokenSpreadData): string {
  if (data.spread === 0) return "0%"
  const ratio = ((data.current - data.low) / data.spread) * 100
  return `${ratio.toFixed(2)}%`
}
