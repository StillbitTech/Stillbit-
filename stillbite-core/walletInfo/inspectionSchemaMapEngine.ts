interface DiagnosticResult {
  vaultId: string
  score: number
  issues: string[]
}

export class SchemaMapEngine {
  mapResult(result: DiagnosticResult): void {
    console.log(`[SchemaMap] Vault ${result.vaultId} → Score ${result.score}`)
    if (result.issues.length) {
      result.issues.forEach((i) => console.warn(`[Issue] ${i}`))
    }
  }
}
