
interface ChartData {
  timestamp: number;
  value: number;
}

function generateChartPoints(data: ChartData[]): [number, number][] {
  return data.map(entry => [entry.timestamp, entry.value]);
}

function detectAnomalyPattern(data: number[]): string {
  let spikeCount = 0;
  for (let i = 1; i < data.length - 1; i++) {
    if (data[i] > data[i-1] * 1.5 && data[i] > data[i+1] * 1.5) {
      spikeCount++;
    }
  }
  return spikeCount > 2 ? "Anomaly Detected" : "Stable Pattern";
}
