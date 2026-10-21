<script setup lang="ts">
import { computed, useSlots, type PropType } from "vue";
import { isColor, isDividerVariant, isOrientation } from '@/utils/validators'

const props = defineProps({
  /** `horizontal` (línea de izquierda a derecha) o `vertical` (de arriba a abajo) */
  orientation: {
    type: String as PropType<'horizontal' | 'vertical'>,
    required: false,
    default: "horizontal",
    validator: isOrientation,
  },
  /** Texto centrado sobre la línea; la línea se corta a los costados */
  label: {
    type: String,
    required: false,
    default: "",
  },
  /** `solid`, `dashed`, `dotted` */
  variant: {
    type: String as PropType<'solid' | 'dashed' | 'dotted'>,
    required: false,
    default: "solid",
    validator: isDividerVariant,
  },
  /** Color semántico del trazo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
});

const slots = useSlots();

/**
 * Presencia de contenido. No es un `computed`: `slots` no es reactivo (Vue sólo
 * re-renderiza al hijo cuando cambian los slots), así que se evalúa en cada
 * render para ver el slot nuevo. El wrapper del custom element recién pasa el
 * slot cuando el host tiene hijos reales.
 */
function hasContent(): boolean {
  return Boolean(props.label) || Boolean(slots.default);
}

function isVertical(): boolean {
  return props.orientation === "vertical";
}

/**
 * Sin label ni slot, una línea lisa es un `<hr>` (un separador semántico, sin rol
 * declarado). Con contenido hace falta un contenedor para cortar la línea.
 */
function isPlain(): boolean {
  return !isVertical() && !hasContent();
}

const dividerStyles = computed(() => ({
  '--divider-color': `var(--cu-color-${props.color}-subtle-border)`,
}));
</script>

<template>
  <hr
    v-if="isPlain()"
    :class="['cu-divider', 'cu-divider--horizontal', `cu-divider--${props.variant}`]"
    :style="dividerStyles"
  />
  <div
    v-else
    :class="[
      'cu-divider',
      `cu-divider--${props.orientation}`,
      `cu-divider--${props.variant}`,
    ]"
    role="separator"
    :aria-orientation="isVertical() ? 'vertical' : undefined"
    :style="dividerStyles"
  >
    <!-- Trazo decorativo: el texto del medio es el contenido semántico -->
    <span class="cu-divider-line" aria-hidden="true"></span>
    <span v-if="hasContent()" class="cu-divider-label"><slot>{{ props.label }}</slot></span>
    <span v-if="hasContent()" class="cu-divider-line" aria-hidden="true"></span>
  </div>
</template>

<style scoped>
.cu-divider {
  box-sizing: border-box;
  /* dashed/dotted/solid del trazo, por variante */
  --divider-style: solid;
}

.cu-divider--solid {
  --divider-style: solid;
}

.cu-divider--dashed {
  --divider-style: dashed;
}

.cu-divider--dotted {
  --divider-style: dotted;
}

/* ── Horizontal ───────────────────────────────────────────────────────────── */
hr.cu-divider {
  width: 100%;
  height: 0;
  margin: 0;
  border: 0;
  border-top: var(--cu-border-thin) var(--divider-style) var(--divider-color);
}

div.cu-divider--horizontal {
  display: flex;
  align-items: center;
  gap: var(--cu-space-sm);
  width: 100%;
  margin: 0;
  border: 0;
}

.cu-divider--horizontal .cu-divider-line {
  flex: 1 1 0;
  min-width: 0;
  border-top: var(--cu-border-thin) var(--divider-style) var(--divider-color);
}

.cu-divider-label {
  color: var(--cu-color-neutral);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  line-height: var(--cu-line-height-tight);
  text-align: center;
  overflow-wrap: anywhere;
}

/* ── Vertical ─────────────────────────────────────────────────────────────── */
div.cu-divider--vertical {
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  /* Toma el alto del contenedor: en una fila flex se estira, y si no, usa el 100% */
  align-self: stretch;
  height: 100%;
  min-height: var(--cu-space-lg);
  margin: 0;
  border: 0;
}

.cu-divider--vertical .cu-divider-line {
  flex: 1 1 0;
  min-height: var(--cu-space-sm);
  border-left: var(--cu-border-thin) var(--divider-style) var(--divider-color);
}

.cu-divider--vertical .cu-divider-label {
  padding: var(--cu-space-xs) 0;
}
</style>
