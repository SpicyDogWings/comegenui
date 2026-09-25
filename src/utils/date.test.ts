import { describe, it, expect } from 'vitest'
import {
  addMonths,
  formatDate,
  normalizeDate,
  normalizeMonth,
  parseDate,
  parseMonth,
  sameDay,
  sameMonth,
  startOfCurrentMonth,
} from './date'

describe('utils/date — parseDate', () => {
  it('parsea "YYYY-MM-DD" como hora local a medianoche', () => {
    const d = parseDate('2026-08-20')
    expect(d).not.toBeNull()
    expect(d!.getFullYear()).toBe(2026)
    expect(d!.getMonth()).toBe(7)
    expect(d!.getDate()).toBe(20)
    expect(d!.getHours()).toBe(0)
  })

  it('normaliza un Date con hora a medianoche', () => {
    const d = parseDate(new Date(2026, 7, 20, 15, 30))
    expect(d!.getHours()).toBe(0)
    expect(d!.getMinutes()).toBe(0)
  })

  it('acepta timestamp', () => {
    const ts = new Date(2026, 7, 20).getTime()
    expect(parseDate(ts)!.getDate()).toBe(20)
  })

  it("'' / null / undefined / inválidos devuelven null", () => {
    expect(parseDate('')).toBeNull()
    expect(parseDate(null)).toBeNull()
    expect(parseDate(undefined)).toBeNull()
    expect(parseDate('no-es-fecha')).toBeNull()
    expect(parseDate(new Date('x'))).toBeNull()
  })
})

describe('utils/date — parseMonth / normalize', () => {
  it('parseMonth fija el día 1', () => {
    expect(parseMonth('2026-08-20')!.getDate()).toBe(1)
    expect(parseMonth('2026-08-20')!.getMonth()).toBe(7)
  })

  it('normalizeDate / normalizeMonth', () => {
    const d = new Date(2026, 7, 20, 9, 5)
    expect(normalizeDate(d).getDate()).toBe(20)
    expect(normalizeMonth(d).getDate()).toBe(1)
  })

  it('startOfCurrentMonth fija día 1 del mes de la fecha dada', () => {
    const start = startOfCurrentMonth(new Date(2026, 7, 20))
    expect(start.getFullYear()).toBe(2026)
    expect(start.getMonth()).toBe(7)
    expect(start.getDate()).toBe(1)
  })
})

describe('utils/date — sameDay / sameMonth / addMonths', () => {
  it('sameDay compara año/mes/día', () => {
    expect(sameDay(new Date(2026, 7, 20), new Date(2026, 7, 20, 23))).toBe(true)
    expect(sameDay(new Date(2026, 7, 20), new Date(2026, 7, 21))).toBe(false)
  })

  it('sameMonth compara año/mes', () => {
    expect(sameMonth(new Date(2026, 7, 1), new Date(2026, 7, 31))).toBe(true)
    expect(sameMonth(new Date(2026, 7, 1), new Date(2026, 8, 1))).toBe(false)
  })

  it('addMonths suma/resta y fija el día 1', () => {
    const base = new Date(2026, 7, 20)
    expect(addMonths(base, 1).getMonth()).toBe(8)
    expect(addMonths(base, 1).getDate()).toBe(1)
    expect(addMonths(base, -1).getMonth()).toBe(6)
  })
})

describe('utils/date — formatDate', () => {
  const date = new Date(2026, 7, 20)

  it('formatea con tokens dd/MM/yyyy', () => {
    expect(formatDate(date, 'dd/MM/yyyy', 'es')).toBe('20/08/2026')
  })

  it('capitaliza el mes por defecto', () => {
    expect(formatDate(date, 'MMMM', 'es')).toBe('Agosto')
    expect(formatDate(date, 'MMM', 'es')).toBe('Ago')
  })

  it('no capitaliza con capitalizeMonths: false (MonthSlider)', () => {
    expect(formatDate(date, 'MMMM', 'es', { capitalizeMonths: false })).toBe('agosto')
  })

  it('soporta el token M sin padding', () => {
    expect(formatDate(new Date(2026, 2, 5), 'M/yyyy', 'es')).toBe('3/2026')
  })

  it('yy devuelve dos dígitos', () => {
    expect(formatDate(date, 'yy', 'es')).toBe('26')
  })
})