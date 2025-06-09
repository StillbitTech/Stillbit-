
import math

def riskMinder(assetData):
    volatilityImpact = math.log(assetData['priceVolatility'] + 1) * assetData['marketMomentum']
    stabilityFactor = assetData['stabilityScore'] / assetData['marketRisk']
    forecastRisk = volatilityImpact * stabilityFactor
    return "Alert: Risk of Instability Forecasted" if forecastRisk > 0.8 else "Asset Stability Likely"

def longTermGuard(assetData):
    longTermRisk = (assetData['price'] * assetData['marketMomentum']) / (assetData['volatility'] ** 0.5)
    return "Alert: Long-Term Instability Predicted" if longTermRisk > 2 else "Long-Term Stability Assured"
