<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  code: { type: String, required: true },
  language: { type: String, default: '' },
  variant: { type: String, default: 'default' },
})

const codeBlockClasses = computed(() => [
  'cu-code-block',
  `cu-code-block--${props.variant}`,
])
</script>

<template>
  <div :class="codeBlockClasses">
    <pre class="cu-code-block-pre"><code class="cu-code-block-code">{{ code }}</code></pre>
    <div v-if="language" class="cu-code-block-lang">
      <span>{{ language }}</span>
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
  padding: var(--cu-space-md);
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
  bottom: 0;
  right: 0;
  padding: var(--cu-space-2xs) var(--cu-space-sm);
  border-top-left-radius: var(--cu-radius-sm);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-medium);
  opacity: 0.8;
}

/* default - white background, no visible border */
.cu-code-block--default {
  background-color: var(--cu-color-surface);
}

.cu-code-block--default .cu-code-block-lang {
  background-color: var(--cu-color-neutral-soft);
  color: var(--cu-color-neutral-text);
}

/* outlined - transparent with border */
.cu-code-block--outlined {
  background-color: transparent;
  border: var(--cu-border-thin) solid var(--cu-color-neutral-subtle-border);
}

.cu-code-block--outlined .cu-code-block-lang {
  background-color: var(--cu-color-neutral-soft);
  color: var(--cu-color-neutral-text);
}

/* solid - neutral background */
.cu-code-block--solid {
  background-color: var(--cu-color-neutral-soft);
  border: none;
}

.cu-code-block--solid .cu-code-block-lang {
  background-color: var(--cu-color-neutral);
  color: var(--cu-color-surface);
}
</style>
