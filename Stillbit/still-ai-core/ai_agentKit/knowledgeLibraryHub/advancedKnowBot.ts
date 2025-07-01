import { Connection, PublicKey } from "@solana/web3.js"

interface BotDetectionResult {
  mint: string
  smartWallets: string[]
  txPerWallet: Record<string, number>
  botIndex: number
}

export async function detectSmartWalletClusters(
  connection: Connection,
  mintAddress: string
): Promise<BotDetectionResult> {
  const mint = new PublicKey(mintAddress)
  const tokenAccounts = await connection.getParsedTokenAccountsByMint(mint)

  const walletTxMap: Record<string, number> = {}

  for (const { pubkey } of tokenAccounts.value) {
    const txs = await connection.getConfirmedSignaturesForAddress2(pubkey, { limit: 20 })
    if (txs.length >= 5) {
      walletTxMap[pubkey.toBase58()] = txs.length
    }
  }

  const smartWallets = Object.entries(walletTxMap)
    .filter(([_, count]) => count >= 8)
    .map(([wallet]) => wallet)

  const totalTxs = Object.values(walletTxMap).reduce((a, b) => a + b, 0)
  const botIndex = parseFloat(((smartWallets.length / Object.keys(walletTxMap).length) * 100).toFixed(2))

  return {
    mint: mint.toBase58(),
    smartWallets,
    txPerWallet: walletTxMap,
    botIndex
  }
}
