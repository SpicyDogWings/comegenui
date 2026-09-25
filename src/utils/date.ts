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
