import type { TokensConfig } from "@spicydogwings/gandalf-tokens";

/**
 * Tokens del Button. La fuente es gandalf; `naming` emite la convención plana
 * de ComegenUI (`--cu-color-{color}-{variante}`) para que el componente y los
 * tests del workspace viejo sigan funcionando sin cambios.
 */
export const gandalfConfig: TokensConfig = {
  naming: {
    prefix: "cu",
    variants: ["color-token", "variant", "state", "text", "border"],
  },
  colors: {
    primary: "#E73F1E",
    secondary: "#6366f1",
    neutral: "#1a1a1a",
    success: "#22c55e",
    warning: "#f59e0b",
    danger: "#ef4444",
    surface: "#eeeeee",
    focus: "#1774A4",
    shadow: "#000000",
    strong: "#6b7280",
    default: "#d1d5db",
  },
  themes: {
    dark: {
      colors: {
        primary: "#38bdf8",
        secondary: "#818cf8",
        neutral: "#e5e5e5",
        success: "#4ade80",
        warning: "#fbbf24",
        danger: "#f87171",
        surface: "#1a1a1a",
        focus: "#60a5fa",
        shadow: "#000000",
        strong: "#9ca3af",
        default: "#4b5563",
      },
      opacities: { shadows: 40 },
    },
  },
  opacities: { shadows: 10 },
  sizes: {
    base: "0.25rem",
    // gandalf exige pasos numéricos; los nombres de cu se agregan como alias.
    steps: {
      "0-5": 0.5,
      "1": 1,
      "2": 2,
      "3": 3,
      "4": 4,
      "6": 6,
      "8": 8,
      "12": 12,
      "16": 16,
      "20": 20,
    },
    space: ["0-5", "1", "2", "3", "4", "6", "8", "12", "16", "20"],
    radius: { default: 2, none: 0, sm: 1, md: 2, lg: 3, full: "9999px" },
    border: { width: 0.25, strong: 0.5, min: "1px", strongMin: "2px" },
  },
  font: {
    family: {
      sans: "Inter, system-ui, sans-serif",
      mono: "Fira Code, monospace",
    },
  },
  code: {},
  variants: {
    // Los alfas y los textos replican las fórmulas de cu-tokens: el texto de
    // cada familia se mide contra el tinte más fuerte de sus estados.
    solid: {
      bg: "color",
      text: "contrast",
      border: "none",
      state: {
        hover: { bg: { mix: { with: "black", amount: 0.1 } } },
        active: { bg: { mix: { with: "white", amount: 0.1 } } },
      },
    },
    soft: {
      bg: { alpha: 0.15 },
      text: { ensureContrast: { against: "bg", min: 4.5 } },
      border: "none",
      state: {
        hover: { bg: { alpha: 0.25 } },
        active: { bg: { alpha: 0.35 } },
      },
    },
    subtle: {
      bg: { alpha: 0.1 },
      text: { ensureContrast: { against: "bg", min: 4.5 } },
      border: { alpha: 0.5 },
      state: {
        hover: { bg: { alpha: 0.2 } },
        active: { bg: { alpha: 0.3 } },
      },
    },
    ghost: {
      bg: "transparent",
      text: { ensureContrast: { against: "surface", min: 4.5 } },
      border: { ensureContrast: { against: "surface", min: 3 } },
      state: {
        hover: {
          bg: { alpha: 0.1 },
          text: { ensureContrast: { against: "bg", min: 4.5 } },
        },
        active: {
          bg: { alpha: 0.2 },
          text: { ensureContrast: { against: "bg", min: 4.5 } },
        },
      },
    },
  },
};
