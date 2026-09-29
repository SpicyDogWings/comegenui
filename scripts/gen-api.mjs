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
 *   node scripts/gen-api.mjs --check    # no escribe: falla si hay drift (gate)
 *   node scripts/gen-api.mjs button     # limita a los componentes que matcheen
 */
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import fg from 'fast-glob'
import { createChecker } from 'vue-component-meta'

const ROOT = resolve(import.meta.dirname, '..')
const CHECK = process.argv.includes('--check')
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
    new RegExp(`${comment}\\s*${esc}\\s*[:,(}]`),
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
  const vueMeta = vue ? meta(vue) : { events: [], exposed: [] }
  const vueEventByName = new Map(vueMeta.events.map((e) => [e.name, e]))
  const vueExposedByName = new Map(vueMeta.exposed.map((x) => [x.name, x]))

  const attrs = m.props.length
    ? table(['Atributo', 'Tipo', 'Default', 'Descripción'],
        m.props.map((p) => [`\`${kebab(p.name)}\``, `\`${p.type}\``, `\`${defaultOf(p)}\``, p.description || '—']))
    : 'Ninguno.'

  const emitNames = ceEmitNames(ce)
  const eventList = emitNames.length
    ? emitNames.map((name) => ({ name, ...vueEventByName.get(name) }))
    : m.events
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

function vueBlocks({ vue }) {
  const m = meta(vue)
  const props = m.props.length
    ? table(['Prop', 'Tipo', 'Default', 'Descripción'],
        m.props.map((p) => [`\`${p.name}\``, `\`${p.type}\``, `\`${defaultOf(p)}\``, p.description || '—']))
    : 'Ninguna.'
  const emits = m.events.length
    ? table(['Evento', 'Payload', 'Descripción'],
        m.events.map((e) => [`\`${e.name}\``, payloadCell(e.type), e.description || '—']))
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

function inject(file, blocks) {
  if (!file) return false
  let text
  try { text = readFileSync(resolve(ROOT, file), 'utf8') } catch { return false }
  let next = text
  for (const [name, content] of Object.entries(blocks)) {
    const re = new RegExp(`(<!-- @api:${name} -->)([\\s\\S]*?)(<!-- /@api:${name} -->)`, 'g')
    if (!re.test(next)) continue
    next = next.replace(re, `$1\n${content}\n$3`)
  }
  if (next === text) return false
  if (!CHECK) writeFileSync(resolve(ROOT, file), next)
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
const drifted = []
let touched = 0

if (process.argv.includes('--print')) {
  for (const [name, comp] of components) {
    if (FILTER.length && !FILTER.some((f) => name.includes(f))) continue
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

for (const [name, comp] of components) {
  if (FILTER.length && !FILTER.some((f) => name.includes(f))) continue
  const targets = {
    ce: `docs/componentes/${comp.tag}.md`,
    vue: `docs/componentes/vue/${name}.md`,
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

  const changed = [
    comp.ce && inject(targets.ce, ce) && drifted.push(targets.ce),
    inject(targets.vue, vue) && drifted.push(targets.vue),
    inject(targets.skill, skillBlocks(ce, vue)) && drifted.push(targets.skill),
  ].filter(Boolean).length
  touched += changed
}

if (CHECK && touched) {
  console.error(`gen-api: ${touched} archivo(s) desactualizado(s):`)
  for (const f of drifted) console.error(`  - ${f}`)
  console.error('Corré `node scripts/gen-api.mjs` y commiteá el resultado.')
  process.exit(1)
}
console.log(`gen-api: ${touched ? `${touched} archivo(s) ${CHECK ? 'desactualizados' : 'actualizados'}` : 'todo al día'} (${components.size} componentes)`)
