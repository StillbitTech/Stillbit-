import { isValidSolanaAddress } from "./walletFormatChecker"

export function runAddressValidationTests(): void {
  const testCases = [
    "9xzF1rWbcX9Lk8dF3aVnKj1zjE6NaV3eWaKdFG9V6fHg",
    "abc123",
    "",
    "9xzF1rWbcX9Lk8dF3aVnKj1zjE6NaV3eWaKdFG9V6fHgZZZZ"
  ]

  testCases.forEach((addr, i) => {
    const result = isValidSolanaAddress(addr)
    console.log(`[Test ${i + 1}] ${addr} → ${result ? "Valid" : "Invalid"}`)
  })
}
