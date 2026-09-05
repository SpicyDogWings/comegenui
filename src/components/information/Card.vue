<script setup lang="ts">
import { computed, useSlots, type PropType, type VNode } from "vue";

const slots = useSlots();

function slotHasContent(name: string): boolean {
  const fn = slots[name];
  if (!fn) return false;
  return fn().some((vnode: VNode) => {
    if (typeof vnode.type === 'symbol') return false;
    if (vnode.type === 'comment') return false;
    if (vnode.type === 'text' && typeof vnode.children === 'string' && !vnode.children.trim()) return false;
    return true;
  });
}

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String,
    required: false,
    default: "ghost",
    validator: (value: string) =>
      ["ghost", "outlined", "soft", "subtle", "solid"].includes(value),
  },
  layout: {
    type: String as PropType<'vertical' | 'horizontal'>,
    required: false,
    default: "vertical",
    validator: (value: string) => ["vertical", "horizontal"].includes(value),
  },
  title: {
    type: String,
    required: false,
  },
  subtitle: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
});

const colorStyles = computed(() => ({
  '--card-bg': `var(--cu-color-${props.color})`,
  '--card-text': `var(--cu-color-${props.color}-text)`,
  '--card-soft-text': `var(--cu-color-${props.color}-soft-text)`,
  '--card-soft': `var(--cu-color-${props.color}-soft)`,
  '--card-subtle': `var(--cu-color-${props.color}-subtle)`,
  '--card-subtle-border': `var(--cu-color-${props.color}-subtle-border)`,
}));

const hasMedia = computed(() => slotHasContent('media'));
const hasHeader = computed(() => slotHasContent('header'));
const hasFooter = computed(() => slotHasContent('footer'));
</script>

<template>
  <article :class="['cu-card', `cu-card--${props.variant}`, `cu-card--${props.layout}`]" :style="colorStyles">
    <div v-if="props.image || hasMedia" class="cu-card-media">
      <slot v-if="hasMedia" name="media" />
      <img v-else-if="props.image" :src="props.image" alt="" class="cu-card-image" />
    </div>

    <div class="cu-card-body">
      <header v-if="props.title || props.subtitle || hasHeader" class="cu-card-header">
        <template v-if="hasHeader">
          <slot name="header" />
        </template>
        <template v-else>
          <h3 v-if="props.title" class="cu-card-title">{{ props.title }}</h3>
          <p v-if="props.subtitle" class="cu-card-subtitle">{{ props.subtitle }}</p>
        </template>
      </header>

      <div class="cu-card-content">
        <slot />
      </div>

      <footer v-if="hasFooter" class="cu-card-footer">
        <slot name="footer" />
      </footer>
    </div>
  </article>
</template>

<style scoped>
.cu-card {
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  border-radius: var(--cu-radius-lg);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--cu-color-surface);
  color: var(--cu-color-neutral);
  border: var(--cu-border-thin) solid transparent;
}

/* ghost */
.cu-card.cu-card--ghost {
  background-color: var(--cu-color-surface);
  color: var(--cu-color-neutral);
  border-color: var(--cu-border-color);
  box-shadow: var(--cu-shadow-md);
}

/* solid */
.cu-card.cu-card--solid {
  background-color: var(--card-bg);
  color: var(--cu-color-surface);
}
.cu-card.cu-card--solid .cu-card-title {
  color: var(--cu-color-surface);
}

/* soft */
.cu-card.cu-card--soft {
  background-color: var(--card-soft);
  color: var(--card-soft-text);
}

/* subtle */
.cu-card.cu-card--subtle {
  background-color: var(--card-subtle);
  color: var(--card-soft-text);
  border-color: var(--card-subtle-border);
}

/* outlined */
.cu-card.cu-card--outlined {
  background-color: transparent;
  color: var(--card-soft-text);
  border-color: var(--card-bg);
}

.cu-card-media {
  width: 100%;
  overflow: hidden;
}

.cu-card-image {
  display: block;
  width: 100%;
  height: auto;
  object-fit: cover;
}

/* horizontal: media al costado, contenido a la derecha */
.cu-card--horizontal {
  flex-direction: row;
}

.cu-card--horizontal .cu-card-media {
  flex: 0 0 40%;
  max-width: 40%;
}

.cu-card--horizontal .cu-card-image {
  height: 100%;
  min-height: 100%;
  object-fit: cover;
}

.cu-card--horizontal .cu-card-body {
  flex: 1;
}

.cu-card-body {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-md);
  padding: var(--cu-space-lg);
  box-sizing: border-box;
}

.cu-card-header {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-2xs);
}

.cu-card-title {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-bold);
  margin: 0;
  color: inherit;
}

.cu-card-subtitle {
  font-size: var(--cu-font-size-sm);
  opacity: 0.75;
  margin: 0;
  color: inherit;
}

.cu-card-content {
  color: inherit;
  line-height: var(--cu-line-height-relaxed);
}

.cu-card-footer {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
  padding-top: var(--cu-space-md);
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}
</style>
