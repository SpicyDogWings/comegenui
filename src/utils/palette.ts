import { lighten, darken, toHex, getContrast } from "color2k";

const getFgClass = (color: string, hightContrast: boolean) => {
  let fgColor = toHex(lighten(color, 0.6));
  if (getContrast(fgColor, color) < 3 && hightContrast) {
    fgColor = toHex(darken(color, 0.7));
  } else if (getContrast(fgColor, color) < 3) {
    fgColor = toHex(darken(color, 0.5));
  }
  return fgColor;
};

export { getFgClass };
