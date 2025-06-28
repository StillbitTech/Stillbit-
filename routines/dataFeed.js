// dataFeed.js
// Lightweight WebSocket data-feed manager for the Stillbit dashboard.
// Handles auto-reconnect, back-off, simple pub/sub for incoming messages.

export class DataFeed {
  /**
   * @param {string} wsUrl  WebSocket endpoint (wss://…)
   * @param {number} [reconnectDelay=1000]  initial reconnect delay (ms)
   */
  constructor(wsUrl, reconnectDelay = 1_000) {
    this.wsUrl = wsUrl;
    this.reconnectDelay = reconnectDelay;
    this.socket = null;
    this.subscribers = new Set();  // registered callbacks
    this._active = false;
  }

  /* ------------------------------------------------------------------ *
   * Public API                                                          *
   * ------------------------------------------------------------------ */

  /** Open the WebSocket connection (idempotent) */
  connect() {
    if (this._active) return;

    this._active = true;
    this._openSocket(this.reconnectDelay);
  }

  /** Stop the feed and clear subscribers */
  close() {
    this._active = false;
    this.subscribers.clear();
    if (this.socket) {
      this.socket.close(1000, "Client closed");
      this.socket = null;
    }
  }

  /**
   * Subscribe to incoming payloads.
   * @param {(data: any) => void} cb
   * @returns {() => void} unsubscribe function
   */
  onMessage(cb) {
    this.subscribers.add(cb);
    return () => this.subscribers.delete(cb);
  }

  /* ------------------------------------------------------------------ *
   * Internal helpers                                                    *
   * ------------------------------------------------------------------ */

  _openSocket(delay) {
    this.socket = new WebSocket(this.wsUrl);

    this.socket.addEventListener("open", () => {
      console.info("[DataFeed] connected");
      delay = this.reconnectDelay;          // reset back-off
    });

    this.socket.addEventListener("message", (ev) => {
      let payload;
      try {
        payload = JSON.parse(ev.data);
      } catch {
        payload = ev.data;
      }
      this.subscribers.forEach((cb) => cb(payload));
    });

    this.socket.addEventListener("close", (evt) => {
      console.warn(
        `[DataFeed] socket closed (code ${evt.code}) — retry in ${delay} ms`,
      );
      if (this._active) {
        setTimeout(() => this._openSocket(Math.min(delay * 2, 30_000)), delay);
      }
    });

    this.socket.addEventListener("error", (err) => {
      console.error("[DataFeed] socket error:", err);
      this.socket.close();  // triggers close listener for reconnect
    });
  }
}

/* ------------------------------------------------------------------ *
 * Example                                                             *
 * ------------------------------------------------------------------ */
// const feed = new DataFeed("wss://api.stillbit.io/feed");
// feed.connect();
// const off = feed.onMessage((msg) => console.log("tick:", msg));
//
// // later…
// off();          // unsubscribe
// feed.close();   // stop entirely
