import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import Autocomplete from './Autocomplete.vue'

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
