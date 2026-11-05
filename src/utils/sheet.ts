import * as XLSX from 'xlsx'

export type SheetFormat = 'xlsx' | 'csv'

export const isSheetFormat = (value: unknown): value is SheetFormat =>
  value === 'xlsx' || value === 'csv'

export interface SheetColumn {
  key: string
  label: string
  type?: 'string' | 'integer' | 'number' | 'date' | 'boolean'
  format?: string
  width?: number
  exportable?: boolean
}

export interface SheetOptions {
  /** Nombre del archivo sin extensión. Default: `export-YYYY-MM-DD`. */
  filename?: string
  /** Formato de salida. Default: `xlsx`. */
  format?: SheetFormat
  /** Nombre de la hoja en XLSX. Default: `Datos`. */
  sheetName?: string
  /** Separador de CSV. Default: `,`. */
  delimiter?: string
  /** Opciones de escritura de SheetJS (se combinan con `bookType: 'xlsx'` y `type: 'array'`). */
  config?: XLSX.WritingOptions
  /** Celdas (filas × columnas) desde las que la exportación se considera pesada. Default: `10_000`. */
  heavyThreshold?: number
}

export interface SheetPayload {
  format: SheetFormat
  fileName: string
  rowCount: number
  columnCount: number
  cellCount: number
  heavy: boolean
}

/** Payload de `before-download`: el resumen del archivo + el cancelador sincrónico. */
export interface SheetBeforeDownloadPayload extends SheetPayload {
  cancel: () => void
}

export interface SheetRows {
  columns: SheetColumn[]
  rows: Record<string, unknown>[]
}

const DEFAULT_HEAVY_THRESHOLD = 10_000
const XLSX_MIME = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
const CSV_MIME = 'text/csv;charset=utf-8'

const pad2 = (value: number) => String(value).padStart(2, '0')

/** `export-2024-02-15`: el nombre por defecto de una exportación. */
export function defaultSheetFilename(date = new Date()): string {
  return `export-${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}`
}

/**
 * Columnas que participan (`exportable !== false`) y filas con **valores crudos**
 * (sin `cell`, badges ni botones), limitadas a las keys exportables.
 */
export function buildSheetRows(
  rows: readonly Record<string, unknown>[],
  columns: readonly SheetColumn[],
): SheetRows {
  const active = columns.filter((column) => column.exportable !== false)
  const keys = active.map((column) => column.key)
  return {
    columns: active,
    rows: rows.map((row) => {
      const exported: Record<string, unknown> = {}
      for (const key of keys) exported[key] = row[key]
      return exported
    }),
  }
}

function csvCell(value: unknown, delimiter: string): string {
  const text =
    value === null || value === undefined
      ? ''
      : value instanceof Date
        ? value.toISOString()
        : String(value)
  const needsQuotes =
    text.includes('"') ||
    text.includes('\n') ||
    text.includes('\r') ||
    text.includes(delimiter)
  return needsQuotes ? `"${text.replace(/"/g, '""')}"` : text
}

/** CSV con encabezado y una fila por registro. No incluye BOM (lo agrega la descarga). */
export function buildCSV(
  rows: readonly Record<string, unknown>[],
  columns: readonly SheetColumn[],
  delimiter = ',',
): string {
  const lines = [
    columns.map((column) => csvCell(column.label, delimiter)).join(delimiter),
    ...rows.map((row) =>
      columns.map((column) => csvCell(row[column.key], delimiter)).join(delimiter),
    ),
  ]
  return lines.join('\n') + '\n'
}

/**
 * Libro XLSX con encabezado, anchos (`!cols`), autofiltro (`!autofilter`) y
 * formatos numéricos por columna. Devuelve los bytes listos para descargar.
 */
export function buildXLSX(
  rows: readonly Record<string, unknown>[],
  columns: readonly SheetColumn[],
  options: Pick<SheetOptions, 'sheetName' | 'config'> = {},
): Uint8Array<ArrayBuffer> {
  const header = columns.map((column) => column.label)
  const body = rows.map((row) => columns.map((column) => row[column.key] ?? ''))
  const sheet = XLSX.utils.aoa_to_sheet([header, ...body])

  if (columns.length > 0) {
    sheet['!cols'] = columns.map((column) => ({
      wch: column.width ?? Math.max(8, column.label.length),
    }))
    sheet['!autofilter'] = {
      ref: XLSX.utils.encode_range({
        s: { r: 0, c: 0 },
        e: { r: rows.length, c: columns.length - 1 },
      }),
    }
    columns.forEach((column, columnIndex) => {
      if (!column.format) return
      for (let rowIndex = 1; rowIndex <= rows.length; rowIndex++) {
        const address = XLSX.utils.encode_cell({ r: rowIndex, c: columnIndex })
        const cell = sheet[address] as XLSX.CellObject | undefined
        if (cell) cell.z = column.format
      }
    })
  }

  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, sheet, options.sheetName ?? 'Datos')
  // SheetJS devuelve un `ArrayBuffer` con `type: 'array'`; se normaliza a bytes
  // para que el Blob y los tests vean siempre lo mismo.
  const buffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'array',
    ...options.config,
  }) as ArrayBuffer
  return new Uint8Array(buffer)
}

/** Descarga un Blob como archivo, sin depender de librerías externas. */
export function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}

function withExtension(filename: string, format: SheetFormat): string {
  return filename.toLowerCase().endsWith(`.${format}`) ? filename : `${filename}.${format}`
}

function prepareSheet(
  rows: readonly Record<string, unknown>[],
  columns: readonly SheetColumn[],
  options: SheetOptions,
): { payload: SheetPayload; columns: SheetColumn[]; rows: Record<string, unknown>[] } {
  const format = options.format ?? 'xlsx'
  const { columns: active, rows: data } = buildSheetRows(rows, columns)
  const rowCount = data.length
  const columnCount = active.length
  const cellCount = rowCount * columnCount
  const baseName = options.filename?.trim() || defaultSheetFilename()
  return {
    payload: {
      format,
      fileName: withExtension(baseName, format),
      rowCount,
      columnCount,
      cellCount,
      heavy: cellCount >= (options.heavyThreshold ?? DEFAULT_HEAVY_THRESHOLD),
    },
    columns: active,
    rows: data,
  }
}

/** Resumen del archivo que se generaría, sin construir bytes ni descargar. */
export function getSheetPayload(
  rows: readonly Record<string, unknown>[],
  columns: readonly SheetColumn[],
  options: SheetOptions = {},
): SheetPayload {
  return prepareSheet(rows, columns, options).payload
}

/**
 * Genera el archivo y dispara la descarga. Es la **única** implementación de
 * archivo del core: tabla, botón y `CellsImporter` la usan.
 *
 * `beforeDownload` corre sincrónicamente después del payload y antes de crear
 * el Blob. Si devuelve `false` (cancelación), no se descarga nada y el
 * resultado es `null`.
 */
export function downloadSheet(
  rows: readonly Record<string, unknown>[],
  columns: readonly SheetColumn[],
  options: SheetOptions = {},
  beforeDownload?: (payload: SheetPayload) => boolean | void,
): SheetPayload | null {
  const prepared = prepareSheet(rows, columns, options)
  if (beforeDownload?.(prepared.payload) === false) return null

  const blob =
    prepared.payload.format === 'csv'
      ? new Blob(['\uFEFF' + buildCSV(prepared.rows, prepared.columns, options.delimiter ?? ',')], {
          type: CSV_MIME,
        })
      : new Blob([buildXLSX(prepared.rows, prepared.columns, options)], { type: XLSX_MIME })

  triggerDownload(blob, prepared.payload.fileName)
  return prepared.payload
}
