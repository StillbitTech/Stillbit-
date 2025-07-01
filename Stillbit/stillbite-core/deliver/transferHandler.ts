interface TransferRequest {
  from: string
  to: string
  token: string
  amount: number
}

export function validateTransfer(req: TransferRequest): boolean {
  return req.amount > 0 && req.token.length === 44 && req.from !== req.to
}
