import numpy as np

def z_score(value, mean, std):
    if std == 0:
        return 0.0
    return round((value - mean) / std, 4)

def ema(data, alpha=0.3):
    if not data:
        return []
    result = [data[0]]
    for d in data[1:]:
        result.append(alpha * d + (1 - alpha) * result[-1])
    return result

def normalize(data):
    if not data:
        return []
    low, high = min(data), max(data)
    if low == high:
        return [0.0] * len(data)
    return [round((x - low) / (high - low), 4) for x in data]

def roll_avg(data, window=3):
    if window <= 0 or window > len(data):
        return []
    return [round(sum(data[i:i+window])/window, 4) for i in range(len(data)-window+1)]

def detect_outliers(data, threshold=2.5):
    if not data:
        return []
    mean, std = np.mean(data), np.std(data)
    if std == 0:
        return []
    return [x for x in data if abs((x - mean) / std) > threshold]

def weighted_avg(values, weights):
    if not values or not weights or len(values) != len(weights):
        return 0.0
    total = sum(weights)
    if total == 0:
        return 0.0
    return round(sum(v * w for v, w in zip(values, weights)) / total, 4)

def spike_ratio(current, base):
    if base == 0:
        return 0.0
    return round((current - base) / base * 100, 2)

def vector_norm(vec):
    return round(np.linalg.norm(vec), 4)
