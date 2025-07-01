import { runVaultScan } from "./vaultScan"
import { detectSybilNodes } from "./sybilSweep"
import { computeStressSignals } from "./stressAnalyzer"

export async function scannerBundle(vaultId: string): Promise<void> {
  console.log(`[Stillbit] Starting full scanner bundle for vault ${vaultId}`)

  try {
    const scan = await runVaultScan(vaultId)
    const sybil = await detectSybilNodes(vaultId)
    const stress = await computeStressSignals(vaultId)

    console.log(`[Stillbit] Scan complete:\n - ${scan.status}\n - Sybil: ${sybil.score}\n - Stress: ${stress.level}`)
  } catch (err) {
    console.error("[Stillbit] Scanner bundle failed:", err)
  }
}
