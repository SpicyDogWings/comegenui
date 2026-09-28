import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DualCalendar from './DualCalendar.vue'

const calendar = (w: ReturnType<typeof mount>, n: number) => w.findAll('.cu-calendar')[n]!
const dayIn = (w: ReturnType<typeof mount>, cal: number, n: number) =>
  calendar(w, cal)
    .findAll('.cu-calendar-day')
    .find((d) => d.text() === String(n))

describe('DualCalendar', () => {
  it('renderiza dos calendarios en modo range, con meses consecutivos', () => {
    const w = mount(DualCalendar, { props: { startDate: '2026-03-10' } })
    const sliders = w.findAll('.cu-month-slider')
    expect(sliders).toHaveLength(2)
    expect(sliders[0]!.text().toLowerCase()).toContain('marzo')
    expect(sliders[1]!.text().toLowerCase()).toContain('abril')
  })

  it('sin startDate arranca en el mes actual y el siguiente', () => {
    const w = mount(DualCalendar)
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

  it('el rango es compartido: click en un calendario y luego en el otro completa', async () => {
    const w = mount(DualCalendar)
    // primer click en el primer calendario → inicio
    await dayIn(w, 0, 10)!.trigger('click')
    expect(w.emitted('update:startDate')).toBeTruthy()
    expect(w.emitted('select')).toBeFalsy()
    expect(calendar(w, 0).findAll('.cu-calendar-day--range-start').length).toBeGreaterThan(0)

    // segundo click en el otro calendario (mes siguiente) → completa el rango
    await dayIn(w, 1, 5)!.trigger('click')
    expect(w.emitted('update:endDate')).toBeTruthy()
    const selected = w.emitted('select')
    expect(selected).toBeTruthy()
    const range = selected![0]![0] as { start: Date; end: Date }
    expect(range.start.getDate()).toBe(10)
    expect(range.end.getDate()).toBe(5)
    expect(range.end.getTime()).toBeGreaterThan(range.start.getTime())
    expect(w.emitted('change')).toBeTruthy()
  })

  it('en modo range no resalta el día suelto', async () => {
    const w = mount(DualCalendar, { props: { startDate: '2026-09-01' } })
    await dayIn(w, 0, 10)!.trigger('click')
    expect(w.findAll('.cu-calendar-day--selected')).toHaveLength(0)
  })

  it('setRange/clear actualizan el pintado de ambos calendarios', async () => {
    const w = mount(DualCalendar)
    ;(w.vm as unknown as { setRange: (a: string, b: string) => void }).setRange(
      '2026-09-10',
      '2026-10-05',
    )
    await w.vm.$nextTick()
    expect(w.findAll('.cu-calendar-day--range-start').length).toBeGreaterThan(0)
    expect(w.findAll('.cu-calendar-day--range-end').length).toBeGreaterThan(0)
  })
})
