<script setup lang="ts">
import type { OutlineItem } from "../outline";

defineProps<{
  items: OutlineItem[];
}>();
</script>

<template>
  <nav class="cu-playground-outline">
    <ul class="cu-playground-outline__list">
      <li v-for="item in items" :key="item.id">
        <a class="cu-playground-outline__link" :href="`#${item.id}`">{{ item.label }}</a>
        <ul v-if="item.children?.length" class="cu-playground-outline__list cu-playground-outline__list--nested">
          <li v-for="child in item.children" :key="child.id">
            <a class="cu-playground-outline__link" :href="`#${child.id}`">{{ child.label }}</a>
          </li>
        </ul>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.cu-playground-outline__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.cu-playground-outline__list--nested {
  margin-left: var(--cu-space-sm);
  padding-left: var(--cu-space-sm);
  border-left: var(--cu-border-thin) solid var(--cu-border-color);
}

.cu-playground-outline__link {
  display: block;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  opacity: 0.7;
  text-decoration: none;
}

.cu-playground-outline__link:hover {
  opacity: 1;
}
</style>