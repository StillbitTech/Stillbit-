/**
 * Agent Descriptor — Stillbit Neural Role Allocator
 * Defines neural agent traits, behavior scope, and Solana interaction mappings.
 */

export interface AgentDescriptor {
  id: string
  title: string
  capabilities: string[]
  solanaScopes: string[]
  aiPersona: string
  modelVersion: string
  attentionVector?: number[]
  isEnabled: boolean
}

export const StillbitAgentRegistry: AgentDescriptor[] = [
  {
    id: "sentinel",
    title: "Liquidity Sentinel",
    capabilities: [
      "monitor-liquidity-stream",
      "predict-rug-trajectory",
      "flag-burst-volume-patterns"
    ],
    solanaScopes: ["Raydium", "Jupiter", "DEXPools"],
    aiPersona: "Guard-mode attention filter",
    modelVersion: "4.0-mini-finetuned",
    attentionVector: [0.75, 0.12, 0.43, 0.87, 0.64],
    isEnabled: true
  },
  {
    id: "oracle",
    title: "Risk Oracle",
    capabilities: [
      "analyze-wallet-density",
      "detect-smart-wallet-clusters",
      "compute-risk-profiles"
    ],
    solanaScopes: ["TokenAccounts", "ProgramTraces", "TxHistory"],
    aiPersona: "Predictive & analytical",
    modelVersion: "GPT-4-crypto-tuned",
    attentionVector: [0.91, 0.68, 0.31, 0.44, 0.82],
    isEnabled: true
  },
  {
    id: "seer",
    title: "Pattern Seer",
    capabilities: [
      "extract-pattern-entropy",
      "forecast-token-fragmentation",
      "map-behavioral-spikes"
    ],
    solanaScopes: ["All"],
    aiPersona: "Chaotic vector processor",
    modelVersion: "v3.5-fractal",
    isEnabled: false
  }
]

export function getAgentById(id: string): AgentDescriptor | undefined {
  return StillbitAgentRegistry.find(agent => agent.id === id)
}

export function listEnabledAgents(): AgentDescriptor[] {
  return StillbitAgentRegistry.filter(agent => agent.isEnabled)
}
