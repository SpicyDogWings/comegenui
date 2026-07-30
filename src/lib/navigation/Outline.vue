<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/buttons/Button.vue'

export interface OutlineItem {
  label: string
  id: string
}

const props = defineProps<{
  title?: string
  items: OutlineItem[]
}>()

const route = useRoute()

const activeId = computed(() => {
  const hash = route.hash.replace('#', '')
  if (hash && props.items.some(i => i.id === hash)) return hash
  return props.items[0]?.id ?? ''
})
</script>

<template>
  <nav class="cu-outline">
    <h4 v-if="title" class="cu-outline-title">{{ title }}</h4>
    <div class="cu-outline-items">
      <Button
        v-for="item in items"
        :key="item.id"
        :to="`#${item.id}`"
        :color="activeId === item.id ? 'primary' : undefined"
        :variant="activeId === item.id ? 'soft' : undefined"
        class="cu-outline-btn"
      >
        {{ item.label }}
      </Button>
    </div>
  </nav>
</template>

<style scoped>
.cu-outline {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-2xs);
  padding: var(--cu-space-2xs);
}

.cu-outline-title {
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cu-color-neutral);
  padding: var(--cu-space-xs) var(--cu-space-sm);
  margin: 0;
}

.cu-outline-items {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-2xs);
  margin-top: var(--cu-space-xs);
}

.cu-outline-btn {
  justify-content: flex-start;
  text-align: left;
}
</style>
