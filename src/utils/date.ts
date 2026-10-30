// Utilidades de fecha compartidas por Calendar, MonthSlider, DatePicker y
// DualCalendar. Sin librerías externas: todo con Date/Intl nativo y hora local
// (evita el desfase UTC de "YYYY-MM-DD").

export interface CalendarEvent {
  date: string | number | Date
  color?: string
}

const DATE_RE = /^(\d{4})-(\d{2})(?:-(\d{2}))?$/

/** Normaliza cualquier `Date` a medianoche local. */
export function normalizeDate(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

/** Primer día del mes local de una fecha. */
export function normalizeMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1)
}

/** Primer día del mes actual. */
export function startOfCurrentMonth(now: Date = new Date()): Date {
  return new Date(now.getFullYear(), now.getMonth(), 1)
}

/**
 * Convierte `Date`, timestamp o `"YYYY-MM-DD"` a medianoche local.
 * `''`, `null`, `undefined` y valores inválidos devuelven `null`.
 */
export function parseDate(value: string | number | Date | null | undefined): Date | null {
  if (value === null || value === undefined || value === '') return null
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? null : normalizeDate(value)
  }
  if (typeof value === 'number') {
    if (!Number.isFinite(value)) return null
    const d = new Date(value)
    return Number.isNaN(d.getTime()) ? null : normalizeDate(d)
  }
  const m = value.trim().match(DATE_RE)
  const parsed = m
    ? new Date(Number(m[1] ?? 0), Number(m[2] ?? 1) - 1, m[3] ? Number(m[3]) : 1)
    : new Date(value)
  if (Number.isNaN(parsed.getTime())) return null
  return normalizeDate(parsed)
}

/** Igual que `parseDate` pero normalizado al primer día del mes. */
export function parseMonth(value: string | number | Date | null | undefined): Date | null {
  const d = parseDate(value)
  return d === null ? null : normalizeMonth(d)
}

/** Mismo día (año/mes/día) en hora local. */
export function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  )
}

/** Mismo mes (año/mes) en hora local. */
export function sameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth()
}

/** Suma (o resta) meses, fijando el día al 1 para evitar overflow. */
export function addMonths(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth() + delta, 1)
}

/** Suma (o resta) días en hora local. */
export function addDays(date: Date, delta: number): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta)
}

/**
 * Suma (o resta) meses **conservando el día** y recortándolo al último del mes
 * destino (31 de enero + 1 mes → 28/29 de febrero).
 */
export function shiftMonth(date: Date, delta: number): Date {
  const lastDay = new Date(date.getFullYear(), date.getMonth() + delta + 1, 0).getDate()
  return new Date(date.getFullYear(), date.getMonth() + delta, Math.min(date.getDate(), lastDay))
}

/** Primer día de la semana de `date` según `weekStart` (0 = domingo). */
export function startOfWeek(date: Date, weekStart = 1): Date {
  const offset = (date.getDay() - weekStart + 7) % 7
  return addDays(date, -offset)
}

/** Fecha local como `"YYYY-MM-DD"` (sin pasar por UTC). */
export function toISODate(date: Date): string {
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

/** Normaliza `disabledWeekdays` (`"0,6"` en CE o `[0,6]` en Vue) a números. */
export function toDisabledWeekdays(value: number[] | string | null | undefined): number[] {
  if (Array.isArray(value)) return value.filter((n) => typeof n === 'number' && !Number.isNaN(n))
  if (typeof value === 'string' && value.trim()) {
    return value
      .split(',')
      .map((s) => Number(s.trim()))
      .filter((n) => !Number.isNaN(n))
  }
  return []
}

/** Normaliza `disabledDates` (`"2026-08-15,2026-08-16"` en CE o array) a fechas. */
export function toDisabledDates(
  value: (string | Date)[] | string | null | undefined,
): Date[] {
  const raw = Array.isArray(value)
    ? value
    : typeof value === 'string' && value.trim()
      ? value.split(',')
      : []
  return raw
    .map((d) => parseDate(d))
    .filter((d): d is Date => d !== null)
}

export interface DateDisabledRules {
  /** Deshabilita todo el calendario. */
  disabled?: boolean
  min?: string | number | Date | null
  max?: string | number | Date | null
  /** Días de la semana no seleccionables (0 = domingo). */
  disabledWeekdays?: number[] | string | null
  /** Fechas puntuales no seleccionables. */
  disabledDates?: (string | Date)[] | string | null
}

/**
 * ¿El día se puede seleccionar? Regla única de `Calendar` (click, teclado y
 * `setValue`) y de `DatePicker` (botón "Hoy" y `setValue`).
 */
export function isDateDisabled(day: Date, rules: DateDisabledRules = {}): boolean {
  if (rules.disabled) return true
  const min = parseDate(rules.min ?? null)
  if (min && day < min) return true
  const max = parseDate(rules.max ?? null)
  if (max && day > max) return true
  if (toDisabledWeekdays(rules.disabledWeekdays).includes(day.getDay())) return true
  return toDisabledDates(rules.disabledDates).some((d) => sameDay(day, d))
}

/** Tokens de mes soportados por el header del calendario/slider. */
export const MONTH_FORMATS = ['MMMM', 'MMM', 'MM', 'M'] as const
export type MonthFormat = (typeof MONTH_FORMATS)[number]

/** Tokens de año soportados por el badge del slider. */
export const YEAR_FORMATS = ['yyyy', 'yy'] as const
export type YearFormat = (typeof YEAR_FORMATS)[number]

export const DEFAULT_MONTH_FORMAT: MonthFormat = 'MMMM'
export const DEFAULT_YEAR_FORMAT: YearFormat = 'yyyy'

/** ¿`value` es un formato de mes soportado? */
export function isMonthFormat(value: unknown): value is MonthFormat {
  return typeof value === 'string' && (MONTH_FORMATS as readonly string[]).includes(value)
}

/** ¿`value` es un formato de año soportado? */
export function isYearFormat(value: unknown): value is YearFormat {
  return typeof value === 'string' && (YEAR_FORMATS as readonly string[]).includes(value)
}

/** Formato de mes válido o el default si no se soporta (enforcement runtime). */
export function sanitizeMonthFormat(value: unknown): MonthFormat {
  return isMonthFormat(value) ? value : DEFAULT_MONTH_FORMAT
}

/** Formato de año válido o el default si no se soporta (enforcement runtime). */
export function sanitizeYearFormat(value: unknown): YearFormat {
  return isYearFormat(value) ? value : DEFAULT_YEAR_FORMAT
}

export interface FormatDateOptions {
  /** Capitaliza la primera letra de `MMMM`/`MMM` (default `true`). */
  capitalizeMonths?: boolean
}

// Escaneo de mayor a menor longitud para que `yyyy` gane a `yy` y `MM`+ a `M`.
const FORMAT_TOKENS = ['yyyy', 'MMMM', 'MMM', 'MM', 'yy', 'dd', 'M'] as const

/**
 * Formatea una fecha con tokens `yyyy yy MMMM MMM MM M dd`.
 * `capitalizeMonths: false` deja el mes tal cual lo da `Intl` (para MonthSlider).
 */
export function formatDate(
  date: Date,
  format: string,
  locale = 'es',
  options: FormatDateOptions = {},
): string {
  const { capitalizeMonths = true } = options
  const pad = (n: number) => String(n).padStart(2, '0')
  const monthName = (long: boolean) => {
    const label = new Intl.DateTimeFormat(locale, { month: long ? 'long' : 'short' }).format(date)
    return capitalizeMonths ? label.charAt(0).toUpperCase() + label.slice(1) : label
  }
  const values: Record<string, () => string> = {
    yyyy: () => String(date.getFullYear()),
    yy: () => String(date.getFullYear()).slice(-2),
    MMMM: () => monthName(true),
    MMM: () => monthName(false),
    MM: () => pad(date.getMonth() + 1),
    M: () => String(date.getMonth() + 1),
    dd: () => pad(date.getDate()),
  }
  let out = ''
  let i = 0
  while (i < format.length) {
    let matched = false
    for (const token of FORMAT_TOKENS) {
      if (format.startsWith(token, i)) {
        out += values[token]?.() ?? token
        i += token.length
        matched = true
        break
      }
    }
    if (!matched) {
      out += format[i]
      i += 1
    }
  }
  return out
}
