import { lighten, darken, toHex, getContrast, transparentize } from "color2k";

const getFgClass = (color: string, hightContrast: boolean) => {
  let fgColor = toHex(lighten(color, 0.6));
  if (getContrast(fgColor, color) < 3 && hightContrast) {
    fgColor = toHex(darken(color, 0.7));
  } else if (getContrast(fgColor, color) < 3) {
    fgColor = toHex(darken(color, 0.5));
  }
  return fgColor;
};

const getBgClasses = (color: string, variant: string, hightContrast: boolean) => {
  let main = color;
  if (["ghost", "outlined"].includes(variant)) main = transparentize(color, 1);
  if (["soft", "subtle"].includes(variant)) main = transparentize(color, 0.8);
  let hover = darken(color, 0.1);
  let active = darken(color, 0.2);
  if (getContrast(toHex(darken(color, 0.1)), main) < 1)
    hover = lighten(main, 0.1);
  if (getContrast(toHex(darken(color, 0.2)), main) < 2)
    active = lighten(main, 0.1);
  if (getContrast(toHex(darken(color, 0.2)), main) < 2 && hightContrast)
    active = lighten(main, 0.2);
  if (["ghost", "outlined"].includes(variant)) hover = transparentize(color, 0.9);
  if (["ghost", "outlined"].includes(variant)) active = transparentize(color, 0.8);
  if (["soft", "subtle"].includes(variant)) hover = transparentize(color, 0.7);
  if (["soft", "subtle"].includes(variant)) active = transparentize(color, 0.6);
  return { main, hover, active };
};

const getFgClasses = (color: string, variant: string, hightContrast: boolean) => {
  let main = toHex(lighten(color, 0.6));
  let border = "";
  if (getContrast(main, color) < 3 && hightContrast) {
    main = toHex(darken(color, 0.7));
  } else if (getContrast(main, color) < 3) {
    main = toHex(darken(color, 0.5));
  }
  if (["ghost", "outlined"].includes(variant)) main = color;
  if (["soft", "subtle"].includes(variant)) main = color;
  if (["subtle"].includes(variant)) border = transparentize(color, 0.7);
  return { main, border };
};

export { getFgClass, getBgClasses, getFgClasses };
