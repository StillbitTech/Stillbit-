import { PublicKey } from "@solana/web3.js"

export interface TimeSlot {
  hour: number
  txs: number
  volumeProxy: number
}

export interface HeatmapOutput {
  token: string
  hotspots: number[]
  slots: TimeSlot[]
}

export async function createActivityHeatmap(connection: any, mint: string, hours = 24): Promise<HeatmapOutput> {
  const address = new PublicKey(mint)
  const now = Math.floor(Date.now() / 1000)
  const start = now - hours * 3600
  const map = new Map<number, number[]>()

  const signatures = await connection.getSignaturesForAddress(address, { limit: 500 })

  for (const sig of signatures) {
    if (!sig.blockTime || sig.blockTime < start) continue
    const hour = new Date(sig.blockTime * 1000).getUTCHours()
    if (!map.has(hour)) map.set(hour, [])
    map.get(hour)?.push(sig.slot)
  }

  const slots: TimeSlot[] = []
  for (let h = 0; h < 24; h++) {
    const activity = map.get(h) || []
    slots.push({ hour: h, txs: activity.length, volumeProxy: parseFloat((activity.length * 1.42).toFixed(2)) })
  }

  const maxTxs = Math.max(...slots.map(s => s.txs))
  const hotspots = slots.filter(s => s.txs === maxTxs).map(s => s.hour)

  return {
    token: address.toBase58(),
    hotspots,
    slots
  }
}
