
def calculate_volatility(prices):
    mean_price = sum(prices) / len(prices)
    variance = sum((p - mean_price) ** 2 for p in prices) / len(prices)
    return variance ** 0.5

def calculate_momentum(volume_data):
    if len(volume_data) < 2:
        return 0
    return (volume_data[-1] - volume_data[0]) / len(volume_data)

def weighted_health(price, demand, volatility):
    if volatility == 0:
        return 1
    return (price * demand) / volatility

def trend_signal(prices):
    if len(prices) < 3:
        return "Neutral"
    if prices[-1] > prices[-2] > prices[-3]:
        return "Uptrend"
    if prices[-1] < prices[-2] < prices[-3]:
        return "Downtrend"
    return "Sideways"
