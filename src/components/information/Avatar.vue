<script setup lang="ts">
import { computed, ref, watch, type PropType } from "vue";
import { isColor, isSize } from '@/utils/validators'

// Paleta del color automático: sólo las 4 bases que contrastan entre sí por hash
// (mismo texto → mismo color). El orden define el reparto, no es alfabético.
const PALETTE: Array<'primary' | 'secondary' | 'success' | 'neutral'> = [
  'primary', 'secondary', 'success', 'neutral',
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "",
  },
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    required: false,
    default: "md",
    validator: isSize,
  },
  initials: {
    type: String,
    required: false,
    default: "",
  },
  src: {
    type: String,
    required: false,
    default: "",
  },
});

/**
 * Un `src` que no carga (404, host caído, URL vencida) dejaba el avatar vacío: el
 * `<img>` roto ocupa el círculo y ni las iniciales ni el slot aparecían. Se
 * recuerda el fallo y se vuelve al contenido alternativo; si cambia el `src`
 * (otra URL del mismo avatar) se reintenta.
 */
const imageFailed = ref(false);
watch(() => props.src, () => { imageFailed.value = false; });

const showImage = computed(() => Boolean(props.src) && !imageFailed.value);

/** Una sola cosa se ve por vez: el slot sólo cuando no hay imagen ni iniciales. */
const showSlot = computed(() => !showImage.value && !props.initials);

const resolvedColor = computed(() => {
  if (isColor(props.color)) return props.color;
  // Sin color (o con un nombre fuera del set): hash estable de las iniciales.
  const key = props.initials.toLowerCase() || 'x';
  return PALETTE[hashString(key) % PALETTE.length]!;
});

const avatarStyles = computed(() => ({
  // Fondo `-solid` (el color del tema) + texto `-solid-text` (negro/blanco por
  // máximo contraste): el generador garantiza ≥4.5:1 en los 15 temas.
  '--avatar-bg': `var(--cu-color-${resolvedColor.value}-solid, #4338ca)`,
  '--avatar-fg': `var(--cu-color-${resolvedColor.value}-solid-text, #ffffff)`,
}));

const sizeClass = computed(() => `cu-avatar--${props.size}`);
</script>

<template>
  <div :class="['cu-avatar', sizeClass]" :style="avatarStyles">
    <img
      v-if="showImage"
      :src="props.src"
      class="cu-avatar-img"
      alt=""
      @error="imageFailed = true"
    />
    <span v-else-if="props.initials" class="cu-avatar-initials">{{ props.initials }}</span>
    <!-- Iniciales o contenido del avatar (alternativo a `initials` y `src`). -->
    <slot v-if="showSlot" />
  </div>
</template>

<style scoped>
.cu-avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* Recorta las iniciales largas: sin esto el texto se sale del círculo. */
  overflow: hidden;
  border-radius: 50%;
  background-color: var(--avatar-bg);
  color: var(--avatar-fg);
  font-weight: var(--cu-font-weight-semibold);
  flex-shrink: 0;
}

.cu-avatar--sm {
  width: 28px;
  height: 28px;
  font-size: var(--cu-font-size-xs);
}

.cu-avatar--md {
  width: 36px;
  height: 36px;
  font-size: var(--cu-font-size-sm);
}

.cu-avatar--lg {
  width: 48px;
  height: 48px;
  font-size: var(--cu-font-size-md);
}

.cu-avatar-initials {
  line-height: 1;
}

.cu-avatar-img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
</style>
