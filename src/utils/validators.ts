// src/utils/validators.ts — Validadores compartidos de props (patrón único de la
// lib). Cada componente declara la unión inline en `PropType<...>` y acá vive el
// validador, una sola vez.
//
// Uso: `validator: isColor`.

/** Set cerrado de strings: devuelve un type-guard listo para `validator`. */
export function oneOf<T extends string>(values: readonly T[]) {
  const allowed = new Set<string>(values)
  return (value: unknown): value is T => typeof value === 'string' && allowed.has(value)
}

export const COLORS = ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger'] as const
export const COLORS_BASE = ['primary', 'neutral', 'success', 'warning', 'danger'] as const
export const VARIANTS = ['solid', 'outlined', 'soft', 'ghost', 'subtle'] as const
export const VARIANTS_FULL = ['solid', 'outlined', 'soft', 'ghost', 'subtle', 'link', 'none'] as const
export const VARIANTS_NO_GHOST = ['solid', 'outlined', 'soft', 'subtle'] as const
export const VARIANTS_FIELD = ['outlined', 'soft', 'ghost', 'subtle'] as const
export const VARIANTS_FIELD_NONE = ['outlined', 'soft', 'ghost', 'subtle', 'none'] as const
export const VARIANTS_TABS = ['ghost', 'solid', 'boxed', 'soft'] as const
export const SIZES = ['sm', 'md', 'lg'] as const
export const SIZES_SM = ['sm', 'md'] as const
export const MODAL_SIZES = ['auto', 'sm', 'md', 'lg', 'xl', 'full'] as const
export const ALIGNS = ['start', 'center', 'end'] as const
export const TEXT_ALIGNS = ['left', 'center', 'right'] as const
export const POSITIONS = ['bottom', 'top', 'left', 'right'] as const
export const POSITIONS_VERTICAL = ['bottom', 'top'] as const
export const TRIGGERS = ['click', 'hover'] as const
export const BUTTON_TYPES = ['button', 'submit', 'reset'] as const
export const INPUT_TYPES = ['text', 'password', 'email', 'number', 'tel', 'url', 'search'] as const
export const TARGETS = ['_self', '_blank', '_parent', '_top'] as const
export const DATE_MODES = ['single', 'range'] as const
export const CARD_LAYOUTS = ['vertical', 'horizontal'] as const
export const NAVBAR_RESPONSIVE_MODES = ['auto', 'side', 'fullscreen'] as const
export const NAVBAR_SEARCH_MODES = ['filter', 'scroll'] as const
export const SELECT_SEARCH_MODES = ['startsWith', 'includes'] as const
export const CELLS_IMPORTER_INPUT_TYPES = ['input', 'zone'] as const

export const isColor = oneOf(COLORS)
export const isColorBase = oneOf(COLORS_BASE)
export const isVariant = oneOf(VARIANTS)
export const isVariantFull = oneOf(VARIANTS_FULL)
export const isVariantNoGhost = oneOf(VARIANTS_NO_GHOST)
export const isFieldVariant = oneOf(VARIANTS_FIELD)
export const isFieldVariantNone = oneOf(VARIANTS_FIELD_NONE)
export const isTabsVariant = oneOf(VARIANTS_TABS)
export const isSize = oneOf(SIZES)
export const isSizeSm = oneOf(SIZES_SM)
export const isModalSize = oneOf(MODAL_SIZES)
export const isAlign = oneOf(ALIGNS)
export const isTextAlign = oneOf(TEXT_ALIGNS)
export const isPosition = oneOf(POSITIONS)
export const isPositionVertical = oneOf(POSITIONS_VERTICAL)
export const isTrigger = oneOf(TRIGGERS)
export const isButtonType = oneOf(BUTTON_TYPES)
export const isInputType = oneOf(INPUT_TYPES)
export const isTarget = oneOf(TARGETS)
export const isDateMode = oneOf(DATE_MODES)
export const isCardLayout = oneOf(CARD_LAYOUTS)
export const isNavbarResponsiveMode = oneOf(NAVBAR_RESPONSIVE_MODES)
export const isNavbarSearchMode = oneOf(NAVBAR_SEARCH_MODES)
export const isSelectSearchMode = oneOf(SELECT_SEARCH_MODES)
export const isCellsImporterInputType = oneOf(CELLS_IMPORTER_INPUT_TYPES)

export type Color = (typeof COLORS)[number]
export type ColorBase = (typeof COLORS_BASE)[number]
export type Variant = (typeof VARIANTS)[number]
export type VariantFull = (typeof VARIANTS_FULL)[number]
export type VariantNoGhost = (typeof VARIANTS_NO_GHOST)[number]
export type FieldVariant = (typeof VARIANTS_FIELD)[number]
export type FieldVariantNone = (typeof VARIANTS_FIELD_NONE)[number]
export type TabsVariant = (typeof VARIANTS_TABS)[number]
export type Size = (typeof SIZES)[number]
export type SizeSm = (typeof SIZES_SM)[number]
export type ModalSize = (typeof MODAL_SIZES)[number]
export type Align = (typeof ALIGNS)[number]
export type TextAlign = (typeof TEXT_ALIGNS)[number]
export type Position = (typeof POSITIONS)[number]
export type PositionVertical = (typeof POSITIONS_VERTICAL)[number]
export type Trigger = (typeof TRIGGERS)[number]
export type ButtonType = (typeof BUTTON_TYPES)[number]
export type InputType = (typeof INPUT_TYPES)[number]
export type Target = (typeof TARGETS)[number]
export type DateMode = (typeof DATE_MODES)[number]
export type CardLayout = (typeof CARD_LAYOUTS)[number]
export type NavbarResponsiveMode = (typeof NAVBAR_RESPONSIVE_MODES)[number]
export type NavbarSearchMode = (typeof NAVBAR_SEARCH_MODES)[number]
export type SelectSearchMode = (typeof SELECT_SEARCH_MODES)[number]
export type CellsImporterInputType = (typeof CELLS_IMPORTER_INPUT_TYPES)[number]

