export const themes = {
  light: {
    primary: '#1774A4',
    neutral: '#2c2c2c',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
  },
  dark: {
    primary: '#38bdf8',
    neutral: '#e5e5e5',
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
  },
  sigacadv2: {
    primary: '#0037FF',
    neutral: '#1a1a1a',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
  },
};

export const theme = {
  colors: themes.light,
};

export const themeNames = Object.keys(themes) as Array<keyof typeof themes>;
export type ThemeName = keyof typeof themes;
export const isValidTheme = (value: string) =>
  themeNames.includes(value as ThemeName) || value === "";
