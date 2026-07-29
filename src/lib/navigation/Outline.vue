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
}>(), {
  color: 'neutral',
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
      :color="activeId === item.id ? 'primary' : color"
      :variant="activeId === item.id ? 'soft' : 'ghost'"
      class="cu-outline-btn"
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
</style>
