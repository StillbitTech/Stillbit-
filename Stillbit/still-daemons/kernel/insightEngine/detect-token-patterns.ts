import { Connection, PublicKey } from "@solana/web3.js"

interface TokenActivitySummary {
  mint: string
  recentTxCount: number
  avgTxPerAccount: number
  maxTxBySingleAccount: number
}

export async function analyzeTokenActivity(
  connection: Connection,
  mintAddress: string,
  limit = 100
): Promise<TokenActivitySummary> {
  const mint = new PublicKey(mintAddress)
  const accounts = await connection.getParsedTokenAccountsByMint(mint)

  const activityMap: Record<string, number> = {}
  let totalTxs = 0

  for (const { pubkey } of accounts.value) {
    const txs = await connection.getConfirmedSignaturesForAddress2(pubkey, { limit: 5 })
    totalTxs += txs.length
    activityMap[pubkey.toBase58()] = txs.length
  }

  const accountCount = Object.keys(activityMap).length
  const maxTx = Math.max(...Object.values(activityMap), 0)

  return {
    mint: mint.toBase58(),
    recentTxCount: totalTxs,
    avgTxPerAccount: accountCount ? parseFloat((totalTxs / accountCount).toFixed(2)) : 0,
    maxTxBySingleAccount: maxTx
  }
}
