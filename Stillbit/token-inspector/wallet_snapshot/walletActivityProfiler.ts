interface WalletActivitySample {
  timestamp: number
  txCount: number
  volume: number
}

interface WalletActivityProfile {
  address: string
  totalVolume: number
  averageTxCount: number
  lastActive: number
}

export function profileWalletActivity(
  address: string,
  samples: WalletActivitySample[]
): WalletActivityProfile {
  const totalVolume = samples.reduce((sum, s) => sum + s.volume, 0)
  const averageTx = samples.length
    ? samples.reduce((sum, s) => sum + s.txCount, 0) / samples.length
    : 0
  const lastActive = samples.length ? samples[samples.length - 1].timestamp : 0

  return {
    address,
    totalVolume,
    averageTxCount: parseFloat(averageTx.toFixed(2)),
    lastActive
  }
}
