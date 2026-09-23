<script setup lang="ts">
import type { OutlineItem } from "../outline";

defineProps<{
  items: OutlineItem[];
}>();
</script>

<template>
  <nav class="khadgar-outline">
    <ul class="khadgar-outline__list">
      <li v-for="item in items" :key="item.id">
        <a class="khadgar-outline__link" :href="`#${item.id}`">{{ item.label }}</a>
        <ul v-if="item.children?.length" class="khadgar-outline__list khadgar-outline__list--nested">
          <li v-for="child in item.children" :key="child.id">
            <a class="khadgar-outline__link" :href="`#${child.id}`">{{ child.label }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.khadgar-outline__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.khadgar-outline__list--nested {
  margin-left: var(--cu-space-sm);
  padding-left: var(--cu-space-sm);
  border-left: var(--cu-border-thin) solid var(--cu-border-color);
}

.khadgar-outline__link {
  display: block;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  opacity: 0.7;
  text-decoration: none;
}

.khadgar-outline__link:hover {
  opacity: 1;
}
</style>