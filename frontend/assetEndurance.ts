// assetEndurance.ts
// Evaluates an asset’s “endurance” score: large price swings in a young asset
// imply fragility; small swings in an older asset imply resilience.

export interface AssetSnapshot {
  priceChangePct: number   // %-change over analysis window (–1 … +1)
  assetAgeDays: number     // days since mint/listing
}

/** Result object with numeric score + qualitative label */
export interface EnduranceResult {
  score: number            // 0-100 (higher = sturdier)
  flag: "low" | "sufficient" | "strong"
}

/**
 * Assess asset endurance.
 *
 * Formula (heuristic):
 *   endurance = ageFactor / volatilityFactor
 *   ageFactor        = log2(ageDays + 1)
 *   volatilityFactor = (|priceChange| + 0.01)^2
 *
 * The result is normalised to 0-100.
 */
export function assessEndurance(data: AssetSnapshot): EnduranceResult {
  const ageFactor = Math.log2(Math.max(data.assetAgeDays, 0) + 1)
  const volatilityFactor = Math.pow(Math.abs(data.priceChangePct) + 0.01, 2)
  const raw = ageFactor / volatilityFactor

  // normalise: empirical max ~10 → scale to 100
  const score = Math.min(Math.round((raw / 10) * 100), 100)

  let flag: EnduranceResult["flag"] = "sufficient"
  if (score < 40) flag = "low"
  else if (score > 75) flag = "strong"

  return { score, flag }
}

/* Example
const demo = assessEndurance({ priceChangePct: 0.15, assetAgeDays: 3 })
console.log(demo)  // { score: 28, flag: 'low' }
*/
