<script setup lang="ts">
import { computed, ref, defineModel, type PropType } from "vue";

interface TabItem {
  key: string;
  label: string;
  disabled?: boolean;
}

const props = defineProps({
  tabs: {
    type: Array as PropType<TabItem[]>,
    required: true,
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "primary",
  },
  variant: {
    type: String as PropType<'tabs' | 'pills' | 'boxed' | 'soft'>,
    required: false,
    default: "tabs",
    validator: (value: string) => ["tabs", "pills", "boxed", "soft"].includes(value),
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    required: false,
    default: "md",
    validator: (value: string) => ["sm", "md", "lg"].includes(value),
  },
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["change"]);
const active = defineModel<string>({ default: "" });

const activeKey = computed(() => {
  if (active.value && props.tabs.some((t) => t.key === active.value)) return active.value;
  return props.tabs.find((t) => !t.disabled)?.key ?? "";
});

const tabRefs = ref<Record<string, HTMLElement | null>>({});

const tabStyles = computed(() => ({
  '--tabs-color': `var(--cu-color-${props.color})`,
  '--tabs-soft': `var(--cu-color-${props.color}-soft)`,
  '--tabs-soft-hover': `var(--cu-color-${props.color}-soft-hover)`,
  '--tabs-soft-active': `var(--cu-color-${props.color}-soft-active)`,
  '--tabs-subtle-border': `var(--cu-color-${props.color}-subtle-border)`,
}));

const isTabDisabled = (tab: TabItem) => props.disabled || !!tab.disabled;

const select = (key: string) => {
  if (props.disabled) return;
  const tab = props.tabs.find((t) => t.key === key);
  if (!tab || tab.disabled) return;
  if (key === activeKey.value) return;
  active.value = key;
  emit("change", key);
};

function focusTab(key: string) {
  tabRefs.value[key]?.focus();
}

const move = (dir: -1 | 1) => {
  if (props.disabled || props.tabs.length === 0) return;
  const idx = props.tabs.findIndex((t) => t.key === activeKey.value);
  const length = props.tabs.length;
  for (let i = 1; i <= length; i++) {
    const nextIdx = (idx + dir * i + length) % length;
    const tab = props.tabs[nextIdx];
    if (tab && !tab.disabled) {
      select(tab.key);
      focusTab(tab.key);
      return;
    }
  }
};

function onKeydown(e: KeyboardEvent) {
  if (props.disabled) return;
  if (e.key === "ArrowRight") { e.preventDefault(); move(1); }
  else if (e.key === "ArrowLeft") { e.preventDefault(); move(-1); }
  else if (e.key === "Home") { e.preventDefault(); const first = props.tabs.find((t) => !t.disabled); if (first) { select(first.key); focusTab(first.key); } }
  else if (e.key === "End") { e.preventDefault(); const last = [...props.tabs].reverse().find((t) => !t.disabled); if (last) { select(last.key); focusTab(last.key); } }
}

function getActive() { return activeKey.value; }
function setActive(key: string) { select(key); }
function next() { move(1); }
function prev() { move(-1); }

defineExpose({ getActive, setActive, next, prev });
</script>

<template>
  <div
    class="cu-tabs"
    :class="[`cu-tabs--${props.variant}`, `cu-tabs--${props.size}`, { 'cu-tabs--disabled': props.disabled }]"
    :style="tabStyles"
  >
    <div class="cu-tabs-header" role="tablist" :aria-orientation="'horizontal'" @keydown="onKeydown">
      <button
        v-for="tab in props.tabs"
        :key="tab.key"
        :ref="(el) => { tabRefs[tab.key] = el as HTMLElement | null; }"
        type="button"
        class="cu-tabs-tab"
        :class="{ 'cu-tabs-tab--active': tab.key === activeKey }"
        role="tab"
        :aria-selected="tab.key === activeKey"
        :aria-controls="`cu-tabs-panel-${tab.key}`"
        :id="`cu-tabs-tab-${tab.key}`"
        :disabled="isTabDisabled(tab)"
        :tabindex="tab.key === activeKey ? 0 : -1"
        @click="select(tab.key)"
      >
        <slot :name="`tab-icon-${tab.key}`"></slot>
        {{ tab.label }}
      </button>
    </div>

    <div
      v-if="activeKey"
      :id="`cu-tabs-panel-${activeKey}`"
      class="cu-tabs-panel"
      role="tabpanel"
      :aria-labelledby="`cu-tabs-tab-${activeKey}`"
    >
      <slot :name="activeKey"></slot>
    </div>
  </div>
</template>

<style scoped>
.cu-tabs {
  box-sizing: border-box;
  font-family: var(--cu-font-sans);
}

.cu-tabs-header {
  display: flex;
  gap: var(--cu-space-2xs);
  box-sizing: border-box;
}

.cu-tabs-tab {
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral);
  transition: background-color 150ms ease, color 150ms ease, border-color 150ms ease;
  box-sizing: border-box;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-xs);
}

.cu-tabs-tab:hover:not(:disabled) {
  color: var(--tabs-color);
}

.cu-tabs-tab:focus-visible {
  outline: 2px solid var(--cu-border-color-focus);
  outline-offset: 2px;
}

.cu-tabs-tab:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Sizes */
.cu-tabs--sm .cu-tabs-tab {
  padding: var(--cu-space-xs) var(--cu-space-sm);
  font-size: var(--cu-font-size-xs);
}

.cu-tabs--md .cu-tabs-tab {
  padding: var(--cu-space-sm) var(--cu-space-md);
  font-size: var(--cu-font-size-sm);
}

.cu-tabs--lg .cu-tabs-tab {
  padding: var(--cu-space-md) var(--cu-space-lg);
  font-size: var(--cu-font-size-md);
}

/* Variant: tabs (underline) */
.cu-tabs--tabs .cu-tabs-header {
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.cu-tabs--tabs .cu-tabs-tab {
  border-bottom: 2px solid transparent;
  border-radius: var(--cu-radius-sm) var(--cu-radius-sm) 0 0;
  margin-bottom: calc(var(--cu-border-thin) * -1);
}

.cu-tabs--tabs .cu-tabs-tab--active {
  color: var(--tabs-color);
  border-bottom-color: var(--tabs-color);
}

/* Variant: pills */
.cu-tabs--pills .cu-tabs-tab {
  border-radius: var(--cu-radius-full);
}

.cu-tabs--pills .cu-tabs-tab:hover:not(:disabled) {
  background-color: var(--tabs-soft-hover);
}

.cu-tabs--pills .cu-tabs-tab.cu-tabs-tab--active {
  background-color: var(--tabs-color);
  color: var(--cu-color-surface);
}

.cu-tabs--pills .cu-tabs-tab.cu-tabs-tab--active:hover:not(:disabled) {
  background-color: var(--tabs-color);
  color: var(--cu-color-surface);
}

/* Variant: boxed */
.cu-tabs--boxed .cu-tabs-header {
  border: var(--cu-border-thin) solid var(--cu-border-color);
  border-radius: var(--cu-radius-md);
  background-color: var(--cu-color-surface);
  padding: var(--cu-space-2xs);
}

.cu-tabs--boxed .cu-tabs-tab {
  border-radius: var(--cu-radius-md);
}

.cu-tabs--boxed .cu-tabs-tab:hover:not(:disabled) {
  background-color: var(--tabs-soft-hover);
}

.cu-tabs--boxed .cu-tabs-tab.cu-tabs-tab--active {
  background-color: var(--tabs-color);
  color: var(--cu-color-surface);
}

.cu-tabs--boxed .cu-tabs-tab.cu-tabs-tab--active:hover:not(:disabled) {
  background-color: var(--tabs-color);
  color: var(--cu-color-surface);
}

/* Variant: soft (soft container box + solid active) */
.cu-tabs--soft .cu-tabs-header {
  border: none;
  border-radius: var(--cu-radius-md);
  background-color: var(--tabs-soft);
  padding: var(--cu-space-xs);
}

.cu-tabs--soft .cu-tabs-tab {
  border-radius: var(--cu-radius-md);
}

.cu-tabs--soft .cu-tabs-tab:hover:not(:disabled) {
  background-color: var(--tabs-soft-hover);
}

.cu-tabs--soft .cu-tabs-tab.cu-tabs-tab--active {
  background-color: var(--tabs-color);
  color: var(--cu-color-surface);
}

.cu-tabs--soft .cu-tabs-tab.cu-tabs-tab--active:hover:not(:disabled) {
  background-color: var(--tabs-color);
  color: var(--cu-color-surface);
}

.cu-tabs-panel {
  padding-top: var(--cu-space-md);
  font-size: var(--cu-font-size-md);
}

.cu-tabs--disabled {
  pointer-events: none;
  opacity: 0.7;
}
</style>
