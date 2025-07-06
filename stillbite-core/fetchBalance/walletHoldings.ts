export class MainModule {
  constructor(
    private vault: VaultCoreEngine,
    private schema: SchemaMapEngine,
    private readonly checkFn: (snapshot: unknown) => unknown = executeCheck
  ) {}

  runDiagnostics(): unknown {
    const snapshot = this.vault.getSnapshot()

    if (!snapshot || typeof snapshot !== "object") {
      throw new Error("Invalid or empty vault snapshot")
    }

    const result = this.checkFn(snapshot)
    return this.schema.mapResult(result)
  }
}
