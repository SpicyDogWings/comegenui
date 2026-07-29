<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const playgroundRoutes = router.getRoutes()
  .find(r => r.path === '/playground')
  ?.children
  .map(r => ({
    label: r.name?.toString().replace(' playground', '') || r.path,
    path: `/playground/${r.path}`,
  })) || []
</script>

<template>
  <nav class="cu-navbar">
    <router-link
      v-for="item in playgroundRoutes"
      :key="item.path"
      :to="item.path"
      class="cu-navbar-link"
      :class="{ 'is-active': route.path === item.path }"
    >
      {{ item.label }}
    </router-link>
  </nav>
</template>

<style scoped>
.cu-navbar {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.cu-navbar-link {
  padding: 0.5rem 0.75rem;
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
