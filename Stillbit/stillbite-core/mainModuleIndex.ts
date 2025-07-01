

export class MainModule {
  constructor(
    private vault: VaultCoreEngine,
    private schema: SchemaMapEngine
  ) {}

  runDiagnostics(): void {
    const result = executeCheck(this.vault.getSnapshot())
    this.schema.mapResult(result)
  }
}
