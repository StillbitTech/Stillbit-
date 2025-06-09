
type AssetData = {
  priceVolatility: number;
  marketMomentum: number;
  stabilityScore: number;
  marketRisk: number;
};

export function riskMinder(assetData: AssetData): string {
  const volatilityImpact = Math.log(assetData.priceVolatility + 1) * assetData.marketMomentum;
  const stabilityFactor = assetData.stabilityScore / assetData.marketRisk;
  const forecastRisk = volatilityImpact * stabilityFactor;

  return forecastRisk > 0.8
    ? 'Alert: Risk of Instability Forecasted'
    : 'Asset Stability Likely';
}
