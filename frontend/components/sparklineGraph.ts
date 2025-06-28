// sparklineGraph.ts
// Draws a responsive spark-line with grid and auto-scaling

export function drawSparkline(data: number[]): void {
  const canvas = document.getElementById("trend-canvas") as HTMLCanvasElement | null;
  if (!canvas || data.length === 0) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Handle high-DPI displays
  const ratio = window.devicePixelRatio || 1;
  canvas.width = canvas.offsetWidth * ratio;
  canvas.height = canvas.offsetHeight * ratio;
  ctx.scale(ratio, ratio);

  const w = canvas.offsetWidth;
  const h = canvas.offsetHeight;
  const pad = 8;

  const max = Math.max(...data);
  const min = Math.min(...data);
  const span = max - min || 1;

  const xStep = (w - pad * 2) / (data.length - 1);
  const toY = (v: number) => h - pad - ((v - min) / span) * (h - pad * 2);

  ctx.clearRect(0, 0, w, h);

  // Grid
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  for (let i = 0; i <= 4; i++) {
    const y = pad + (i * (h - pad * 2)) / 4;
    ctx.beginPath();
    ctx.moveTo(pad, y);
    ctx.lineTo(w - pad, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  // Spark line
  ctx.beginPath();
  ctx.moveTo(pad, toY(data[0]));
  data.forEach((v, i) => ctx.lineTo(pad + i * xStep, toY(v)));
  ctx.strokeStyle = "#00ccff";
  ctx.lineWidth = 2;
  ctx.stroke();
}
