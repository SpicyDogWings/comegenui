<script setup lang="ts">
import { computed } from 'vue'
import Badge from './Badge.vue'

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

const lines = computed(() => props.code.split('\n'))
const lineCount = computed(() => lines.value.length)
</script>

<template>
  <div :class="codeBlockClasses">
    <pre class="cu-code-block-pre"><code class="cu-code-block-code"><template v-if="lineNumbers"><span v-for="(line, i) in lines" :key="i" class="cu-code-block-line"><span class="cu-code-block-line-number">{{ i + 1 }}</span><span class="cu-code-block-line-content">{{ line }}</span></span></template><template v-else>{{ code }}</template></code></pre>
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
