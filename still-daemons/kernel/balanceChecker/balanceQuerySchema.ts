export interface TokenBalanceSchema {
  mint: string
  symbol: string
  amountRaw: number
  decimals: number
  uiAmount: number
  lastUpdated: number
}

export function createBalanceSchema(
  mint: string,
  symbol: string,
  rawAmount: number,
  decimals: number
): TokenBalanceSchema {
  const uiAmount = parseFloat((rawAmount / 10 ** decimals).toFixed(4))
  return {
    mint,
    symbol,
    amountRaw: rawAmount,
    decimals,
    uiAmount,
    lastUpdated: Date.now()
  }
}
