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
    const tag = src.match(/customElements\.define\(\s*['"]([^'"]+)['"]/)?.[1]
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
  const vues = await fg('src/components/{buttons,controls,data,form,information,markdown,navigation,overlay,theme}/*.vue', {
    cwd: ROOT,
    ignore: ['**/*.test.ts', '**/*.spec.ts'],
  })
  for (const v of vues) {
    const name = kebab(v.split('/').pop().replace(/\.vue$/, ''))
    if (out.has(name)) continue
    out.set(name, { tag: null, ce: null, vue: v })
  }
  return out
}

/* ── bloques generados ───────────────────────────────────────────────────── */

function ceBlocks({ ce, tag }) {
  const m = meta(ce)
  const attrs = m.props.length
    ? table(['Atributo', 'Tipo', 'Default', 'Descripción'],
        m.props.map((p) => [`\`${kebab(p.name)}\``, `\`${p.type}\``, `\`${defaultOf(p)}\``, p.description || '—']))
    : 'Ninguno.'
  const events = m.events.length
    ? table(['Evento', 'Payload (`e.detail`)', 'Descripción'],
        m.events.map((e) => [`\`${e.name}\``, `\`${cell(e.type.replace(/^\[|\]$/g, '').replace(/^[A-Za-z_$][\w$]*\s*:\s*/, ''))}\``, e.description || '—']))
    : 'Ninguno.'
  const slots = m.slots.length
    ? table(['Slot', 'Descripción'], m.slots.map((s) => [s.name === 'default' ? '`default`' : `\`${s.name}\``, s.description || '—']))
    : 'Ninguno.'
  const metodos = m.exposed.length
    ? table(['Método', 'Descripción'], m.exposed.map((x) => [`\`${x.name}\``, x.description || '—']))
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
        m.events.map((e) => [`\`${e.name}\``, `\`${cell(e.type.replace(/^\[|\]$/g, '').replace(/^[A-Za-z_$][\w$]*\s*:\s*/, ''))}\``, e.description || '—']))
    : 'Ninguno.'
  const slots = m.slots.length
    ? table(['Slot', 'Descripción'], m.slots.map((s) => [s.name === 'default' ? '`default`' : `\`${s.name}\``, s.description || '—']))
    : 'Ninguno.'
  const expose = m.exposed.length
    ? table(['Método', 'Descripción'], m.exposed.map((x) => [`\`${x.name}\``, x.description || '—']))
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
    inject(targets.skill, { ...ce, ...vue }) && drifted.push(targets.skill),
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
