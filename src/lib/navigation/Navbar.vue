<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'
import Collapse from '../collapse/Collapse.vue'

const route = useRoute()
const router = useRouter()

function flattenRoutes(routes: any[], parentPath = ''): Array<{ label: string; path: string }> {
  return routes.flatMap(r => {
    const fullPath = `${parentPath}/${r.path}`
    if (r.children?.length) {
      return flattenRoutes(r.children, fullPath)
    }
    return [{
      label: r.name?.toString().replace(' playground', '') || r.path,
      path: fullPath,
    }]
  })
}

function groupByFolder(routes: Array<{ label: string; path: string }>) {
  const groups: Record<string, Array<{ label: string; path: string }>> = {}
  for (const item of routes) {
    const parts = item.path.replace('/playground/', '').split('/')
    const folder = parts.length > 1 ? parts[0] : ''
    if (!groups[folder]) groups[folder] = []
    groups[folder].push(item)
  }
  return groups
}

const playgroundRoutes = flattenRoutes(
  router.getRoutes().find(r => r.path === '/playground')?.children || [],
  '/playground'
)

const grouped = groupByFolder(playgroundRoutes)
</script>

<template>
  <nav class="cu-navbar">
    <template v-for="(items, folder) in grouped" :key="folder">
      <Collapse v-if="folder" :label="folder" :defaultOpen="true">
        <router-link
          v-for="item in items"
          :key="item.path"
          :to="item.path"
          class="cu-navbar-link"
          :class="{ 'is-active': route.path === item.path }"
        >
          {{ item.label }}
        </router-link>
      </Collapse>
      <template v-else>
        <router-link
          v-for="item in items"
          :key="item.path"
          :to="item.path"
          class="cu-navbar-link"
          :class="{ 'is-active': route.path === item.path }"
        >
          {{ item.label }}
        </router-link>
      </template>
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
