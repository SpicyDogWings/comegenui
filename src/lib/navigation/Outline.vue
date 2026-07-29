<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import Button from '@/components/buttons/Button.vue'

export interface OutlineItem {
  label: string
  id: string
}

const props = defineProps<{
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
    <Button
      v-for="item in items"
      :key="item.id"
      :to="`#${item.id}`"
      color="neutral"
      variant="ghost"
      class="cu-outline-btn"
      :class="{ 'is-active': activeId === item.id }"
    >
      {{ item.label }}
    </Button>
  </nav>
</template>

<style scoped>
.cu-outline {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.25rem;
}

.cu-outline-btn {
  justify-content: flex-start;
  text-align: left;
  border-left: 2px solid transparent;
}

.cu-outline-btn.is-active {
  border-left-color: var(--cu-color-primary);
}
</style>
