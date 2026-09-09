import * as XLSX from 'xlsx'

export type CellType = 'string' | 'integer' | 'number' | 'date' | 'boolean' | 'email'

export interface CellColumn {
  key: string
  label: string
  type?: CellType
  required?: boolean
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  pattern?: string | RegExp
  enum?: (string | number)[]
  unique?: boolean
  validate?: (value: unknown, row: Record<string, unknown>) => string | boolean | undefined
}

export interface CellError {
  row: number
  columnKey: string
  columnLabel: string
  message: string
}

export interface CellParseResult {
  rows: Record<string, unknown>[]
  headers: string[]
  warnings: string[]
}

export function parseCSV(text: string, delimiter = ','): string[][] {
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let inQuotes = false
  let i = 0

  const pushField = () => {
    row.push(field)
    field = ''
  }
  const pushRow = () => {
    pushField()
    rows.push(row)
    row = []
  }

  while (i < text.length) {
    const char = text[i]
    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          field += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        field += char
      }
      i++
      continue
    }
    if (char === '"') {
      inQuotes = true
      i++
      continue
    }
    if (char === delimiter) {
      pushField()
      i++
      continue
    }
    if (char === '\n') {
      pushRow()
      i++
      continue
    }
    if (char === '\r') {
      if (text[i + 1] === '\n') i++
      pushRow()
      i++
      continue
    }
    field += char
    i++
  }
  if (field !== '' || row.length > 0 || (rows.length === 0 && text.trim() !== '')) {
    pushRow()
  }
  return rows
}

async function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(reader.error)
    reader.readAsText(file)
  })
}

function isExcelFile(file: File): boolean {
  const name = file.name.toLowerCase()
  return name.endsWith('.xlsx') || name.endsWith('.xls') || name.endsWith('.ods')
}

async function parseXLSX(file: File, sheet: string | number = 0): Promise<string[][]> {
  const buf = await file.arrayBuffer()
  const wb = XLSX.read(buf, { type: 'array' })
  const sheetName = typeof sheet === 'number' ? wb.SheetNames[sheet] : sheet
  const ws = wb.Sheets[sheetName]
  if (!ws) throw new Error('Hoja no encontrada')
  const grid: unknown[][] = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' })
  return grid.map((r) => r.map((c) => (c === undefined || c === null ? '' : String(c))))
}

export async function readGrid(file: File, options: { delimiter?: string; sheet?: string | number } = {}): Promise<string[][]> {
  if (isExcelFile(file)) {
    return await parseXLSX(file, options.sheet)
  }
  const text = await readFileAsText(file)
  return parseCSV(text, options.delimiter ?? ',')
}

function normalizeHeader(value: string): string {
  return value.trim().toLowerCase()
}

function findColumnIndex(headers: string[], label: string): number {
  const target = normalizeHeader(label)
  return headers.findIndex((h) => normalizeHeader(h) === target)
}

function coerce(type: CellType | undefined, raw: unknown): unknown {
  if (raw === '' || raw === null || raw === undefined) return raw
  switch (type) {
    case 'integer': {
      const s = String(raw).trim()
      const cleaned = s.replace(/[^0-9.,-]/g, '')
      if (cleaned === '') return raw
      const n = Number(cleaned)
      return Number.isNaN(n) ? raw : Math.trunc(n)
    }
    case 'number': {
      const s = String(raw).trim()
      const cleaned = s.replace(',', '.').replace(/[^0-9.-]/g, '')
      if (cleaned === '') return raw
      const n = Number(cleaned)
      return Number.isNaN(n) ? raw : n
    }
    case 'boolean': {
      const v = String(raw).trim().toLowerCase()
      if (['true', 'si', 'sí', '1', 'x', 'yes'].includes(v)) return true
      if (['false', 'no', '0', ''].includes(v)) return false
      return raw
    }
    case 'date': {
      const d = new Date(String(raw))
      return Number.isNaN(d.getTime()) ? raw : d
    }
    default:
      return String(raw)
  }
}

function typeErrorMessage(type: CellType, value: unknown): string {
  const v = String(value)
  switch (type) {
    case 'integer': return `Debe ser un número entero (recibido "${v}")`
    case 'number': return `Debe ser un número (recibido "${v}")`
    case 'date': return `Debe ser una fecha válida (recibido "${v}")`
    case 'boolean': return `Debe ser verdadero/falso (recibido "${v}")`
    case 'email': return `Debe ser un email válido (recibido "${v}")`
    default: return `Valor inválido`
  }
}

export function validateValue(column: CellColumn, value: unknown, row: Record<string, unknown>): string | null {
  const isEmpty = value === '' || value === null || value === undefined
  if (isEmpty) {
    if (column.required) return 'Campo obligatorio'
    return null
  }

  const type = column.type ?? 'string'
  const coerced = coerce(type, value)

  switch (type) {
    case 'integer':
    case 'number':
      if (typeof coerced !== 'number') return typeErrorMessage(type, value)
      if (column.min !== undefined && coerced < column.min) return `Debe ser mayor o igual a ${column.min}`
      if (column.max !== undefined && coerced > column.max) return `Debe ser menor o igual a ${column.max}`
      break
    case 'boolean':
      if (typeof coerced !== 'boolean') return typeErrorMessage(type, value)
      break
    case 'date':
      if (!(coerced instanceof Date)) return typeErrorMessage(type, value)
      break
    case 'email': {
      const str = String(value).trim()
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str)) return typeErrorMessage(type, value)
      break
    }
    default: {
      const str = String(value)
      if (column.minLength !== undefined && str.length < column.minLength) return `Debe tener al menos ${column.minLength} caracteres`
      if (column.maxLength !== undefined && str.length > column.maxLength) return `No puede superar los ${column.maxLength} caracteres`
      if (column.pattern) {
        const regex = column.pattern instanceof RegExp ? column.pattern : new RegExp(column.pattern)
        if (!regex.test(str)) return 'No cumple el formato esperado'
      }
      break
    }
  }

  if (column.enum && !column.enum.some((opt) => String(opt) === String(value).trim())) {
    return `Debe ser uno de: ${column.enum.join(', ')}`
  }

  const custom = column.validate?.(coerced, row)
  if (typeof custom === 'string') return custom
  if (custom === false) return 'Valor inválido'

  return null
}

export interface BuildRowsOptions {
  hasHeader: boolean
  strict: boolean
  sheet?: string | number
  delimiter?: string
}

export async function parseFile(
  file: File,
  columns: CellColumn[],
  options: BuildRowsOptions = { hasHeader: true, strict: false },
): Promise<CellParseResult> {
  const grid = await readGrid(file, { delimiter: options.delimiter, sheet: options.sheet })
  const warnings: string[] = []
  let headers: string[] = []

  let dataStart = 0
  if (options.hasHeader && grid.length > 0) {
    headers = grid[0]
    dataStart = 1
  }

  const columnIndexes: Record<string, number> = {}
  if (options.hasHeader) {
    columns.forEach((col, i) => {
      if (options.strict) {
        if (i < headers.length && normalizeHeader(headers[i]) === normalizeHeader(col.label)) {
          columnIndexes[col.key] = i
        } else {
          warnings.push(`Columna "${col.label}" esperada en posición ${i + 1} pero no está ahí`)
        }
      } else {
        const idx = findColumnIndex(headers, col.label)
        if (idx >= 0) columnIndexes[col.key] = idx
      }
    })
  } else {
    columns.forEach((col, i) => {
      columnIndexes[col.key] = i
    })
  }

  const rows: Record<string, unknown>[] = []
  for (let r = dataStart; r < grid.length; r++) {
    const raw = grid[r]
    if (raw.every((cell) => cell === '' || cell === null || cell === undefined)) continue
    const row: Record<string, unknown> = {}
    for (const col of columns) {
      const idx = columnIndexes[col.key]
      if (idx === undefined) continue
      const value = idx < raw.length ? raw[idx] : ''
      row[col.key] = coerce(col.type ?? 'string', value)
    }
    rows.push(row)
  }

  return { rows, headers, warnings }
}

export function validateRows(rows: Record<string, unknown>[], columns: CellColumn[]): CellError[] {
  const errors: CellError[] = []
  const seen: Record<string, Set<string>> = {}

  rows.forEach((row, rowIndex) => {
    for (const col of columns) {
      const value = row[col.key]
      const message = validateValue(col, value, row)
      if (message) {
        errors.push({ row: rowIndex, columnKey: col.key, columnLabel: col.label, message })
      }
      if (col.unique && value !== '' && value !== null && value !== undefined) {
        const set = seen[col.key] ?? (seen[col.key] = new Set<string>())
        const key = String(value)
        if (set.has(key)) {
          errors.push({ row: rowIndex, columnKey: col.key, columnLabel: col.label, message: `Valor duplicado ("${key}")` })
        }
        set.add(key)
      }
    }
  })

  return errors
}

export function buildTemplateCSV(columns: CellColumn[]): string {
  const escaped = columns.map((c) => {
    const v = c.label
    return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v
  })
  return escaped.join(',') + '\n'
}

export async function downloadTemplate(columns: CellColumn[], options: { type?: 'xlsx' | 'csv'; filename?: string } = {}): Promise<void> {
  const type = options.type ?? 'csv'
  const filename = options.filename ?? 'template'
  const header = columns.map((c) => c.label)

  if (type === 'csv') {
    const content = buildTemplateCSV(columns)
    const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8' })
    triggerDownload(blob, `${filename}.csv`)
    return
  }

  const ws = XLSX.utils.aoa_to_sheet([header])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Template')
  const buf = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
  triggerDownload(new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), `${filename}.xlsx`)
}

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}