/**
 * Stillbit Activity Detector — Solana-focused anomaly scanner powered by AI signal signatures
 * Connects to wallet + token activity streams and scores them
 */

import { Connection, PublicKey } from "@solana/web3.js"
import { computeEntropy } from "./tools"

interface ActivityReport {
  wallet: string
  txCount: number
  entropy: number
  flagged: boolean
  tags: string[]
}

export async function scanWalletActivity(
  connection: Connection,
  walletAddress: string
): Promise<ActivityReport> {
  const pubkey = new PublicKey(walletAddress)
  const sigs = await connection.getSignaturesForAddress(pubkey, { limit: 100 })

  const txCounts: Record<number, number> = {}
  for (const sig of sigs) {
    if (!sig.blockTime) continue
    const hour = new Date(sig.blockTime * 1000).getUTCHours()
    txCounts[hour] = (txCounts[hour] || 0) + 1
  }

  const vector = Array.from({ length: 24 }, (_, h) => txCounts[h] || 0)
  const entropy = computeEntropy(vector)
  const txTotal = sigs.length

  const flagged = entropy < 2.2 || txTotal > 90
  const tags = []
  if (entropy < 1.8) tags.push("pattern-consolidation")
  if (txTotal > 90) tags.push("spam-pattern")

  return {
    wallet: walletAddress,
    txCount: txTotal,
    entropy: parseFloat(entropy.toFixed(3)),
    flagged,
    tags
  }
}
