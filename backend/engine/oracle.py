
def stabilityCore(assetData):
    stabilityIndex = assetData['priceFluctuation'] * (assetData['marketDepth'] ** 0.5)
    return "Alert: Asset Instability Detected" if stabilityIndex > 3000 else "Asset Stable"

def secureFlow(assetData):
    healthIndex = (assetData['price'] * assetData['demandFactor']) / assetData['priceVolatility']
    return "Alert: Asset Health Below Acceptable Level" if healthIndex < 0.5 else "Asset Health Stable"
