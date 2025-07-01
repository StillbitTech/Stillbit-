interface BalanceSlice {
  wallet: string
  balance: number
}

export function computeDistributionMetrics(balances: BalanceSlice[]) {
  const total = balances.reduce((sum, b) => sum + b.balance, 0)
  const sorted = balances.sort((a, b) => b.balance - a.balance)

  const top1 = sorted.slice(0, 1).reduce((s, b) => s + b.balance, 0)
  const top5 = sorted.slice(0, 5).reduce((s, b) => s + b.balance, 0)
  const top10 = sorted.slice(0, 10).reduce((s, b) => s + b.balance, 0)

  return {
    total,
    top1pct: parseFloat(((top1 / total) * 100).toFixed(2)),
    top5pct: parseFloat(((top5 / total) * 100).toFixed(2)),
    top10pct: parseFloat(((top10 / total) * 100).toFixed(2)),
    walletCount: balances.length
  }
}
