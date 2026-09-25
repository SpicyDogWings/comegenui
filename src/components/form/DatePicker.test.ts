import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import DatePicker from './DatePicker.vue'

type AnyVm = { open: () => void; close: () => void; isOpen: () => boolean; clear: () => void }

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as AnyVm

const dayButton = (w: ReturnType<typeof mount>, n: number) =>
  w.findAll('.cu-calendar-day').find((d) => d.text() === String(n))

describe('DatePicker — single', () => {
  it('renderiza el trigger y arranca cerrado', () => {
    const w = mount(DatePicker)
    expect(w.find('.cu-date-picker-toggle').exists()).toBe(true)
    expect(vm(w).isOpen()).toBe(false)
  })

  it('abre, selecciona un día, emite y cierra', async () => {
    const w = mount(DatePicker)
    vm(w).open()
    await flushPromises()
    expect(vm(w).isOpen()).toBe(true)
    await dayButton(w, 15)!.trigger('click')
    await flushPromises()
    expect(w.emitted('update:modelValue')).toBeTruthy()
    expect(w.emitted('select')).toBeTruthy()
    expect(vm(w).isOpen()).toBe(false)
  })

  it('muestra el botón "Hoy" por defecto en modo single', async () => {
    const w = mount(DatePicker)
    vm(w).open()
    await flushPromises()
    expect(w.text()).toContain('Hoy')
  })
})

describe('DatePicker — range', () => {
  it('dos clicks definen inicio y fin, y emite start/end/select/change', async () => {
    const w = mount(DatePicker, { props: { mode: 'range' } })
    vm(w).open()
    await flushPromises()
    await dayButton(w, 10)!.trigger('click')
    await flushPromises()
    expect(w.emitted('update:startDate')).toBeTruthy()
    expect(w.emitted('change')).toBeFalsy()
    // sigue abierto para completar el rango
    expect(vm(w).isOpen()).toBe(true)
    await dayButton(w, 20)!.trigger('click')
    await flushPromises()
    expect(w.emitted('update:endDate')).toBeTruthy()
    expect(w.emitted('select')).toBeTruthy()
    expect(w.emitted('change')).toBeTruthy()
  })

  it('no muestra "Hoy" por defecto en modo range', async () => {
    const w = mount(DatePicker, { props: { mode: 'range' } })
    vm(w).open()
    await flushPromises()
    expect(w.text()).not.toContain('Hoy')
  })

  it('dualCalendar renderiza dos calendarios', async () => {
    const w = mount(DatePicker, { props: { mode: 'range', dualCalendar: true } })
    vm(w).open()
    await flushPromises()
    expect(w.findAll('.cu-calendar')).toHaveLength(2)
  })

  it('un rango a medio elegir no sobrevive al cierre del panel', async () => {
    const w = mount(DatePicker, { props: { mode: 'range' } })
    vm(w).open()
    await flushPromises()
    await dayButton(w, 10)!.trigger('click')
    await flushPromises()
    vm(w).close()
    await flushPromises()
    vm(w).open()
    await flushPromises()
    // el próximo click debe iniciar de nuevo (no completar el rango previo)
    await dayButton(w, 25)!.trigger('click')
    await flushPromises()
    expect(w.emitted('select')).toBeFalsy()
    expect((w.emitted('update:startDate') as Date[][]).length).toBe(2)
  })
})
