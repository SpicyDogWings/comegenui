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
  // Permite usar el label sin drag (p.ej. si solo se quiere navegar con botones)
  draggable: {
    type: Boolean,
    default: true,
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: 'primary',
  },
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle'>,
    default: 'soft',
  },
  // Píxeles acumulados de arrastre necesarios para disparar un paso.
  // Fijo: hay que arrastrar bastante (96px) para evitar cambios accidentales.
  threshold: {
    type: Number,
    default: 96,
  },
  // Meses que avanza cada deslizada completa (1 = uno por gesto)
  steps: {
    type: Number,
    default: 1,
  },
  // Hacia dónde se puede navegar (lo resuelve el padre según min/max).
  // Cuando un gesto intenta cruzar un límite, el label "choca" contra la
  // pared en vez de consumir la deslizada y rebotar sin efecto.
  canNavigatePrev: {
    type: Boolean,
    default: true,
  },
  canNavigateNext: {
    type: Boolean,
    default: true,
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
// Una vez que se supera el umbral, la deslizada queda "consumida":
// un gesto = un paso, sin importar la velocidad ni la distancia.
const fired = ref(false)

let pointerId = 0
let lastX = 0
let accX = 0

function onPointerDown(event: PointerEvent) {
  if (props.disabled || !props.draggable) return
  dragging.value = true
  pointerId = event.pointerId
  lastX = event.clientX
  accX = 0
  fired.value = false
  root.value?.setPointerCapture(pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value || event.pointerId !== pointerId || fired.value) return
  const dx = event.clientX - lastX
  lastX = event.clientX
  accX += dx
  // Arrastrar a la izquierda (accX negativo) = siguiente (+1),
  // arrastrar a la derecha (accX positivo) = anterior (-1)
  const dir = accX < 0 ? 1 : -1
  const blocked = dir === 1 ? !props.canNavigateNext : !props.canNavigatePrev
  if (blocked) {
    // Límite alcanzado: el label se queda pegado a la pared sin consumir
    // el gesto, así que invertir la dirección dispara de inmediato.
    accX = dir === 1 ? -props.threshold : props.threshold
    offsetX.value = accX
    return
  }
  // El label acompaña el dedo, limitado al umbral
  offsetX.value = Math.max(-props.threshold, Math.min(props.threshold, accX))
  if (Math.abs(accX) >= props.threshold) {
    emit('navigate', dir * props.steps)
    fired.value = true
    offsetX.value = 0
  }
}

function endDrag() {
  if (!dragging.value) return
  dragging.value = false
  fired.value = false
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
      {
        'is-draggable': props.draggable,
        'is-dragging': dragging,
        'is-fired': fired,
        'is-disabled': props.disabled,
      },
    ]"
    :style="{ '--drag-offset': `${offsetX}px` }"
    :role="props.draggable ? 'button' : 'group'"
    :tabindex="props.draggable ? 0 : -1"
    :aria-label="props.year ? `${props.label} ${props.year}` : props.label"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="endDrag"
    @pointercancel="endDrag"
    @keydown.left.prevent="props.draggable && props.canNavigatePrev && emit('navigate', -1 * props.steps)"
    @keydown.right.prevent="props.draggable && props.canNavigateNext && emit('navigate', props.steps)"
  >
    <span :key="props.label" class="cu-month-slider-label-month">{{ props.label }}</span>
    <Badge
      v-if="props.year"
      :key="props.year"
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
  cursor: default;
  user-select: none;
  touch-action: pan-y;
  transform: translateX(var(--drag-offset, 0px));
  transition: transform 0.4s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.25s ease, color 0.25s ease;
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
.cu-month-slider-label.cu-month-slider-label--outlined {
  background-color: transparent;
  color: var(--ms-accent);
  border: var(--cu-border-thin) solid var(--ms-accent);
}
.cu-month-slider-label.cu-month-slider-label--outlined:hover {
  background-color: var(--ms-ghost-hover);
}

/* soft (default) */
.cu-month-slider-label.cu-month-slider-label--soft {
  background-color: var(--ms-soft);
  color: var(--ms-accent);
}
.cu-month-slider-label.cu-month-slider-label--soft:hover {
  background-color: var(--ms-soft-hover);
}

/* ghost */
.cu-month-slider-label.cu-month-slider-label--ghost {
  background-color: transparent;
  color: var(--ms-accent);
}
.cu-month-slider-label.cu-month-slider-label--ghost:hover {
  background-color: var(--ms-ghost-hover);
}

/* subtle */
.cu-month-slider-label.cu-month-slider-label--subtle {
  background-color: var(--ms-subtle);
  color: var(--ms-accent);
  border: var(--cu-border-thin) solid var(--ms-subtle-border);
}
.cu-month-slider-label.cu-month-slider-label--subtle:hover {
  background-color: var(--ms-subtle-hover);
}

/* El texto del mes lleva color explícito (inherit del root) con especificidad
   suficiente para ganarle a reglas globales del consumidor tipo
   `.playground :is(h1, ..., span, ...) { color: ... }` que pegan en spans internos.
   La clase scoped [data-v] sube la regla a (0,3,0). */
.cu-month-slider-label .cu-month-slider-label-month {
  color: inherit;
}

.cu-month-slider-label.is-draggable {
  cursor: grab;
}

.cu-month-slider-label.is-dragging {
  cursor: grabbing;
  transition: none;
}

/* Al consumir la deslizada, el label vuelve con un rebote suave */
.cu-month-slider-label.is-fired {
  transition: transform 0.35s cubic-bezier(0.22, 1, 0.36, 1);
}

.cu-month-slider-label.is-disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.cu-month-slider-label:focus-visible {
  outline: 2px solid var(--ms-accent);
  outline-offset: 2px;
}

/* Entrada suave del texto al cambiar el mes (key en el span lo re-monta) */
.cu-month-slider-label-month,
.cu-month-slider-label-year {
  animation: cu-month-slide-in 0.28s cubic-bezier(0.22, 1, 0.36, 1);
}

@keyframes cu-month-slide-in {
  from {
    opacity: 0;
    transform: translateY(5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
