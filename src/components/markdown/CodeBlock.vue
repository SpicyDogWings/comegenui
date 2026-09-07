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

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

const highlightedHtml = computed(() => {
  if (!highlightLanguage.value) return ''
  try {
    return hljs.highlight(escapeHtml(props.code), { language: highlightLanguage.value, ignoreIllegals: true }).value
  } catch {
    return ''
  }
})

const lines = computed(() => props.code.split('\n'))
const lineCount = computed(() => lines.value.length)
</script>

<template>
  <div :class="codeBlockClasses">
    <pre class="cu-code-block-pre"><code class="cu-code-block-code"><template v-if="lineNumbers"><span v-for="(line, i) in lines" :key="i" class="cu-code-block-line"><span class="cu-code-block-line-number">{{ i + 1 }}</span><span class="cu-code-block-line-content">{{ escapeHtml(line) }}</span></span></template><template v-else-if="highlightedHtml"><span class="cu-code-block-hl" v-html="highlightedHtml"></span></template><template v-else>{{ code }}</template></code></pre>
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

.cu-code-block-pre {
  padding: var(--cu-space-xl) var(--cu-space-2xl);
  overflow-x: auto;
  margin: 0;
}

.cu-code-block-code {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  line-height: var(--cu-line-height-relaxed);
  color: var(--cu-color-neutral-text);
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

.cu-code-block-line-number {
  display: inline-block;
  width: 2em;
  margin-right: var(--cu-space-md);
  text-align: right;
  color: var(--cu-color-neutral-text);
  opacity: 0.4;
  user-select: none;
  -webkit-user-select: none;
}

.cu-code-block-line-content {
  display: inline;
}

/* syntax highlighting */
.cu-code-block-hl {
  color: var(--cu-color-neutral-text);
}

.cu-code-block-code :deep(.hljs-keyword),
.cu-code-block-code :deep(.hljs-selector-tag),
.cu-code-block-code :deep(.hljs-literal) {
  color: var(--cu-color-primary);
}

.cu-code-block-code :deep(.hljs-string),
.cu-code-block-code :deep(.hljs-regexp),
.cu-code-block-code :deep(.hljs-addition) {
  color: var(--cu-color-success);
}

.cu-code-block-code :deep(.hljs-number),
.cu-code-block-code :deep(.hljs-symbol),
.cu-code-block-code :deep(.hljs-bullet) {
  color: var(--cu-color-warning);
}

.cu-code-block-code :deep(.hljs-tag),
.cu-code-block-code :deep(.hljs-name),
.cu-code-block-code :deep(.hljs-selector-class),
.cu-code-block-code :deep(.hljs-selector-id),
.cu-code-block-code :deep(.hljs-built_in),
.cu-code-block-code :deep(.hljs-type),
.cu-code-block-code :deep(.hljs-class),
.cu-code-block-code :deep(.hljs-title),
.cu-code-block-code :deep(.hljs-function),
.cu-code-block-code :deep(.hljs-section) {
  color: var(--cu-color-secondary);
}

.cu-code-block-code :deep(.hljs-attr),
.cu-code-block-code :deep(.hljs-attribute),
.cu-code-block-code :deep(.hljs-params) {
  color: var(--cu-color-danger);
}

.cu-code-block-code :deep(.hljs-comment),
.cu-code-block-code :deep(.hljs-quote) {
  opacity: 0.5;
  font-style: italic;
}

.cu-code-block-code :deep(.hljs-meta),
.cu-code-block-code :deep(.hljs-doctag) {
  color: var(--cu-color-neutral-text);
  opacity: 0.6;
}

.cu-code-block-code :deep(.hljs-subst),
.cu-code-block-code :deep(.hljs-property),
.cu-code-block-code :deep(.hljs-operator),
.cu-code-block-code :deep(.hljs-punctuation) {
  color: inherit;
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

/* solid - darker neutral */
.cu-code-block--solid {
  background-color: var(--cu-color-neutral);
  border: none;
}

.cu-code-block--solid .cu-code-block-code,
.cu-code-block--solid .cu-code-block-line-number,
.cu-code-block--solid .cu-code-block-line-content {
  color: var(--cu-color-surface);
}

.cu-code-block--solid :deep(.cu-badge) {
  background-color: rgba(255, 255, 255, 0.15);
  color: var(--cu-color-surface);
}
</style>
