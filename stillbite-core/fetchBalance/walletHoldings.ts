interface TokenHolding {
  mint: string
  amount: number
  uiAmount: number
  symbol: string
}

export function summarizeHoldings(data: TokenHolding[]) {
  const total = data.reduce((sum, t) => sum + t.uiAmount, 0)
  return {
    totalUsdValue: parseFloat(total.toFixed(2)),
    tokenCount: data.length
  }
}
