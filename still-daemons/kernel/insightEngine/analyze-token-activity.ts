interface ActivityWindow {
  timestamp: number
  volume: number
}

interface PatternMatch {
  type: "spike" | "drop" | "flat"
  startIndex: number
  endIndex: number
  delta: number
}

export function detectActivityPatterns(data: ActivityWindow[], spikeThreshold = 1.5): PatternMatch[] {
  const result: PatternMatch[] = []

  for (let i = 1; i < data.length; i++) {
    const prev = data[i - 1].volume
    const curr = data[i].volume

    if (curr > prev * spikeThreshold) {
      result.push({
        type: "spike",
        startIndex: i - 1,
        endIndex: i,
        delta: parseFloat((curr - prev).toFixed(2))
      })
    } else if (curr < prev / spikeThreshold) {
      result.push({
        type: "drop",
        startIndex: i - 1,
        endIndex: i,
        delta: parseFloat((prev - curr).toFixed(2))
      })
    }
  }

  return result
}
