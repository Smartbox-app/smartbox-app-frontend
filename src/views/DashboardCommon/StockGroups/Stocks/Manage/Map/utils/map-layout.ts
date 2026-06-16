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
  return Math.round(box.groupWidth * ratio);
};

export const getBoxHeight = (
  box: BoxMapRes | BoxMapUserRes,
  stock: StockRes,
) => {
  if (box.height) return box.height;
  if (!box.groupHeight) return 50;
  const ratio = stock.mapHeight / stock.mapHeightMeters;
  return Math.round(box.groupHeight * ratio);
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
