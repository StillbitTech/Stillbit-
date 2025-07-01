import { TokenBalanceSchema } from "./balanceSchema"

export interface PortfolioSnapshot {
  wallet: string
  tokens: TokenBalanceSchema[]
  totalValueUsd: number
}

export function buildPortfolioSnapshot(
  wallet: string,
  balances: TokenBalanceSchema[],
  prices: Record<string, number>  // mint → price
): PortfolioSnapshot {
  const total = balances.reduce((sum, b) => {
    const price = prices[b.mint] ?? 0
    return sum + b.uiAmount * price
  }, 0)

  return {
    wallet,
    tokens: balances,
    totalValueUsd: parseFloat(total.toFixed(2))
  }
}
