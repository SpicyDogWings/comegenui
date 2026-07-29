import { darken, toHex, lighten, transparentize } from 'color2k'

let styleEl: HTMLStyleElement | null = null

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

export function generateCSS(tokens: any) {
  const t = tokens
  return `:root {
    /* Colors */
    ${colorVar('primary', t.colors.primary)}
    ${colorVar('neutral', t.colors.neutral)}
    ${colorVar('success', t.colors.success)}
    ${colorVar('warning', t.colors.warning)}
    ${colorVar('danger', t.colors.danger)}
    --cu-color-surface: ${t.colors.surface};

    /* Typography */
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

    /* Spacing */
    --cu-space-2xs: ${t.spacing['2xs']};
    --cu-space-xs: ${t.spacing.xs};
    --cu-space-sm: ${t.spacing.sm};
    --cu-space-md: ${t.spacing.md};
    --cu-space-lg: ${t.spacing.lg};
    --cu-space-xl: ${t.spacing.xl};
    --cu-space-2xl: ${t.spacing['2xl']};

    /* Border Radius */
    --cu-radius-none: ${t.borderRadius.none};
    --cu-radius-sm: ${t.borderRadius.sm};
    --cu-radius-md: ${t.borderRadius.md};
    --cu-radius-lg: ${t.borderRadius.lg};
    --cu-radius-full: ${t.borderRadius.full};

    /* Shadows */
    --cu-shadow-sm: ${t.shadows.sm};
    --cu-shadow-md: ${t.shadows.md};
    --cu-shadow-lg: ${t.shadows.lg};
    --cu-shadow-xl: ${t.shadows.xl};

    /* Borders */
    --cu-border-none: ${t.borders.width.none};
    --cu-border-thin: ${t.borders.width.thin};
    --cu-border-medium: ${t.borders.width.medium};
    --cu-border-thick: ${t.borders.width.thick};
    --cu-border-color: ${t.borders.color.default};
    --cu-border-color-strong: ${t.borders.color.strong};
    --cu-border-color-focus: ${t.borders.color.focus};
  }`
}

export function inject(css: string) {
  if (!styleEl) {
    styleEl = document.createElement('style')
    styleEl.id = 'cu-tokens'
    document.head.appendChild(styleEl)
  }
  styleEl.textContent = css
}
