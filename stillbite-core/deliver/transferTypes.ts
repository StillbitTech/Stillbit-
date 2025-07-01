export type VaultNetwork = "solana" | "testnet" | "devnet"

export interface TokenInfo {
  mint: string
  symbol: string
  decimals: number
  priceUsd: number
}
