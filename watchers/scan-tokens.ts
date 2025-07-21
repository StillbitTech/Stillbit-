import { scanRecentTraceSignatures } from "../core/traceScanner"

export async function runTraceAnalysisJob(): Promise<void> {
  const timestamp = () => new Date().toISOString()
  console.log(`[Stillbit] 🔍 Trace analysis started at ${timestamp()}`)

  try {
    const result = await scanRecentTraceSignatures()

    if (!result || typeof result.totalTraces !== "number") {
      console.warn("[Stillbit] ⚠️ Invalid trace data received")
      return
    }

    if (result.totalTraces === 0) {
      console.log("[Stillbit] ✅ No significant trace signatures found")
    } else {
      console.log(`[Stillbit] 📊 Trace scan completed with results:\n${JSON.stringify(result, null, 2)}`)
    }
  } catch (error) {
    console.error("[Stillbit] ❌ Trace analysis job failed:", error)
  } finally {
    console.log(`[Stillbit] 🛠️ Trace analysis finished at ${timestamp()}`)
  }
}
