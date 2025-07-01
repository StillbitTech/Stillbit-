import { Connection, PublicKey } from "@solana/web3.js"

interface TokenActivityLog {
  mint: string
  txCountLastHour: number
  uniqueAccounts: number
  avgTransfersPerAccount: number
}

export async function getTokenActivitySnapshot(
  connection: Connection,
  mintAddr: string
): Promise<TokenActivityLog> {
  const mint = new PublicKey(mintAddr)
  const accounts = await connection.getParsedTokenAccountsByMint(mint)

  let totalTransfers = 0
  const activeAccounts = new Set<string>()

  for (const { pubkey } of accounts.value) {
    const txs = await connection.getConfirmedSignaturesForAddress2(pubkey, { limit: 10 })
    if (txs.length > 0) activeAccounts.add(pubkey.toBase58())
    totalTransfers += txs.length
  }

  const uniqueCount = activeAccounts.size
  const avg = uniqueCount ? totalTransfers / uniqueCount : 0

  return {
    mint: mint.toBase58(),
    txCountLastHour: totalTransfers,
    uniqueAccounts: uniqueCount,
    avgTransfersPerAccount: parseFloat(avg.toFixed(2))
  }
}
