interface AlertPayload {
  id: string
  vaultId: string
  type: "anomaly" | "threshold" | "sybil" | "liquidity"
  message: string
  level: "info" | "warn" | "critical"
  timestamp: number
}

export class AlertService {
  private queue: AlertPayload[] = []

  emit(alert: AlertPayload): void {
    this.queue.push(alert)
    if (alert.level === "critical") {
      console.error(`[ALERT] ${alert.message}`)
    } else {
      console.log(`[ALERT] ${alert.message}`)
    }
  }

  getQueue(): AlertPayload[] {
    return [...this.queue]
  }

  flush(): void {
    this.queue = []
  }
}
