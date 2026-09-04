<script setup lang="ts">
import { computed } from 'vue'
import hljs from 'highlight.js/lib/core'
import xml from 'highlight.js/lib/languages/xml'
import css from 'highlight.js/lib/languages/css'
import javascript from 'highlight.js/lib/languages/javascript'
import typescript from 'highlight.js/lib/languages/typescript'
import bash from 'highlight.js/lib/languages/bash'
import json from 'highlight.js/lib/languages/json'
import python from 'highlight.js/lib/languages/python'
import Badge from '../information/Badge.vue'
import CopyButton from '@/components/buttons/CopyButton.vue'

hljs.registerLanguage('xml', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('json', json)
hljs.registerLanguage('python', python)

const LANGUAGE_ALIASES: Record<string, string> = {
  html: 'xml',
  vue: 'xml',
  sfc: 'xml',
  js: 'javascript',
  ts: 'typescript',
  sh: 'bash',
  shell: 'bash',
  py: 'python',
}

const props = defineProps({
  code: { type: String, required: true },
  language: { type: String, default: '' },
  variant: { type: String, default: 'default' },
  lineNumbers: { type: Boolean, default: false },
})

const codeBlockClasses = computed(() => [
  'cu-code-block',
  `cu-code-block--${props.variant}`,
  { 'cu-code-block--line-numbers': props.lineNumbers },
])

const highlightLanguage = computed(() => {
  const lang = (props.language || '').toLowerCase().trim()
  const resolved = LANGUAGE_ALIASES[lang] ?? lang
  return resolved && hljs.getLanguage(resolved) ? resolved : ''
})

// highlight.js escapa el input; si algo falla, cae a texto plano
const highlightedHtml = computed(() => {
  if (!highlightLanguage.value) return ''
  try {
    return hljs.highlight(props.code, { language: highlightLanguage.value, ignoreIllegals: true }).value
  } catch {
    return ''
  }
})

const lines = computed(() => props.code.split('\n'))
const lineCount = computed(() => lines.value.length)
const gutterText = computed(() => lines.value.map((_, i) => i + 1).join('\n'))
</script>

<template>
  <div :class="codeBlockClasses">
    <CopyButton :text="code" :variant="variant === 'solid' ? 'solid' : 'soft'" class="cu-code-block-copy" />
    <pre class="cu-code-block-pre"><code :class="['cu-code-block-code', { 'cu-code-block-code--gutter': lineNumbers && highlightedHtml }]"><span v-if="lineNumbers" class="cu-code-block-gutter" aria-hidden="true">{{ gutterText }}</span><span v-if="lineNumbers && highlightedHtml" class="cu-code-block-hl" v-html="highlightedHtml"></span><template v-else-if="lineNumbers"><span v-for="(line, i) in lines" :key="i" class="cu-code-block-line"><span class="cu-code-block-line-number">{{ i + 1 }}</span><span class="cu-code-block-line-content">{{ line }}</span></span></template><span v-else-if="highlightedHtml" class="cu-code-block-hl" v-html="highlightedHtml"></span><template v-else>{{ code }}</template></code></pre>
    <div v-if="language" class="cu-code-block-lang">
      <Badge color="neutral" variant="soft">{{ language }}</Badge>
    </div>
  </div>
</template>

<style scoped>
.cu-code-block {
  position: relative;
  border-radius: var(--cu-radius-sm);
  margin-bottom: var(--cu-space-lg);
  overflow: hidden;
}

.cu-code-block-copy {
  position: absolute;
  top: var(--cu-space-sm);
  right: var(--cu-space-sm);
  z-index: 1;
}

.cu-code-block-pre {
  padding: var(--cu-space-xl) var(--cu-space-2xl);
  overflow-x: auto;
  margin: 0;
}

.cu-code-block-code {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  line-height: var(--cu-line-height-relaxed);
  color: var(--cb-text);
  white-space: pre;
}

.cu-code-block-lang {
  position: absolute;
  bottom: var(--cu-space-xs);
  right: var(--cu-space-xs);
}

/* line numbers */
.cu-code-block-line {
  display: block;
}

/* clase duplicada a propósito: (0,3,0) le gana al global del playground
   ".playground[data-v] span" (0,2,1), que fuerza color neutral en los spans */
.cu-code-block-line.cu-code-block-line {
  color: var(--cb-text);
}

.cu-code-block-line-number {
  display: inline-block;
  width: 2em;
  margin-right: var(--cu-space-md);
  text-align: right;
  opacity: 0.4;
  user-select: none;
  -webkit-user-select: none;
}

.cu-code-block-line-content {
  display: inline;
}

/* gutter de números (modo highlight): flex para alinear columnas arriba */
.cu-code-block-code--gutter {
  display: flex;
  align-items: flex-start;
}

.cu-code-block-code--gutter .cu-code-block-hl {
  flex: 1;
}

.cu-code-block-gutter.cu-code-block-gutter {
  display: inline-block;
  flex-shrink: 0;
  width: 2em;
  margin-right: var(--cu-space-md);
  text-align: right;
  color: var(--cb-text);
  opacity: 0.4;
  user-select: none;
  -webkit-user-select: none;
  white-space: pre;
}

/* default - solid neutral */
.cu-code-block--default {
  background-color: var(--cu-color-neutral-soft);
  border: none;
}

.cu-code-block--default .cu-code-block-lang {
  color: var(--cu-color-neutral-text);
}

/* outlined - transparent with border */
.cu-code-block--outlined {
  background-color: transparent;
  border: var(--cu-border-thin) solid var(--cu-color-neutral-subtle-border);
}

.cu-code-block--outlined .cu-code-block-lang {
  color: var(--cu-color-neutral-text);
}

/* solid - esquema de código (tokens dedicados, invierten con el tema) */
.cu-code-block--solid {
  background-color: var(--cu-code-bg);
  border: none;
}

.cu-code-block--solid :deep(.cu-badge) {
  background-color: var(--cu-code-faded);
  color: var(--cu-code-text);
}

/* syntax highlighting (highlight.js) — paleta sobre tokens del tema */
/* texto plano (sin clase hljs: identificadores, operadores, puntuación) */
.cu-code-block {
  --cb-text: var(--cu-color-neutral-text);
  --cb-hl-keyword: color-mix(in srgb, var(--cu-color-primary) 87%, var(--cu-color-neutral-text));
  --cb-hl-string: color-mix(in srgb, var(--cu-color-success) 87%, var(--cu-color-neutral-text));
  --cb-hl-number: color-mix(in srgb, var(--cu-color-warning) 89%, var(--cu-color-neutral-text));
  --cb-hl-tag: color-mix(in srgb, var(--cu-color-secondary) 87%, var(--cu-color-neutral-text));
  --cb-hl-attr: color-mix(in srgb, var(--cu-color-danger) 87%, var(--cu-color-neutral-text));
  --cb-hl-title: color-mix(in srgb, var(--cu-color-primary) 87%, var(--cu-color-neutral-text));
  --cb-hl-comment: color-mix(in srgb, var(--cu-color-neutral-text) 50%, transparent);
  --cb-hl-meta: color-mix(in srgb, var(--cu-color-neutral-text) 85%, transparent);
}

/* default (fondo soft neutral): un poco más de brillo */
.cu-code-block--default {
  --cb-hl-keyword: color-mix(in srgb, var(--cu-color-primary) 94%, var(--cu-color-neutral-text));
  --cb-hl-string: color-mix(in srgb, var(--cu-color-success) 94%, var(--cu-color-neutral-text));
  --cb-hl-number: color-mix(in srgb, var(--cu-color-warning) 96%, var(--cu-color-neutral-text));
  --cb-hl-tag: color-mix(in srgb, var(--cu-color-secondary) 94%, var(--cu-color-neutral-text));
  --cb-hl-attr: color-mix(in srgb, var(--cu-color-danger) 94%, var(--cu-color-neutral-text));
  --cb-hl-title: color-mix(in srgb, var(--cu-color-primary) 94%, var(--cu-color-neutral-text));
  --cb-hl-comment: color-mix(in srgb, var(--cu-color-neutral-text) 55%, transparent);
  --cb-hl-meta: color-mix(in srgb, var(--cu-color-neutral-text) 92%, transparent);
}

/* solid: acentos precalculados por token (--cu-color-*-code = mezcla hacia
   surface generada en cu-tokens), garantizan contraste sobre --cu-code-bg
   en los 3 temas. Este bloque va DESPUÉS del base: misma especificidad,
   gana el último en la cascada */
.cu-code-block--solid {
  --cb-text: var(--cu-code-text);
  --cb-hl-keyword: var(--cu-color-primary-code);
  --cb-hl-string: var(--cu-color-success-code);
  --cb-hl-number: var(--cu-color-warning-code);
  --cb-hl-tag: var(--cu-color-secondary-code);
  --cb-hl-attr: var(--cu-color-danger-code);
  --cb-hl-title: var(--cu-color-primary-code);
  --cb-hl-comment: var(--cu-code-faded);
  --cb-hl-meta: color-mix(in srgb, var(--cu-code-text) 70%, transparent);
}

/* clases duplicadas a propósito: (0,3,0) le gana al global del playground
   ".playground[data-v] span" (0,2,1), que fuerza color neutral en los spans */
.cu-code-block-hl.cu-code-block-hl {
  color: var(--cb-text);
}

.cu-code-block-code :deep(.hljs-keyword),
.cu-code-block-code :deep(.hljs-selector-tag),
.cu-code-block-code :deep(.hljs-literal) {
  color: var(--cb-hl-keyword);
}

.cu-code-block-code :deep(.hljs-string),
.cu-code-block-code :deep(.hljs-regexp),
.cu-code-block-code :deep(.hljs-addition) {
  color: var(--cb-hl-string);
}

.cu-code-block-code :deep(.hljs-number),
.cu-code-block-code :deep(.hljs-symbol),
.cu-code-block-code :deep(.hljs-bullet),
.cu-code-block-code :deep(.hljs-variable),
.cu-code-block-code :deep(.hljs-template-variable) {
  color: var(--cb-hl-number);
}

.cu-code-block-code :deep(.hljs-tag),
.cu-code-block-code :deep(.hljs-name),
.cu-code-block-code :deep(.hljs-selector-class),
.cu-code-block-code :deep(.hljs-selector-id),
.cu-code-block-code :deep(.hljs-built_in),
.cu-code-block-code :deep(.hljs-type),
.cu-code-block-code :deep(.hljs-class) {
  color: var(--cb-hl-tag);
}

.cu-code-block-code :deep(.hljs-attr),
.cu-code-block-code :deep(.hljs-attribute),
.cu-code-block-code :deep(.hljs-params) {
  color: var(--cb-hl-attr);
}

.cu-code-block-code :deep(.hljs-title),
.cu-code-block-code :deep(.hljs-function),
.cu-code-block-code :deep(.hljs-section) {
  color: var(--cb-hl-title);
  font-weight: var(--cu-font-weight-medium);
}

.cu-code-block-code :deep(.hljs-comment),
.cu-code-block-code :deep(.hljs-quote) {
  color: var(--cb-hl-comment);
  font-style: italic;
}

.cu-code-block-code :deep(.hljs-meta),
.cu-code-block-code :deep(.hljs-doctag) {
  color: var(--cb-hl-meta);
}

.cu-code-block-code :deep(.hljs-emphasis) {
  font-style: italic;
}

.cu-code-block-code :deep(.hljs-strong) {
  font-weight: var(--cu-font-weight-bold);
}

.cu-code-block-code :deep(.hljs-deletion) {
  color: var(--cb-hl-attr);
  text-decoration: line-through;
}
</style>
