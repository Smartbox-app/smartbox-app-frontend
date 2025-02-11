const componentToHex = (c: number) => {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
};

const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
};

const hexToHSL = (hex: string) => {
  // remove #
  const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
  const fullHex = hex.replace(shorthandRegex, function (m, r, g, b) {
    return r + r + g + g + b + b;
  });

  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
  if (!result) return [0, 0, 1];

  let r = parseInt(result[1], 16);
  let g = parseInt(result[2], 16);
  let b = parseInt(result[3], 16);

  r /= 255;
  g /= 255;
  b /= 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;
  if (max == min) {
    h = s = 0; // achromatic
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g < b ? 6 : 0);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
    h /= 6;
  }

  return [h, s, l];
};

export const getColorForBackground = (bg: string) => {
  let parsedColor = bg;
  if (bg.includes("rgb")) {
    const values = bg.split("(")[1].split(")")[0];
    const [r, g, b] = values.split(",").map((part) => parseInt(part));
    parsedColor = rgbToHex(r, g, b);
  }

  const [h, s, l] = hexToHSL(parsedColor);

  if (l > 0.5) return "#000";
  return "#fff";
};

export const colorOrDark = (color: string) => {
  let parsedColor = color;
  if (color.includes("rgb")) {
    const values = color.split("(")[1].split(")")[0];
    const [r, g, b] = values.split(",").map((part) => parseInt(part));
    parsedColor = rgbToHex(r, g, b);
  }
  const [h, s, l] = hexToHSL(parsedColor);
  if (l < 0.5) return parsedColor;
  return "#000";
};
