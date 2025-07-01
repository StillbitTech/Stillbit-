export async function getDexPairsByChain(): Promise<any[]> {
  const res = await fetch("https://api.dexscreener.com/latest/dex/pairs/solana")
  const json = await res.json()
  return json.pairs || []
}
