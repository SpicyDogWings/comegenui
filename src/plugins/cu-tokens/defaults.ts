export const DEFAULT_COLORS = {
  primary: '#E73F1E',
  secondary: '#6366f1',
  neutral: '#1a1a1a',
  success: '#22c55e',
  warning: '#f59e0b',
  danger: '#ef4444',
  surface: '#eeeeee'
}

export const DEFAULT_DARK_COLORS = {
  primary: '#38bdf8',
  secondary: '#818cf8',
  neutral: '#e5e5e5',
  success: '#4ade80',
  warning: '#fbbf24',
  danger: '#f87171',
  surface: '#1a1a1a'
}

export const DEFAULTS = {
  ...DEFAULT_COLORS,
  typography: {
    fontFamily: {
      sans: 'Inter, system-ui, sans-serif',
      mono: 'Fira Code, monospace'
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem'
    },
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    },
    lineHeight: {
      tight: '1.25',
      normal: '1.5',
      relaxed: '1.75'
    }
  },
  spacing: {
    '2xs': '2px',
    xs: '4px',
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    '2xl': '32px',
    '3xl': '48px'
  },
  borderRadius: {
    default: '8px',
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px'
  },
  shadows: {
    color: '#000000',
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    md: '0 4px 6px rgba(0,0,0,0.1)',
    lg: '0 10px 15px rgba(0,0,0,0.1)',
    xl: '0 20px 25px rgba(0,0,0,0.1)'
  },
  borders: {
    width: {
      none: '0',
      thin: '1px',
      medium: '2px',
      thick: '4px'
    },
    color: {
      default: '#d1d5db',
      strong: '#6b7280',
      focus: '#1774A4'
    }
  },
  modal: {
    size: {
      sm: '25vw',
      md: '30vw',
      lg: '35vw',
      xl: '40vw',
      auto: '50vw',
      full: '90vw'
    },
    height: {
      sm: '30vh',
      md: '40vh',
      lg: '50vh',
      xl: '60vh',
      auto: '50vh',
      full: '90vh'
    }
  }
}

const COLOR_KEYS = Object.keys(DEFAULT_COLORS)

export function extractColors(obj: any) {
  const colors: Record<string, string> = {}
  for (const key of COLOR_KEYS) {
    if (obj[key] !== undefined) colors[key] = obj[key]
  }
  return colors
}

export function extractShared(obj: any) {
  const { primary, secondary, neutral, success, warning, danger, surface, ...rest } = obj
  return rest
}
