import { getDexScreenerTokenData } from "@/integrations/dexscreener"
import { analyzeVolatility } from "@/utils/volatility"

export interface BurstForecast {
  symbol: string
  volScore: number
  direction: "bullish" | "bearish" | "neutral"
  probability: number
  certainty: number
}

export async function forecastBurst(mint: string): Promise<BurstForecast | null> {
  const data = await getDexScreenerTokenData(mint)
  if (!data) return null

  const v = analyzeVolatility(data.volume.h1, data.volume.h6, data.volume.h24)
  const p = Math.min(100, v * 1.2 + (data.txCount.h1 / 12))
  const direction = parseFloat(data.priceUsd) > 1.0 ? "bullish" : "bearish"
  const certainty = Math.min(1, (data.txCount.h1 + data.txCount.h6) / 100)

  return {
    symbol: data.baseToken.symbol,
    volScore: v,
    direction,
    probability: parseFloat(p.toFixed(2)),
    certainty: parseFloat(certainty.toFixed(2))
  }
}
