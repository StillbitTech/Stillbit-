export function isValidSolanaAddress(address: string): boolean {
  const base58Regex = /^[1-9A-HJ-NP-Za-km-z]{32,44}$/
  return base58Regex.test(address)
}

export function checkWalletFormat(address: string): string {
  if (!address) return "Missing address"
  if (!isValidSolanaAddress(address)) return "Invalid format"
  if (address.length < 32 || address.length > 44) return "Suspicious length"
  return "Valid"
}
