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
