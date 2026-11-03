// src/utils/sanitizeIcon.ts — `icon` es HTML del consumidor: se sanitiza antes del
// `v-html` con un allowlist de **SVG inline**.
//
// DOMPurify con el perfil por defecto deja pasar HTML interactivo dentro del icono:
// `<a href="/hack">` sobrevive y queda un enlace anidado dentro del `<a>`/`<button>`
// que lo contiene (HTML inválido, dos nodos interactivos y una navegación que el
// consumidor no pidió), y `<img>` agrega una imagen que puede fallar o cargar red.
// El icono documentado es un SVG inline, así que el allowlist son sólo elementos de
// dibujo SVG y atributos presentacionales: sin `<a>`, `<img>`, `<foreignObject>`,
// `<use>`/`href` (recursos externos), `<style>`, `<script>` ni handlers `on*`.
import DOMPurify from 'dompurify'

/** Elementos de dibujo SVG permitidos dentro de un `icon`. */
const ICON_TAGS = [
  'svg',
  'g',
  'path',
  'circle',
  'ellipse',
  'rect',
  'line',
  'polyline',
  'polygon',
  'defs',
  'linearGradient',
  'radialGradient',
  'stop',
  'clipPath',
  'mask',
  'title',
  'desc',
]

/** Atributos presentacionales de esos elementos (sin `style` ni referencias externas). */
const ICON_ATTRS = [
  'class',
  'id',
  'role',
  'xmlns',
  'viewBox',
  'preserveAspectRatio',
  'width',
  'height',
  'x',
  'y',
  'x1',
  'x2',
  'y1',
  'y2',
  'cx',
  'cy',
  'r',
  'rx',
  'ry',
  'd',
  'points',
  'fill',
  'fill-opacity',
  'fill-rule',
  'clip-rule',
  'stroke',
  'stroke-width',
  'stroke-linecap',
  'stroke-linejoin',
  'stroke-miterlimit',
  'stroke-dasharray',
  'stroke-dashoffset',
  'stroke-opacity',
  'opacity',
  'transform',
  'offset',
  'stop-color',
  'stop-opacity',
  'gradientUnits',
  'gradientTransform',
  'clipPathUnits',
  'maskUnits',
  'aria-hidden',
  'aria-label',
  'focusable',
]

/**
 * Sanitiza el HTML de un icono dejando sólo SVG inline. Devuelve `undefined` sin icono
 * y `''` cuando el HTML no contiene nada válido: el `v-if` del consumidor no pinta
 * wrappers vacíos.
 */
export function sanitizeIcon(html?: string): string | undefined {
  if (!html) return undefined
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ICON_TAGS,
    ALLOWED_ATTR: ICON_ATTRS,
    // Un `<a>texto</a>` no debe dejar el texto suelto dentro del botón.
    KEEP_CONTENT: false,
  })
}
