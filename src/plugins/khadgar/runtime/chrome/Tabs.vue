<script setup lang="ts">
import { ref } from "vue";

export interface TabItem {
  key: string;
  label: string;
  keepAlive?: boolean;
}

const props = defineProps<{
  tabs: TabItem[];
  color?: string;
}>();

const active = ref(props.tabs[0]?.key ?? "");
</script>

<template>
  <div class="khadgar-tabs">
    <div class="khadgar-tabs__list" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        role="tab"
        class="khadgar-tabs__tab"
        :class="{ 'khadgar-tabs__tab--active': active === tab.key }"
        :aria-selected="active === tab.key"
        @click="active = tab.key"
      >
        {{ tab.label }}
      </button>
    </div>
    <div
      v-for="tab in tabs"
      v-show="active === tab.key"
      :key="tab.key"
      class="khadgar-tabs__panel"
      role="tabpanel"
    >
      <slot :name="tab.key" />
    </div>
  </div>
</template>

<style scoped>
.khadgar-tabs {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
}

.khadgar-tabs__list {
  display: flex;
  gap: var(--cu-space-xs);
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.khadgar-tabs__tab {
  border: none;
  background: none;
  cursor: pointer;
  font: inherit;
  color: var(--cu-color-neutral);
  opacity: 0.6;
  padding: var(--cu-space-xs) var(--cu-space-sm);
  border-bottom: var(--cu-border-medium) solid transparent;
}

.khadgar-tabs__tab--active {
  opacity: 1;
  border-bottom-color: var(--cu-color-neutral);
}

.khadgar-tabs__panel {
  min-width: 0;
}
</style>