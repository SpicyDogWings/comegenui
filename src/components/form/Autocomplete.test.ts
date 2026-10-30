import { describe, it, expect } from 'vitest'
import { flushPromises, mount, type VueWrapper } from '@vue/test-utils'
import Autocomplete from './Autocomplete.vue'
import Dropdown from '../overlay/Dropdown.vue'

const items = [{ label: 'María López' }, { label: 'Juan Pérez' }]

type AcVm = {
  get: () => string
  set: (v: string) => void
  reset: () => void
  open: () => void
  close: () => void
  toggle: () => void
  isOpen: () => boolean
  selectedItem: () => { label: string } | null
}

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as AcVm

const inputValue = (w: ReturnType<typeof mount>) =>
  (w.find('input').element as HTMLInputElement).value

describe('Autocomplete — texto y modelo', () => {
  it('escribir actualiza get() y emite update:modelValue', async () => {
    const w = mount(Autocomplete, { props: { items } })
    await w.find('input').setValue('María')
    await flushPromises()

    expect(vm(w).get()).toBe('María')
    const emitted = w.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect(emitted![emitted!.length - 1]).toEqual(['María'])
  })

  it('emite una sola vez por cambio de texto', async () => {
    const w = mount(Autocomplete, { props: { items } })
    await w.find('input').setValue('María')
    await flushPromises()

    expect(w.emitted('update:modelValue')).toHaveLength(1)
  })

  it('seleccionar una sugerencia actualiza get(), selectedItem y emite select + update:modelValue', async () => {
    const w = mount(Autocomplete, { props: { items } })
    await w.find('input').setValue('María')
    await flushPromises()

    await w.find('.cu-autocomplete-option').trigger('click')
    await flushPromises()

    expect(vm(w).get()).toBe('María López')
    expect(vm(w).selectedItem()?.label).toBe('María López')
    expect(w.emitted('select')?.[0]?.[0]).toMatchObject({ label: 'María López' })
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['María López'])
  })

  it('set() y reset() sincronizan get() y el input', async () => {
    const w = mount(Autocomplete, { props: { items } })

    vm(w).set('Juan Pérez')
    await flushPromises()
    expect(vm(w).get()).toBe('Juan Pérez')
    expect(inputValue(w)).toBe('Juan Pérez')

    vm(w).reset()
    await flushPromises()
    expect(vm(w).get()).toBe('')
    expect(inputValue(w)).toBe('')
  })

  it('refleja un modelValue externo y emite al teclear', async () => {
    const w = mount(Autocomplete, { props: { items, modelValue: 'Juan' } })
    await flushPromises()
    expect(inputValue(w)).toBe('Juan')

    await w.find('input').setValue('María')
    await flushPromises()

    expect(vm(w).get()).toBe('María')
    expect(w.emitted('update:modelValue')?.at(-1)).toEqual(['María'])
  })

  it('limpiar el texto emite el valor vacío', async () => {
    const w = mount(Autocomplete, { props: { items } })
    await w.find('input').setValue('J')
    await flushPromises()
    await w.find('input').setValue('')
    await flushPromises()

    expect(vm(w).get()).toBe('')
    const emitted = w.emitted('update:modelValue')!
    expect(emitted[emitted.length - 1]).toEqual([''])
  })
})

describe('Autocomplete — apertura del panel', () => {
  it('abre al enfocar si el texto ya cumple minChars y hay items', async () => {
    const w = mount(Autocomplete, { props: { items, minChars: 2 } })
    await w.find('input').trigger('focus')
    await flushPromises()
    expect(vm(w).isOpen()).toBe(false)

    vm(w).set('María')
    await flushPromises()
    await w.find('input').trigger('focus')
    await flushPromises()
    expect(vm(w).isOpen()).toBe(true)
  })

  it('no abre al enfocar si el texto no llega a minChars', async () => {
    const w = mount(Autocomplete, { props: { items, minChars: 2 } })
    await w.find('input').setValue('M')
    await flushPromises()
    await w.find('input').trigger('focus')
    await flushPromises()
    expect(vm(w).isOpen()).toBe(false)
  })

  it('open() abre el panel sin importar minChars', async () => {
    const w = mount(Autocomplete, { props: { items, minChars: 3 } })
    vm(w).open()
    await flushPromises()
    expect(vm(w).isOpen()).toBe(true)
  })

  it('set() no abre el panel aunque el valor matchee (open() sí)', async () => {
    const w = mount(Autocomplete, { props: { items } })

    vm(w).set('María')
    await flushPromises()
    expect(vm(w).isOpen()).toBe(false)

    vm(w).open()
    await flushPromises()
    expect(vm(w).isOpen()).toBe(true)
  })

  it('close() y toggle() controlan el panel', async () => {
    const w = mount(Autocomplete, { props: { items } })

    vm(w).open()
    await flushPromises()
    expect(vm(w).isOpen()).toBe(true)

    vm(w).close()
    await flushPromises()
    expect(vm(w).isOpen()).toBe(false)

    vm(w).toggle()
    await flushPromises()
    expect(vm(w).isOpen()).toBe(true)
  })

  it('open() no abre si está disabled', async () => {
    const w = mount(Autocomplete, { props: { items, disabled: true } })
    vm(w).open()
    await flushPromises()
    expect(vm(w).isOpen()).toBe(false)
  })
})

describe('Autocomplete — carga', () => {
  it('loading llega al Dropdown (spinner del panel)', () => {
    const w = mount(Autocomplete, { props: { items, loading: true } })
    expect(w.findComponent(Dropdown).props('loading')).toBe(true)
  })
})

describe('Autocomplete — alineación del texto (input + opciones)', () => {
  // Alcance: el texto del input (y su placeholder) y los items del panel. Los items son
  // `Button` (flex), así que la alineación real es `justify-content`.
  async function align(textAlign?: 'left' | 'center' | 'right') {
    const w = mount(Autocomplete, { props: textAlign ? { items, textAlign } : { items } })
    await w.find('input').setValue('a')
    await flushPromises()
    return {
      input: w.find('input').element as HTMLInputElement,
      options: w.findAll('.cu-autocomplete-option').map((o) => o.element as HTMLElement),
    }
  }

  it('por defecto alinea a la izquierda (input left, items flex-start)', async () => {
    const { input, options } = await align()
    expect(input.style.textAlign).toBe('left')
    expect(options[0]!.style.justifyContent).toBe('flex-start')
  })

  it('center centra el texto del input y los items', async () => {
    const { input, options } = await align('center')
    expect(input.style.textAlign).toBe('center')
    for (const option of options) expect(option.style.justifyContent).toBe('center')
  })

  it('right alinea a la derecha el texto del input y los items', async () => {
    const { input, options } = await align('right')
    expect(input.style.textAlign).toBe('right')
    for (const option of options) expect(option.style.justifyContent).toBe('flex-end')
  })

  it('con ícono alinea el bloque entero (ícono + label)', async () => {
    const w = mount(Autocomplete, {
      props: { textAlign: 'right', items: [{ label: 'María López', icon: '<svg class="mi-icono"></svg>' }] },
    })
    await w.find('input').setValue('a')
    await flushPromises()

    const option = w.find('.cu-autocomplete-option')
    expect((option.element as HTMLElement).style.justifyContent).toBe('flex-end')
    expect(option.find('.mi-icono').exists()).toBe(true)
  })
})

describe('Autocomplete — selección visible (check) y panel abierto', () => {
  async function typeAndPick(w: VueWrapper, text: string) {
    await w.find('input').setValue(text)
    await flushPromises()
    await w.findAll('.cu-autocomplete-option')[0]!.trigger('click')
    await flushPromises()
  }

  it('seleccionar no cierra el panel: muestra todos los items con el elegido checkeado', async () => {
    const w = mount(Autocomplete, { props: { items } })
    await typeAndPick(w, 'María')

    expect(vm(w).isOpen()).toBe(true)
    const options = w.findAll('.cu-autocomplete-option')
    expect(options).toHaveLength(2)
    expect(options[0]!.text()).toContain('María López')
    expect(options[0]!.find('.cu-menu-option-check').exists()).toBe(true)
    expect(options[1]!.find('.cu-menu-option-check').exists()).toBe(false)
    expect(vm(w).selectedItem()?.label).toBe('María López')
    expect(inputValue(w)).toBe('María López')
  })

  it('al volver a escribir se reanuda el filtrado con la cadena actual', async () => {
    const w = mount(Autocomplete, { props: { items } })
    await typeAndPick(w, 'María')

    await w.find('input').setValue('Juan')
    await flushPromises()

    const options = w.findAll('.cu-autocomplete-option')
    expect(options).toHaveLength(1)
    expect(options[0]!.text()).toContain('Juan Pérez')
    expect(vm(w).isOpen()).toBe(true)
    // El texto deja de coincidir con el item elegido: se limpia la selección.
    expect(w.find('.cu-menu-option-check').exists()).toBe(false)
    expect(vm(w).selectedItem()).toBeNull()
  })

  it('re-click sobre el mismo item mantiene la selección y el panel abierto', async () => {
    const w = mount(Autocomplete, { props: { items } })
    await typeAndPick(w, 'María')

    await w.findAll('.cu-autocomplete-option')[0]!.trigger('click')
    await flushPromises()

    expect(vm(w).isOpen()).toBe(true)
    expect(w.findAll('.cu-menu-option-check')).toHaveLength(1)
    expect(w.emitted('select')).toHaveLength(2)
  })

  it('click afuera cierra el panel', async () => {
    const w = mount(Autocomplete, { props: { items } })
    await typeAndPick(w, 'María')
    expect(vm(w).isOpen()).toBe(true)

    document.body.click()
    await flushPromises()

    expect(vm(w).isOpen()).toBe(false)
    expect(vm(w).selectedItem()?.label).toBe('María López')
  })

  it('set() conserva la selección sólo si el texto coincide; reset() la limpia', async () => {
    const w = mount(Autocomplete, { props: { items } })
    await typeAndPick(w, 'María')

    vm(w).set('María López')
    await flushPromises()
    expect(vm(w).selectedItem()?.label).toBe('María López')
    expect(w.find('.cu-menu-option-check').exists()).toBe(true)

    vm(w).set('Juan')
    await flushPromises()
    expect(vm(w).selectedItem()).toBeNull()
    expect(w.find('.cu-menu-option-check').exists()).toBe(false)

    vm(w).set('María')
    await flushPromises()
    await w.findAll('.cu-autocomplete-option')[0]!.trigger('click')
    await flushPromises()

    vm(w).reset()
    await flushPromises()
    expect(vm(w).get()).toBe('')
    expect(vm(w).selectedItem()).toBeNull()
    expect(w.findAll('.cu-menu-option-check')).toHaveLength(0)
  })

  it('con minChars, seleccionar deja el panel abierto; escribir por debajo de minChars lo cierra', async () => {
    const w = mount(Autocomplete, { props: { items, minChars: 2 } })
    await typeAndPick(w, 'Ma')

    expect(vm(w).isOpen()).toBe(true)
    expect(vm(w).selectedItem()?.label).toBe('María López')

    await w.find('input').setValue('M')
    await flushPromises()
    expect(vm(w).isOpen()).toBe(false)
  })
})

describe('Autocomplete — el foco vuelve al input al cerrar', () => {
  it('Escape con el foco en una sugerencia lo devuelve al input', async () => {
    const w = mount(Autocomplete, { props: { items }, attachTo: document.body })
    const input = w.find('input').element as HTMLInputElement
    input.focus()
    vm(w).open()
    await flushPromises()
    const option = w.find('.cu-autocomplete-option').element as HTMLElement
    option.focus()

    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    await flushPromises()
    expect(vm(w).isOpen()).toBe(false)
    expect(document.activeElement).toBe(input)
    w.unmount()
  })
})

describe('Autocomplete — el panel no queda abierto al salir del campo', () => {
  const items2 = [{ label: 'María López' }, { label: 'Juan Pérez' }]

  it('el foco que sale del campo (Tab) cierra el panel', async () => {
    const w = mount(Autocomplete, { props: { items: items2 }, attachTo: document.body })
    const outside = document.createElement('button')
    document.body.appendChild(outside)

    await w.find('input').trigger('focus')
    await flushPromises()
    expect(vm(w).isOpen()).toBe(true)

    await w.find('input').trigger('focusout', { relatedTarget: outside })
    await flushPromises()

    expect(vm(w).isOpen()).toBe(false)
    expect(w.emitted('blur')).toHaveLength(1)
    outside.remove()
    w.unmount()
  })

  it('el foco que pasa a un item del panel NO cierra el panel', async () => {
    const w = mount(Autocomplete, { props: { items: items2 }, attachTo: document.body })
    await w.find('input').trigger('focus')
    await flushPromises()

    const option = w.find('.cu-autocomplete-option').element as HTMLElement
    await w.find('input').trigger('focusout', { relatedTarget: option })
    await flushPromises()

    expect(vm(w).isOpen()).toBe(true)
    expect(w.emitted('blur')).toBeUndefined()
    w.unmount()
  })

  it('un click en el campo reabre la lista que cerró un click afuera', async () => {
    const w = mount(Autocomplete, { props: { items: items2 }, attachTo: document.body })
    await w.find('input').trigger('focus')
    await flushPromises()
    expect(vm(w).isOpen()).toBe(true)

    // Click afuera: cierra y el foco vuelve al input (Popover).
    document.body.click()
    await flushPromises()
    expect(vm(w).isOpen()).toBe(false)

    // El campo ya tiene el foco: el click no dispara `focus`, pero sí reabre.
    await w.find('input').trigger('click')
    await flushPromises()
    expect(vm(w).isOpen()).toBe(true)
    w.unmount()
  })

  it('el click no abre si el texto no llega a minChars', async () => {
    const w = mount(Autocomplete, { props: { items: items2, minChars: 2 } })
    await w.find('input').setValue('M')
    await flushPromises()

    await w.find('input').trigger('click')
    await flushPromises()

    expect(vm(w).isOpen()).toBe(false)
  })
})

describe('Autocomplete — items reemplazados (carga async)', () => {
  it('reemplazar items por objetos nuevos conserva el check y selectedItem por texto', async () => {
    const w = mount(Autocomplete, { props: { items: [{ label: 'María López' }, { label: 'Juan Pérez' }] } })
    await w.find('input').setValue('María')
    await flushPromises()
    await w.find('.cu-autocomplete-option').trigger('click')
    await flushPromises()
    expect(w.findAll('.cu-menu-option-check')).toHaveLength(1)

    const antes = vm(w).selectedItem()
    const nuevos = [{ label: 'María López' }, { label: 'Juan Pérez' }, { label: 'Ana Ruiz' }]
    await w.setProps({ items: nuevos })
    await flushPromises()

    expect(w.findAll('.cu-menu-option-check')).toHaveLength(1)
    expect(w.findAll('.cu-autocomplete-option')[0]!.find('.cu-menu-option-check').exists()).toBe(true)
    // La selección ahora apunta al item vigente, no al objeto del array anterior.
    expect(vm(w).selectedItem()).toBe((w.props('items') as unknown[])[0])
    expect(vm(w).selectedItem()).not.toBe(antes)
  })

  it('si el item elegido desaparece de los items, la selección se limpia', async () => {
    const w = mount(Autocomplete, { props: { items: [{ label: 'María López' }, { label: 'Juan Pérez' }] } })
    await w.find('input').setValue('María')
    await flushPromises()
    await w.find('.cu-autocomplete-option').trigger('click')
    await flushPromises()

    await w.setProps({ items: [{ label: 'Ana Ruiz' }] })
    await flushPromises()

    expect(w.findAll('.cu-menu-option-check')).toHaveLength(0)
    expect(vm(w).selectedItem()).toBeNull()
  })

  it('items null no rompe el campo (lista vacía)', async () => {
    const w = mount(Autocomplete, { props: { items: null as unknown as [] } })
    await flushPromises()
    expect(w.find('input').exists()).toBe(true)

    await w.find('input').trigger('focus')
    await flushPromises()
    expect(vm(w).isOpen()).toBe(false)
  })
})

describe('Autocomplete — item deshabilitado', () => {
  it('se ve atenuado (color muted inline, sin opacidad apilada) y no se puede elegir', async () => {
    const w = mount(Autocomplete, {
      props: { items: [{ label: 'Ana habilitada' }, { label: 'Ana deshabilitada', disabled: true }] },
    })
    await w.find('input').setValue('ana')
    await flushPromises()

    const rows = w.findAll('.cu-autocomplete-option')
    const habilitado = rows[0]!.element as HTMLElement
    const deshabilitado = rows[1]!.element as HTMLElement

    expect(deshabilitado.style.color).toBe('var(--cu-color-neutral-text-muted)')
    expect(deshabilitado.style.opacity).toBe('1')
    expect(habilitado.style.color).toBe('')

    await rows[1]!.trigger('click')
    await flushPromises()
    expect(w.emitted('select')).toBeUndefined()
    expect(vm(w).selectedItem()).toBeNull()
  })
})
