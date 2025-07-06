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
  try {
    const mint = new PublicKey(mintAddr)
    const { value: tokenAccounts } = await connection.getParsedTokenAccountsByMint(mint)

    const activityMap = new Map<string, number>()

    const txResults = await Promise.allSettled(
      tokenAccounts.map(({ pubkey }) =>
        connection.getConfirmedSignaturesForAddress2(pubkey, { limit: 10 })
      )
    )

    let totalTransfers = 0

    txResults.forEach((res, i) => {
      if (res.status === "fulfilled" && res.value.length > 0) {
        const account = tokenAccounts[i].pubkey.toBase58()
        activityMap.set(account, res.value.length)
        totalTransfers += res.value.length
      }
    })

    const uniqueAccounts = activityMap.size
    const avgTransfers = uniqueAccounts ? totalTransfers / uniqueAccounts : 0

    return {
      mint: mint.toBase58(),
      txCountLastHour: totalTransfers,
      uniqueAccounts,
      avgTransfersPerAccount: parseFloat(avgTransfers.toFixed(2)),
    }
  } catch (err) {
    console.error("Failed to fetch token activity snapshot:", err)
    return {
      mint: mintAddr,
      txCountLastHour: 0,
      uniqueAccounts: 0,
      avgTransfersPerAccount: 0,
    }
  }
}
