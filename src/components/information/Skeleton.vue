<script setup lang="ts">
import { computed, type PropType } from "vue";
import { isColor, isSkeletonAnimation, isSkeletonRadius, isSkeletonShape } from '@/utils/validators'

const SHAPE_DEFAULTS = {
  rect: { width: "100%", height: "1rem", radius: "md" },
  circle: { width: "40px", height: "40px", radius: "full" },
  text: { width: "100%", height: "0.875em", radius: "sm" },
} as const;

const props = defineProps({
  /** `rect` (bloque), `circle` (avatar) o `text` (líneas de texto) */
  shape: {
    type: String as PropType<'rect' | 'circle' | 'text'>,
    required: false,
    default: "rect",
    validator: isSkeletonShape,
  },
  /** Ancho CSS (`100%`, `48px`, `12rem`); vacío = el default del `shape` */
  width: {
    type: String,
    required: false,
    default: "",
  },
  /** Alto CSS (`1rem`, `48px`); vacío = el default del `shape` (en `text`, alto de cada línea) */
  height: {
    type: String,
    required: false,
    default: "",
  },
  /** Cantidad de barras con `shape="text"` (se ignora en `rect` y `circle`) */
  lines: {
    type: Number,
    required: false,
    default: 1,
  },
  /** `pulse` (opacidad), `wave` (barrido) o `none`; con `prefers-reduced-motion` no anima */
  animation: {
    type: String as PropType<'pulse' | 'wave' | 'none'>,
    required: false,
    default: "pulse",
    validator: isSkeletonAnimation,
  },
  /** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
  /** Radio de las esquinas; vacío = el default del `shape` (`rect` md, `circle` full, `text` sm) */
  radius: {
    type: String as PropType<'none' | 'sm' | 'md' | 'lg' | 'full'>,
    required: false,
    default: "",
    validator: isSkeletonRadius,
  },
});

const shapeDefaults = computed(() => SHAPE_DEFAULTS[props.shape]);

const resolvedRadius = computed(() => props.radius || shapeDefaults.value.radius);

const barCount = computed(() =>
  props.shape === "text" ? Math.max(1, Math.floor(props.lines) || 1) : 1,
);

const skeletonStyles = computed(() => ({
  "--cu-skeleton-width": props.width || shapeDefaults.value.width,
  "--cu-skeleton-height": props.height || shapeDefaults.value.height,
  "--cu-skeleton-radius": `var(--cu-radius-${resolvedRadius.value})`,
  "--cu-skeleton-bg": `var(--cu-color-${props.color}-soft)`,
  "--cu-skeleton-highlight": `var(--cu-color-${props.color}-subtle)`,
}));

/** La última línea de un párrafo es más corta (60 %), como el final de un texto. */
function isShortLine(index: number): boolean {
  return props.shape === "text" && barCount.value > 1 && index === barCount.value;
}
</script>

<template>
  <div
    :class="[
      'cu-skeleton',
      `cu-skeleton--${props.shape}`,
      `cu-skeleton--${props.animation}`,
      `cu-skeleton--radius-${resolvedRadius}`,
    ]"
    :style="skeletonStyles"
    aria-hidden="true"
  >
    <span
      v-for="line in barCount"
      :key="line"
      :class="['cu-skeleton-bar', { 'cu-skeleton-bar--short': isShortLine(line) }]"
    ></span>
  </div>
</template>

<style scoped>
.cu-skeleton {
  box-sizing: border-box;
  width: var(--cu-skeleton-width);
  border-radius: var(--cu-skeleton-radius);
}

.cu-skeleton--rect,
.cu-skeleton--circle {
  height: var(--cu-skeleton-height);
}

.cu-skeleton--circle {
  flex-shrink: 0;
}

/* En `text` el contenedor apila las barras: el alto es de cada línea. */
.cu-skeleton--text {
  display: flex;
  flex-direction: column;
  gap: var(--cu-space-xs);
  height: auto;
}

.cu-skeleton-bar {
  display: block;
  width: 100%;
  height: 100%;
  background-color: var(--cu-skeleton-bg);
  border-radius: var(--cu-skeleton-radius);
}

.cu-skeleton--text .cu-skeleton-bar {
  height: var(--cu-skeleton-height);
}

.cu-skeleton-bar--short {
  width: 60%;
}

/* ── Animaciones ──────────────────────────────────────────────────────────── */
.cu-skeleton--pulse .cu-skeleton-bar {
  animation: cu-skeleton-pulse 1.5s ease-in-out infinite;
}

.cu-skeleton--wave .cu-skeleton-bar {
  background-image: linear-gradient(
    90deg,
    transparent 0%,
    var(--cu-skeleton-highlight) 50%,
    transparent 100%
  );
  background-repeat: no-repeat;
  background-size: 200% 100%;
  animation: cu-skeleton-wave 1.6s ease-in-out infinite;
}

.cu-skeleton--none .cu-skeleton-bar {
  animation: none;
}

@keyframes cu-skeleton-pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.45;
  }
}

@keyframes cu-skeleton-wave {
  from {
    background-position: -100% 0;
  }
  to {
    background-position: 200% 0;
  }
}

/* Accesibilidad: sin animación si el sistema lo pide. */
@media (prefers-reduced-motion: reduce) {
  .cu-skeleton--pulse .cu-skeleton-bar,
  .cu-skeleton--wave .cu-skeleton-bar {
    animation: none;
  }
}
</style>
