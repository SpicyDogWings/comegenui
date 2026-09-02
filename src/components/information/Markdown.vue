<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { useMarkdown } from '@/composables/useMarkdown'

const slotEl = ref<HTMLElement | null>(null)
const slotText = ref('')

const { rendered } = useMarkdown(slotText)

onMounted(() => {
  nextTick(() => {
    const el = slotEl.value
    if (!el) return
    slotText.value = el.textContent || ''
    el.style.display = 'none'
  })
})
</script>

<template>
  <div class="cu-markdown">
    <div ref="slotEl" class="cu-md-slot"><slot /></div>
    <div class="cu-md-output" v-html="rendered"></div>
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

.cu-markdown :deep(.cu-md-blockquote) {
  border-left: 4px solid var(--cu-color-primary);
  padding-left: var(--cu-space-md);
  margin-left: 0;
  margin-bottom: var(--cu-space-md);
  color: var(--cu-color-neutral-text);
  opacity: 0.85;
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

.cu-markdown :deep(.cu-md-link) {
  color: var(--cu-color-primary);
  text-decoration: underline;
  cursor: pointer;
}

.cu-markdown :deep(.cu-md-link:hover) {
  color: var(--cu-color-primary-hover);
}

.cu-markdown :deep(.cu-md-code-block) {
  background-color: var(--cu-color-neutral-soft);
  border-radius: var(--cu-radius-sm);
  padding: var(--cu-space-md);
  margin-bottom: var(--cu-space-md);
  overflow-x: auto;
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
}

.cu-markdown :deep(.cu-md-code-block code) {
  background: none;
  padding: 0;
}

.cu-markdown :deep(.cu-md-code-inline) {
  background-color: var(--cu-color-neutral-soft);
  padding: var(--cu-space-2xs) var(--cu-space-xs);
  border-radius: var(--cu-radius-sm);
  font-family: var(--cu-font-mono);
  font-size: 0.9em;
}

.cu-markdown :deep(.cu-md-table) {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: var(--cu-space-md);
}

.cu-markdown :deep(.cu-md-th) {
  background-color: var(--cu-color-neutral-soft);
  padding: var(--cu-space-sm) var(--cu-space-md);
  text-align: left;
  font-weight: var(--cu-font-weight-semibold);
  border-bottom: 2px solid var(--cu-color-neutral-subtle-border);
}

.cu-markdown :deep(.cu-md-td) {
  padding: var(--cu-space-sm) var(--cu-space-md);
  border-bottom: var(--cu-border-thin) solid rgba(0, 0, 0, 0.08);
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
