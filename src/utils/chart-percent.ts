export const pieLegendPercent = (value: number, total: number) =>
  (total ? (value / total) * 100 : 0).toFixed(2);
