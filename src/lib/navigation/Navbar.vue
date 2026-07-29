<script setup lang="ts">
import { useRoute } from 'vue-router'
import Collapse from '../collapse/Collapse.vue'

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
        <router-link
          v-for="child in item.children"
          :key="child.path"
          :to="child.path"
          class="cu-navbar-link"
          :class="{ 'is-active': route.path === child.path }"
        >
          {{ child.label }}
        </router-link>
      </Collapse>
      <router-link
        v-else
        :to="item.path"
        class="cu-navbar-link"
        :class="{ 'is-active': route.path === item.path }"
      >
        {{ item.label }}
      </router-link>
    </template>
  </nav>
</template>

<style scoped>
.cu-navbar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 0.25rem;
}

.cu-navbar-link {
  padding: 0.375rem 0.75rem;
  border-radius: var(--cu-radius-md);
  text-decoration: none;
  color: var(--cu-color-neutral);
  font-size: var(--cu-font-size-sm);
  transition: background-color 0.15s;
}

.cu-navbar-link:hover {
  background-color: var(--cu-color-primary-subtle-hover);
}

.cu-navbar-link.is-active {
  background-color: var(--cu-color-primary-soft);
  font-weight: var(--cu-font-weight-medium);
}
</style>
