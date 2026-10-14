/**
 * Entry de la superficie **Vue** de ComegenUI (paquete npm).
 *
 * Exporta los componentes reales (`src/components/**`), NO los wrappers CE
 * (`.ce.vue`): esos son exclusivos del modo custom element y emiten sus eventos
 * con `ceEmit()`, que depende del VDOM.
 *
 * PoC: por ahora solo Button y Alert.
 */
import type { App, Plugin } from 'vue'

import Button from '@/components/buttons/Button.vue'
import Alert from '@/components/information/Alert.vue'
import { initTokens as applyTokens } from '@/plugins/cu-tokens/css'

export const CuButton = Button
export const CuAlert = Alert

/**
 * Inyecta los tokens `--cu-*` (runtime). Es idempotente y no-op si el host ya
 * los definió en `:root`. Se llama una vez al importar el paquete; en SSR no
 * hace nada (no hay `document`).
 *
 * El tipo se declara acá a propósito: así el `.d.ts` publicado no arrastra
 * rutas internas del repo.
 */
export const initTokens: (config?: unknown) => void = applyTokens

if (typeof document !== 'undefined') {
  initTokens()
}

const components = { CuButton, CuAlert }

/** Plugin: registra todos los componentes a nivel global. */
const ComegenUI: Plugin = {
  install(app: App) {
    for (const [name, component] of Object.entries(components)) {
      app.component(name, component)
    }
  },
}

export default ComegenUI
