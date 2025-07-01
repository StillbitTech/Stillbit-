import { scanRecentTraceSignatures } from "../core/traceScanner"

export async function runTraceAnalysisJob(): Promise<void> {
  const jobStart = new Date().toISOString()
  console.log(`[Stillbit] Trace analysis started at ${jobStart}`)

  try {
    const scanResult = await scanRecentTraceSignatures()

    if (!scanResult || scanResult.totalTraces === 0) {
      console.log("[Stillbit] No significant trace signatures detected")
    } else {
      console.log(`[Stillbit] Trace scan complete:\n${JSON.stringify(scanResult, null, 2)}`)
    }
  } catch (err) {
    console.error("[Stillbit] Trace job execution failed:", err)
  } finally {
    const jobEnd = new Date().toISOString()
    console.log(`[Stillbit] Trace analysis finished at ${jobEnd}`)
  }
}
