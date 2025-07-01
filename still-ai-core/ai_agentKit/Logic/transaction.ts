import { Connection, PublicKey } from "@solana/web3.js"

interface TxMetrics {
  mint: string
  totalTx: number
  uniqueWallets: number
  avgTxPerWallet: number
  peakActivityHour: number
}

export async function analyzeTransactionMetrics(
  connection: Connection,
  mintAddress: string
): Promise<TxMetrics> {
  const mint = new PublicKey(mintAddress)
  const signatures = await connection.getSignaturesForAddress(mint, { limit: 500 })

  const walletMap: Record<string, number> = {}
  const hourMap: Record<number, number> = {}

  for (const sig of signatures) {
    const tx = await connection.getParsedTransaction(sig.signature)
    if (!tx) continue

    const hour = new Date((sig.blockTime || 0) * 1000).getUTCHours()
    hourMap[hour] = (hourMap[hour] || 0) + 1

    for (const ix of tx.transaction.message.instructions) {
      if ("parsed" in ix && ix.parsed?.info?.source) {
        const wallet = ix.parsed.info.source
        walletMap[wallet] = (walletMap[wallet] || 0) + 1
      }
    }
  }

  const peakActivityHour = Object.entries(hourMap).sort((a, b) => b[1] - a[1])[0]?.[0] || 0
  const uniqueWallets = Object.keys(walletMap).length
  const totalTx = signatures.length
  const avgTx = uniqueWallets ? totalTx / uniqueWallets : 0

  return {
    mint: mint.toBase58(),
    totalTx,
    uniqueWallets,
    avgTxPerWallet: parseFloat(avgTx.toFixed(2)),
    peakActivityHour: Number(peakActivityHour)
  }
}
