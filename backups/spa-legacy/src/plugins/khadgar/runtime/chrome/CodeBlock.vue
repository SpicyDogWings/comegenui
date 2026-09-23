<script setup lang="ts">
defineProps<{
  code: string;
  language?: string;
}>();
</script>

<template>
  <pre class="khadgar-code"><code :class="language ? `language-${language}` : undefined">{{ code }}</code></pre>
</template>

<style scoped>
.khadgar-code {
  margin: 0;
  padding: var(--cu-space-md);
  border-radius: var(--cu-radius);
  background: var(--cu-code-bg);
  color: var(--cu-code-text);
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  line-height: var(--cu-line-height-normal);
  overflow: auto;
  white-space: pre;
}
</style>