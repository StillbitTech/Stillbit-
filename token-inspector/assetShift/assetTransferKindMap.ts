interface TransferEvent {
  from: string
  to: string
  token: string
  amount: number
}

interface TransferLink {
  source: string
  target: string
  weight: number
}

export function buildAssetTransferMap(events: TransferEvent[]): TransferLink[] {
  const map = new Map<string, number>()

  for (const event of events) {
    const key = `${event.from}->${event.to}`
    const current = map.get(key) || 0
    map.set(key, current + event.amount)
  }

  return Array.from(map.entries()).map(([key, weight]) => {
    const [source, target] = key.split("->")
    return { source, target, weight }
  })
}
