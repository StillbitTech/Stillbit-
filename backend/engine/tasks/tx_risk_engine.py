# tx_risk_stream.py
"""
Real-time transaction-risk stream aggregator.

Consumes tuples (path, density, age, recent_alerts) from a queue,
delegates scoring to TxRiskEngine, pushes alerts to a callback.
"""

from __future__ import annotations

import queue
import threading
from time import sleep
from typing import Callable, List, Tuple

from tx_risk_engine import TxRiskEngine, PathRating, RiskRating


RiskInput = Tuple[List[str], float, int, int]         # (path, density, age_days, alerts)
AlertSink = Callable[[PathRating, RiskRating], None]


class TxRiskStream:
    def __init__(
        self,
        maxsize: int = 10_000,
        poll_interval: float = 0.1,
        engine: TxRiskEngine | None = None,
    ) -> None:
        self.q: queue.Queue[RiskInput] = queue.Queue(maxsize=maxsize)
        self.poll_interval = poll_interval
        self.engine = engine or TxRiskEngine()
        self._thread = threading.Thread(target=self._loop, daemon=True)
        self._sink: AlertSink | None = None
        self._running = False

    # ----------------------------- Public API ----------------------------- #

    def start(self, sink: AlertSink) -> None:
        """Begin consuming items and forwarding alerts."""
        self._sink = sink
        self._running = True
        self._thread.start()

    def stop(self) -> None:
        """Signal the loop to terminate."""
        self._running = False
        self._thread.join(timeout=2)

    def push(self, item: RiskInput) -> None:
        """Feed a new observation into the queue (non-blocking)."""
        try:
            self.q.put_nowait(item)
        except queue.Full:
            TxRiskEngine.log_trace("queue_full", "dropping item")

    # --------------------------- Internal loop ---------------------------- #

    def _loop(self) -> None:
        while self._running:
            try:
                path, density, age, alerts = self.q.get(timeout=self.poll_interval)
            except queue.Empty:
                continue

            path_rating = self.engine.dark_track(path)
            risk_rating = self.engine.risk_alert(density, age, alerts)

            if self._sink:
                self._sink(path_rating, risk_rating)

            self.q.task_done()


# ----------------------------- Demo run ----------------------------------- #

if __name__ == "__main__":
    engine = TxRiskEngine()
    stream = TxRiskStream(engine=engine)

    def print_alert(path_rate: PathRating, risk_rate: RiskRating) -> None:
        print(f"[ALERT] Path={path_rate.value} | Risk={risk_rate.value}")

    stream.start(print_alert)

    # Fake producer
    for i in range(30):
        sample = (
            ["walletA", "proxy_1", "unknown_wallet", "walletB"] * (i % 3 + 1),
            120 + i * 10,      # tx_density
            2,                 # token_age_days
            i % 4,             # recent_alerts
        )
        stream.push(sample)
        sleep(0.05)

    sleep(1)
    stream.stop()
