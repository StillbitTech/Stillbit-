export class MainModule {
  constructor(
    private vault: VaultCoreEngine,
    private schema: SchemaMapEngine
  ) {}

  runDiagnostics(): void {
    const snapshot = this.vault.getSnapshot()

    if (!snapshot || typeof snapshot !== "object") {
      throw new Error("Invalid or empty vault snapshot")
    }

    const result = executeCheck(snapshot)
    this.schema.mapResult(result)
  }
}
