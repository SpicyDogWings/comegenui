<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, type PropType } from "vue";
import { isCardLayout, isVariant } from '@/utils/validators'

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle'>,
    required: false,
    default: "ghost",
    validator: isVariant,
  },
  layout: {
    type: String as PropType<'vertical' | 'horizontal'>,
    required: false,
    default: "vertical",
    validator: isCardLayout,
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
  '--card-soft': `var(--cu-color-${props.color}-soft)`,
  '--card-subtle': `var(--cu-color-${props.color}-subtle)`,
  '--card-subtle-border': `var(--cu-color-${props.color}-subtle-border)`,
}));

/*
 * Presencia de cada slot. En un custom element el slot es nativo: los hijos
 * viven en el light DOM del host y `$slots` no los ve, así que se mira el
 * `<slot>` real (`assignedNodes`), igual que `cu-alert`. En Vue los nodos se
 * renderizan como hijos del contenedor. Los contenedores quedan montados y se
 * ocultan con `v-show`, para que el slot exista y pueda asignar contenido.
 */
const mediaWrap = ref<HTMLElement | null>(null);
const headerWrap = ref<HTMLElement | null>(null);
const footerWrap = ref<HTMLElement | null>(null);

const hasMedia = ref(false);
const hasMediaSlot = ref(false);
const hasHeader = ref(false);
const hasHeaderSlot = ref(false);
const hasFooter = ref(false);

function nodeHasContent(node: ChildNode): boolean {
  if (node.nodeType === Node.TEXT_NODE) return !!node.textContent?.trim();
  if (node.nodeType !== Node.ELEMENT_NODE) return false;
  const el = node as Element;
  // Lo que renderiza el propio componente (imagen/título/subtítulo) no es slot:
  // si contara, la detección se taparía a sí misma y entraría en loop.
  if (el.classList.contains('cu-card-image')
    || el.classList.contains('cu-card-title')
    || el.classList.contains('cu-card-subtitle')) return false;
  if (el.tagName === 'SLOT') {
    return (el as HTMLSlotElement)
      .assignedNodes()
      .some((assigned) => assigned.nodeType === Node.ELEMENT_NODE
        || (assigned.nodeType === Node.TEXT_NODE && !!assigned.textContent?.trim()));
  }
  return true;
}

function wrapHasContent(el: HTMLElement | null): boolean {
  return !!el && Array.from(el.childNodes).some(nodeHasContent);
}

function detectSlots() {
  hasMediaSlot.value = wrapHasContent(mediaWrap.value);
  hasMedia.value = hasMediaSlot.value || !!props.image;
  hasHeaderSlot.value = wrapHasContent(headerWrap.value);
  hasHeader.value = hasHeaderSlot.value || !!props.title || !!props.subtitle;
  hasFooter.value = wrapHasContent(footerWrap.value);
}

let slotEls: HTMLSlotElement[] = [];

onMounted(() => {
  detectSlots();
  slotEls = [mediaWrap.value, headerWrap.value, footerWrap.value]
    .flatMap((wrap) => Array.from(wrap?.querySelectorAll("slot") ?? []));
  slotEls.forEach((slot) => slot.addEventListener("slotchange", detectSlots));
});

// En Vue los slots cambian con el render; en el CE avisa `slotchange`.
onUpdated(detectSlots);

onBeforeUnmount(() => {
  slotEls.forEach((slot) => slot.removeEventListener("slotchange", detectSlots));
});
</script>

<template>
  <article :class="['cu-card', `cu-card--${props.variant}`, `cu-card--${props.layout}`]" :style="colorStyles">
    <div v-show="hasMedia" ref="mediaWrap" class="cu-card-media">
      <slot name="media" />
      <img v-if="props.image && !hasMediaSlot" :src="props.image" alt="" class="cu-card-image" />
    </div>

    <div class="cu-card-body">
      <header v-show="hasHeader" ref="headerWrap" class="cu-card-header">
        <slot name="header" />
        <h3 v-if="props.title && !hasHeaderSlot" class="cu-card-title">{{ props.title }}</h3>
        <p v-if="props.subtitle && !hasHeaderSlot" class="cu-card-subtitle">{{ props.subtitle }}</p>
      </header>

      <div class="cu-card-content">
        <slot />
      </div>

      <footer v-show="hasFooter" ref="footerWrap" class="cu-card-footer">
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
  color: var(--card-text);
}

/* subtle */
.cu-card.cu-card--subtle {
  background-color: var(--card-subtle);
  color: var(--card-text);
  border-color: var(--card-subtle-border);
}

/* outlined */
.cu-card.cu-card--outlined {
  background-color: transparent;
  color: var(--card-text);
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
