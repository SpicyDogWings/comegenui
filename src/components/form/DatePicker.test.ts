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

  it('ignora startDate/endDate y setRange (no hay rango en single)', async () => {
    const w = mount(DatePicker, { props: { startDate: '2026-09-03', endDate: '2026-09-15' } })
    vm(w).open()
    await flushPromises()
    expect(w.findAll('.cu-calendar-day--range')).toHaveLength(0)
    ;(w.vm as unknown as { setRange: (a: string, b: string) => void }).setRange(
      '2026-09-01',
      '2026-09-30',
    )
    await flushPromises()
    expect(w.emitted('update:startDate')).toBeFalsy()
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

  it('dualCalendar fuerza range aunque mode sea single', async () => {
    const w = mount(DatePicker, { props: { dualCalendar: true } })
    vm(w).open()
    await flushPromises()
    expect(w.findAll('.cu-calendar')).toHaveLength(2)
    await dayButton(w, 10)!.trigger('click')
    await flushPromises()
    expect(w.emitted('update:startDate')).toBeTruthy()
    // no cierra el panel: sigue range a la espera del fin
    expect(vm(w).isOpen()).toBe(true)
  })

  it('un rango a medio elegir sobrevive al cierre y el próximo click lo completa', async () => {
    const w = mount(DatePicker, { props: { mode: 'range' } })
    vm(w).open()
    await flushPromises()
    await dayButton(w, 10)!.trigger('click')
    await flushPromises()
    vm(w).close()
    await flushPromises()
    vm(w).open()
    await flushPromises()
    await dayButton(w, 25)!.trigger('click')
    await flushPromises()
    const selected = w.emitted('select')
    expect(selected).toBeTruthy()
    const range = selected![0]![0] as { start: Date; end: Date }
    expect(range.start.getDate()).toBe(10)
    expect(range.end.getDate()).toBe(25)
  })
})
