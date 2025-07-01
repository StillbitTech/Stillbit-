interface VaultSnapshot {
  vaultId: string
  tokenCount: number
  totalUsdValue: number
  riskLevel: string
}

export function executeCheck(snapshot: VaultSnapshot) {
  const issues: string[] = []

  if (snapshot.tokenCount === 0) issues.push("Vault is empty")
  if (snapshot.riskLevel === "elevated" && snapshot.totalUsdValue > 500000)
    issues.push("Large holdings with elevated risk")

  return {
    vaultId: snapshot.vaultId,
    score: snapshot.tokenCount * 10,
    issues
  }
}
