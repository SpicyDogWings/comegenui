<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import Button from '@/components/buttons/Button.vue'

export interface OutlineItem {
  label: string
  id: string
}

const props = defineProps<{
  items: OutlineItem[]
  container?: string
}>()

const activeId = ref<string>('')

let observer: IntersectionObserver | null = null

onMounted(() => {
  const root = props.container ? document.querySelector(props.container) : null

  observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          activeId.value = entry.target.id
        }
      }
    },
    {
      root: root,
      rootMargin: '-20% 0px -60% 0px',
      threshold: 0,
    }
  )

  for (const item of props.items) {
    const el = document.getElementById(item.id)
    if (el) observer.observe(el)
  }
})

onUnmounted(() => {
  observer?.disconnect()
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
