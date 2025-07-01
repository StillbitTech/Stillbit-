interface VaultSnapshot {
  vaultId: string
  tokenCount: number
  totalUsdValue: number
  riskLevel: string
}

export class VaultCoreEngine {
  private balances: Record<string, number> = {}

  constructor(public vaultId: string) {}

  updateBalance(token: string, amount: number): void {
    this.balances[token] = amount
  }

  getSnapshot(): VaultSnapshot {
    const tokenCount = Object.keys(this.balances).length
    const total = Object.values(this.balances).reduce((a, b) => a + b, 0)
    return {
      vaultId: this.vaultId,
      tokenCount,
      totalUsdValue: parseFloat(total.toFixed(2)),
      riskLevel: total > 100000 ? "elevated" : "low"
    }
  }
}
