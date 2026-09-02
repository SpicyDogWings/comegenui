<script setup lang="ts">
defineProps({
  color: { type: String, default: 'primary' },
  html: { type: String, default: '' },
})
</script>

<template>
  <blockquote :class="['cu-blockquote', `cu-blockquote--${color}`]">
    <div v-if="html" v-html="html" class="cu-blockquote-content" />
    <slot v-else />
  </blockquote>
</template>

<style scoped>
.cu-blockquote {
  border-left: 4px solid var(--cu-color-primary);
  padding-left: var(--cu-space-md);
  margin-left: 0;
  margin-bottom: var(--cu-space-md);
  color: var(--cu-color-neutral-text);
  opacity: 0.85;
  font-style: italic;
}

.cu-blockquote--primary { border-left-color: var(--cu-color-primary); }
.cu-blockquote--secondary { border-left-color: var(--cu-color-secondary); }
.cu-blockquote--neutral { border-left-color: var(--cu-color-neutral); }
.cu-blockquote--success { border-left-color: var(--cu-color-success); }
.cu-blockquote--warning { border-left-color: var(--cu-color-warning); }
.cu-blockquote--danger { border-left-color: var(--cu-color-danger); }

.cu-blockquote-content {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
}

.cu-blockquote-content :deep(p) {
  margin: 0;
}
</style>
