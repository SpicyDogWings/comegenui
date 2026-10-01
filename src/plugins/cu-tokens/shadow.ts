// src/plugins/cu-tokens/shadow.ts — Geometría de sombras.
//
// El valor de una sombra es SOLO geometría: `<x> <y> <blur>` (ej. `0 4px 6px`).
// El color y su alfa NO forman parte del valor: los aporta `--cu-shadow-color`
// (el color `shadow` del tema + su opacidad), que `colorsBlock` emite por tema.
// Los valores legacy traían el color embebido (`0 4px 6px rgba(0,0,0,.1)`);
// `stripShadowColor` lo limpia al emitir y al migrar.

const COLOR_RE = /(?:rgba?|hsla?)\([^)]*\)|#[0-9a-f]{3,8}/gi

export interface ShadowGeometry {
  x: string
  y: string
  blur: string
}

/** Saca cualquier color embebido y deja solo la geometría. */
export function stripShadowColor(value: unknown): string {
  return String(value ?? '')
    .replace(COLOR_RE, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Parsea `x y blur [color]` → { x, y, blur }. Tokens faltantes = "0". */
export function parseShadow(value: unknown): ShadowGeometry {
  const [x = '0', y = '0', blur = '0'] = stripShadowColor(value).split(/\s+/).filter(Boolean)
  return { x, y, blur }
}

/** Compone { x, y, blur } → "x y blur". */
export function composeShadow({ x, y, blur }: Partial<ShadowGeometry>): string {
  return `${x || '0'} ${y || '0'} ${blur || '0'}`
}

/** Si no trae unidad, asume px (`0` → `0px`; `0rem` queda igual). */
export function normalizeShadowLength(value: unknown): string {
  const v = String(value ?? '').trim()
  return /^-?(?:\d+|\d*\.\d+)$/.test(v) ? `${v}px` : v
}

/** Deja la sombra canónica: sin color y con las longitudes en px si faltaba unidad. */
export function normalizeShadow(value: unknown): string {
  const { x, y, blur } = parseShadow(value)
  return composeShadow({
    x: normalizeShadowLength(x),
    y: normalizeShadowLength(y),
    blur: normalizeShadowLength(blur),
  })
}
