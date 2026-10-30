import { colorOrDark, getColorForBackground } from 'src/utils/color';

describe('contrast color', () => {
  it('picks black text on light backgrounds and white text on dark ones', () => {
    expect(getColorForBackground('#fff')).toBe('#000');
    expect(getColorForBackground('#ffffff')).toBe('#000');
    expect(getColorForBackground('#000')).toBe('#fff');
    expect(getColorForBackground('#0000ff')).toBe('#fff');
    expect(getColorForBackground('rgb(255, 255, 255)')).toBe('#000');
    expect(getColorForBackground('rgb(0, 0, 0)')).toBe('#fff');
  });

  it('uses the lower threshold for a saturated yellow', () => {
    expect(getColorForBackground('#ffff00')).toBe('#000');
    expect(getColorForBackground('rgb(255, 255, 0)')).toBe('#000');
  });

  it('keeps a dark color and replaces a light one', () => {
    expect(colorOrDark('#000000')).toBe('#000000');
    expect(colorOrDark('#ffffff')).toBe('#000');
    expect(colorOrDark('#ffff00')).toBe('#000');
    expect(colorOrDark('rgb(0, 0, 0)')).toBe('#000000');
  });
});
