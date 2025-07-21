import numpy as np
from typing import List, Dict, Union


class TraceSignalAnalyzer:
    def __init__(self, window_size: int = 12, deviation_threshold: float = 2.3):
        self.window_size = window_size
        self.deviation_threshold = deviation_threshold

    def _normalize_series(self, series: List[float]) -> List[float]:
        if not series:
            return []

        mean = np.mean(series)
        std_dev = np.std(series)
        if std_dev == 0:
            return [0.0] * len(series)

        return [(value - mean) / std_dev for value in series]

    def detect_spikes(self, signal: List[float]) -> Dict[int, float]:
        normalized_signal = self._normalize_series(signal)

        spike_map = {
            idx: round(score, 4)
            for idx, score in enumerate(normalized_signal)
            if abs(score) > self.deviation_threshold
        }

        return spike_map

    def generate_trace_report(self, datapoints: List[float]) -> Dict[str, Union[int, float, Dict[int, float]]]:
        if not datapoints:
            return {
                "tracePoints": 0,
                "spikeCount": 0,
                "spikeIndexMap": {},
                "spikeDensity": 0.0
            }

        spike_index_map = self.detect_spikes(datapoints)
        total = len(datapoints)
        spike_count = len(spike_index_map)

        return {
            "tracePoints": total,
            "spikeCount": spike_count,
            "spikeIndexMap": spike_index_map,
            "spikeDensity": round(spike_count / total, 4)
        }
