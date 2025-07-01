import React from "react"

interface SignalSentimentWidgetProps {
  clarityScore: number
  trend: "Stable" | "Unstable" | "Shifting"
  activePulse: string
  driftVolume24h: number
}

const getClarityColor = (score: number) => {
  if (score >= 70) return "#27ae60"
  if (score >= 40) return "#f39c12"
  return "#e74c3c"
}

export const SignalSentimentWidget: React.FC<SignalSentimentWidgetProps> = ({
  clarityScore,
  trend,
  activePulse,
  driftVolume24h
}) => {
  return (
    <div className="signal-sentiment-widget">
      <h3>Trace Signal Overview</h3>
      <div className="sentiment-details">
        <div className="score-ring" style={{
          backgroundColor: getClarityColor(clarityScore)
        }}>
          {clarityScore}%
        </div>
        <ul className="signal-facts">
          <li><strong>State:</strong> {trend}</li>
          <li><strong>Leading Pulse:</strong> {activePulse}</li>
          <li><strong>Drift Volume:</strong> ${driftVolume24h.toLocaleString()}</li>
        </ul>
      </div>
    </div>
  )
}
