<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'

// SideOver: panel overlay que desliza desde un borde (izquierda/derecha/arriba/
// abajo) sobre el contenido, con scrim y cierre por backdrop/Escape. Opción
// fullscreen para ocupar toda la pantalla.
const props = defineProps({
  modelValue: { type: Boolean, required: false, default: false },
  position: {
    type: String,
    required: false,
    default: 'right',
    validator: (value: string) => ['left', 'right', 'top', 'bottom'].includes(value),
  },
  // Ancho (left/right) o alto (top/bottom) del panel. Ignorado en fullscreen.
  size: { type: String, required: false, default: '300px' },
  fullscreen: { type: Boolean, required: false, default: false },
  // Con persistent no se cierra por backdrop ni Escape.
  persistent: { type: Boolean, required: false, default: false },
  zIndex: { type: Number, required: false, default: 1100 },
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

function close() {
  if (props.persistent) return
  emit('update:modelValue', false)
  emit('close')
}

function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape' && props.modelValue) close()
}

// Scroll lock del body mientras está abierto
let prevOverflow = ''
watch(() => props.modelValue, (open) => {
  if (open) {
    prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  } else {
    document.body.style.overflow = prevOverflow
  }
})

onMounted(() => {
  document.addEventListener('keydown', onKeydown)
})
onUnmounted(() => {
  document.removeEventListener('keydown', onKeydown)
  document.body.style.overflow = prevOverflow
})

const panelStyle = computed(() => {
  if (props.fullscreen) return {}
  if (props.position === 'left' || props.position === 'right') return { width: props.size }
  return { height: props.size }
})
</script>

<template>
  <Teleport to="body">
    <Transition name="cu-sideover">
      <div
        v-if="modelValue"
        class="cu-sideover"
        :style="{ zIndex: props.zIndex }"
        role="dialog"
        aria-modal="true"
      >
        <div class="cu-sideover-backdrop" @click="close"></div>
        <div
          class="cu-sideover-panel"
          :class="[
            `cu-sideover-panel--${props.position}`,
            { 'cu-sideover-panel--fullscreen': props.fullscreen },
          ]"
          :style="panelStyle"
        >
          <slot />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.cu-sideover {
  position: fixed;
  inset: 0;
  font-family: var(--cu-font-sans);
  color: var(--cu-color-neutral);
}

.cu-sideover-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
}

.cu-sideover-panel {
  position: absolute;
  display: flex;
  flex-direction: column;
  background-color: var(--cu-color-surface);
  box-shadow: var(--cu-shadow-xl);
  overflow-y: auto;
}

.cu-sideover-panel--left { top: 0; left: 0; bottom: 0; }
.cu-sideover-panel--right { top: 0; right: 0; bottom: 0; }
.cu-sideover-panel--top { top: 0; left: 0; right: 0; }
.cu-sideover-panel--bottom { bottom: 0; left: 0; right: 0; }
.cu-sideover-panel--fullscreen { inset: 0; width: 100vw !important; height: 100dvh !important; }

/* Transición: scrim con fade + panel deslizando desde su borde */
.cu-sideover-enter-active,
.cu-sideover-leave-active {
  transition: opacity 0.25s ease;
}
.cu-sideover-enter-active .cu-sideover-panel,
.cu-sideover-leave-active .cu-sideover-panel {
  transition: transform 0.25s ease;
}
.cu-sideover-enter-from,
.cu-sideover-leave-to {
  opacity: 0;
}
.cu-sideover-enter-from .cu-sideover-panel--left,
.cu-sideover-leave-to .cu-sideover-panel--left { transform: translateX(-100%); }
.cu-sideover-enter-from .cu-sideover-panel--right,
.cu-sideover-leave-to .cu-sideover-panel--right { transform: translateX(100%); }
.cu-sideover-enter-from .cu-sideover-panel--top,
.cu-sideover-leave-to .cu-sideover-panel--top { transform: translateY(-100%); }
.cu-sideover-enter-from .cu-sideover-panel--bottom,
.cu-sideover-leave-to .cu-sideover-panel--bottom { transform: translateY(100%); }
</style>