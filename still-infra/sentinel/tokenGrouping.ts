interface TokenInfo {
  symbol: string
  liquidityUsd: number
  trend: "up" | "down" | "flat"
}

export function groupTokensByTrend(tokens: TokenInfo[]): Record<string, TokenInfo[]> {
  return tokens.reduce((groups, token) => {
    if (!groups[token.trend]) groups[token.trend] = []
    groups[token.trend].push(token)
    return groups
  }, {} as Record<string, TokenInfo[]>)
}
