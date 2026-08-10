<script setup lang="ts">
import { useRoute } from 'vue-router'
import Collapse from '@/components/overlay/Collapse.vue'
import Button from '@/components/buttons/Button.vue'

export interface NavItem {
  label: string
  path?: string
  children?: NavItem[]
}

defineProps<{
  items: NavItem[]
}>()

const route = useRoute()
</script>

<template>
  <nav class="cu-navbar">
    <template v-for="item in items" :key="item.path || item.label">
      <Collapse v-if="item.children?.length" :label="item.label" :defaultOpen="true">
        <Navbar :items="item.children" />
      </Collapse>
      <Button
        v-else
        :to="item.path!"
        :color="route.path === item.path ? 'primary' : undefined"
        :variant="route.path === item.path ? 'soft' : undefined"
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
  padding: var(--cu-space-sm) var(--cu-space-md);
}

.cu-navbar :deep(.cu-collapse-content) {
  margin-top: var(--cu-space-xs);
}
</style>
