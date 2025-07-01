import { Connection, PublicKey } from "@solana/web3.js"

interface TokenSignalReport {
  mint: string
  txLoad: number
  transferVolume: number
  uniqueSenders: string[]
  signalRisk: "low" | "moderate" | "high"
}

export async function analyzeTokenSignal(
  connection: Connection,
  mintAddress: string,
  txLimit = 50,
  volumeLimit = 10000
): Promise<TokenSignalReport> {
  const mint = new PublicKey(mintAddress)
  const accounts = await connection.getParsedTokenAccountsByMint(mint)
  const seen = new Set<string>()
  let txs = 0
  let volume = 0

  for (const { pubkey } of accounts.value) {
    const history = await connection.getConfirmedSignaturesForAddress2(pubkey, { limit: 15 })

    txs += history.length

    for (const item of history) {
      const tx = await connection.getParsedTransaction(item.signature)
      if (!tx) continue

      for (const ix of tx.transaction.message.instructions)
