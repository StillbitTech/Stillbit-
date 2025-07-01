import { Connection, PublicKey } from "@solana/web3.js"

interface TokenDeepProfile {
  mint: string
  totalAccounts: number
  circulatingEstimate: number
  holderDiversity: number  // 0 to 1
}

export async function getTokenDeepProfile(
  connection: Connection,
  mintAddress: string
): Promise<TokenDeepProfile> {
  const mint = new PublicKey(mintAddress)
  const accounts = await connection.getParsedTokenAccountsByMint(mint)

  let total = 0
  let nonZero = 0

  for (const acc of accounts.value) {
    const amount = parseFloat(acc.account.data.parsed.info.tokenAmount.uiAmount || "0")
    total += amount
    if (amount > 0) nonZero += 1
  }

  return {
    mint: mint.toBase58(),
    totalAccounts: accounts.value.length,
    circulatingEstimate: parseFloat(total.toFixed(2)),
    holderDiversity: accounts.value.length > 0 ? parseFloat((nonZero / accounts.value.length).toFixed(3)) : 0
  }
}
