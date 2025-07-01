import React from "react"

interface TraceSignalCardProps {
  sourceAddress: string
  signalWeight: number
  token: string
  timestamp: number
  network?: string
}

function getTimeDelta(timestamp: number): string {
  const delta = Date.now() - timestamp
  const minutes = Math.floor(delta / 60000)
  if (minutes < 1) return "Just now"
  if (minutes < 60) return `${minutes} min ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hrs ago`
  const days = Math.floor(hours / 24)
  return `${days}d ago`
}

function shortenAddress(addr: string): string {
  return addr.length > 8 ? `${addr.slice(0, 6)}...${addr.slice(-4)}` : addr
}

export const TraceSignalCard: React.FC<TraceSignalCardProps> = ({
  sourceAddress,
  signalWeight,
  token,
  timestamp,
  network = "Solana"
}) => {
  return (
    <div className="trace-signal-card" style={{
      border: "1px solid #d1d1d1",
      borderRadius: "10px",
      padding: "18px",
      backgroundColor: "#f9f9fb",
      boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
      maxWidth: "400px",
      margin: "14px auto"
    }}>
      <h4 style={{ marginBottom: "10px", color: "#3d3d3d" }}>🔍 Signal Trace Detected</h4>
      <p><strong>Source:</strong> {shortenAddress(sourceAddress)}</p>
      <p><strong>Magnitude:</strong> {signalWeight.toLocaleString()} {token}</p>
      <p><strong>Network:</strong> {network}</p>
      <p><strong>Detected:</strong> {getTimeDelta(timestamp)}</p>
    </div>
  )
}
