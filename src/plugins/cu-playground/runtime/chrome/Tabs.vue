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
  <div class="cu-playground-tabs">
    <div class="cu-playground-tabs__list" role="tablist">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        type="button"
        role="tab"
        class="cu-playground-tabs__tab"
        :class="{ 'cu-playground-tabs__tab--active': active === tab.key }"
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
      class="cu-playground-tabs__panel"
      role="tabpanel"
    >
      <slot :name="tab.key" />
    </div>
  </div>
</template>

<style scoped>
.cu-playground-tabs {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-sm);
}

.cu-playground-tabs__list {
  display: flex;
  gap: var(--cu-space-xs);
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.cu-playground-tabs__tab {
  border: none;
  background: none;
  cursor: pointer;
  font: inherit;
  color: var(--cu-color-neutral);
  opacity: 0.6;
  padding: var(--cu-space-xs) var(--cu-space-sm);
  border-bottom: var(--cu-border-medium) solid transparent;
}

.cu-playground-tabs__tab--active {
  opacity: 1;
  border-bottom-color: var(--cu-color-neutral);
}

.cu-playground-tabs__panel {
  min-width: 0;
}
</style>