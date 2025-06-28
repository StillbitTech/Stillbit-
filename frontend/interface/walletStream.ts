// walletStream.ts
// Streams wallet addresses at a fixed cadence and returns a stop handle.

/**
 * Stream wallet IDs to a callback at a given interval.
 *
 * @param wallets   array of wallet public keys
 * @param interval  delay between emissions (ms), default = 1 000 ms
 * @param onEmit    optional callback invoked on each wallet
 * @returns function that stops the stream
 */
export function streamWalletFlow(
  wallets: string[],
  interval = 1_000,
  onEmit: (wallet: string, index: number) => void = () => {},
): () => void {
  if (!Array.isArray(wallets) || wallets.length === 0) {
    throw new Error("wallets array is empty or invalid");
  }
  if (interval <= 0) {
    throw new Error("interval must be a positive number");
  }

  let idx = 0;
  const timer = setInterval(() => {
    if (idx >= wallets.length) {
      clearInterval(timer);
      return;
    }
    const wallet = wallets[idx++];
    // eslint-disable-next-line no-console
    console.log(`[stream] wallet ${idx}/${wallets.length}: ${wallet}`);
    onEmit(wallet, idx - 1);
  }, interval);

  /** Stop the stream */
  return () => clearInterval(timer);
}

/* Example
const stop = streamWalletFlow(
  ["walletA", "walletB", "walletC"],
  500,
  (w, i) => console.log("Callback:", i, w),
);

// Stop after 5 s
setTimeout(stop, 5_000);
*/
