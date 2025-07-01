export async function getSolanaTrends(): Promise<any[]> {
  const res = await fetch("https://api.dexscreener.com/latest/dex/search?q=solana")
  const json = await res.json()
  return json.pairs?.slice(0, 20) || []
}
export { getDexPairsByChain } from "./getDexPairs"
export { getDexTokenInfo } from "./getDexTokenInfo"
export { getSolanaTrends } from "./getSolanaTrens"
