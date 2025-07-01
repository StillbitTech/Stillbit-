import { Connection, PublicKey } from "@solana/web3.js"
import { TokenBalanceSchema, createBalanceSchema } from "./balanceSchema"

export async function fetchImprovedTokenBalance(
  connection: Connection,
  wallet: string,
  mint: string
): Promise<TokenBalanceSchema | null> {
  const walletPub = new PublicKey(wallet)
  const mintPub = new PublicKey(mint)

  const tokenAccounts = await connection.getParsedTokenAccountsByOwner(walletPub, {
    mint: mintPub
  })

  if (tokenAccounts.value.length === 0) return null

  const info = tokenAccounts.value[0].account.data.parsed.info
  const amount = parseInt(info.tokenAmount.amount)
  const decimals = info.tokenAmount.decimals
  const symbol = mint.slice(0, 4).toUpperCase()

  return createBalanceSchema(mint, symbol, amount, decimals)
}
