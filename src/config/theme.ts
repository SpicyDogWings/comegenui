export const themes = {
  light: { primary: '#1774A4', neutral: '#2c2c2c', success: '#22c55e', warning: '#f59e0b', danger: '#ef4444', surface: '#ffffff' },
  dark: { primary: '#38bdf8', neutral: '#e5e5e5', success: '#4ade80', warning: '#fbbf24', danger: '#f87171', surface: '#1a1a1a' },
  sigacadv2: { primary: '#0037FF', neutral: '#1a1a1a', success: '#28a745', warning: '#ffc107', danger: '#dc3545', surface: '#f5f5f5' },
};

export type ThemeName = keyof typeof themes;

export function isValidTheme(value: string): value is ThemeName {
  return value in themes;
}
