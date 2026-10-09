import { BoxMapRes, BoxMapUserRes, StockRes } from 'smartbox-types';

export type BoxMapLayoutUpdate = {
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
};

export const getBoxWidth = (
  box: BoxMapRes | BoxMapUserRes,
  stock: StockRes,
) => {
  if (box.width) return box.width;
  if (!box.groupWidth) return 50;
  const ratio = stock.mapWidth / stock.mapWidthMeters;
  return Math.round(Number(box.groupWidth) * ratio);
};

export const getBoxHeight = (
  box: BoxMapRes | BoxMapUserRes,
  stock: StockRes,
) => {
  if (box.height) return box.height;
  if (!box.groupHeight) return 50;
  const ratio = stock.mapHeight / stock.mapHeightMeters;
  return Math.round(Number(box.groupHeight) * ratio);
};

export const getBoxLayoutFromBox = (
  box: BoxMapRes | BoxMapUserRes,
  stock: StockRes,
): BoxMapLayoutUpdate => ({
  x: box.x || 0,
  y: box.y || 0,
  width: getBoxWidth(box, stock),
  height: getBoxHeight(box, stock),
  rotation: box.rotation || 0,
});

export const isSameBoxLayout = (
  left: BoxMapLayoutUpdate,
  right: BoxMapLayoutUpdate,
) =>
  left.x === right.x &&
  left.y === right.y &&
  left.width === right.width &&
  left.height === right.height &&
  left.rotation === right.rotation;

export const normalizeMapPosition = (position: number, rotation: number) => {
  if (rotation !== 0) return position;

  const rest = position % 5;
  return rest > 2 ? position + (5 - rest) : position - rest;
};

export const layoutFromMoveableRect = (
  beforeOrigin: readonly number[],
  offsetWidth: number,
  offsetHeight: number,
  rotation: number,
): BoxMapLayoutUpdate => ({
  x: Math.round(beforeOrigin[0] - offsetWidth / 2),
  y: Math.round(beforeOrigin[1] - offsetHeight / 2),
  width: Math.round(offsetWidth),
  height: Math.round(offsetHeight),
  rotation: Math.round(rotation),
});

export const getMapBoxFontSize = (width: number) => {
  if (width > 80) return 13;
  if (width > 60) return 12;
  if (width > 50) return 11;
  return 10;
};
