import { Connection, PublicKey } from "@solana/web3.js"

interface SybilSweepResult {
  mint: string
  flaggedSenders: string[]
  spreadScore: number
}

export async function executeSybilSweep(
  connection: Connection,
  mintAddr: string,
  minSpread = 4
): Promise<SybilSweepResult> {
  const mint = new PublicKey(mintAddr)
  const program = new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA")
  const currentSlot = await connection.getSlot()

  const suspicious = new Set<string>()
  let totalReceivers = 0

  for (let offset = 0; offset < 100; offset++) {
    const slot = currentSlot - offset
    const block = await connection.getBlock(slot, { maxSupportedTransactionVersion: 0 }).catch(() => null)
    if (!block?.transactions) continue

    const map = new Map<string, Set<string>>()

    for (const tx of block.transactions) {
      for (const ix of tx.transaction.message.instructions) {
        if ("parsed" in ix && ix.programId.equals(program) && ix.parsed?.type === "transfer") {
          const parsed = ix.parsed.info
          if (parsed.mint !== mint.toBase58()) continue

          const from = parsed.source
          const to = parsed.destination

          if (!map.has(from)) map.set(from, new Set())
          map.get(from)!.add(to)
        }
      }
    }

    for (const [sender, recipients] of map.entries()) {
      if (recipients.size >= minSpread) {
        suspicious.add(sender)
        totalReceivers += recipients.size
      }
    }
  }

  const score = Math.min(100, suspicious.size * 10 + totalReceivers * 0.5)

  return {
    mint: mint.toBase58(),
    flaggedSenders: Array.from(suspicious),
    spreadScore: score
  }
}
