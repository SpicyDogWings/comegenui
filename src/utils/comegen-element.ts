import { defineCustomElement, type Component } from 'vue'

/**
 * Metadatos de build que inyecta `build-lib.ts` con el `define` de Vite en cada
 * bundle. En dev/tests el identificador no existe: se cae al fallback `dev`.
 */
declare const __COMEGEN_META__: BuildMeta | undefined

/** Lo que `build-lib.ts` inyecta en cada bundle (versión + tipo de build). */
interface BuildMeta {
  version?: string
  /** `umd` | `esm`. */
  format?: string
  /** `core` | `shared`. */
  variant?: string
  /** Nombre de la configuración: `umd-core`, `umd-shared`, `esm-core`, `esm-shared`. */
  type?: string
}

export interface ComegenMeta {
  lib: 'comegenui'
  name: string
  tag: string
  version: string
  /** Formato del bundle: `umd` | `esm` (o `dev` fuera de build). */
  format: string
  /** Variante: `core` | `shared` (o `dev` fuera de build). */
  variant: string
  /** Tipo de build completo: `umd-core`, `umd-shared`, `esm-core`, `esm-shared` (o `dev`). */
  type: string
  versionedTag: string
}

const BUILD_META: BuildMeta =
  typeof __COMEGEN_META__ === 'object' && __COMEGEN_META__ ? __COMEGEN_META__ : {}

/** Valor de metadata con fallback `dev` (fuera de build no existe). */
function metaText(value: string | undefined): string {
  return typeof value === 'string' && value ? value : 'dev'
}

/** `cu-alert` → `CuAlert` (nombre del bundle / global de la UMD). */
function pascalCase(tag: string): string {
  return tag
    .split('-')
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join('')
}

/** `cu-alert` + `5.0.0-alpha.3` → `cu-alert--v5-0-0-alpha-3`. */
function toVersionedTag(tag: string, version: string): string {
  const slug = version.replace(/[^a-z0-9]+/gi, '-').replace(/^-+|-+$/g, '').toLowerCase()
  return slug ? `${tag}--v${slug}` : tag
}

function versionOf(ctor: CustomElementConstructor): string | undefined {
  return (ctor as { comegen?: ComegenMeta }).comegen?.version
}

function attachMeta<T extends CustomElementConstructor>(ctor: T, meta: ComegenMeta): T {
  Object.defineProperty(ctor, 'comegen', { value: meta, configurable: true })
  Object.defineProperty(ctor.prototype, 'comegen', { get: () => meta, configurable: true })
  return ctor
}

/** `aria-describedby` → `ariaDescribedby` (mismo algoritmo que Vue). */
function camelize(name: string): string {
  return name.replace(/-(\w)/g, (_, char: string) => (char ? char.toUpperCase() : ''))
}

/** Props declaradas por el componente, en camelCase (cacheado por definición). */
const PROP_KEYS = new WeakMap<object, Set<string>>()
function declaredProps(def: VueElementDef): Set<string> {
  const cached = PROP_KEYS.get(def)
  if (cached) return cached
  const props = def.props
  const keys = !props ? [] : Array.isArray(props) ? props : Object.keys(props)
  const set = new Set(keys.map((key) => camelize(String(key))))
  PROP_KEYS.set(def, set)
  return set
}

/** `tabindex` del host se reenvía al control real; en el host queda `-1`. */
const FOCUS_ATTR = 'tabindex'

interface VueElementDef {
  props?: string[] | Record<string, unknown>
}

/**
 * Superficie interna de `VueElement` (runtime-dom) que usa el forwarding. No es
 * API pública de Vue: es el punto exacto donde el custom element traduce
 * atributos del host a props/vnode props.
 */
interface VueElementInternals {
  _def: VueElementDef
  _props: Record<string, unknown>
  _numberProps: Record<string, boolean> | null
  _dirty: boolean
  _instance: { subTree?: { el?: unknown } } | null
  _setProp(key: string, value: unknown, shouldReflect?: boolean, shouldUpdate?: boolean): void
  _update(): void
}

interface VueElementBase extends VueElementInternals {
  _mountComponent(def: unknown): void
  disconnectedCallback(): void
}

type VueElementClass = new () => HTMLElement & VueElementBase

/**
 * ARIA que referencia elementos por id y el atributo textual con el que se
 * reemplaza cuando el id vive fuera del shadow tree. Los IDREF de ARIA se
 * resuelven por árbol: un `aria-labelledby` dentro del shadow que apunta al
 * documento queda inválido en Chrome (el nombre/descripción no llega al
 * control). El atributo original se copia igual, exacto, y además se sintetiza
 * el texto accesible desde los nodos referenciados.
 */
const IDREF_FALLBACK = {
  'aria-labelledby': 'aria-label',
  'aria-describedby': 'aria-description',
} as const

type IdRefAttr = keyof typeof IDREF_FALLBACK
type FallbackAttr = (typeof IDREF_FALLBACK)[IdRefAttr]

/** Busca un id en un árbol (documento o shadow root), sin cruzar de árbol. */
function byId(tree: Node, id: string): Element | null {
  const lookup = tree as unknown as { getElementById?: (id: string) => Element | null }
  if (typeof lookup.getElementById === 'function') return lookup.getElementById(id)
  if (tree instanceof Document || tree instanceof ShadowRoot) {
    return tree.querySelector(`[id="${id.replace(/["\\]/g, '\\$&')}"]`)
  }
  return null
}

/**
 * Constructor del custom element. Subclasea el que genera Vue para corregir el
 * único punto donde pierde información: `_setAttr`.
 *
 * Vue cameliza *todo* atributo del host antes de pasarlo como prop
 * (`aria-describedby` → `ariaDescribedby`). Como los atributos que no son props
 * caen al nodo raíz por fallthrough, el nodo interno terminaba con
 * `ariadescribedby`, `datatestid`, `foobar`… y el nombre accesible no resolvía.
 * Acá los atributos desconocidos se guardan con su nombre original exacto: Vue
 * los aplica tal cual al nodo raíz. Las props declaradas siguen yendo por su
 * nombre camelCase normal.
 */
function makeElement(component: Component, meta: ComegenMeta) {
  // `defineCustomElement` no tiene una sobrecarga que acepte el tipo unión
  // `Component`; el valor siempre es un SFC/options nuestro. Se fija la firma
  // que necesitamos (constructora de HTMLElement) en vez de un `any`.
  const createElement = defineCustomElement as unknown as (options: Component) => VueElementClass
  const Base = createElement(component)

  class ComegenCustomElement extends Base {
    /**
     * Reflejos de `tabindex` que hicimos nosotros (host → `-1`). Se cuentan
     * porque el MutationObserver de Vue puede entregar varias mutaciones en un
     * mismo lote y no hay que confundir nuestra escritura con la del usuario.
     * Empieza con `_` para que el contrato runtime no lo exponga como prop.
     */
    _reflectedTabindex = 0

    /** Texto accesible sintetizado que escribimos en el nodo raíz (para no pisar al autor). */
    _ariaFallbackValues: Partial<Record<FallbackAttr, string>> = {}

    _ariaObserver: MutationObserver | null = null

    _setAttr(key: string) {
      if (key.startsWith('data-v-')) return
      const self = this as unknown as VueElementInternals
      const camelKey = camelize(key)
      const isProp = declaredProps(self._def).has(camelKey)

      // `id` se queda en el host: copiarlo al nodo interno duplica el id en el
      // documento (getElementById/label[for] apuntan al primero, el host).
      if (!isProp && key === 'id') return

      if (!isProp && key === FOCUS_ATTR) {
        // Nuestra propia reflexión (host `tabindex=-1`): ya está aplicada al
        // control interno, no la reinterpretamos como pedido del usuario.
        const current = this.getAttribute(FOCUS_ATTR)
        if (current === '-1' && this._reflectedTabindex > 0) {
          this._reflectedTabindex -= 1
          return
        }
        if (current !== null && current !== '-1') {
          this._applyProp(key, current, camelKey)
          // El host es el envoltorio, no el control: una sola parada de tab,
          // sobre el nodo interno, con el orden que pidió el usuario.
          this._reflectedTabindex += 1
          this.setAttribute(FOCUS_ATTR, '-1')
          return
        }
      }

      this._applyProp(isProp ? camelKey : key, this.getAttribute(key), camelKey)
    }

    /** Aplica el atributo del host al vnode prop (o lo quita si ya no está). */
    _applyProp(propKey: string, value: string | null, camelKey: string) {
      const self = this as unknown as VueElementInternals
      if (value !== null) {
        // Mismo criterio que Vue para props numéricas (`Number` → número).
        let parsed: string | number = value
        if (self._numberProps?.[camelKey]) {
          const n = parseFloat(value)
          if (!Number.isNaN(n)) parsed = n
        }
        self._setProp(propKey, parsed, false, true)
        return
      }
      if (!Object.prototype.hasOwnProperty.call(self._props, propKey)) return
      delete self._props[propKey]
      self._dirty = true
      if (self._instance) self._update()
    }

    _mountComponent(def: unknown) {
      super._mountComponent(def)
      this._syncAriaFallback()
    }

    _update() {
      super._update()
      this._syncAriaFallback()
    }

    disconnectedCallback() {
      super.disconnectedCallback()
      this._ariaObserver?.disconnect()
    }

    /**
     * Resuelve `aria-labelledby`/`aria-describedby` del host contra el nodo
     * raíz. Cuando el id referenciado está fuera del shadow tree, el IDREF no
     * puede resolver desde adentro: se sintetiza `aria-label`/`aria-description`
     * con el texto de los elementos referenciados. El autor manda: si puso
     * `aria-label`/`aria-description` explícito no se toca.
     */
    _syncAriaFallback() {
      const self = this as unknown as VueElementInternals
      const root = self._instance?.subTree?.el
      const entries = Object.entries(IDREF_FALLBACK) as [IdRefAttr, FallbackAttr][]
      const hasRefs = entries.some(([attr]) => this.hasAttribute(attr))
      if (!(root instanceof HTMLElement) || (!hasRefs && !Object.keys(this._ariaFallbackValues).length)) {
        this._ariaObserver?.disconnect()
        return
      }

      const rootTree = root.getRootNode()
      const hostTree = this.getRootNode()
      const observer = this._ensureAriaObserver()
      observer?.disconnect()
      let observing = 0

      for (const [attr, fallback] of entries) {
        const authorSet = this.hasAttribute(fallback)
        const written = this._ariaFallbackValues[fallback]
        const value = this.getAttribute(attr)
        let text: string | undefined

        if (value && !authorSet) {
          const ids = value.split(/\s+/).filter(Boolean)
          // Sólo hay fallback si algún id queda fuera del shadow tree.
          const hasExternal = ids.some((id) => !byId(rootTree, id) && byId(hostTree, id))
          if (hasExternal) {
            const parts = ids
              .map((id) => byId(rootTree, id) ?? byId(hostTree, id))
              .map((el) => el?.textContent?.trim() ?? '')
              .filter(Boolean)
            if (parts.length) {
              text = parts.join(' ')
              for (const id of ids) {
                const el = byId(hostTree, id)
                if (!el || byId(rootTree, id)) continue
                observer?.observe(el, { subtree: true, childList: true, characterData: true })
                observing += 1
              }
            }
          }
        }

        if (text === undefined) {
          if (written !== undefined) {
            // Un `aria-label` del autor ya se copió por fallthrough: no tocarlo.
            if (!authorSet && root.getAttribute(fallback) === written) root.removeAttribute(fallback)
            delete this._ariaFallbackValues[fallback]
          }
          continue
        }
        if (!authorSet && root.getAttribute(fallback) !== text) root.setAttribute(fallback, text)
        this._ariaFallbackValues[fallback] = text
      }

      if (!observing) observer?.disconnect()
    }

    _ensureAriaObserver() {
      if (typeof MutationObserver === 'undefined') return null
      if (!this._ariaObserver) {
        this._ariaObserver = new MutationObserver(() => this._syncAriaFallback())
      }
      return this._ariaObserver
    }
  }

  return attachMeta(ComegenCustomElement as unknown as CustomElementConstructor, meta)
}

/**
 * Registra el tag base con guarda: si ya lo tomó otra versión se conserva la
 * primera y se avisa. El tag versionado (`<cu-x--v…>`) se registra siempre, así
 * conviven versiones distintas del mismo componente en la misma página.
 */
function register(
  tag: string,
  component: Component,
  meta: ComegenMeta,
): CustomElementConstructor | null {
  if (typeof customElements === 'undefined') return null

  let base: CustomElementConstructor | null = null
  const current = customElements.get(tag)
  if (!current) {
    base = makeElement(component, meta)
    customElements.define(tag, base)
  } else if (versionOf(current) !== meta.version) {
    const own = versionOf(current)
    const detail = own ? `v${own}` : 'una versión desconocida'
    console.warn(
      `[comegenui] <${tag}> ya está registrado (${detail}); se mantiene esa versión. ` +
        `La v${meta.version} quedó disponible como <${meta.versionedTag}>.`,
    )
  }

  if (!customElements.get(meta.versionedTag)) {
    customElements.define(meta.versionedTag, makeElement(component, meta))
  }
  return base
}

/**
 * Define y registra un custom element de ComegenUI adjuntándole sus metadatos de
 * bundle (`CuX.comegen` y `el.comegen`). Reemplaza al par
 * `defineCustomElement` + `customElements.define` en los entry points de `src/lib`.
 */
export function defineComegenElement(tag: string, component: Component) {
  const version =
    typeof BUILD_META.version === 'string' && BUILD_META.version ? BUILD_META.version : 'dev'
  const meta: ComegenMeta = Object.freeze({
    lib: 'comegenui',
    name: pascalCase(tag),
    tag,
    version,
    format: metaText(BUILD_META.format),
    variant: metaText(BUILD_META.variant),
    type: metaText(BUILD_META.type),
    versionedTag: toVersionedTag(tag, version),
  })

  return register(tag, component, meta) ?? makeElement(component, meta)
}
