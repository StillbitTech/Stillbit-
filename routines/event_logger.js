/**
 * Emit a single log line.
 * @param {"info"|"warn"|"error"|"debug"|string} level
 * @param {*} payload
 */
export function logEvent(level, payload) {
  const ts = new Date().toISOString();
  // eslint-disable-next-line no-console
  console.log(`[${level.toUpperCase()}] ${ts}:`, payload);
}


export function batchLog(events = []) {
  events.forEach((e) => logEvent(e.type, e.payload));
}

