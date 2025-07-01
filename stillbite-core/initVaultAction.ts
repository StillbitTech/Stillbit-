interface VaultInitConfig {
  vaultId: string
  owner: string
  creationSlot: number
  network: "solana" | "testnet" | "devnet"
}

export function initVault(config: VaultInitConfig) {
  return {
    ...config,
    createdAt: Date.now(),
    status: "initialized"
  }
}
