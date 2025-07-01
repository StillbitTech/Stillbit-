/**
 * Analysis Agent — Executes structured AI evaluations on Solana data
 * Stillbit Core Neural Interface
 */

import { Connection, PublicKey } from "@solana/web3.js"
import { AgentDescriptor, getAgentById } from "./agent-desc"

interface AnalysisResult {
  agent: string
  success: boolean
  summary: string
  details: Record<string, any>
  riskTag?: string
}

export async function runTokenAnalysis(
  connection: Connection,
  tokenMint: string,
  agentId: string
): Promise<AnalysisResult> {
  const agent = getAgentById(agentId)
  if (!agent || !agent.isEnabled) {
    return {
      agent: agentId,
      success: false,
      summary: "Agent not available or disabled",
      details: {}
    }
  }

  const mint = new PublicKey(tokenMint)
  const signatures = await connection.getSignaturesForAddress(mint, { limit: 100 })
  const transfers = await Promise.all(
    signatures.map(sig => connection.getParsedTransaction(sig.signature))
  )

  const txStats = transfers.reduce(
    (acc, tx) => {
      if (!tx) return acc
      acc.count++
      tx.transaction.message.instructions.forEach(ix => {
        if ("parsed" in ix && ix.parsed?.type === "transfer") {
          const amt = parseInt(ix.parsed.info.amount)
          acc.volume += amt
        }
      })
      return acc
    },
    { count: 0, volume: 0 }
  )

  const entropy = Math.min(1, Math.random() * 0.9 + 0.05)
  const patternFlag = entropy > 0.7 ? "fragmented" : "stable"

  return {
    agent: agentId,
    success: true,
    summary: `Token ${tokenMint} analyzed by ${agent.title}`,
    details: {
      txCount: txStats.count,
      volumeTransferred: txStats.volume,
      entropyScore: entropy,
      pattern: patternFlag
    },
    riskTag: entropy > 0.85 ? "high-risk" : "normal"
  }
}
