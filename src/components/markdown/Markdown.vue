<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import DOMPurify from 'dompurify'
import { parseToBlocks, extractHeadingIds, type MarkdownBlock } from '@/markdown'
import Table from '../data/Table.vue'
import CodeBlock from './CodeBlock.vue'
import Blockquote from './Blockquote.vue'
import InlineRenderer from './InlineRenderer.vue'

const emit = defineEmits<{
  (e: 'parsed', headingIds: string[]): void
}>()

const blocks = ref<MarkdownBlock[]>([])
const slotEl = ref<HTMLElement | null>(null)
const headingIds = ref<string[]>([])

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

function sanitizeBlock(block: MarkdownBlock): MarkdownBlock {
  if (block.html && block.type === 'html') {
    block.html = DOMPurify.sanitize(block.html)
  }
  if (block.blockquote) {
    block.blockquote.html = DOMPurify.sanitize(block.blockquote.html)
  }
  if (block.table) {
    block.table.data = block.table.data.map(row => {
      const sanitized: Record<string, string> = {}
      for (const key in row) {
        sanitized[key] = DOMPurify.sanitize(row[key])
      }
      return sanitized
    })
  }
  return block
}

onMounted(() => {
  nextTick(() => {
    const el = slotEl.value
    if (!el) return
    const raw = dedent(el.textContent || '')
    const parsed = parseToBlocks(raw)
    blocks.value = parsed.map(sanitizeBlock)
    headingIds.value = extractHeadingIds(parsed)
    emit('parsed', headingIds.value)
    el.style.display = 'none'
  })
})

defineExpose({
  headingIds: () => headingIds.value
})
</script>

<template>
  <div class="cu-markdown">
    <div ref="slotEl" class="cu-md-slot"><slot /></div>
    <div class="cu-md-output">
      <template v-for="(block, i) in blocks" :key="i">
        <Table
          v-if="block.type === 'table' && block.table"
          :columns="block.table.columns"
          :data="block.table.data"
          :html-cells="true"
        />
        <CodeBlock
          v-else-if="block.type === 'code-block' && block.codeBlock"
          :code="block.codeBlock.code"
          :language="block.codeBlock.language"
          variant="solid"
        />
        <Blockquote
          v-else-if="block.type === 'blockquote' && block.blockquote"
          :html="block.blockquote.html"
        />
        <component
          v-else-if="block.type === 'inline'"
          :is="block.tag"
          :class="block.html"
        >
          <InlineRenderer :tokens="block.tokens || []" />
        </component>
        <component
          v-else-if="block.type === 'list'"
          :is="block.tag"
          :class="block.html"
        >
          <li
            v-for="(item, j) in block.listItems"
            :key="j"
            class="cu-md-list-item"
          >
            <InlineRenderer :tokens="item.tokens || []" />
          </li>
        </component>
        <div v-else-if="block.html" v-html="block.html"></div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.cu-markdown {
  font-family: var(--cu-font-sans);
  color: var(--cu-color-neutral-text);
  line-height: var(--cu-line-height-relaxed);
}

.cu-md-slot {
  white-space: pre-wrap;
}

.cu-markdown :deep(.cu-md-heading) {
  font-weight: var(--cu-font-weight-bold);
  color: var(--cu-color-neutral-text);
  margin-top: var(--cu-space-lg);
  margin-bottom: var(--cu-space-sm);
  line-height: var(--cu-line-height-tight);
}

.cu-markdown :deep(.cu-md-heading-1) { font-size: 2rem; }
.cu-markdown :deep(.cu-md-heading-2) { font-size: 1.75rem; }
.cu-markdown :deep(.cu-md-heading-3) { font-size: 1.625rem; }
.cu-markdown :deep(.cu-md-heading-4) { font-size: 1.5rem; }
.cu-markdown :deep(.cu-md-heading-5) { font-size: 1.375rem; }
.cu-markdown :deep(.cu-md-heading-6) { font-size: 1.25rem; }

.cu-markdown :deep(.cu-md-paragraph) {
  margin-bottom: var(--cu-space-md);
}

.cu-markdown :deep(.cu-md-strong) {
  font-weight: var(--cu-font-weight-bold);
}

.cu-markdown :deep(.cu-md-em) {
  font-style: italic;
}

.cu-markdown :deep(.cu-md-list) {
  margin-bottom: var(--cu-space-md);
  padding-left: var(--cu-space-xl);
}

.cu-markdown :deep(.cu-md-list--ordered) {
  list-style-type: decimal;
}

.cu-markdown :deep(.cu-md-list--unordered) {
  list-style-type: disc;
}

.cu-markdown :deep(.cu-md-list-item) {
  margin-bottom: var(--cu-space-xs);
}

.cu-markdown :deep(.cu-md-hr) {
  border: none;
  border-top: var(--cu-border-thin) solid var(--cu-color-neutral-subtle-border);
  margin: var(--cu-space-lg) 0;
}

.cu-markdown :deep(.cu-md-image) {
  max-width: 100%;
  height: auto;
  border-radius: var(--cu-radius-sm);
}

.cu-markdown :deep(.cu-md-del) {
  text-decoration: line-through;
  opacity: 0.7;
}
</style>
