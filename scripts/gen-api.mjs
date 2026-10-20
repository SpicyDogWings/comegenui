#!/usr/bin/env node
/**
 * Genera las tablas de API de la doc leyendo los SFC.
 *
 *   prosa  → a mano (cuándo usarlo, qué puede y qué no, ejemplos)
 *   API    → generada (atributos/props, eventos, slots, métodos/expose)
 *
 * Inyecta cada tabla entre sus marcadores:
 *
 *   <!-- @api:atributos -->   …generado…   <!-- /@api:atributos -->
 *   <!-- @api:eventos -->     <!-- /@api:eventos -->
 *   <!-- @api:slots -->       <!-- /@api:slots -->
 *   <!-- @api:metodos -->     <!-- /@api:metodos -->     (CE)
 *   <!-- @api:props -->       <!-- /@api:props -->       (Vue)
 *   <!-- @api:emits -->       <!-- /@api:emits -->
 *   <!-- @api:expose -->      <!-- /@api:expose -->
 *
 *   node scripts/gen-api.mjs            # escribe
 *   node scripts/gen-api.mjs --check    # no escribe: falla si hay drift (gate) y avisa de las
 *                                       # descripciones vacías contra scripts/docs-baseline.txt
 *   node scripts/gen-api.mjs --update   # regenera ese baseline (tope: no puede empeorar)
 *   node scripts/gen-api.mjs button     # limita a los componentes que matcheen
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import fg from 'fast-glob'
import { createChecker } from 'vue-component-meta'
import { exists, latestId, resolveInVersions, writeInLatest } from './doc-tree.mjs'

const ROOT = resolve(import.meta.dirname, '..')

// La doc es la fuente y está versionada: `docs/versiones/<id>/` (id = la `latest` del
// manifiesto), con **overlay**: se lee del árbol resuelto y se escribe en `latest`
// (ver scripts/doc-tree.mjs y docs/notes/13-doc-versionada.md).
const DOC_ID = latestId()
const DOC = `docs/versiones/${DOC_ID}`
/** Path relativo dentro de la versión (el resolutor trabaja sin el prefijo de versión). */
const rel = (p) => p.replace(new RegExp(`^docs/versiones/${DOC_ID}/`), '')
const CHECK = process.argv.includes('--check')
const UPDATE = process.argv.includes('--update')
const FILTER = process.argv.slice(2).filter((a) => !a.startsWith('--'))

const checker = createChecker(resolve(ROOT, 'tsconfig.app.json'))

const kebab = (s) => s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase()
const cell = (s) => String(s ?? '').replace(/\n+/g, ' ').replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim()
const row = (cols) => `| ${cols.map(cell).join(' | ')} |`
const table = (headers, rows) => [
  row(headers),
  row(headers.map(() => '------')),
  ...rows.map(row),
].join('\n')

/** Props que Vue agrega solo y no son API del componente. */
const SKIP_PROPS = new Set(['key', 'ref', 'ref_for', 'ref_key', 'class', 'style'])
const cleanType = (t) => String(t).replace(/ \| undefined$/, '')

function readSfc(file) {
  if (!file) return ''
  try { return readFileSync(resolve(ROOT, file), 'utf8') } catch { return '' }
}

/**
 * Eventos que el wrapper reenvía con `ceEmit('evento', …)`. Vue no los ve como
 * `defineEmits`, así que son la única fuente real de los `CustomEvent`s del host.
 */
function ceEmitNames(file) {
  const names = []
  for (const m of readSfc(file).matchAll(/ceEmit\(\s*['"]([^'"]+)['"]/g)) {
    if (!names.includes(m[1])) names.push(m[1])
  }
  return names
}

/** Trozo de objeto entre las llaves que siguen a `defineExpose(` (balanceado). */
function exposedBody(source) {
  const start = source.indexOf('defineExpose(')
  if (start === -1) return null
  const braceStart = source.indexOf('{', start)
  if (braceStart === -1) return null
  let depth = 0
  let quote = null
  for (let i = braceStart; i < source.length; i++) {
    const char = source[i]
    if (quote) {
      if (char === '\\') { i++; continue }
      if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') { quote = char; continue }
    if (char === '{') depth++
    else if (char === '}' && --depth === 0) return source.slice(braceStart + 1, i)
  }
  return null
}

/** Parte por comas de primer nivel, ignorando strings y anidamiento. */
function splitTopLevel(source) {
  const parts = []
  let depth = 0
  let current = ''
  let quote = null
  for (let i = 0; i < source.length; i++) {
    const char = source[i]
    if (quote) {
      current += char
      if (char === '\\') { current += source[++i] ?? ''; continue }
      if (char === quote) quote = null
      continue
    }
    if (char === '"' || char === "'" || char === '`') { quote = char; current += char; continue }
    if (char === '(' || char === '[' || char === '{') depth++
    else if (char === ')' || char === ']' || char === '}') depth--
    if (char === ',' && depth === 0) { parts.push(current); current = ''; continue }
    current += char
  }
  if (current.trim()) parts.push(current)
  return parts
}

/**
 * Claves de `defineExpose({ … })`, en orden. No se usa `m.exposed` solo porque
 * vue-component-meta pierde las que chocan con una prop (p. ej. `close` en Alert).
 */
function exposedKeys(file) {
  const body = exposedBody(readSfc(file))
  if (!body) return []
  const clean = body.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/[^\n]*/g, '')
  const keys = []
  for (const part of splitTopLevel(clean)) {
    const text = part.trim()
    if (!text) continue
    const colon = text.indexOf(':')
    const key = (colon === -1 ? text : text.slice(0, colon)).trim()
    if (/^[A-Za-z_$][\w$]*$/.test(key) && !keys.includes(key)) keys.push(key)
  }
  return keys
}

/** JSDoc inmediatamente anterior a la definición de `name` (function o comentario inline). */
function jsdocFor(file, name) {
  const source = readSfc(file)
  const esc = name.replace(/[$]/g, '\\$&')
  const comment = String.raw`/\*\*((?:(?!\*/)[\s\S])*)\*/`
  for (const re of [
    new RegExp(`${comment}\\s*(?:async\\s+)?function\\s+${esc}\\b`),
    new RegExp(`${comment}\\s*(?:const|let|var)\\s+${esc}\\s*=`),
    new RegExp(`${comment}\\s*${esc}\\s*[:,(}]`),
    // emits: miembro tipado `(e: 'name', …)` y forma array `'name',`
    new RegExp(`${comment}\\s*\\(\\s*e\\s*:\\s*['"]${esc}['"]`),
    new RegExp(`${comment}\\s*['"]${esc}['"]`),
  ]) {
    const m = re.exec(source)
    if (m) return m[1].split('\n').map((l) => l.replace(/^\s*\*?\s?/, '')).join(' ').trim()
  }
  return ''
}

/** Payload legible del `e.detail`; `any[]` (emits sin tipar) y los vacíos van como `—`. */
function payloadCell(type) {
  const raw = String(type ?? '').trim()
  if (!raw || raw === 'any' || raw === 'any[]' || raw === 'unknown') return '—'
  const tuple = /^\[([\s\S]*)\]$/.exec(raw)
  if (!tuple) return `\`${raw}\``
  const label = tuple[1].trim().replace(/^[A-Za-z_$][\w$]*\s*:\s*/, '')
  return label ? `\`${label}\`` : '—'
}

function meta(file) {
  const m = checker.getComponentMeta(resolve(ROOT, file))
  return {
    props: (m.props ?? [])
      .filter((p) => !SKIP_PROPS.has(p.name) && !kebab(p.name).startsWith('on-vue:'))
      .map((p) => ({ ...p, type: cleanType(p.type) })),
    events: (m.events ?? []).map((e) => ({ ...e, type: cleanType(e.type) })),
    slots: m.slots ?? [],
    exposed: m.exposed ?? [],
  }
}

/**
 * Eventos del componente Vue. El meta no llena la descripción de un emit ni con JSDoc, así
 * que se resuelve del SFC (mismo criterio que los métodos expuestos). Además, `vue-component-meta`
 * no expone los emits declarados en forma de array (`defineEmits(["change"])`), así que se
 * completan con un fallback sobre el SFC.
 */
function arrayEmitNames(file) {
  const names = []
  for (const m of readSfc(file).matchAll(/defineEmits\s*\(\s*\[([\s\S]*?)\]\s*\)/g)) {
    for (const s of m[1].matchAll(/['"]([^'"]+)['"]/g)) if (!names.includes(s[1])) names.push(s[1])
  }
  return names
}

function vueEvents(vue) {
  const events = meta(vue).events.map((e) => ({
    ...e,
    description: e.description || jsdocFor(vue, e.name),
  }))
  const seen = new Set(events.map((e) => e.name))
  for (const name of arrayEmitNames(vue)) {
    if (!seen.has(name)) events.push({ name, type: '', description: jsdocFor(vue, name) })
  }
  return events
}

function defaultOf(p) {
  const tag = p.tags?.find((t) => t.name === 'default' || t.name === 'defaultValue')
  const value = p.default ?? tag?.text
  return value === undefined || value === null || value === '' ? '—' : value
}

/* ── un componente: su SFC de custom element y su SFC de Vue ──────────────── */

async function collect() {
  const out = new Map() // nombre (kebab) → { tag, ce, vue }
  const entries = await fg('src/lib/**/*.ts', { cwd: ROOT, ignore: ['**/index.ts'] })

  for (const entry of entries) {
    const src = readFileSync(resolve(ROOT, entry), 'utf8')
    const tag = src.match(/(?:customElements\.define|defineComegenElement)\(\s*['"]([^'"]+)['"]/)?.[1]
    if (!tag) continue
    const sfc = (src.match(/from\s+['"]@\/(components\/[^'"]+\.ce\.vue)['"]/)?.[1]
      ?? src.match(/from\s+['"]@\/(components\/[^'"]+\.vue)['"]/)?.[1])
    if (!sfc) continue
    const vueName = sfc.split('/').pop().replace(/\.ce\.vue$|\.vue$/, '')
    out.set(kebab(vueName), {
      tag,
      ce: `src/${sfc}`,
      vue: `src/${sfc.replace('components/customElements/', 'components/').replace(/\.ce\.vue$/, '.vue')}`,
    })
  }

  // componentes sólo Vue (sin entry en src/lib)
  const vues = await fg([
    'src/components/{buttons,controls,data,form,information,markdown,navigation,overlay,theme}/*.vue',
    'src/components/*.vue',
    'src/components/controls/month-slider/*.vue',
  ], {
    cwd: ROOT,
    ignore: ['**/*.test.ts', '**/*.spec.ts'],
  })
  for (const v of vues) {
    const name = kebab(v.split('/').pop().replace(/\.vue$/, ''))
    if (out.has(name)) continue
    out.set(name, { tag: null, ce: null, vue: v })
  }
  // Orden determinista: el checker comparte estado entre componentes, asi que el
  // resultado del mismo componente depende de que se resolvio antes.
  return new Map([...out].sort(([a], [b]) => a.localeCompare(b)))
}

/* ── bloques generados ───────────────────────────────────────────────────── */

function ceBlocks({ ce, vue, tag }) {
  const m = meta(ce)
  const vueMeta = vue ? { events: vueEvents(vue), exposed: meta(vue).exposed } : { events: [], exposed: [] }
  const vueEventByName = new Map(vueMeta.events.map((e) => [e.name, e]))
  const vueExposedByName = new Map(vueMeta.exposed.map((x) => [x.name, x]))

  const attrs = m.props.length
    ? table(['Atributo', 'Tipo', 'Default', 'Descripción'],
        m.props.map((p) => [`\`${kebab(p.name)}\``, `\`${p.type}\``, `\`${defaultOf(p)}\``, p.description || '—']))
    : 'Ninguno.'

  const emitNames = ceEmitNames(ce)
  // Sin `ceEmit` (CE que es el `.vue` directo) los eventos salen del propio SFC del CE,
  // con la misma resolución de descripción que los del componente Vue.
  const eventList = emitNames.length
    ? emitNames.map((name) => ({ name, ...vueEventByName.get(name) }))
    : vueEvents(ce)
  const events = eventList.length
    ? table(['Evento', 'Payload (`e.detail`)', 'Descripción'],
        eventList.map((e) => [`\`${e.name}\``, payloadCell(e.type), e.description || '—']))
    : 'Ninguno.'

  const slots = m.slots.length
    ? table(['Slot', 'Descripción'], m.slots.map((s) => [s.name === 'default' ? '`default`' : `\`${s.name}\``, s.description || '—']))
    : 'Ninguno.'

  const metodosList = exposedKeys(ce).map((name) => ({
    name,
    description: jsdocFor(ce, name) || vueExposedByName.get(name)?.description,
  }))
  for (const x of m.exposed) if (!metodosList.some((e) => e.name === x.name)) metodosList.push(x)
  const metodos = metodosList.length
    ? table(['Método', 'Descripción'], metodosList.map((x) => [`\`${x.name}\``, x.description || '—']))
    : 'No expone métodos.'
  return { atributos: attrs, eventos: events, slots, metodos }
}

/**
 * `defineModel<T>({ default })` es una prop real pero `vue-component-meta` no la reporta
 * (no está en `defineProps`): la leemos del SFC para no perderla en la tabla.
 */
function defineModelOf(vue) {
  let source
  try {
    source = readFileSync(resolve(ROOT, vue), 'utf8')
  } catch {
    return null
  }
  const call = /defineModel(?:<([^>]*)>)?\(([^)]*)\)/.exec(source)
  if (!call) return null
  const args = call[2]
  // `defineModel('query')` → prop `query`; sin nombre → `modelValue`.
  const name = /(['"])([\w-]+)\1/.exec(args)?.[2] ?? 'modelValue'
  const def = /default:\s*([^,}]+)/.exec(args)
  return { name, type: (call[1] || 'any').trim(), default: def ? def[1].trim() : '—' }
}

function vueBlocks({ vue }) {
  const m = meta(vue)
  const model = defineModelOf(vue)
  const propRows = m.props.map((p) => [`\`${p.name}\``, `\`${p.type}\``, `\`${defaultOf(p)}\``, p.description || '—'])
  if (model && !m.props.some((p) => p.name === model.name)) {
    propRows.unshift([`\`${model.name}\``, `\`${model.type}\``, `\`${model.default}\``, '—'])
  }
  const props = propRows.length
    ? table(['Prop', 'Tipo', 'Default', 'Descripción'], propRows)
    : 'Ninguna.'
  const events = vueEvents(vue)
  const emits = events.length
    ? table(['Evento', 'Payload', 'Descripción'],
        events.map((e) => [`\`${e.name}\``, payloadCell(e.type), e.description || '—']))
    : 'Ninguno.'
  const slots = m.slots.length
    ? table(['Slot', 'Descripción'], m.slots.map((s) => [s.name === 'default' ? '`default`' : `\`${s.name}\``, s.description || '—']))
    : 'Ninguno.'
  const exposeList = exposedKeys(vue).map((name) => ({
    name,
    description: jsdocFor(vue, name) || m.exposed.find((x) => x.name === name)?.description,
  }))
  for (const x of m.exposed) if (!exposeList.some((e) => e.name === x.name)) exposeList.push(x)
  const expose = exposeList.length
    ? table(['Método', 'Descripción'], exposeList.map((x) => [`\`${x.name}\``, x.description || '—']))
    : 'No expone métodos.'
  return { props, emits, slots, expose }
}

/* ── inyección entre marcadores ──────────────────────────────────────────── */

/**
 * Inyecta los bloques entre sus marcadores `@api:*`.
 *
 * El destino se lee del árbol de doc versionada (overlay: puede vivir en una versión anterior
 * y lo que cambia se escribe en `latest`). Hay destinos que **no** viven en `docs/versiones/`
 * —las recetas de la skill, `skills/use-comegen/references/*.md`—: para esos se lee y escribe
 * directo del repo. Antes el resolutor devolvía `null` y el archivo se salteaba en silencio,
 * así que las recetas tenían marcadores que nunca se llenaban y el gate decía "todo al día".
 */
function inject(file, blocks) {
  if (!file) return false
  const relPath = rel(file)
  const inTree = resolveInVersions(relPath)
  const abs = resolve(ROOT, relPath)
  const source = inTree ?? (existsSync(abs) ? abs : null)
  if (!source) return false

  const text = readFileSync(source, 'utf-8')
  let next = text
  for (const [name, content] of Object.entries(blocks)) {
    const re = new RegExp(`(<!-- @api:${name} -->)([\\s\\S]*?)(<!-- /@api:${name} -->)`, 'g')
    if (!re.test(next)) continue
    next = next.replace(re, `$1\n${content}\n$3`)
  }
  // Un archivo que ya tiene marcadores pero al que le falta alguno (nombre mal escrito, o
  // bloque nuevo que nadie agregó) dejaría la tabla vieja para siempre.
  if (/<!--\s*@api:/.test(text)) {
    const faltantes = Object.keys(blocks).filter((n) => !text.includes(`<!-- @api:${n} -->`))
    if (faltantes.length) marcadoresRotos.set(relPath, faltantes)
  }
  if (next === text) return false
  if (!CHECK) {
    if (inTree) writeInLatest(relPath, next)
    else writeFileSync(abs, next)
  }
  return true
}

/**
 * La receta de la skill junta las dos APIs en un archivo: los slots del CE y los
 * de Vue necesitan marcadores distintos (`@api:slots` y `@api:slots-vue`).
 */
function skillBlocks(ce, vue) {
  if (!ce) return vue
  return {
    atributos: ce.atributos,
    eventos: ce.eventos,
    slots: ce.slots,
    metodos: ce.metodos,
    props: vue.props,
    emits: vue.emits,
    'slots-vue': vue.slots,
    expose: vue.expose,
  }
}

const components = await collect()
const drifted = new Set()
/** Archivos con marcadores a los que les falta alguno: `relPath → bloques faltantes`. */
const marcadoresRotos = new Map()
const emptyCounts = new Map() // kebab → descripciones vacías de su API Vue
let touched = 0

/** Filtro por CLI: nombre exacto si matchea un componente; si no, substring. */
const selected = (name) =>
  FILTER.length === 0 ||
  FILTER.some((f) => (components.has(f) ? name === f : name.includes(f)))

if (process.argv.includes('--print')) {
  for (const [name, comp] of components) {
    if (!selected(name)) continue
    console.log(`\n${'='.repeat(70)}\n${name}${comp.tag ? ` (<${comp.tag}>)` : ' (sólo Vue)'}\n${'='.repeat(70)}`)
    if (comp.ce) {
      console.log('\n#### CE · atributos\n', ceBlocks(comp).atributos)
      console.log('\n#### CE · eventos\n', ceBlocks(comp).eventos)
      console.log('\n#### CE · slots\n', ceBlocks(comp).slots)
      console.log('\n#### CE · métodos\n', ceBlocks(comp).metodos)
    }
    const v = vueBlocks(comp)
    console.log('\n#### Vue · props\n', v.props)
    console.log('\n#### Vue · emits\n', v.emits)
  }
  process.exit(0)
}

/**
 * Modo partials (`docs/partials/<kebab>/`): las dos fichas comparten las secciones de API
 * por `<!--@include-->`. Cada sección vive en un partial: `<base>.md` si la tabla del CE y la
 * de Vue son idénticas, o `<base>-vanilla.md` / `<base>-vue.md` si difieren. Ver la skill
 * `documenter`.
 */
const SECTION_FILES = [
  { base: 'props', ce: 'atributos', vue: 'props' },
  { base: 'eventos', ce: 'eventos', vue: 'emits' },
  { base: 'slots', ce: 'slots', vue: 'slots' },
  { base: 'metodos', ce: 'metodos', vue: 'expose' },
]

/** Cuerpo de la tabla sin la fila de encabezado («Atributo» vs «Prop» no cuenta). */
const tableBody = (text) => (text ?? '').split('\n').slice(1).join('\n')

function partialPlan(name, ce, vue) {
  const dir = `${DOC}/partials/${name}`
  const plan = new Map() // archivo → { marcador: contenido }
  const add = (file, marker, content) => {
    const blocks = plan.get(file) ?? {}
    blocks[marker] = content
    plan.set(file, blocks)
  }
  for (const { base, ce: ceName, vue: vueName } of SECTION_FILES) {
    const vueContent = vue[vueName]
    // Sólo Vue: no hay nada que compartir.
    if (!ce) {
      add(`${dir}/${base}.md`, vueName, vueContent)
      continue
    }
    const ceContent = ce[ceName]
    // Compartida si las **filas** coinciden; se guarda el bloque del CE.
    if (ceContent !== undefined && tableBody(ceContent) === tableBody(vueContent)) {
      add(`${dir}/${base}.md`, ceName, ceContent) // compartida
    } else {
      if (ceContent !== undefined) add(`${dir}/${base}-vanilla.md`, ceName, ceContent)
      add(`${dir}/${base}-vue.md`, vueName, vueContent)
    }
  }
  return plan
}

/**
 * Crea un partial que falta con sus marcadores vacíos (después `inject` lo llena). Sólo aplica
 * a `docs/partials/`: las fichas y las recetas nunca se crean solas.
 */
function ensureMarkers(file, blocks) {
  const skeleton = Object.keys(blocks)
    .map((marker) => `<!-- @api:${marker} -->\n<!-- /@api:${marker} -->`)
    .join('\n\n')
  writeFileSync(resolve(ROOT, file), `${skeleton}\n`)
}

/* ── descripciones vacías (deuda de JSDoc, visible y acotada) ─────────────── */

const BASELINE_FILE = 'scripts/docs-baseline.txt'

/**
 * Celdas de una fila `| a | b |`. Los `|` de un tipo llegan escapados (`\|`) y son contenido,
 * no separador (mismo criterio que `scripts/ficha-api.mjs`).
 */
function splitCells(line) {
  const inner = line.trim().replace(/^\||\|$/g, '')
  const cells = []
  let current = ''
  for (let i = 0; i < inner.length; i++) {
    const char = inner[i]
    if (char === '\\' && inner[i + 1] === '|') { current += '|'; i++ }
    else if (char === '|') { cells.push(current); current = '' }
    else current += char
  }
  cells.push(current)
  return cells.map((c) => c.trim())
}

/**
 * Celdas `—` de la columna «Descripción» de una tabla generada: la descripción sale del JSDoc
 * del SFC, así que una prop/emit/slot/método sin JSDoc deja la celda vacía (`—`).
 */
function emptyDescriptions(text) {
  const lines = String(text ?? '')
    .split('\n')
    .map((l) => l.trim())
    .filter((l) => l.startsWith('|') && !/^\|[\s\-:|]+\|$/.test(l))
  if (lines.length < 2) return 0
  const column = splitCells(lines[0]).indexOf('Descripción')
  if (column === -1) return 0
  return lines.slice(1).filter((l) => splitCells(l)[column] === '—').length
}

/** Descripciones vacías de la **API Vue** de un componente (props/emits/slots/expose). */
const vueEmptyDescriptions = (vue) =>
  ['props', 'emits', 'slots', 'expose'].reduce((n, key) => n + emptyDescriptions(vue[key]), 0)

/** `nombre → celdas vacías`, tal como está en el baseline (vacío si todavía no existe). */
function readBaseline() {
  const counts = new Map()
  const file = resolve(ROOT, BASELINE_FILE)
  if (!existsSync(file)) return counts
  for (const line of readFileSync(file, 'utf8').split('\n')) {
    const m = /^([a-z0-9-]+)\t(\d+)$/.exec(line.trim())
    if (m && m[1] !== 'total') counts.set(m[1], Number(m[2]))
  }
  return counts
}

/** Reescribe el baseline: el tope contra el que se compara la próxima corrida. */
function writeBaseline(counts) {
  const rows = [...counts].sort(([a], [b]) => a.localeCompare(b)).map(([name, n]) => `${name}\t${n}`)
  const total = [...counts.values()].reduce((a, b) => a + b, 0)
  writeFileSync(
    resolve(ROOT, BASELINE_FILE),
    [
      '# scripts/docs-baseline.txt — descripciones vacías de la doc.',
      '# Celdas «—» de la columna «Descripción» de la API Vue (props/emits/slots/expose) de cada',
      '# ficha: el JSDoc del SFC es la fuente y todavía no está. Es deuda visible, no un error:',
      '# `node scripts/gen-api.mjs --check` la reporta y avisa si sube por encima de este tope.',
      '# Regenerar a propósito (después de documentar): node scripts/gen-api.mjs --update',
      '# o ./scripts/guard.sh --update.',
      '',
      ...rows,
      `total\t${total}`,
      '',
    ].join('\n'),
  )
  return total
}

/* ── fin descripciones vacías ─────────────────────────────────────────────── */

if (process.argv.includes('--plan')) {
  // Se computan TODOS los componentes (en el mismo orden que la corrida completa) para que el
  // estado del checker —y por lo tanto la decisión shared/split— coincida con ella; sólo se
  // imprime lo seleccionado.
  for (const [name, comp] of components) {
    let plan
    try {
      const ce = comp.ce ? ceBlocks(comp) : null
      const vue = vueBlocks(comp)
      plan = partialPlan(name, ce, vue)
    } catch (e) {
      console.warn(`gen-api: salteo ${name} — ${String(e.message).split('\n')[0]}`)
      continue
    }
    if (!selected(name)) continue
    console.log(`${name}${comp.tag ? ` (<${comp.tag}>)` : ' (sólo Vue)'}`)
    for (const [file, blocks] of plan) {
      console.log(`  ${file}  [${Object.keys(blocks).join(', ')}]`)
    }
  }
  process.exit(0)
}

for (const [name, comp] of components) {
  if (!selected(name)) continue
  const targets = {
    ce: `${DOC}/componentes/${comp.tag}.md`,
    vue: `${DOC}/componentes/vue/${name}.md`,
    skill: `skills/use-comegen/references/${name}.md`,
  }
  let ce = null
  let vue = null
  try {
    ce = comp.ce ? ceBlocks(comp) : null
    vue = vueBlocks(comp)
  } catch (e) {
    console.warn(`gen-api: salteo ${name} — ${String(e.message).split('\n')[0]}`)
    continue
  }
  emptyCounts.set(name, vueEmptyDescriptions(vue))

  const changes = new Set()
  if (exists(`partials/${name}`)) {
    // Fichas compuestas por partials.
    for (const [file, blocks] of partialPlan(name, ce, vue)) {
      const missing = !existsSync(resolve(ROOT, file))
      if (missing && !CHECK) ensureMarkers(file, blocks)
      if (inject(file, blocks) || (missing && CHECK)) changes.add(file)
    }
  } else {
    if (comp.ce && inject(targets.ce, ce)) changes.add(targets.ce)
    if (inject(targets.vue, vue)) changes.add(targets.vue)
  }
  if (inject(targets.skill, skillBlocks(ce, vue))) changes.add(targets.skill)
  for (const file of changes) drifted.add(file)
  touched += changes.size
}

if (marcadoresRotos.size) {
  const detalle = [...marcadoresRotos].map(([f, faltan]) => `  - ${f} (falta ${faltan.join(', ')})`).join('\n')
  if (CHECK) {
    console.error(`gen-api: ${marcadoresRotos.size} archivo(s) con marcadores @api incompletos:`)
    console.error(detalle)
    console.error('Agregá el marcador que falta (o corregí el nombre): el bloque no se inyecta.')
    process.exit(1)
  }
  console.warn(`⚠ gen-api: marcadores @api incompletos (ese bloque no se inyecta):\n${detalle}`)
}

if (CHECK && touched) {
  console.error(`gen-api: ${touched} archivo(s) desactualizado(s):`)
  for (const f of drifted) console.error(`  - ${f}`)
  console.error('Corré `node scripts/gen-api.mjs` y commiteá el resultado.')
  process.exit(1)
}

// El conteo sólo es comparable con el baseline si se procesaron todos los componentes.
if (FILTER.length === 0) {
  const total = [...emptyCounts.values()].reduce((a, b) => a + b, 0)
  if (UPDATE) {
    writeBaseline(emptyCounts)
    console.log(`gen-api: baseline actualizado — ${total} descripción(es) vacía(s) en ${emptyCounts.size} componente(s) (${BASELINE_FILE})`)
  } else {
    const baseline = readBaseline()
    const base = [...baseline.values()].reduce((a, b) => a + b, 0)
    const worse = [...emptyCounts].filter(([name, n]) => n > (baseline.get(name) ?? 0))
    if (!baseline.size) {
      console.warn(`gen-api: sin baseline de descripciones vacías (${BASELINE_FILE}) — generá uno con --update.`)
    } else if (worse.length) {
      console.warn(`⚠ gen-api: ${worse.length} componente(s) con más descripciones vacías que el baseline:`)
      for (const [name, n] of worse.slice(0, 12)) {
        console.warn(`  - ${name}: ${n} (baseline ${baseline.get(name) ?? 0})`)
      }
      console.warn('  Sumá el JSDoc que falta en el SFC, o corré `node scripts/gen-api.mjs --update` si fue a propósito.')
    }
    console.log(`gen-api: descripciones vacías: ${total} (baseline ${base})`)
  }
}
console.log(`gen-api: ${touched ? `${touched} archivo(s) ${CHECK ? 'desactualizados' : 'actualizados'}` : 'todo al día'} (${components.size} componentes)`)
