
function endureScan(assetData) {
  const enduranceFactor = Math.pow(assetData.priceChange, 2) * assetData.assetAge;
  const riskThreshold = 100;

  return enduranceFactor < riskThreshold
    ? 'Alert: Asset Endurance Low'
    : 'Asset Endurance Sufficient';
}
