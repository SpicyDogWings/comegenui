import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Calendar from './Calendar.vue'

const dayButton = (w: ReturnType<typeof mount>, n: number) =>
  w.findAll('.cu-calendar-day').find((d) => d.text() === String(n))

describe('Calendar — selección', () => {
  it('click en un día emite update:modelValue/change/select', async () => {
    const w = mount(Calendar)
    const day = dayButton(w, 15)
    expect(day).toBeTruthy()
    await day!.trigger('click')
    expect(w.emitted('select')).toBeTruthy()
    expect(w.emitted('change')).toBeTruthy()
    expect(w.emitted('update:modelValue')).toBeTruthy()
  })

  it('no emite al clickear un día deshabilitado por disabledDates', async () => {
    // Deshabilita todos los días del mes visible salvo el 15 no sirve para
    // aislar; deshabilitamos el 10 puntual de un mes fijo.
    const w = mount(Calendar, {
      props: { modelValue: '2026-08-01', disabledDates: '2026-08-10' },
    })
    const disabled = dayButton(w, 10)
    await disabled!.trigger('click')
    expect(w.emitted('select')).toBeFalsy()
  })
})

describe('Calendar — modo rango', () => {
  it('primer click inicio, segundo fin, y emite el rango', async () => {
    const w = mount(Calendar, { props: { mode: 'range', modelValue: '2026-08-01' } })
    await dayButton(w, 10)!.trigger('click')
    expect(w.emitted('update:rangeStart')).toBeTruthy()
    expect(w.emitted('select')).toBeFalsy()
    await dayButton(w, 20)!.trigger('click')
    expect(w.emitted('update:rangeEnd')).toBeTruthy()
    const selected = w.emitted('select')
    expect(selected).toBeTruthy()
    expect((selected![0]![0] as { start: Date; end: Date }).start.getDate()).toBe(10)
    expect((selected![0]![0] as { start: Date; end: Date }).end.getDate()).toBe(20)
    expect(w.emitted('change')).toBeTruthy()
  })

  it('no emite update:modelValue al clickear en modo rango', async () => {
    const w = mount(Calendar, { props: { mode: 'range', modelValue: '2026-08-01' } })
    await dayButton(w, 10)!.trigger('click')
    expect(w.emitted('update:modelValue')).toBeFalsy()
  })

  it('pinta el rango con range-start/range-end', async () => {
    const w = mount(Calendar, { props: { mode: 'range', modelValue: '2026-08-01' } })
    await dayButton(w, 10)!.trigger('click')
    expect(w.findAll('.cu-calendar-day--range-start')).toHaveLength(1)
    await dayButton(w, 20)!.trigger('click')
    expect(w.findAll('.cu-calendar-day--range-start')).toHaveLength(1)
    expect(w.findAll('.cu-calendar-day--range-end')).toHaveLength(1)
    expect(w.findAll('.cu-calendar-day--range').length).toBeGreaterThan(1)
  })
})

describe('Calendar — single ignora el rango', () => {
  it('no pinta clases de rango con rangeStart/rangeEnd', () => {
    const w = mount(Calendar, {
      props: { modelValue: '2026-08-01', rangeStart: '2026-08-05', rangeEnd: '2026-08-20' },
    })
    expect(w.findAll('.cu-calendar-day--range')).toHaveLength(0)
    expect(w.findAll('.cu-calendar-day--range-start')).toHaveLength(0)
    expect(w.findAll('.cu-calendar-day--range-end')).toHaveLength(0)
  })
})

describe('Calendar — viewMonth', () => {
  it('modo controlado: navegar emite update:viewMonth', async () => {
    const w = mount(Calendar, { props: { viewMonth: '2026-03-15' } })
    expect(w.find('.cu-month-slider').text().toLowerCase()).toContain('marzo')
    await (w.vm as any).nextMonth()
    const emitted = w.emitted('update:viewMonth')
    expect(emitted).toBeTruthy()
    expect((emitted![0][0] as Date).getMonth()).toBe(3)
    expect((emitted![0][0] as Date).getDate()).toBe(1)
  })

  it('modo controlado: la prop manda sobre modelValue', () => {
    const w = mount(Calendar, {
      props: { viewMonth: '2026-03-15', modelValue: '2026-09-20' },
    })
    expect(w.find('.cu-month-slider').text().toLowerCase()).toContain('marzo')
  })

  it('modo no controlado: navegar cambia el mes sin emitir update:viewMonth', async () => {
    const w = mount(Calendar, { props: { modelValue: '2026-03-15' } })
    await (w.vm as any).nextMonth()
    expect(w.emitted('update:viewMonth')).toBeFalsy()
    expect(w.find('.cu-month-slider').text().toLowerCase()).toContain('abril')
  })
})
