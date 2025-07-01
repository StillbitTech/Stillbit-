import { Connection, PublicKey } from "@solana/web3.js"

interface NewTokenInfo {
  mint: string
  creator: string | null
  creationSlot: number
  initialAccounts: number
}

export async function scanNewToken(
  connection: Connection,
  mintAddress: string
): Promise<NewTokenInfo> {
  const mint = new PublicKey(mintAddress)
  const mintInfo = await connection.getAccountInfo(mint)

  const parsed = await connection.getParsedTokenAccountsByMint(mint)
  const firstAccount = parsed.value[0]?.account
  const creator = firstAccount?.owner.toBase58() ?? null
  const creationSlot = mintInfo?.slot ?? 0
  const accountCount = parsed.value.length

  return {
    mint: mint.toBase58(),
    creator,
    creationSlot,
    initialAccounts: accountCount
  }
}
