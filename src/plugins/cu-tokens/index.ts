import { ref, watch, type App } from 'vue'
import { DEFAULTS } from './defaults'
import { deepMerge } from './merge'
import { generateCSS, inject } from './css'

const tokens = ref(DEFAULTS)
const loaded = ref(false)

async function init() {
  try {
    const res = await fetch('/comegen.config.json')
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    const custom = await res.json()
    tokens.value = deepMerge(DEFAULTS, custom)
  } catch {
    console.warn('[Comegen] comegen.config.json no encontrado, usando defaults')
  } finally {
    loaded.value = true
    inject(generateCSS(tokens.value))
  }
}

export default {
  install(app: App) {
    init().then(() => {
      watch(tokens, (val) => inject(generateCSS(val)), { deep: true })
    })
  }
}

export { tokens, loaded }
