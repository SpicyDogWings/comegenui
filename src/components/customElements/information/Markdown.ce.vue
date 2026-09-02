<script setup lang="ts">
import { ref, onMounted, nextTick, useSlots } from 'vue'
import { parseMarkdown } from '@/markdown'
import { DEFAULTS, extractColors, extractShared } from '@/plugins/cu-tokens/defaults'
import { darken, toHex, lighten, transparentize } from 'color2k'

const slots = useSlots()
const markdownEl = ref<HTMLElement | null>(null)
const rendered = ref('')

function colorVar(name: string, value: string) {
  return `--cu-color-${name}: ${value};
    --cu-color-${name}-text: ${toHex(darken(value, 0.25))};
    --cu-color-${name}-hover: ${toHex(darken(value, 0.1))};
    --cu-color-${name}-active: ${toHex(lighten(value, 0.1))};
    --cu-color-${name}-ghost-hover: ${toHex(transparentize(value, 0.9))};
    --cu-color-${name}-ghost-active: ${toHex(transparentize(value, 0.8))};
    --cu-color-${name}-soft: ${toHex(transparentize(value, 0.85))};
    --cu-color-${name}-soft-hover: ${toHex(transparentize(value, 0.75))};
    --cu-color-${name}-soft-active: ${toHex(transparentize(value, 0.65))};
    --cu-color-${name}-subtle: ${toHex(transparentize(value, 0.9))};
    --cu-color-${name}-subtle-hover: ${toHex(transparentize(value, 0.8))};
    --cu-color-${name}-subtle-active: ${toHex(transparentize(value, 0.7))};
    --cu-color-${name}-subtle-border: ${transparentize(value, 0.5)};`
}

function colorsBlock(colors: any) {
  return `${colorVar('primary', colors.primary)}
    ${colorVar('secondary', colors.secondary)}
    ${colorVar('neutral', colors.neutral)}
    ${colorVar('success', colors.success)}
    ${colorVar('warning', colors.warning)}
    ${colorVar('danger', colors.danger)}
    --cu-color-surface: ${colors.surface};`
}

function sharedBlock(shared: any) {
  return `/* Typography */
    --cu-font-sans: ${shared.typography.fontFamily.sans};
    --cu-font-mono: ${shared.typography.fontFamily.mono};
    --cu-font-size-xs: ${shared.typography.fontSize.xs};
    --cu-font-size-sm: ${shared.typography.fontSize.sm};
    --cu-font-size-md: ${shared.typography.fontSize.md};
    --cu-font-size-lg: ${shared.typography.fontSize.lg};
    --cu-font-size-xl: ${shared.typography.fontSize.xl};
    --cu-font-size-2xl: ${shared.typography.fontSize['2xl']};
    --cu-font-weight-normal: ${shared.typography.fontWeight.normal};
    --cu-font-weight-medium: ${shared.typography.fontWeight.medium};
    --cu-font-weight-semibold: ${shared.typography.fontWeight.semibold};
    --cu-font-weight-bold: ${shared.typography.fontWeight.bold};
    --cu-line-height-tight: ${shared.typography.lineHeight.tight};
    --cu-line-height-normal: ${shared.typography.lineHeight.normal};
    --cu-line-height-relaxed: ${shared.typography.lineHeight.relaxed};

    /* Spacing */
    --cu-space-2xs: ${shared.spacing['2xs']};
    --cu-space-xs: ${shared.spacing.xs};
    --cu-space-sm: ${shared.spacing.sm};
    --cu-space-md: ${shared.spacing.md};
    --cu-space-lg: ${shared.spacing.lg};
    --cu-space-xl: ${shared.spacing.xl};
    --cu-space-2xl: ${shared.spacing['2xl']};
    --cu-space-3xl: ${shared.spacing['3xl']};

    /* Border Radius */
    --cu-radius: ${shared.borderRadius.default};
    --cu-radius-none: ${shared.borderRadius.none};
    --cu-radius-sm: ${shared.borderRadius.sm};
    --cu-radius-md: ${shared.borderRadius.md};
    --cu-radius-lg: ${shared.borderRadius.lg};
    --cu-radius-full: ${shared.borderRadius.full};

    /* Borders */
    --cu-border-none: ${shared.borders.width.none};
    --cu-border-thin: ${shared.borders.width.thin};
    --cu-border-medium: ${shared.borders.width.medium};
    --cu-border-thick: ${shared.borders.width.thick};
    --cu-border-color: ${shared.borders.color.default};`
}

function generateTokensCSS(): string {
  const colors = extractColors(DEFAULTS)
  const shared = extractShared(DEFAULTS)
  return `:host {\n${colorsBlock(colors)}\n${sharedBlock(shared)}\n}`
}

const markdownStyles = `
.cu-markdown {
  font-family: var(--cu-font-sans);
  color: var(--cu-color-neutral-text);
  line-height: var(--cu-line-height-relaxed);
}

.cu-md-slot {
  white-space: pre-wrap;
}

.cu-markdown .cu-md-heading {
  font-weight: var(--cu-font-weight-bold);
  color: var(--cu-color-neutral-text);
  margin-top: var(--cu-space-lg);
  margin-bottom: var(--cu-space-sm);
  line-height: var(--cu-line-height-tight);
}

.cu-markdown .cu-md-heading-1 { font-size: 2rem; }
.cu-markdown .cu-md-heading-2 { font-size: 1.75rem; }
.cu-markdown .cu-md-heading-3 { font-size: 1.625rem; }
.cu-markdown .cu-md-heading-4 { font-size: 1.5rem; }
.cu-markdown .cu-md-heading-5 { font-size: 1.375rem; }
.cu-markdown .cu-md-heading-6 { font-size: 1.25rem; }

.cu-markdown .cu-md-paragraph {
  margin-bottom: var(--cu-space-md);
}

.cu-markdown .cu-md-strong {
  font-weight: var(--cu-font-weight-bold);
}

.cu-markdown .cu-md-em {
  font-style: italic;
}

.cu-markdown .cu-md-blockquote {
  border-left: 4px solid var(--cu-color-primary);
  padding-left: var(--cu-space-md);
  margin-left: 0;
  margin-bottom: var(--cu-space-md);
  color: var(--cu-color-neutral-text);
  opacity: 0.85;
  font-style: italic;
}

.cu-markdown .cu-md-list {
  margin-bottom: var(--cu-space-md);
  padding-left: var(--cu-space-xl);
}

.cu-markdown .cu-md-list--ordered {
  list-style-type: decimal;
}

.cu-markdown .cu-md-list--unordered {
  list-style-type: disc;
}

.cu-markdown .cu-md-list-item {
  margin-bottom: var(--cu-space-xs);
}

.cu-markdown .cu-md-link {
  color: var(--cu-color-primary);
  text-decoration: underline;
  cursor: pointer;
}

.cu-markdown .cu-md-link:hover {
  color: var(--cu-color-primary-hover);
}

.cu-markdown .cu-md-code-block {
  background-color: var(--cu-color-neutral-soft);
  border-radius: var(--cu-radius-sm);
  padding: var(--cu-space-md);
  margin-bottom: var(--cu-space-md);
  overflow-x: auto;
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
}

.cu-markdown .cu-md-code-block code {
  background: none;
  padding: 0;
}

.cu-markdown .cu-md-code-inline {
  background-color: var(--cu-color-neutral-soft);
  padding: var(--cu-space-2xs) var(--cu-space-xs);
  border-radius: var(--cu-radius-sm);
  font-family: var(--cu-font-mono);
  font-size: 0.9em;
}

.cu-markdown .cu-md-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--cu-space-md);
}

.cu-markdown .cu-md-th {
  background-color: var(--cu-color-neutral-soft);
  padding: var(--cu-space-sm) var(--cu-space-md);
  text-align: left;
  font-weight: var(--cu-font-weight-semibold);
  border-bottom: 2px solid var(--cu-color-neutral-subtle-border);
}

.cu-markdown .cu-md-td {
  padding: var(--cu-space-sm) var(--cu-space-md);
  border-bottom: var(--cu-border-thin) solid rgba(0, 0, 0, 0.08);
}

.cu-markdown .cu-md-hr {
  border: none;
  border-top: var(--cu-border-thin) solid var(--cu-color-neutral-subtle-border);
  margin: var(--cu-space-lg) 0;
}

.cu-markdown .cu-md-image {
  max-width: 100%;
  height: auto;
  border-radius: var(--cu-radius-sm);
}

.cu-markdown .cu-md-del {
  text-decoration: line-through;
  opacity: 0.7;
}
`

function injectStyles() {
  const el = markdownEl.value
  if (!el) return

  const root = el.getRootNode() as ShadowRoot
  if (root && root.nodeType === Node.DOCUMENT_FRAGMENT_NODE) {
    const tokensStyle = document.createElement('style')
    tokensStyle.textContent = generateTokensCSS()
    root.appendChild(tokensStyle)

    const mdStyle = document.createElement('style')
    mdStyle.textContent = markdownStyles
    root.appendChild(mdStyle)
  }
}

function dedent(text: string): string {
  const lines = text.split('\n')
  while (lines.length && lines[0].trim() === '') lines.shift()
  while (lines.length && lines[lines.length - 1].trim() === '') lines.pop()

  let minIndent = Infinity
  for (const line of lines) {
    if (line.trim() === '') continue
    const match = line.match(/^(\s*)/)
    if (match) {
      minIndent = Math.min(minIndent, match[1].length)
    }
  }

  if (minIndent === Infinity) minIndent = 0
  return lines.map(line => line.slice(minIndent)).join('\n')
}

const slotEl = ref<HTMLElement | null>(null)

function extractSlotText(): string {
  const el = slotEl.value
  if (!el) return ''
  return dedent(el.textContent || '')
}

function render() {
  const raw = extractSlotText()
  rendered.value = raw ? parseMarkdown(raw) : ''
  if (slotEl.value) {
    slotEl.value.style.display = 'none'
  }
}

onMounted(() => {
  nextTick(() => {
    render()
    injectStyles()
  })
})
</script>

<template>
  <div ref="markdownEl" class="cu-markdown">
    <div ref="slotEl" class="cu-md-slot"><slot /></div>
    <div class="cu-md-output" v-html="rendered"></div>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
