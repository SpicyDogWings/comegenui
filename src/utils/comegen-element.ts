import { defineCustomElement, type Component } from 'vue'

/**
 * Metadatos de build que inyecta `build-lib.ts` con el `define` de Vite en cada
 * UMD. En dev/tests el identificador no existe: se cae al fallback `dev`.
 */
declare const __COMEGEN_META__: { version?: string } | undefined

export interface ComegenMeta {
  lib: 'comegenui'
  name: string
  tag: string
  version: string
  versionedTag: string
}

const BUILD_META: { version?: string } =
  typeof __COMEGEN_META__ === 'object' && __COMEGEN_META__ ? __COMEGEN_META__ : {}

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

/** Un constructor nuevo por tag: el registry no admite el mismo en dos nombres. */
function makeElement(component: Component, meta: ComegenMeta) {
  return attachMeta(defineCustomElement(component as any), meta)
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
    versionedTag: toVersionedTag(tag, version),
  })

  return register(tag, component, meta) ?? makeElement(component, meta)
}
