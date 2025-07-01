import { getDexScreenerTokenData } from "@/integrations/dexscreener"

interface MarketSnapshot {
  token: string
  priceUsd: number
  priceChange24h: number
  volume24h: number
  liquidity: number
  holders: number
  isTrending: boolean
}

export async function fetchMarketSnapshot(mint: string): Promise<MarketSnapshot | null> {
  const data = await getDexScreenerTokenData(mint)
  if (!data) return null

  const { priceUsd, priceChange24h, volume, liquidity, holders } = data

  return {
    token: data.baseToken.symbol,
    priceUsd,
    priceChange24h,
    volume24h: volume.h24,
    liquidity: liquidity.usd,
    holders: data.holders || 0,
    isTrending: Math.abs(priceChange24h) > 20 || volume.h1 > volume.h24 / 12
  }
}
