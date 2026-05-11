import { lighten, darken, toHex, getContrast, transparentize } from "color2k";

const getBgClasses = (color: string, variant: string, hightContrast: boolean) => {
  const isGhostOrOutlined = ["ghost", "outlined"].includes(variant);
  const isSoftOrSubtle = ["soft", "subtle"].includes(variant);
  const isLink = variant === "link";
  let main = color;
  if (isGhostOrOutlined || isLink) main = transparentize(color, 1);
  if (isSoftOrSubtle) main = transparentize(color, 0.8);
  let hover = darken(color, 0.1);
  let active = darken(color, 0.2);
  const hoverContrast = getContrast(toHex(darken(color, 0.1)), main);
  if (hoverContrast < 1) hover = lighten(main, 0.1);
  const activeContrast = getContrast(toHex(darken(color, 0.2)), main);
  if (activeContrast < 2) active = lighten(main, hightContrast ? 0.2 : 0.1);
  if (isGhostOrOutlined) {
    hover = transparentize(color, 0.9);
    active = transparentize(color, 0.8);
  }
  if (isLink) {
    hover = transparentize(color, 1);
    active = transparentize(color, 1);
  }
  if (isSoftOrSubtle) {
    hover = transparentize(color, 0.7);
    active = transparentize(color, 0.6);
  }
  return { main, hover, active };
};

const getFgClasses = (color: string, variant: string, hightContrast: boolean) => {
  let main = toHex(lighten(color, 0.6));
  const contrast = getContrast(main, color);
  if (hightContrast ? contrast < 3 : contrast < 2) main = toHex(darken(color, hightContrast ? 0.7 : 0.5));
  if (["ghost", "outlined", "soft", "subtle", "link"].includes(variant)) main = color;
  let border = "";
  if (variant === "subtle") border = transparentize(color, 0.7);
  return { main, border };
};

export const colorMap = {
  primary: "#3b82f6",
  neutral: "#2c2c2c",
  success: "#22c55e",
  warning: "#f59e0b",
  danger: "#ef4444",
};

export { getBgClasses, getFgClasses };
