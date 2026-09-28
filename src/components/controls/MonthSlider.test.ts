import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import MonthSlider from './MonthSlider.vue'

const monthLabel = (w: ReturnType<typeof mount>) =>
  w.find('.cu-month-slider-label-month').text()

describe('MonthSlider — formatos de mes/año (enums cerrados)', () => {
  it('monthFormat usa el token pedido (MMM → sept)', () => {
    const w = mount(MonthSlider, { props: { modelValue: '2026-09-01', monthFormat: 'MMM' } })
    expect(monthLabel(w)).toBe('sept')
  })

  it('monthFormat no soportado (MMM yyyy) cae al default MMMM', () => {
    const w = mount(MonthSlider, {
      props: { modelValue: '2026-09-01', monthFormat: 'MMM yyyy' as never },
    })
    expect(monthLabel(w)).toBe('septiembre')
  })

  it('yearFormat yy muestra el año a dos dígitos en el badge', () => {
    const year = new Date().getFullYear() + 5
    const w = mount(MonthSlider, {
      props: { modelValue: `${year}-09-01`, yearFormat: 'yy' },
    })
    expect(w.find('.cu-month-slider-label-year').text()).toContain(String(year).slice(-2))
  })
})
