<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/buttons/Button.vue'

export interface OutlineItem {
  label: string
  id: string
}

const props = withDefaults(defineProps<{
  items: OutlineItem[]
  color?: 'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'
  border?: boolean
}>(), {
  color: 'neutral',
  border: true,
})

const route = useRoute()

const activeId = computed(() => {
  const hash = route.hash.replace('#', '')
  if (hash && props.items.some(i => i.id === hash)) return hash
  return props.items[0]?.id ?? ''
})
</script>

<template>
  <nav class="cu-outline">
    <Button
      v-for="item in items"
      :key="item.id"
      :to="`#${item.id}`"
      :color="color"
      variant="ghost"
      class="cu-outline-btn"
      :class="{ 'is-active': activeId === item.id, 'cu-outline-btn--border': border }"
    >
      {{ item.label }}
    </Button>
  </nav>
</template>

<style scoped>
.cu-outline {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-2xs);
  padding: var(--cu-space-2xs);
}

.cu-outline-btn {
  justify-content: flex-start;
  text-align: left;
}

.cu-outline-btn--border {
  border-left: var(--cu-border-thin) solid var(--cu-border-color);
}

.cu-outline-btn.cu-outline-btn--border.is-active {
  border-left-color: var(--cu-color-primary);
}
</style>
