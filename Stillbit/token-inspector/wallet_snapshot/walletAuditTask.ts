interface WalletAuditResult {
  address: string
  suspiciousTransfers: number
  flaggedTokens: string[]
  riskLevel: "Low" | "Medium" | "High"
}

export function auditWalletBehavior(
  address: string,
  txHistory: Array<{ token: string; value: number; flagged?: boolean }>
): WalletAuditResult {
  const flagged = txHistory.filter(tx => tx.flagged)
  const suspiciousTransfers = flagged.length
  const uniqueFlaggedTokens = [...new Set(flagged.map(tx => tx.token))]

  const risk =
    suspiciousTransfers > 10
      ? "High"
      : suspiciousTransfers > 3
      ? "Medium"
      : "Low"

  return {
    address,
    suspiciousTransfers,
    flaggedTokens: uniqueFlaggedTokens,
    riskLevel: risk
  }
}
