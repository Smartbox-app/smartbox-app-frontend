export const pieLegendPercent = (value: number, total: number) =>
  total ? Math.round((value / total) * 100).toFixed(2) : 0;
