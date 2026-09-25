import { describe, it, expect } from 'vitest'
import { nextTick, ref } from 'vue'
import { useDateRange, type DateRange } from './useDateRange'

interface Spy {
  start: (Date | null)[]
  end: (Date | null)[]
  change: DateRange[]
  select: DateRange[]
}

function setup() {
  const spy: Spy = { start: [], end: [], change: [], select: [] }
  const range = useDateRange({
    onStartChange: (v) => spy.start.push(v),
    onEndChange: (v) => spy.end.push(v),
    onChange: (v) => spy.change.push(v),
    onSelect: (v) => spy.select.push(v),
  })
  return { spy, range }
}

const d = (day: number) => new Date(2026, 7, day)

describe('useDateRange', () => {
  it('primer click inicia el rango y no emite change/select', () => {
    const { spy, range } = setup()
    range.select(d(10))
    expect(range.pickingEnd.value).toBe(true)
    expect(range.startValue.value?.getDate()).toBe(10)
    expect(range.endValue.value).toBeNull()
    expect(spy.start).toHaveLength(1)
    expect(spy.change).toHaveLength(0)
    expect(spy.select).toHaveLength(0)
  })

  it('segundo click completa el rango y emite change + select', () => {
    const { spy, range } = setup()
    range.select(d(10))
    range.select(d(20))
    expect(range.pickingEnd.value).toBe(false)
    expect(range.startValue.value?.getDate()).toBe(10)
    expect(range.endValue.value?.getDate()).toBe(20)
    expect(spy.change).toHaveLength(1)
    expect(spy.select).toHaveLength(1)
    expect(spy.change[0]).toEqual({ start: d(10), end: d(20) })
  })

  it('hace swap si el fin es anterior al inicio', () => {
    const { spy, range } = setup()
    range.select(d(20))
    range.select(d(10))
    expect(range.startValue.value?.getDate()).toBe(10)
    expect(range.endValue.value?.getDate()).toBe(20)
    expect(spy.start.at(-1)?.getDate()).toBe(10)
    expect(spy.end.at(-1)?.getDate()).toBe(20)
  })

  it('reiniciar la selección descarta el fin previo y lo emite', () => {
    const { spy, range } = setup()
    range.select(d(10))
    range.select(d(20))
    spy.end.length = 0
    range.select(d(25))
    expect(range.endValue.value).toBeNull()
    expect(spy.end).toEqual([null])
  })

  it('clear limpia todo y emite start/end/change null', () => {
    const { spy, range } = setup()
    range.select(d(10))
    range.select(d(20))
    range.clear()
    expect(range.startValue.value).toBeNull()
    expect(range.endValue.value).toBeNull()
    expect(range.pickingEnd.value).toBe(false)
    expect(spy.start.at(-1)).toBeNull()
    expect(spy.end.at(-1)).toBeNull()
    expect(spy.change.at(-1)).toEqual({ start: null, end: null })
  })

  it('setRange setea ambos extremos desde string/Date y resetea pickingEnd', () => {
    const { spy, range } = setup()
    range.setRange('2026-08-01', '2026-08-31')
    expect(range.startValue.value?.getDate()).toBe(1)
    expect(range.endValue.value?.getDate()).toBe(31)
    expect(range.pickingEnd.value).toBe(false)
    expect(spy.change.at(-1)?.start?.getDate()).toBe(1)
  })

  it('reset no toca las fechas, solo el estado de selección', () => {
    const { range } = setup()
    range.select(d(10))
    range.reset()
    expect(range.pickingEnd.value).toBe(false)
    expect(range.startValue.value?.getDate()).toBe(10)
  })

  it('se sincroniza cuando cambian las props desde afuera', async () => {
    const start = ref<string | null>(null)
    const end = ref<string | null>(null)
    const range = useDateRange({ start: () => start.value, end: () => end.value })
    start.value = '2026-08-15'
    end.value = '2026-08-20'
    await nextTick()
    expect(range.startValue.value?.getDate()).toBe(15)
    expect(range.endValue.value?.getDate()).toBe(20)
  })
})