import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Loader from './Loader.vue'

describe('Loader', () => {
  it('renderiza la barra con la animación default (loading)', () => {
    const wrapper = mount(Loader)
    const bar = wrapper.find('.cu-loader-bar')
    expect(bar.exists()).toBe(true)
    expect(bar.classes()).toContain('cu-loader-bar--loading')
  })

  it('resuelve el color via token --cu-color-{name}', () => {
    const wrapper = mount(Loader, { props: { color: 'success' } })
    expect(wrapper.find('.cu-loader-bar').attributes('style')).toContain('--cu-loader-color: var(--cu-color-success)')
  })

  it('aplica la animación cooldown y el delay', () => {
    const wrapper = mount(Loader, { props: { animation: 'cooldown', delay: 5000 } })
    const bar = wrapper.find('.cu-loader-bar')
    expect(bar.classes()).toContain('cu-loader-bar--cooldown')
    expect(bar.attributes('style')).toContain('--cu-loader-delay: 5000ms')
  })
})
