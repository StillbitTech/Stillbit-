export interface TransferModelInput {
  token: string
  amount: number
  frequency: number
}

export function evaluateTransferRisk(input: TransferModelInput): "Low" | "Medium" | "High" {
  if (input.amount > 100000 && input.frequency > 10) return "High"
  if (input.amount > 50000 || input.frequency > 5) return "Medium"
  return "Low"
}
