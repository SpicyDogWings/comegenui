<script setup lang="ts">
import { RouterLink } from "vue-router";
import type { NavItem } from "./types";

defineProps<{
  items: NavItem[];
  search?: boolean;
}>();
</script>

<template>
  <nav class="khadgar-nav">
    <div v-for="item in items" :key="item.label" class="khadgar-nav__group">
      <span class="khadgar-nav__group-label">{{ item.label }}</span>
      <ul class="khadgar-nav__list">
        <li v-for="leaf in item.children ?? []" :key="leaf.label">
          <RouterLink class="khadgar-nav__link" :to="leaf.path ?? '#'">
            {{ leaf.label }}
          </RouterLink>
        </li>
      </ul>
    </div>
  </nav>
</template>

<style scoped>
.khadgar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-lg);
}

.khadgar-nav__group-label {
  display: block;
  margin-bottom: var(--cu-space-xs);
  font-size: var(--cu-font-size-xs);
  font-weight: var(--cu-font-weight-semibold);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--cu-color-neutral);
  opacity: 0.5;
}

.khadgar-nav__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.khadgar-nav__link {
  display: block;
  padding: var(--cu-space-xs) var(--cu-space-sm);
  border-radius: var(--cu-radius-sm);
  color: var(--cu-color-neutral);
  text-decoration: none;
  font-size: var(--cu-font-size-sm);
}

.khadgar-nav__link:hover {
  background: var(--cu-color-neutral-ghost-hover);
}

.khadgar-nav__link.router-link-active {
  background: var(--cu-color-neutral-subtle);
  font-weight: var(--cu-font-weight-medium);
}
</style>