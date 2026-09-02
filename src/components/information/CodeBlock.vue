<script setup lang="ts">
defineProps({
  code: { type: String, required: true },
  language: { type: String, default: '' },
})
</script>

<template>
  <div class="cu-code-block">
    <pre class="cu-code-block-pre"><code class="cu-code-block-code">{{ code }}</code></pre>
    <div v-if="language" class="cu-code-block-lang">
      <span>{{ language }}</span>
    </div>
  </div>
</template>

<style scoped>
.cu-code-block {
  position: relative;
  background-color: var(--cu-color-neutral-soft);
  border-radius: var(--cu-radius-sm);
  margin-bottom: var(--cu-space-md);
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
  background-color: var(--cu-color-neutral-subtle);
  border-top-left-radius: var(--cu-radius-sm);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral-text);
  opacity: 0.7;
}
</style>
