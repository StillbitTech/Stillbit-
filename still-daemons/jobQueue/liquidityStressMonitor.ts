import { Connection, PublicKey } from "@solana/web3.js"

interface MintAnomalyResult {
  mint: string
  abnormalMintCount: number
  topMinter: string | null
  riskTag: "low" | "moderate" | "high"
}

export async function detectMintAnomaly(
  connection: Connection,
  mintAddress: string,
  slotDepth = 200
): Promise<MintAnomalyResult> {
  const mint = new PublicKey(mintAddress)
  const programId = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")

  const currentSlot = await connection.getSlot()
  const minterMap: Record<string, number> = {}

  for (let offset = 0; offset < slotDepth; offset++) {
    const slot = currentSlot - offset
    const block = await connection.getBlock(slot).catch(() => null)
    if (!block?.transactions) continue

    for (const tx of block.transactions) {
      for (const ix of tx.transaction.message.instructions) {
        if ("parsed" in ix && ix.programId.equals(programId) && ix.parsed?.type === "mintTo") {
          const info = ix.parsed.info
          if (info.mint !== mint.toBase58()) continue

          const authority = info.authority
          minterMap[authority] = (minterMap[authority] || 0) + 1
        }
      }
    }
  }

  const entries = Object.entries(minterMap).sort((a, b) => b[1] - a[1])
  const top = entries[0]?.[0] || null
  const total = Object.values(minterMap).reduce((a, b) => a + b, 0)

  const risk =
    total > 50 ? "high" :
    total > 20 ? "moderate" :
    "low"

  return {
    mint: mint.toBase58(),
    abnormalMintCount: total,
    topMinter: top,
    riskTag: risk
  }
}
