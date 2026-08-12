import { computed } from 'vue'
import { useRoute } from 'vue-router'

// Source of truth: los mismos entry points que construye build-lib.ts
// (src/lib/**/*.ts, excluyendo index.ts y tokens.ts). Si se agrega o quita
// un entry point, el badge de los playgrounds se actualiza solo.
const LIB_ENTRIES = import.meta.glob('@/lib/**/*.ts')

const LIB_NAMES = new Set(
  Object.keys(LIB_ENTRIES)
    .map((file) => file.split('/').pop()?.replace(/\.ts$/, '') ?? '')
    .filter((name) => name !== 'index' && name !== 'tokens'),
)

// Rutas cuyo componente se publica en la lib bajo OTRO nombre de entry point.
// AdvancedTable se publica como cu-table (lib/data/table.ts → Table.ce.vue → AdvancedTable.vue).
const LIB_KEY_ALIASES: Record<string, string> = {
  'advanced-table': 'table',
}

/**
 * Estado dinámico de "inclusión en la lib" para los playgrounds.
 *
 * - `libKey`: nombre del entry point en src/lib, derivado de la ruta actual
 *   (último segmento, ej. /playground/components/date-picker → "date-picker").
 * - `inLib`: si ese entry point existe realmente en src/lib (verdict calculado,
 *   no hardcodeado por página).
 */
export function useLibStatus() {
  const route = useRoute()
  const libKey = computed(() => {
    const segments = route.path.split('/').filter(Boolean)
    const last = segments[segments.length - 1] ?? ''
    return LIB_KEY_ALIASES[last] ?? last
  })
  const inLib = computed(() => LIB_NAMES.has(libKey.value))
  return { libKey, inLib }
}
