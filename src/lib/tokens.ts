import { darken, toHex, lighten, transparentize } from 'color2k'

const DEFAULTS = {
  colors: {
    primary: '#E73F1E',
    secondary: '#6366f1',
    neutral: '#1a1a1a',
    success: '#22c55e',
    warning: '#f59e0b',
    danger: '#ef4444',
    surface: '#eeeeee'
  },
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
    none: '0',
    sm: '4px',
    md: '8px',
    lg: '12px',
    full: '9999px'
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
  }
}

function colorVar(name: string, value: string) {
  return `
    --cu-color-${name}: ${value};
    --cu-color-${name}-hover: ${toHex(darken(value, 0.1))};
    --cu-color-${name}-active: ${toHex(lighten(value, 0.1))};
    --cu-color-${name}-ghost-hover: ${toHex(transparentize(value, 0.9))};
    --cu-color-${name}-ghost-active: ${toHex(transparentize(value, 0.8))};
    --cu-color-${name}-soft: ${toHex(transparentize(value, 0.85))};
    --cu-color-${name}-soft-hover: ${toHex(transparentize(value, 0.75))};
    --cu-color-${name}-soft-active: ${toHex(transparentize(value, 0.65))};
    --cu-color-${name}-subtle: ${toHex(transparentize(value, 0.9))};
    --cu-color-${name}-subtle-hover: ${toHex(transparentize(value, 0.8))};
    --cu-color-${name}-subtle-active: ${toHex(transparentize(value, 0.7))};
    --cu-color-${name}-subtle-border: ${transparentize(value, 0.5)};`
}

function generateCSS(config: any) {
  const t = config
  return `:root {
    ${colorVar('primary', t.colors.primary)}
    ${colorVar('secondary', t.colors.secondary)}
    ${colorVar('neutral', t.colors.neutral)}
    ${colorVar('success', t.colors.success)}
    ${colorVar('warning', t.colors.warning)}
    ${colorVar('danger', t.colors.danger)}
    --cu-color-surface: ${t.colors.surface};

    --cu-font-sans: ${t.typography.fontFamily.sans};
    --cu-font-mono: ${t.typography.fontFamily.mono};
    --cu-font-size-xs: ${t.typography.fontSize.xs};
    --cu-font-size-sm: ${t.typography.fontSize.sm};
    --cu-font-size-md: ${t.typography.fontSize.md};
    --cu-font-size-lg: ${t.typography.fontSize.lg};
    --cu-font-size-xl: ${t.typography.fontSize.xl};
    --cu-font-size-2xl: ${t.typography.fontSize['2xl']};
    --cu-font-weight-normal: ${t.typography.fontWeight.normal};
    --cu-font-weight-medium: ${t.typography.fontWeight.medium};
    --cu-font-weight-semibold: ${t.typography.fontWeight.semibold};
    --cu-font-weight-bold: ${t.typography.fontWeight.bold};
    --cu-line-height-tight: ${t.typography.lineHeight.tight};
    --cu-line-height-normal: ${t.typography.lineHeight.normal};
    --cu-line-height-relaxed: ${t.typography.lineHeight.relaxed};

    --cu-space-2xs: ${t.spacing['2xs']};
    --cu-space-xs: ${t.spacing.xs};
    --cu-space-sm: ${t.spacing.sm};
    --cu-space-md: ${t.spacing.md};
    --cu-space-lg: ${t.spacing.lg};
    --cu-space-xl: ${t.spacing.xl};
    --cu-space-2xl: ${t.spacing['2xl']};
    --cu-space-3xl: ${t.spacing['3xl']};

    --cu-radius-none: ${t.borderRadius.none};
    --cu-radius-sm: ${t.borderRadius.sm};
    --cu-radius-md: ${t.borderRadius.md};
    --cu-radius-lg: ${t.borderRadius.lg};
    --cu-radius-full: ${t.borderRadius.full};

    --cu-border-none: ${t.borders.width.none};
    --cu-border-thin: ${t.borders.width.thin};
    --cu-border-medium: ${t.borders.width.medium};
    --cu-border-thick: ${t.borders.width.thick};
    --cu-border-color: ${t.borders.color.default};
    --cu-border-color-strong: ${t.borders.color.strong};
    --cu-border-color-focus: ${t.borders.color.focus};
  }`
}

function deepMerge(target: any, source: any): any {
  const result = { ...target }
  for (const key of Object.keys(source)) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(target[key] || {}, source[key])
    } else {
      result[key] = source[key]
    }
  }
  return result
}

let injected = false

export function initTokens(customConfig?: any) {
  if (injected) return
  injected = true

  const config = customConfig
    ? deepMerge(DEFAULTS, customConfig)
    : DEFAULTS

  const css = generateCSS(config)

  const style = document.createElement('style')
  style.id = 'cu-tokens'
  style.textContent = css
  document.head.appendChild(style)
}

// Auto-init: check for global config
if (typeof window !== 'undefined') {
  const win = window as any
  const config = win.__CU_TOKENS__ || win.__CU_CONFIG__
  initTokens(config)
}
