interface StreamedTransfer {
  token: string
  from: string
  to: string
  amount: number
  timestamp: number
}

export class TransferStream {
  private buffer: StreamedTransfer[] = []

  push(transfer: StreamedTransfer): void {
    this.buffer.push(transfer)
    if (this.buffer.length > 1000) {
      this.buffer.shift()
    }
  }

  getRecent(limit = 10): StreamedTransfer[] {
    return this.buffer.slice(-limit)
  }

  clear(): void {
    this.buffer = []
  }
}
