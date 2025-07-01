export interface VolumePoint {
  hour: number
  value: number
}

export function generateHeatmapFromVolumes(volumes: VolumePoint[]): number[] {
  const map = Array(24).fill(0)

  for (const point of volumes) {
    const hour = point.hour % 24
    map[hour] += point.value
  }

  return map.map(v => parseFloat(v.toFixed(2)))
}

export function getPeakHours(heatmap: number[]): number[] {
  const max = Math.max(...heatmap)
  return heatmap
    .map((val, idx) => (val === max ? idx : -1))
    .filter(i => i !== -1)
}
