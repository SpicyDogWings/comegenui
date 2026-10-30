import { describe, it, expect } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import DatePicker from './DatePicker.vue'
import { formatDate } from '@/utils/date'

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

  it('el click en el label enfoca el trigger y abre el panel', async () => {
    const w = mount(DatePicker, {
      props: { label: 'Fecha de nacimiento' },
      attachTo: document.body,
    })
    const trigger = w.find('.cu-date-picker-toggle').element as HTMLElement

    await w.find('.cu-label-text').trigger('click')
    await flushPromises()

    expect(vm(w).isOpen()).toBe(true)
    expect(document.activeElement).toBe(trigger)
    w.unmount()
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

describe('DatePicker — value-format (eventos formateados)', () => {
  it('single: con value-format emite los eventos formateados al elegir', async () => {
    const w = mount(DatePicker, { props: { valueFormat: 'dd-MM-yyyy' } })
    vm(w).open()
    await flushPromises()
    await dayButton(w, 15)!.trigger('click')
    await flushPromises()
    const date = w.emitted('update:modelValue')![0]![0] as Date
    const expected = formatDate(date, 'dd-MM-yyyy')
    expect(w.emitted('update:formattedValue')?.[0]?.[0]).toBe(expected)
    expect(w.emitted('change-formatted')?.[0]?.[0]).toBe(expected)
    expect(w.emitted('select-formatted')?.[0]?.[0]).toBe(expected)
  })

  it('single: sin value-format NO emite eventos formateados', async () => {
    const w = mount(DatePicker)
    vm(w).open()
    await flushPromises()
    await dayButton(w, 15)!.trigger('click')
    await flushPromises()
    expect(w.emitted('update:formattedValue')).toBeFalsy()
    expect(w.emitted('change-formatted')).toBeFalsy()
  })

  it('single: getFormattedValue formatea con value-format', () => {
    const w = mount(DatePicker, { props: { valueFormat: 'dd-MM-yyyy', modelValue: '2026-08-11' } })
    const get = (w.vm as unknown as { getFormattedValue: () => string | null }).getFormattedValue
    expect(get()).toBe('11-08-2026')
  })

  it('range: con value-format emite start/end y change-formatted { start, end }', async () => {
    const w = mount(DatePicker, { props: { mode: 'range', valueFormat: 'yyyy-MM-dd' } })
    vm(w).open()
    await flushPromises()
    await dayButton(w, 10)!.trigger('click')
    await flushPromises()
    expect(w.emitted('update:formattedStartDate')?.[0]?.[0]).toMatch(/^\d{4}-\d{2}-10$/)
    await dayButton(w, 20)!.trigger('click')
    await flushPromises()
    const cf = w.emitted('change-formatted')?.[0]?.[0] as { start: string; end: string }
    expect(cf.start).toMatch(/-10$/)
    expect(cf.end).toMatch(/-20$/)
  })
})

describe('DatePicker — límites y "Hoy"', () => {
  it('"Hoy" se deshabilita cuando hoy queda fuera de min/max y no emite nada', async () => {
    const w = mount(DatePicker, { props: { min: '2026-08-01', max: '2026-08-31' } })
    vm(w).open()
    await flushPromises()
    const today = w.findAll('.cu-date-picker-footer button').find((b) => b.text() === 'Hoy')
    expect(today).toBeTruthy()
    expect(today!.attributes('disabled')).toBeDefined()
    // Click nativo (no `trigger` de VTU, que ignora elementos deshabilitados):
    // comprueba además el guard de `goToday`, no solo el `disabled` visual.
    today!.element.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await flushPromises()
    expect(w.emitted('change')).toBeFalsy()
    expect(w.emitted('update:modelValue')).toBeFalsy()
  })

  it('"Hoy" sigue funcionando cuando hoy está dentro del rango', async () => {
    const w = mount(DatePicker)
    vm(w).open()
    await flushPromises()
    const today = w.findAll('.cu-date-picker-footer button').find((b) => b.text() === 'Hoy')
    expect(today!.attributes('disabled')).toBeUndefined()
    await today!.trigger('click')
    await flushPromises()
    expect(w.emitted('change')).toBeTruthy()
  })

  it('setValue no selecciona un día fuera de min/max', async () => {
    const w = mount(DatePicker, { props: { min: '2026-08-10', max: '2026-08-20' } })
    const setValue = (w.vm as unknown as { setValue: (v: string) => void }).setValue
    setValue('2026-08-05')
    await flushPromises()
    expect(w.emitted('change')).toBeFalsy()
    setValue('2026-08-15')
    await flushPromises()
    expect(w.emitted('change')).toBeTruthy()
  })
})

describe('DatePicker — accesibilidad del trigger', () => {
  it('el trigger expone aria-expanded y aria-haspopup, y refleja el estado del panel', async () => {
    const w = mount(DatePicker, { props: { modelValue: '2026-08-11' } })
    const trigger = () => w.find('.cu-date-picker-toggle')
    expect(trigger().attributes('aria-expanded')).toBe('false')
    expect(trigger().attributes('aria-haspopup')).toBe('dialog')
    vm(w).open()
    await flushPromises()
    expect(trigger().attributes('aria-expanded')).toBe('true')
    vm(w).close()
    await flushPromises()
    expect(trigger().attributes('aria-expanded')).toBe('false')
  })

  it('con label, el trigger se anuncia como "label: valor"', () => {
    const w = mount(DatePicker, { props: { label: 'Fecha', modelValue: '2026-08-11' } })
    expect(w.find('.cu-date-picker-toggle').attributes('aria-label')).toBe('Fecha: 11/08/2026')
  })

  it('al cerrar con el foco dentro del panel, vuelve al trigger', async () => {
    const w = mount(DatePicker, { props: { modelValue: '2026-08-11' }, attachTo: document.body })
    vm(w).open()
    await flushPromises()
    const day = dayButton(w, 15)!
    ;(day.element as HTMLElement).focus()
    expect((day.element as HTMLElement).ownerDocument.activeElement).toBe(day.element)
    vm(w).close()
    await flushPromises()
    expect(document.activeElement).toBe(w.find('.cu-date-picker-toggle').element)
    w.unmount()
  })
})

describe('DatePicker — modo rango abre en el mes del rango', () => {
  it('con startDate, el calendario interno arranca en ese mes', async () => {
    const w = mount(DatePicker, { props: { mode: 'range', startDate: '2026-03-10' } })
    vm(w).open()
    await flushPromises()
    expect(w.find('.cu-month-slider').text().toLowerCase()).toContain('marzo')
  })
})

describe('DatePicker — cambios en caliente', () => {
  it('pasar de single a range con el panel abierto cambia el calendario sin romper', async () => {
    const w = mount(DatePicker, { props: { modelValue: '2026-08-11' } })
    vm(w).open()
    await flushPromises()
    expect(w.find('.cu-date-picker-label').text()).toBe('11/08/2026')
    await w.setProps({ mode: 'range' })
    await flushPromises()
    expect(w.find('.cu-date-picker-label').text()).toBe('Seleccionar rango...')
    await dayButton(w, 10)!.trigger('click')
    await flushPromises()
    expect(w.emitted('update:startDate')).toBeTruthy()
    await w.setProps({ mode: 'single' })
    await flushPromises()
    expect(w.find('.cu-date-picker-label').text()).toBe('11/08/2026')
  })

  it('limpiar en rango deja el label en el placeholder y el panel abierto', async () => {
    const w = mount(DatePicker, { props: { mode: 'range', startDate: '2026-08-10' } })
    vm(w).open()
    await flushPromises()
    const clear = w.findAll('.cu-date-picker-footer button').find((b) => b.text() === 'Limpiar')
    await clear!.trigger('click')
    await flushPromises()
    expect(w.find('.cu-date-picker-label').text()).toBe('Seleccionar rango...')
    expect(vm(w).isOpen()).toBe(true)
    expect(w.emitted('change')?.at(-1)?.[0]).toEqual({ start: null, end: null })
  })
})

describe('DatePicker — rol del panel', () => {
  it('el panel se anuncia como dialog (adentro hay un grid, no menuitems)', async () => {
    const w = mount(DatePicker)
    vm(w).open()
    await flushPromises()
    expect(w.find('.cu-dropdown-panel').attributes('role')).toBe('dialog')
  })
})
