// src/utils/textAlign.ts — alineación del texto de un item flex.
//
// `text-align` NO mueve nada dentro de un contenedor `flex`: el `Button` de la lib es
// `inline-flex` con el contenido en una fila, así que `text-align: center|right` se queda
// sin efecto visible. La alineación real es `justify-content`. Los tres componentes que
// alinean texto (DropdownMenu, Select, Autocomplete) comparten este mapeo, para que
// `left` / `center` / `right` signifiquen lo mismo en todos.

export type TextAlign = 'left' | 'center' | 'right'

/** `text-align` → `justify-content` del bloque de contenido (ícono + label). */
export const TEXT_ALIGN_JUSTIFY = {
  left: 'flex-start',
  center: 'center',
  right: 'flex-end',
} as const

/**
 * Estilo para un item flex alineable: `justify-content` ubica el bloque de contenido
 * (con ícono incluido, sin descentrarlo) y `text-align` alinea el texto cuando el label
 * ocupa más de una línea.
 */
export function textAlignStyle(textAlign: TextAlign) {
  return { justifyContent: TEXT_ALIGN_JUSTIFY[textAlign], textAlign }
}
