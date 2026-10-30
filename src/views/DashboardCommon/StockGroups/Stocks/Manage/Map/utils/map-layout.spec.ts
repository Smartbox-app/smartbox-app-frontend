import { BoxMapRes, StockRes } from 'smartbox-types';

import {
  getBoxHeight,
  getBoxLayoutFromBox,
  getBoxWidth,
  getMapBoxFontSize,
  isSameBoxLayout,
  layoutFromMoveableRect,
  normalizeMapPosition,
} from './map-layout';

const stock = {
  mapWidth: 1000,
  mapWidthMeters: 10,
  mapHeight: 500,
  mapHeightMeters: 10,
} as StockRes;

const box = (overrides: Partial<BoxMapRes> = {}) =>
  ({
    x: 10,
    y: 20,
    rotation: 0,
    ...overrides,
  }) as BoxMapRes;

describe('map layout', () => {
  it('uses an explicit size, otherwise scales the group size, otherwise 50', () => {
    expect(getBoxWidth(box({ width: 80, groupWidth: 2 }), stock)).toBe(80);
    expect(getBoxWidth(box({ groupWidth: 1.5 }), stock)).toBe(150);
    expect(getBoxWidth(box(), stock)).toBe(50);
    expect(getBoxHeight(box({ groupHeight: 2 }), stock)).toBe(100);
  });

  it('builds a layout and compares every field', () => {
    const layout = getBoxLayoutFromBox(box({ groupWidth: 1, groupHeight: 1 }), stock);

    expect(layout).toEqual({ x: 10, y: 20, width: 100, height: 50, rotation: 0 });
    expect(isSameBoxLayout(layout, { ...layout })).toBe(true);
    expect(isSameBoxLayout(layout, { ...layout, rotation: 90 })).toBe(false);
  });

  it('snaps an unrotated position to a 5px grid and leaves a rotated one', () => {
    expect(normalizeMapPosition(12, 0)).toBe(10);
    expect(normalizeMapPosition(13, 0)).toBe(15);
    expect(normalizeMapPosition(13, 45)).toBe(13);
  });

  it('centers a moveable rect and rounds each value', () => {
    expect(layoutFromMoveableRect([100, 80], 30.4, 20.6, 10.4)).toEqual({
      x: 85,
      y: 70,
      width: 30,
      height: 21,
      rotation: 10,
    });
  });

  it('picks a font size from the box width', () => {
    expect(getMapBoxFontSize(81)).toBe(13);
    expect(getMapBoxFontSize(61)).toBe(12);
    expect(getMapBoxFontSize(51)).toBe(11);
    expect(getMapBoxFontSize(50)).toBe(10);
  });
});
