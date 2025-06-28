# flow_spectrum.py
"""
Flow Spectrum – matrix builder and anomaly detector for transaction flows.

Improvements over the basic version:
• Auto-sizing: matrix size derives from max index in data (up to hard cap)
• Normalisation option to convert absolute values to percentages
• Z-score anomaly check in addition to simple mean threshold
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Iterable, List, Tuple

import numpy as np


@dataclass(slots=True, frozen=True)
class SpectrumConfig:
    max_dim: int = 64        # safety cap
    z_thresh: float = 3.0    # z-score threshold for anomalies


# ────────────────────────────── core api ───────────────────────────── #

def build_matrix(
    txs: Iterable[dict],
    cfg: SpectrumConfig = SpectrumConfig(),
) -> np.ndarray:
    """
    Create an N×N flow matrix where N = 1 + max(src,dst) (clamped by cfg.max_dim).
    """
    # Derive matrix size
    max_idx = 0
    for t in txs:
        max_idx = max(max_idx, t.get("src_index", 0), t.get("dst_index", 0))
    dim = min(max_idx + 1, cfg.max_dim)

    mat = np.zeros((dim, dim), dtype=float)

    # Populate
    for t in txs:
        s, d, amt = t.get("src_index", 0), t.get("dst_index", 0), t.get("amount", 0)
        if s < dim and d < dim:
            mat[s, d] += amt
    return mat


def normalise_matrix(mat: np.ndarray) -> np.ndarray:
    """Return matrix with each cell expressed as % of total."""
    total = mat.sum()
    return mat / total if total else mat.copy()


def anomalies(
    mat: np.ndarray,
    cfg: SpectrumConfig = SpectrumConfig(),
) -> List[Tuple[int, int]]:
    """
    Identify cells whose z-score > cfg.z_thresh.
    Fallback to mean×2 if stdev == 0 (flat matrix).
    """
    mean = mat.mean()
    std = mat.std()
    if std == 0:
        thr = mean * 2
        return [
            (i, j)
            for i in range(mat.shape[0])
            for j in range(mat.shape[1])
            if mat[i, j] > thr
        ]

    z = (mat - mean) / std
    return list(zip(*np.where(z > cfg.z_thresh)))  # list[(row, col)]


# ─────────────────────────── demo / test ──────────────────────────── #

if __name__ == "__main__":
    sample = [
        {"src_index": 0, "dst_index": 1, "amount": 50},
        {"src_index": 0, "dst_index": 2, "amount": 20},
        {"src_index": 3, "dst_index": 1, "amount": 200},  # spike
        {"src_index": 4, "dst_index": 4, "amount": 15},
    ]

    matrix = build_matrix(sample)
    print("Matrix:\n", matrix)

    anomalies_found = anomalies(matrix)
    print("Anomalies:", anomalies_found)
