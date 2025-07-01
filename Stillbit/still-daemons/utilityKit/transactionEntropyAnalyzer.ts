import { PublicKey } from "@solana/web3.js"

interface EntropySnapshot {
  mint: string
  participantCount: number
  entropyValue: number
  state: "uniform" | "scattered" | "dense"
}

export async function scanTransactionEntropy(connection: any, mint: string, limit = 300): Promise<EntropySnapshot> {
  const key = new PublicKey(mint)
  const seen: Record<string, number> = {}
  const signatures = await connection.getSignaturesForAddress(key, { limit })

  for (const sig of signatures) {
    const tx = await connection.getParsedTransaction(sig.signature)
    if (!tx) continue

    for (const ix of tx.transaction.message.instructions) {
      if ("parsed" in ix && ix.parsed?.info?.owner) {
        const a = ix.parsed.info.owner
        seen[a] = (seen[a] || 0) + 1
      }
    }
  }

  const total = Object.values(seen).reduce((a, b) => a + b, 0)
  const entropy = -Object.values(seen).map(p => p / total).reduce((acc, x) => acc + x * Math.log2(x), 0)
  const maxEntropy = Math.log2(Object.keys(seen).length || 1)
  const score = Math.round((entropy / maxEntropy) * 100)

  let state: "uniform" | "scattered" | "dense" = "uniform"
  if (score < 30) state = "dense"
  else if (score > 75) state = "scattered"

  return {
    mint: key.toBase58(),
    participantCount: Object.keys(seen).length,
    entropyValue: score,
    state
  }
}
