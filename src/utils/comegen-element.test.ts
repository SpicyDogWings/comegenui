import { afterEach, describe, expect, it, vi } from 'vitest'
import { defineComponent, h, nextTick } from 'vue'
import { defineComegenElement, type ComegenMeta } from '@/utils/comegen-element'
import Button from '@/components/buttons/Button.vue'

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


/**
 * Atributos del host → nodo raíz del shadow. Vue cameliza todo atributo que no
 * es prop (`aria-describedby` → `ariaDescribedby`), que después baja al nodo
 * interno como `ariadescribedby`: el nombre accesible/descriptivo no resuelve.
 * El contrato es que el nombre original llegue exacto, sin duplicados.
 */
const Probe = defineComponent({
  props: {
    label: { type: String, default: 'probe' },
    tone: { type: String, default: 'neutral' },
  },
  render() {
    return h('button', { type: 'button', class: 'probe' }, this.label)
  },
})

const MATRIX = {
  'aria-describedby': 'help',
  'aria-labelledby': 'lbl',
  'aria-controls': 'panel',
  'aria-owns': 'list',
  'aria-activedescendant': 'opt-1',
  'aria-details': 'details',
  'aria-errormessage': 'error',
  'aria-label': 'Guardar',
  'aria-pressed': 'true',
  'aria-hidden': 'false',
  'data-testid': 'guarda-btn',
  'data-cy': 'guarda',
  'foo-bar': 'baz',
}

async function mountProbe(tag: string, attrs: Record<string, string> = {}) {
  defineComegenElement(tag, Probe)
  const host = document.createElement(tag)
  for (const [name, value] of Object.entries(attrs)) host.setAttribute(name, value)
  document.body.appendChild(host)
  await nextTick()
  await nextTick()
  const root = host.shadowRoot?.querySelector('button')
  expect(root).toBeTruthy()
  return { host, root: root as HTMLButtonElement }
}

afterEach(() => {
  document.body.innerHTML = ''
})

describe('defineComegenElement — forwarding de atributos del host', () => {
  it('copia aria-*/data-*/kebab con el nombre original exacto, sin camelCase', async () => {
    const { root } = await mountProbe('cu-test-fwd-matrix', MATRIX)

    for (const [name, value] of Object.entries(MATRIX)) {
      expect(root.getAttribute(name), name).toBe(value)
      expect(root.hasAttribute(name.replace(/-(\w)/g, (_, c: string) => c.toUpperCase())), name).toBe(false)
    }
  })

  it('las props declaradas siguen llegando como props (no como atributo)', async () => {
    const { host, root } = await mountProbe('cu-test-fwd-props', {
      label: 'Comprar',
      tone: 'danger',
      'foo-bar': 'baz',
    })

    expect(root.textContent).toBe('Comprar')
    expect(root.hasAttribute('label')).toBe(false)
    expect(root.hasAttribute('tone')).toBe(false)
    expect(root.getAttribute('foo-bar')).toBe('baz')
    // El host conserva sus atributos (no se reescriben).
    expect(host.getAttribute('label')).toBe('Comprar')
  })

  it('mantiene class/style y no duplica el atributo ya aplicado', async () => {
    const { host, root } = await mountProbe('cu-test-fwd-class', { class: 'host-class', style: 'margin: 4px' })

    expect(root.classList.contains('probe')).toBe(true)
    expect(root.classList.contains('host-class')).toBe(true)
    expect(root.getAttribute('style')).toContain('margin')
    expect(host.className).toBe('host-class')
  })

  it('baja altas, cambios y bajas dinámicas de atributos', async () => {
    const { host, root } = await mountProbe('cu-test-fwd-dynamic')

    host.setAttribute('aria-describedby', 'help')
    host.setAttribute('data-testid', 'dinamico')
    await nextTick()
    expect(root.getAttribute('aria-describedby')).toBe('help')
    expect(root.getAttribute('data-testid')).toBe('dinamico')

    host.setAttribute('aria-describedby', 'ayuda-2')
    await nextTick()
    expect(root.getAttribute('aria-describedby')).toBe('ayuda-2')

    host.removeAttribute('aria-describedby')
    host.removeAttribute('data-testid')
    await nextTick()
    expect(root.hasAttribute('aria-describedby')).toBe(false)
    expect(root.hasAttribute('datadescribedby')).toBe(false)
    expect(root.hasAttribute('data-testid')).toBe(false)
  })

  it('no copia el `id` del host al nodo interno (evita ids duplicados)', async () => {
    const { host, root } = await mountProbe('cu-test-fwd-id', { id: 'guardar' })

    expect(host.getAttribute('id')).toBe('guardar')
    expect(root.hasAttribute('id')).toBe(false)
  })

  it('una sola parada de tab: `tabindex` vive en el control, el host queda en -1', async () => {
    const { host, root } = await mountProbe('cu-test-fwd-tabindex', { tabindex: '3' })

    expect(root.getAttribute('tabindex')).toBe('3')
    expect(root.tabIndex).toBe(3)
    expect(host.getAttribute('tabindex')).toBe('-1')
    expect(host.tabIndex).toBe(-1)

    host.setAttribute('tabindex', '5')
    await nextTick()
    expect(root.getAttribute('tabindex')).toBe('5')
    expect(host.getAttribute('tabindex')).toBe('-1')

    host.removeAttribute('tabindex')
    await nextTick()
    expect(root.hasAttribute('tabindex')).toBe(false)
    expect(host.hasAttribute('tabindex')).toBe(false)
  })

  it('sintetiza el texto accesible cuando el IDREF vive fuera del shadow tree', async () => {
    const label = document.createElement('span')
    label.id = 'fwd-ext-label'
    label.textContent = 'Comprar'
    const help = document.createElement('span')
    help.id = 'fwd-ext-help'
    help.textContent = 'Abre el carrito'
    document.body.append(label, help)

    const { host, root } = await mountProbe('cu-test-fwd-idref', {
      'aria-labelledby': 'fwd-ext-label',
      'aria-describedby': 'fwd-ext-help',
    })

    // El atributo original queda exacto en el control…
    expect(root.getAttribute('aria-labelledby')).toBe('fwd-ext-label')
    expect(root.getAttribute('aria-describedby')).toBe('fwd-ext-help')
    // …y el nombre/descripción se resuelven igual (los IDREF no cruzan el shadow).
    expect(root.getAttribute('aria-label')).toBe('Comprar')
    expect(root.getAttribute('aria-description')).toBe('Abre el carrito')

    label.textContent = 'Comprar ahora'
    await Promise.resolve()
    await Promise.resolve()
    expect(root.getAttribute('aria-label')).toBe('Comprar ahora')

    host.removeAttribute('aria-labelledby')
    host.removeAttribute('aria-describedby')
    await nextTick()
    expect(root.hasAttribute('aria-label')).toBe(false)
    expect(root.hasAttribute('aria-description')).toBe(false)
  })

  it('un aria-label explícito del autor no se pisa con el fallback', async () => {
    const label = document.createElement('span')
    label.id = 'fwd-author-label'
    label.textContent = 'Texto referenciado'
    document.body.append(label)

    const { root } = await mountProbe('cu-test-fwd-author', {
      'aria-labelledby': 'fwd-author-label',
      'aria-label': 'Explícito',
    })
    expect(root.getAttribute('aria-label')).toBe('Explícito')
  })

  it('el CE real resuelve aria-labelledby/aria-describedby sobre el control interno', async () => {
    const label = document.createElement('span')
    label.id = 'fwd-label'
    label.textContent = 'Comprar'
    const help = document.createElement('span')
    help.id = 'fwd-help'
    help.textContent = 'Abre el carrito'
    document.body.append(label, help)

    defineComegenElement('cu-test-fwd-real', Button)
    const host = document.createElement('cu-test-fwd-real')
    host.setAttribute('aria-labelledby', 'fwd-label')
    host.setAttribute('aria-describedby', 'fwd-help')
    host.setAttribute('data-testid', 'real')
    host.textContent = 'Comprar'
    document.body.appendChild(host)
    await nextTick()
    await nextTick()

    const root = host.shadowRoot?.querySelector('button')
    expect(root?.getAttribute('aria-labelledby')).toBe('fwd-label')
    expect(root?.getAttribute('aria-describedby')).toBe('fwd-help')
    expect(root?.getAttribute('data-testid')).toBe('real')
    expect(root?.hasAttribute('arialabelledby')).toBe(false)
  })
})
