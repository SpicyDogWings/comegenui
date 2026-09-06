export const themes = {
  light: {
    primary: '#1774A4',
    neutral: '#2c2c2c',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    surface: '#ffffff',
  },
  dark: {
    primary: '#38bdf8',
    neutral: '#e5e5e5',
    success: '#4ade80',
    warning: '#fbbf24',
    danger: '#f87171',
    surface: '#1a1a1a',
  },
  sigacadv2: {
    primary: '#0037FF',
    neutral: '#1a1a1a',
    success: '#28a745',
    warning: '#ffc107',
    danger: '#dc3545',
    surface: '#f5f5f5',
  },
  // Gruvbox — https://github.com/morhetz/gruvbox
  'gruvbox-dark': {
    primary: '#83a598',   // bright_blue
    neutral: '#ebdbb2',   // light1 (fg)
    success: '#b8bb26',   // bright_green
    warning: '#fabd2f',   // bright_yellow
    danger: '#fb4934',    // bright_red
    surface: '#282828',   // dark0
  },
  'gruvbox-light': {
    primary: '#076678',   // faded_blue
    neutral: '#3c3836',   // dark1 (fg)
    success: '#79740e',   // faded_green
    warning: '#b57614',   // faded_yellow
    danger: '#9d0006',    // faded_red
    surface: '#fbf1c7',   // light0
  },
};

export const theme = {
  colors: themes.light,
};

export const themeNames = Object.keys(themes) as Array<keyof typeof themes>;
export type ThemeName = keyof typeof themes;
export const isValidTheme = (value: string) =>
  themeNames.includes(value as ThemeName) || value === "";
