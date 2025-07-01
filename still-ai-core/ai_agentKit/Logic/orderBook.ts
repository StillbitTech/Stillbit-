import { getJupiterOrderbook } from "@/integrations/jupiter"

interface OrderbookLevel {
  price: number
  size: number
}

interface OrderbookAnalysis {
  mint: string
  bids: OrderbookLevel[]
  asks: OrderbookLevel[]
  spread: number
  imbalance: number
}

export async function fetchOrderbookSnapshot(mint: string): Promise<OrderbookAnalysis | null> {
  const ob = await getJupiterOrderbook(mint)
  if (!ob) return null

  const topBid = ob.bids[0]?.price || 0
  const topAsk = ob.asks[0]?.price || 0
  const spread = topAsk - topBid

  const totalBids = ob.bids.reduce((sum, b) => sum + b.size, 0)
  const totalAsks = ob.asks.reduce((sum, a) => sum + a.size, 0)
  const imbalance = parseFloat(((totalBids - totalAsks) / (totalBids + totalAsks)).toFixed(3))

  return {
    mint,
    bids: ob.bids,
    asks: ob.asks,
    spread: parseFloat(spread.toFixed(6)),
    imbalance
  }
}
