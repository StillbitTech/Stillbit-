interface MetricEvent {
  label: string
  value: number
  timestamp: number
  tags?: Record<string, string>
}

export class MetricsLog {
  private events: MetricEvent[] = []

  record(label: string, value: number, tags: Record<string, string> = {}): void {
    this.events.push({
      label,
      value,
      timestamp: Date.now(),
      tags
    })
  }

  getAll(): MetricEvent[] {
    return [...this.events]
  }

  filterByLabel(label: string): MetricEvent[] {
    return this.events.filter(e => e.label === label)
  }

  clear(): void {
    this.events = []
  }
}
