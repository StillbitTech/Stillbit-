interface WatchlistEntry {
  mint: string
  symbol: string
  targetPrice: number
  alertAbove: boolean
  lastChecked?: number
}

export class TokenWatchlist {
  private list: Map<string, WatchlistEntry> = new Map()

  add(entry: WatchlistEntry): void {
    this.list.set(entry.mint, { ...entry, lastChecked: Date.now() })
  }

  remove(mint: string): void {
    this.list.delete(mint)
  }

  checkAlerts(currentPrices: Record<string, number>): string[] {
    const alerts: string[] = []

    for (const entry of this.list.values()) {
      const current = currentPrices[entry.mint]
      if (current === undefined) continue

      if (
        (entry.alertAbove && current >= entry.targetPrice) ||
        (!entry.alertAbove && current <= entry.targetPrice)
      ) {
        alerts.push(`${entry.symbol} hit target (${current})`)
      }
    }

    return alerts
  }

  getAll(): WatchlistEntry[] {
    return Array.from(this.list.values())
  }
}
