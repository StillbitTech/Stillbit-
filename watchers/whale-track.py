import numpy as np
from typing import List, Dict


class TraceSignalAnalyzer:
    def __init__(self, window_size: int = 12, deviation_threshold: float = 2.3):
        self.window = window_size
        self.threshold = deviation_threshold

    def _normalized_series(self, series: List[float]) -> List[float]:
        if not series:
            return []

        mean = np.mean(series)
        std = np.std(series)
        return [(x - mean) / std if std != 0 else 0 for x in series]

    def detect_spikes(self, signal: List[float]) -> Dict[int, float]:
        normalized = self._normalized_series(signal)
        spikes = {
            index: score
            for index, score in enumerate(normalized)
            if abs(score) > self.threshold
        }
        return spikes

    def generate_trace_report(self, datapoints: List[float]) -> Dict[str, any]:
        anomalies = self.detect_spikes(datapoints)
        total_points = len(datapoints)

        return {
            "tracePoints": total_points,
            "spikeCount": len(anomalies),
            "spikeIndexMap": anomalies,
            "spikeDensity": round(len(anomalies) / total_points, 4) if total_points else 0.0,
        }
