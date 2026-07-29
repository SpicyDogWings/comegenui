<script setup lang="ts">
import { useRoute } from 'vue-router'
import Collapse from '../collapse/Collapse.vue'
import Button from '@/components/buttons/Button.vue'

export interface NavItem {
  label: string
  path: string
  children?: NavItem[]
}

defineProps<{
  items: NavItem[]
}>()

const route = useRoute()
</script>

<template>
  <nav class="cu-navbar">
    <template v-for="item in items" :key="item.path">
      <Collapse v-if="item.children?.length" :label="item.label" :defaultOpen="true">
        <Button
          v-for="child in item.children"
          :key="child.path"
          :to="child.path"
          color="primary"
          :variant="route.path === child.path ? 'soft' : 'none'"
        >
          {{ child.label }}
        </Button>
      </Collapse>
      <Button
        v-else
        :to="item.path"
        color="primary"
        :variant="route.path === item.path ? 'soft' : 'none'"
      >
        {{ item.label }}
      </Button>
    </template>
  </nav>
</template>

<style scoped>
.cu-navbar {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-2xs);
  padding: var(--cu-space-2xs);
}

.cu-navbar :deep(.cu-button) {
  justify-content: flex-start;
  text-align: left;
  padding: var(--cu-space-xs) var(--cu-space-sm);
}
</style>
