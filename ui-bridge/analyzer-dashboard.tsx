import React from "react"
import { SignalPulseCard } from "./SignalPulseCard"
import { ThreatLevelBadge } from "./ThreatLevelBadge"
import { NetworkDriftGraph } from "./NetworkDriftGraph"
import { TraceEventList } from "./TraceEventList"
import { StatusPingBanner } from "./StatusPingBanner"

const StillbitDashboard: React.FC = () => {
  const pulseData = {
    name: "STILLBIT",
    threatLevel: "Elevated",
    signalVolume: 1729400,
  }

  const traceEvents = [
    { amount: 102000, token: "STL", address: "9ztUqgL...Bfw1" },
    { amount: 61000, token: "STL", address: "FkE2pWr...Xy9e" },
  ]

  const driftTimeline = [
    { time: "10:15", value: 520 },
    { time: "11:30", value: 1040 },
    { time: "12:45", value: 390 },
  ]

  return (
    <div className="stillbit-dashboard">
      <StatusPingBanner message="Anomaly surge on STL — 42.1% drift signal increase" />

      <section className="dashboard-slab">
        <SignalPulseCard
          signalName={pulseData.name}
          threatLevel={pulseData.threatLevel}
          volume={pulseData.signalVolume}
        />
        <ThreatLevelBadge level={pulseData.threatLevel} />
      </section>

      <section className="dashboard-slab">
        <NetworkDriftGraph data={driftTimeline} />
        <TraceEventList events={traceEvents} />
      </section>
    </div>
  )
}

export default StillbitDashboard
