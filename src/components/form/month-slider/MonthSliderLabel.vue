<script setup lang="ts">
import { ref } from 'vue'

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
})

const emit = defineEmits<{
  // 1 = mes siguiente (swipe a la izquierda), -1 = mes anterior (swipe a la derecha)
  (e: 'navigate', direction: -1 | 1): void
}>()

// Píxeles acumulados de arrastre necesarios para cambiar de mes
const THRESHOLD = 48

const root = ref<HTMLElement | null>(null)
const dragging = ref(false)
const offsetX = ref(0)

let pointerId = 0
let lastX = 0
let accX = 0

function onPointerDown(event: PointerEvent) {
  if (props.disabled) return
  dragging.value = true
  pointerId = event.pointerId
  lastX = event.clientX
  accX = 0
  root.value?.setPointerCapture(pointerId)
}

function onPointerMove(event: PointerEvent) {
  if (!dragging.value || event.pointerId !== pointerId) return
  const dx = event.clientX - lastX
  lastX = event.clientX
  accX += dx
  // El label acompaña el dedo, limitado al umbral
  offsetX.value = Math.max(-THRESHOLD, Math.min(THRESHOLD, accX))
  if (Math.abs(accX) >= THRESHOLD) {
    // Arrastrar a la izquierda (accX negativo) = mes siguiente
    emit('navigate', accX < 0 ? 1 : -1)
    accX = 0
    offsetX.value = 0
  }
}

function endDrag() {
  if (!dragging.value) return
  dragging.value = false
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
    :class="{ 'is-dragging': dragging, 'is-disabled': props.disabled }"
    :style="{ '--drag-offset': `${offsetX}px` }"
    role="button"
    tabindex="0"
    :aria-label="props.year ? `${props.label} ${props.year}` : props.label"
    @pointerdown="onPointerDown"
    @pointermove="onPointerMove"
    @pointerup="endDrag"
    @pointercancel="endDrag"
    @keydown.left.prevent="emit('navigate', -1)"
    @keydown.right.prevent="emit('navigate', 1)"
  >
    <span class="cu-month-slider-label-month">{{ props.label }}</span>
    <span v-if="props.year" class="cu-month-slider-label-year">{{ props.year }}</span>
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
  background-color: var(--month-slider-soft);
  color: var(--month-slider-accent);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-md);
  font-weight: var(--cu-font-weight-semibold);
  cursor: grab;
  user-select: none;
  touch-action: pan-y;
  transform: translateX(var(--drag-offset, 0px));
  transition: transform 0.2s ease, background-color 150ms ease;
  will-change: transform;
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
  outline: 2px solid var(--month-slider-accent);
  outline-offset: 2px;
}

.cu-month-slider-label-year {
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  padding: 2px var(--cu-space-sm);
  border-radius: var(--cu-radius-full);
  background-color: var(--month-slider-accent);
  color: var(--month-slider-accent-text);
}
</style>
