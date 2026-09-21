<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { NavItem } from "./types";

defineProps<{
  items: NavItem[];
  search?: boolean;
}>();
</script>

<template>
  <nav class="cu-playground-nav">
    <div v-for="item in items" :key="item.label" class="cu-playground-nav__group">
      <span class="cu-playground-nav__group-label">{{ item.label }}</span>
      <ul class="cu-playground-nav__list">
        <li v-for="leaf in item.children ?? []" :key="leaf.label">
          <RouterLink class="cu-playground-nav__link" :to="leaf.path ?? '#'">
            {{ leaf.label }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.cu-playground-nav {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-lg);
}

.cu-playground-nav__group-label {
  display: block;
  margin-bottom: var(--cu-space-xs);
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--cu-color-neutral);
  opacity: 0.5;
}

.cu-playground-nav__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.cu-playground-nav__link {
  display: block;
  padding: var(--cu-space-xs) var(--cu-space-sm);
  border-radius: var(--cu-radius-sm);
  color: var(--cu-color-neutral);
  text-decoration: none;
  font-size: var(--cu-font-size-sm);
}

.cu-playground-nav__link:hover {
  background: var(--cu-color-neutral-ghost-hover);
}

.cu-playground-nav__link.router-link-active {
  background: var(--cu-color-neutral-subtle);
  font-weight: var(--cu-font-weight-medium);
}
</style>