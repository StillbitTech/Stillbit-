export async function getDexTokenInfo(mintAddress: string): Promise<any | null> {
  const res = await fetch(`https://api.dexscreener.com/latest/dex/tokens/${mintAddress}`)
  const json = await res.json()
  if (!json.pairs || json.pairs.length === 0) return null

  const primary = json.pairs[0]
  return {
    name: primary.baseToken.name,
    symbol: primary.baseToken.symbol,
    priceUsd: primary.priceUsd,
    volume24h: primary.volume.h24,
    liquidityUsd: primary.liquidity.usd
  }
}
