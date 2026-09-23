<script setup lang="ts">
import { computed } from "vue";
import { withBase } from "vitepress";

const props = defineProps<{
  slug: string;
  view: "vue" | "vanilla";
  hasVanilla: boolean;
}>();

const tabs = computed(() => {
  const items = [
    { key: "vue", label: "Vue", link: `/componentes/${props.slug}` },
  ];
  if (props.hasVanilla) {
    items.push({ key: "vanilla", label: "Vanilla", link: `/componentes/${props.slug}-vanilla` });
  }
  return items;
});
</script>

<template>
  <nav class="khadgar-views" aria-label="Vista">
    <a
      v-for="tab in tabs"
      :key="tab.key"
      :href="withBase(tab.link)"
      class="khadgar-views__tab"
      :class="{ 'is-active': tab.key === view }"
    >
      {{ tab.label }}
    </a>
  </nav>
</template>

<style scoped>
.khadgar-views {
  display: inline-flex;
  gap: 2px;
  margin-bottom: 1rem;
  padding: 2px;
  border: 1px solid var(--cu-border-color);
  border-radius: var(--cu-radius);
  background-color: var(--cu-color-neutral-soft);
}

.khadgar-views__tab {
  padding: 0.25rem 0.9rem;
  border-radius: calc(var(--cu-radius) - 2px);
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral);
  text-decoration: none;
  transition: background-color 150ms ease, color 150ms ease;
}

.khadgar-views__tab:hover {
  color: var(--cu-color-primary);
}

.khadgar-views__tab.is-active {
  background-color: var(--cu-color-surface);
  color: var(--cu-color-primary);
  box-shadow: var(--cu-shadow-sm);
}
</style>
