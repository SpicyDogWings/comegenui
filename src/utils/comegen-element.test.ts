import { describe, expect, it, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { defineComegenElement, type ComegenMeta } from '@/utils/comegen-element'

const Stub = defineComponent({ render: () => h('div', 'comégen') })

function metaOf(ctor: unknown): ComegenMeta {
  return (ctor as { comegen: ComegenMeta }).comegen
}

describe('defineComegenElement', () => {
  it('adjunta los metadatos a la clase y a la instancia', () => {
    const Ctor = defineComegenElement('cu-test-meta', Stub)
    const meta = metaOf(Ctor)

    expect(meta).toMatchObject({
      lib: 'comegenui',
      name: 'CuTestMeta',
      tag: 'cu-test-meta',
    })
    // Vitest no corre el `define` de build-lib: cae al fallback `dev`.
    expect(meta.version).toBe('dev')
    expect(meta.versionedTag).toBe('cu-test-meta--vdev')
    expect(Object.isFrozen(meta)).toBe(true)

    const el = document.createElement('cu-test-meta') as HTMLElement & { comegen: ComegenMeta }
    expect(el.comegen).toEqual(meta)
  })

  it('deriva el nombre del bundle desde el tag (multi-guion)', () => {
    const Ctor = defineComegenElement('cu-test-date-picker', Stub)
    expect(metaOf(Ctor).name).toBe('CuTestDatePicker')
  })

  it('registra siempre el tag versionado', () => {
    const Ctor = defineComegenElement('cu-test-alias', Stub)
    const alias = customElements.get('cu-test-alias--vdev')
    expect(customElements.get('cu-test-alias')).toBe(Ctor)
    expect(alias).toBeDefined()
    expect(metaOf(alias)).toEqual(metaOf(Ctor))
  })

  it('no pisa el tag base tomado por otra versión y avisa por el alias', () => {
    const other = class extends HTMLElement {}
    Object.defineProperty(other, 'comegen', { value: { version: '9.9.9' } })
    customElements.define('cu-test-conflict', other)

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    defineComegenElement('cu-test-conflict', Stub)

    expect(customElements.get('cu-test-conflict')).toBe(other)
    expect(metaOf(customElements.get('cu-test-conflict--vdev')).version).toBe('dev')
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('<cu-test-conflict--vdev>'))
    warn.mockRestore()
  })

  it('es idempotente si el tag base ya tiene la misma versión', () => {
    const other = class extends HTMLElement {}
    Object.defineProperty(other, 'comegen', { value: { version: 'dev' } })
    customElements.define('cu-test-same', other)

    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    defineComegenElement('cu-test-same', Stub)

    expect(customElements.get('cu-test-same')).toBe(other)
    expect(metaOf(customElements.get('cu-test-same--vdev')).version).toBe('dev')
    expect(warn).not.toHaveBeenCalled()
    warn.mockRestore()
  })
})
