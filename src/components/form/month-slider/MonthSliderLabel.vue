<script setup lang="ts">
import { computed, ref, type PropType } from 'vue'
import Badge from '@/components/information/Badge.vue'

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    default: '',
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: 'primary',
  },
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle'>,
    default: 'soft',
  },
  // Píxeles acumulados de arrastre necesarios para disparar un paso
  threshold: {
    type: Number,
    default: 48,
  },
  // Meses que avanza cada deslizada completa (1 = uno por gesto)
  steps: {
    type: Number,
    default: 1,
  },
})

const emit = defineEmits<{
  // Positivo = mes siguiente (swipe a la izquierda), negativo = mes anterior
  (e: 'navigate', direction: number): void
}>()

// Sobre un label solid (fondo = color), el badge solid se perdería:
// se usa un badge suave para mantener contraste.
const yearBadgeVariant = computed<'solid' | 'subtle'>(() =>
  props.variant === 'solid' ? 'subtle' : 'solid',
)

const root = ref<HTMLElement | null>(null)
const dragging = ref(false)
const offsetX = ref(0)

let pointerId = 0
let lastX = 0
let accX = 0
// Una vez que se supera el umbral, la deslizada queda "consumida":
// un gesto = un paso, sin importar la velocidad ni la distancia.
let fired = false

function onPointerDown(event: PointerEvent) {
  if (props.disabled) return
  dragging.value = true
  pointerId = event.pointerId
  lastX = event.clientX
  accX = 0
  fired = false
  root.value?.setPointerCapture(pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value || event.pointerId !== pointerId || fired) return
  const dx = event.clientX - lastX
  lastX = event.clientX
  accX += dx
  // El label acompaña el dedo, limitado al umbral
  offsetX.value = Math.max(-props.threshold, Math.min(props.threshold, accX))
  if (Math.abs(accX) >= props.threshold) {
    // Arrastrar a la izquierda (accX negativo) = mes(es) siguiente(s)
    emit('navigate', (accX < 0 ? 1 : -1) * props.steps)
    fired = true
    offsetX.value = 0
  }
}

function endDrag() {
  if (!dragging.value) return
  dragging.value = false
  fired = false
  accX = 0
  offsetX.value = 0
  try {
    root.value?.releasePointerCapture(pointerId)
  } catch {
    // el pointer ya se soltó
  }
}
</script>

<template>
  <div
    ref="root"
    class="cu-month-slider-label"
    :class="[
      `cu-month-slider-label--${props.variant}`,
      { 'is-dragging': dragging, 'is-disabled': props.disabled },
    ]"
    :style="{ '--drag-offset': `${offsetX}px` }"
    role="button"
    tabindex="0"
    :aria-label="props.year ? `${props.label} ${props.year}` : props.label"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="endDrag"
    @pointercancel="endDrag"
    @keydown.left.prevent="emit('navigate', -1 * props.steps)"
    @keydown.right.prevent="emit('navigate', props.steps)"
  >
    <span class="cu-month-slider-label-month">{{ props.label }}</span>
    <Badge
      v-if="props.year"
      class="cu-month-slider-label-year"
      :color="props.color"
      :variant="yearBadgeVariant"
    >
      {{ props.year }}
    </Badge>
  </div>
</template>

<style scoped>
.cu-month-slider-label {
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-xs);
  min-width: 150px;
  justify-content: center;
  padding: var(--cu-space-md) var(--cu-space-lg);
  border-radius: var(--cu-radius);
  border: var(--cu-border-none) solid transparent;
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-md);
  font-weight: var(--cu-font-weight-semibold);
  cursor: grab;
  user-select: none;
  touch-action: pan-y;
  transform: translateX(var(--drag-offset, 0px));
  transition: transform 0.2s ease, background-color 150ms ease, color 150ms ease;
  will-change: transform;
}

/* solid: doble clase para ganarle a reglas globales del consumidor (convención del repo) */
.cu-month-slider-label.cu-month-slider-label--solid {
  background-color: var(--ms-accent);
  color: var(--ms-surface);
}
.cu-month-slider-label.cu-month-slider-label--solid:hover {
  background-color: var(--ms-accent-hover);
}

/* outlined */
.cu-month-slider-label--outlined {
  background-color: transparent;
  color: var(--ms-accent);
  border: var(--cu-border-thin) solid var(--ms-accent);
}
.cu-month-slider-label--outlined:hover {
  background-color: var(--ms-ghost-hover);
}

/* soft (default) */
.cu-month-slider-label--soft {
  background-color: var(--ms-soft);
  color: var(--ms-accent);
}
.cu-month-slider-label--soft:hover {
  background-color: var(--ms-soft-hover);
}

/* ghost */
.cu-month-slider-label--ghost {
  background-color: transparent;
  color: var(--ms-accent);
}
.cu-month-slider-label--ghost:hover {
  background-color: var(--ms-ghost-hover);
}

/* subtle */
.cu-month-slider-label--subtle {
  background-color: var(--ms-subtle);
  color: var(--ms-accent);
  border: var(--cu-border-thin) solid var(--ms-subtle-border);
}
.cu-month-slider-label--subtle:hover {
  background-color: var(--ms-subtle-hover);
}

.cu-month-slider-label.is-dragging {
  cursor: grabbing;
  transition: none;
}

.cu-month-slider-label.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.cu-month-slider-label:focus-visible {
  outline: 2px solid var(--ms-accent);
  outline-offset: 2px;
}
</style>
