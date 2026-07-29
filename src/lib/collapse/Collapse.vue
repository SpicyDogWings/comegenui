<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
  label: string
  defaultOpen?: boolean
}>()

const isOpen = ref(props.defaultOpen ?? false)
</script>

<template>
  <div class="cu-collapse">
    <button class="cu-collapse-trigger" @click="isOpen = !isOpen">
      <span class="cu-collapse-chevron" :class="{ 'is-open': isOpen }">›</span>
      {{ label }}
    </button>
    <div v-show="isOpen" class="cu-collapse-content">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cu-collapse {
  display: flex;
  flex-direction: column;
}

.cu-collapse-trigger {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: none;
  background: none;
  color: var(--cu-color-neutral);
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-semibold);
  cursor: pointer;
  text-align: left;
  border-radius: var(--cu-radius-md);
  transition: background-color 0.15s;
}

.cu-collapse-trigger:hover {
  background-color: var(--cu-color-primary-subtle-hover);
}

.cu-collapse-chevron {
  transition: transform 0.2s;
  font-size: 0.75rem;
}

.cu-collapse-chevron.is-open {
  transform: rotate(90deg);
}

.cu-collapse-content {
  display: flex;
  flex-direction: column;
  padding-left: 0.75rem;
}
</style>
