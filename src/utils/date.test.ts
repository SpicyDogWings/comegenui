import { describe, it, expect } from 'vitest'
import {
  addDays,
  addMonths,
  formatDate,
  isDateDisabled,
  isMonthFormat,
  isYearFormat,
  normalizeDate,
  normalizeMonth,
  parseDate,
  parseMonth,
  sameDay,
  sameMonth,
  sanitizeMonthFormat,
  sanitizeYearFormat,
  shiftMonth,
  startOfCurrentMonth,
  startOfWeek,
  toDisabledDates,
  toDisabledWeekdays,
  toISODate,
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

describe('utils/date — formatos de mes/año (enums cerrados)', () => {
  it('isMonthFormat acepta solo los tokens de mes', () => {
    for (const value of ['MMMM', 'MMM', 'MM', 'M']) {
      expect(isMonthFormat(value)).toBe(true)
    }
    for (const value of ['MMM yyyy', 'MM/yyyy', 'dd', '', null, 7]) {
      expect(isMonthFormat(value)).toBe(false)
    }
  })

  it('isYearFormat acepta solo los tokens de año', () => {
    expect(isYearFormat('yyyy')).toBe(true)
    expect(isYearFormat('yy')).toBe(true)
    for (const value of ['y', 'YYYY', 'dd/MM/yyyy', '', null]) {
      expect(isYearFormat(value)).toBe(false)
    }
  })

  it('sanitize cae al default con valores no soportados', () => {
    expect(sanitizeMonthFormat('MMM')).toBe('MMM')
    expect(sanitizeMonthFormat('MMM yyyy')).toBe('MMMM')
    expect(sanitizeMonthFormat(undefined)).toBe('MMMM')
    expect(sanitizeYearFormat('yy')).toBe('yy')
    expect(sanitizeYearFormat('YYYY')).toBe('yyyy')
  })
})
describe('utils/date — navegación de grilla', () => {
  it('addDays cruza fin de mes y de año', () => {
    expect(toISODate(addDays(new Date(2026, 7, 31), 1))).toBe('2026-09-01')
    expect(toISODate(addDays(new Date(2026, 11, 31), 1))).toBe('2027-01-01')
    expect(toISODate(addDays(new Date(2026, 0, 1), -1))).toBe('2025-12-31')
  })

  it('shiftMonth conserva el día y lo recorta al último del mes destino', () => {
    expect(toISODate(shiftMonth(new Date(2026, 0, 31), 1))).toBe('2026-02-28')
    expect(toISODate(shiftMonth(new Date(2026, 7, 15), 1))).toBe('2026-09-15')
    expect(toISODate(shiftMonth(new Date(2026, 0, 15), -1))).toBe('2025-12-15')
  })

  it('startOfWeek respeta weekStart (0 = domingo)', () => {
    // 2026-08-12 es miércoles
    expect(toISODate(startOfWeek(new Date(2026, 7, 12), 1))).toBe('2026-08-10')
    expect(toISODate(startOfWeek(new Date(2026, 7, 12), 0))).toBe('2026-08-09')
    // Un domingo con weekStart lunes cae al lunes anterior
    expect(toISODate(startOfWeek(new Date(2026, 7, 16), 1))).toBe('2026-08-10')
  })

  it('toISODate usa la fecha local (no UTC)', () => {
    expect(toISODate(new Date(2026, 0, 1))).toBe('2026-01-01')
  })
})

describe('utils/date — isDateDisabled', () => {
  const day = new Date(2026, 7, 15)

  it('respeta min y max', () => {
    expect(isDateDisabled(day, { min: '2026-08-16' })).toBe(true)
    expect(isDateDisabled(day, { max: '2026-08-14' })).toBe(true)
    expect(isDateDisabled(day, { min: '2026-08-15', max: '2026-08-15' })).toBe(false)
  })

  it('respeta disabledWeekdays y disabledDates', () => {
    // 2026-08-15 es sábado (6)
    expect(isDateDisabled(day, { disabledWeekdays: '0,6' })).toBe(true)
    expect(isDateDisabled(day, { disabledWeekdays: [0, 6] })).toBe(true)
    expect(isDateDisabled(day, { disabledWeekdays: [1, 2] })).toBe(false)
    expect(isDateDisabled(day, { disabledDates: '2026-08-15' })).toBe(true)
    expect(isDateDisabled(day, { disabledDates: [new Date(2026, 7, 15)] })).toBe(true)
    expect(isDateDisabled(day, { disabledDates: ['2026-08-16'] })).toBe(false)
  })

  it('disabled deshabilita todo', () => {
    expect(isDateDisabled(day, { disabled: true })).toBe(true)
  })

  it('toDisabledWeekdays / toDisabledDates normalizan string y array', () => {
    expect(toDisabledWeekdays('0, 6')).toEqual([0, 6])
    expect(toDisabledWeekdays([1, 2])).toEqual([1, 2])
    expect(toDisabledWeekdays('')).toEqual([])
    expect(toDisabledDates('2026-08-15, 2026-08-16').map(toISODate)).toEqual([
      '2026-08-15',
      '2026-08-16',
    ])
    expect(toDisabledDates('no-es-fecha')).toEqual([])
  })
})
