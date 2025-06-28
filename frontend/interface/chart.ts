
export function drawRiskHeatmap(
  scores: number[],
  cols = 12,           // wrap every N cells
): string {
  const symbol = (v: number): string => {
    if (v >= 0.8) return "🔴"   // critical
    if (v >= 0.6) return "🟠"   // high
    if (v >= 0.4) return "🟡"   // moderate
    return "🟢"                 // low
  }

  const cells = scores.map(symbol)
  const lines: string[] = []

  for (let i = 0; i < cells.length; i += cols) {
    lines.push(cells.slice(i, i + cols).join(" "))
  }

  return lines.join("\n")
}
