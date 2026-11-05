<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, onUpdated, ref, type PropType } from "vue";
import { isCardLayout, isColor, isVariant } from '@/utils/validators'

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
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
  /** Título visible del header (alias preferido de `title`). Si vienen ambos, gana `heading`. */
  heading: {
    type: String,
    required: false,
  },
  /**
   * Título visible del header. Se mantiene por compatibilidad: en el custom element el
   * atributo `title` queda en el host y el navegador muestra su tooltip nativo sobre toda
   * la tarjeta. Usá `heading` para evitarlo.
   */
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

/** Título del header: `heading` es el alias preferido y pisa a `title`. */
const visibleTitle = computed(() => props.heading ?? props.title);

/** Un color fuera del set no tiene tokens: la variante solid quedaría sin fondo
 *  y con el texto del tema encima (invisible). Cae al color seguro. */
const safeColor = computed(() => (isColor(props.color) ? props.color : 'neutral'));

const colorStyles = computed(() => ({
  '--card-solid': `var(--cu-color-${safeColor.value}-solid)`,
  '--card-solid-text': `var(--cu-color-${safeColor.value}-solid-text)`,
  '--card-border': `var(--cu-color-${safeColor.value}-border)`,
  '--card-text': `var(--cu-color-${safeColor.value}-text)`,
  '--card-text-soft': `var(--cu-color-${safeColor.value}-text-on-soft)`,
  '--card-text-subtle': `var(--cu-color-${safeColor.value}-text-on-subtle)`,
  '--card-soft': `var(--cu-color-${safeColor.value}-soft)`,
  '--card-subtle': `var(--cu-color-${safeColor.value}-subtle)`,
  '--card-subtle-border': `var(--cu-color-${safeColor.value}-subtle-border)`,
  /* Subtitle: el atenuado sale del token (≥4.5:1), nunca de `opacity`. `ghost`
     no usa el color semántico, así que se atenúa el texto neutro. */
  '--card-text-muted': props.variant === 'ghost'
    ? 'var(--cu-color-neutral-text-muted)'
    : `var(--cu-color-${safeColor.value}-text-muted)`,
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
  hasHeader.value = hasHeaderSlot.value || !!visibleTitle.value || !!props.subtitle;
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
        <h3 v-if="visibleTitle && !hasHeaderSlot" class="cu-card-title">{{ visibleTitle }}</h3>
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
  /* La tarjeta nunca crece más que su contenedor (flex/grid): el contenido se ajusta. */
  max-width: 100%;
  /* Se hereda al contenido y al que llega por slot: las palabras largas se cortan
     en lugar de desbordar y arrastrar el ancho mínimo del layout. */
  overflow-wrap: anywhere;
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

/* solid: el borde (`-border`, ≥3:1 contra la superficie) delimita la tarjeta
   cuando el relleno por sí solo no alcanza ese piso. */
.cu-card.cu-card--solid {
  background-color: var(--card-solid);
  color: var(--card-solid-text);
  border-color: var(--card-border);
}
.cu-card.cu-card--solid .cu-card-title {
  color: var(--card-solid-text);
}

/* soft */
.cu-card.cu-card--soft {
  background-color: var(--card-soft);
  color: var(--card-text-soft);
}

/* subtle */
.cu-card.cu-card--subtle {
  background-color: var(--card-subtle);
  color: var(--card-text-subtle);
  border-color: var(--card-subtle-border);
}

/* outlined */
.cu-card.cu-card--outlined {
  background-color: transparent;
  color: var(--card-text);
  border-color: var(--card-border);
}

.cu-card-media {
  width: 100%;
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
}

.cu-card-image {
  display: block;
  width: 100%;
  max-width: 100%;
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
  min-width: 0;
}

.cu-card-body {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-md);
  padding: var(--cu-space-lg);
  box-sizing: border-box;
  /* Sin esto el cuerpo no baja de su ancho mínimo y empuja la tarjeta en horizontal. */
  min-width: 0;
}

.cu-card-header {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-2xs);
  min-width: 0;
}

.cu-card-title {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-bold);
  margin: 0;
  color: inherit;
}

.cu-card-subtitle {
  font-size: var(--cu-font-size-sm);
  margin: 0;
  color: var(--card-text-muted);
}
/* Sobre solid no hay token atenuado: el texto del tema ya contrasta (≥4.5:1). */
.cu-card.cu-card--solid .cu-card-subtitle {
  color: var(--card-solid-text);
}

.cu-card-content {
  color: inherit;
  line-height: var(--cu-line-height-relaxed);
  min-width: 0;
}

.cu-card-footer {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--cu-space-sm);
  min-width: 0;
  padding-top: var(--cu-space-md);
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}
</style>
