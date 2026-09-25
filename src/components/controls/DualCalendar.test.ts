import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DualCalendar from './DualCalendar.vue'

describe('DualCalendar', () => {
  it('months=2 renderiza dos calendarios con meses consecutivos', () => {
    const w = mount(DualCalendar, { props: { startDate: '2026-03-10' } })
    const sliders = w.findAll('.cu-month-slider')
    expect(sliders).toHaveLength(2)
    expect(sliders[0]!.text().toLowerCase()).toContain('marzo')
    expect(sliders[1]!.text().toLowerCase()).toContain('abril')
  })

  it('sin startDate arranca en el mes actual y el siguiente', () => {
    const w = mount(DualCalendar, { props: { months: 2 } })
    const sliders = w.findAll('.cu-month-slider')
    expect(sliders).toHaveLength(2)
    const first = new Date()
    const expectedFirst = new Intl.DateTimeFormat('es', { month: 'long' }).format(first)
    const expectedSecond = new Intl.DateTimeFormat('es', { month: 'long' }).format(
      new Date(first.getFullYear(), first.getMonth() + 1, 1),
    )
    expect(sliders[0]!.text().toLowerCase()).toContain(expectedFirst.toLowerCase())
    expect(sliders[1]!.text().toLowerCase()).toContain(expectedSecond.toLowerCase())
  })

  it('months=1 renderiza un solo calendario', () => {
    const w = mount(DualCalendar, { props: { months: 1 } })
    expect(w.findAll('.cu-calendar')).toHaveLength(1)
  })

  it('propaga el select de los calendarios internos', async () => {
    const w = mount(DualCalendar, { props: { startDate: '2026-03-10' } })
    const day = w.findAll('.cu-calendar-day').find((d) => d.text() === '20')
    expect(day).toBeTruthy()
    await day!.trigger('click')
    expect(w.emitted('select')).toBeTruthy()
  })
})
