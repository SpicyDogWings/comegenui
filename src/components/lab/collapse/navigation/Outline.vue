<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
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

const rootRef = ref<HTMLElement | null>(null)
const activeId = ref('')
let scrollContainer: HTMLElement | null = null
let sections: HTMLElement[] = []

function findScrollableAncestor(el: HTMLElement | null): HTMLElement | null {
  let node = el?.parentElement ?? null
  while (node) {
    const style = getComputedStyle(node)
    if (/(auto|scroll)/.test(style.overflowY)) return node
    node = node.parentElement
  }
  return null
}

function collectSections() {
  sections = props.items
    .map(item => document.getElementById(item.id))
    .filter((el): el is HTMLElement => el !== null)
}

function updateActive() {
  if (!scrollContainer) return
  const containerTop = scrollContainer.getBoundingClientRect().top
  const threshold = containerTop + 80
  let current = props.items[0]?.id ?? ''
  for (const section of sections) {
    if (section.getBoundingClientRect().top <= threshold) {
      current = section.id
    }
  }
  activeId.value = current
}

const routeActiveId = computed(() => {
  const hash = route.hash.replace('#', '')
  return hash && props.items.some(i => i.id === hash) ? hash : ''
})

watch(routeActiveId, (hash) => {
  if (hash) activeId.value = hash
}, { immediate: true })

watch(() => props.items, () => {
  collectSections()
  updateActive()
})

onMounted(() => {
  scrollContainer = findScrollableAncestor(rootRef.value)
  collectSections()
  scrollContainer?.addEventListener('scroll', updateActive, { passive: true })
  updateActive()
})

onBeforeUnmount(() => {
  scrollContainer?.removeEventListener('scroll', updateActive)
  scrollContainer = null
  sections = []
})

function handleClick(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  activeId.value = id
}
</script>

<template>
  <nav ref="rootRef" class="cu-outline">
    <h4 v-if="title" class="cu-outline-title">{{ title }}</h4>
    <Button
      v-for="item in items"
      :key="item.id"
      :to="`#${item.id}`"
      :color="activeId === item.id ? 'primary' : undefined"
      :variant="activeId === item.id ? 'soft' : undefined"
      class="cu-outline-btn"
      @click="handleClick(item.id)"
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

.cu-outline-title {
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--cu-color-neutral);
  padding: var(--cu-space-xs) var(--cu-space-sm);
  margin: 0;
}

.cu-outline-btn {
  justify-content: flex-start;
  text-align: left;
}
</style>
