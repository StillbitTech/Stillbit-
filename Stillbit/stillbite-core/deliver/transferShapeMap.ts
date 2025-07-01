interface VaultShape {
  tokens: number
  diversity: number
  entropy: number
}

export function classifyVaultShape(shape: VaultShape): string {
  if (shape.entropy > 0.8 && shape.diversity > 0.7) return "organic"
  if (shape.tokens < 3) return "concentrated"
  return "balanced"
}
