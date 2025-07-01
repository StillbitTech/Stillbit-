/**
 * Stillbit AI Tools — Utility helpers for pattern detection, entropy modeling, and AI signal shaping
 * Used across detectors and vault agents
 */

export function normalizeVector(vec: number[]): number[] {
  const max = Math.max(...vec)
  const min = Math.min(...vec)
  return vec.map(x => (x - min) / (max - min || 1))
}

export function computeEntropy(distribution: number[]): number {
  const total = distribution.reduce((a, b) => a + b, 0)
  return -distribution
    .map(p => (p / total) || 0)
    .reduce((sum, p) => sum + p * Math.log2(p || 1), 0)
}

export function standardDeviation(series: number[]): number {
  const avg = series.reduce((a, b) => a + b, 0) / series.length
  const variance = series.reduce((sum, x) => sum + (x - avg) ** 2, 0) / series.length
  return Math.sqrt(variance)
}

export function compareTrendVectors(vecA: number[], vecB: number[]): number {
  if (vecA.length !== vecB.length) return 0
  const diff = vecA.map((x, i) => Math.abs(x - vecB[i]))
  return 1 - normalizeVector(diff).reduce((a, b) => a + b, 0) / diff.length
}

export function generateNoiseVector(length: number = 10): number[] {
  return Array.from({ length }, () => Math.random())
}

export function interpretRiskScore(score: number): string {
  if (score >= 85) return "Critical AI alert"
  if (score >= 60) return "Elevated concern"
  if (score >= 35) return "Mild anomaly"
  return "No concern"
}
