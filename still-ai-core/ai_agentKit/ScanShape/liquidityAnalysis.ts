import { Connection, PublicKey } from "@solana/web3.js"
import { getDexScreenerTokenData } from "@/integrations/dexscreener"

interface LiquidityReport {
  mint: string
  liquidityUsd: number
  volumeH1: number
  volumeH24: number
  deltaVolume: number
  verdict: "stable" | "inflow" | "outflow"
  source: string
}

export async function analyzeLiquidityShift(
  connection: Connection,
  mintAddress: string
): Promise<LiquidityReport | null> {
  const mint = new PublicKey(mintAddress)
  const tokenData = await getDexScreenerTokenData(mint.toBase58())
  if (!tokenData) return null

  const { liquidity, volume } = tokenData
  const liquidityUsd = liquidity.usd
  const volumeH1 = volume.h1
  const volumeH24 = volume.h24

  const deltaVolume = volumeH1 - volumeH24 / 24
  let verdict: LiquidityReport["verdict"] = "stable"

  if (deltaVolume > volumeH24 * 0.1) verdict = "inflow"
  if (deltaVolume < -volumeH24 * 0.1) verdict = "outflow"

  return {
    mint: mint.toBase58(),
    liquidityUsd,
    volumeH1,
    volumeH24,
    deltaVolume: parseFloat(deltaVolume.toFixed(2)),
    verdict,
    source: "dexscreener"
  }
}
