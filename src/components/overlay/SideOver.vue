<script setup lang="ts">
import { computed, watch, onMounted, onUnmounted } from 'vue'

// SideOver: panel overlay que desliza desde un borde (izquierda/derecha/arriba/
// abajo) sobre el contenido, con scrim y cierre por backdrop/Escape. Opción
// fullscreen para ocupar toda la pantalla.
const props = defineProps({
  modelValue: { type: Boolean, required: false, default: false },
  title: { type: String, required: false, default: '' },
  position: {
    type: String,
    required: false,
    default: 'right',
    validator: (value: string) => ['left', 'right', 'top', 'bottom'].includes(value),
  },
  // Ancho (left/right) o alto (top/bottom) del panel. Ignorado en fullscreen.
  // Acepta un valor CSS ('300px', '40vw') o un preset: 'sm' | 'md' | 'lg' | 'xl' | 'full'.
  size: { type: String, required: false, default: '300px' },
  fullscreen: { type: Boolean, required: false, default: false },
  // Con persistent no se cierra por backdrop ni Escape ni el botón de cerrar.
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

const PRESET_SIZES = ['sm', 'md', 'lg', 'xl', 'full']

const isPresetSize = computed(() => PRESET_SIZES.includes(props.size))

const panelStyle = computed(() => {
  if (props.fullscreen) return {}
  // Los presets se resuelven via CSS (--cu-sideover-size-*) y data-size.
  if (isPresetSize.value) return {}
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
          :data-size="isPresetSize ? props.size : undefined"
          :style="panelStyle"
        >
          <header
            v-if="props.title || !props.persistent"
            class="cu-sideover-header"
          >
            <h2 v-if="props.title" class="cu-sideover-title">{{ props.title }}</h2>
            <button
              v-if="!props.persistent"
              type="button"
              class="cu-sideover-close"
              aria-label="Cerrar panel"
              @click="close"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
            </button>
          </header>
          <div class="cu-sideover-body">
            <slot />
          </div>
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
  overflow: hidden;
}

.cu-sideover-panel--left { top: 0; left: 0; bottom: 0; }
.cu-sideover-panel--right { top: 0; right: 0; bottom: 0; }
.cu-sideover-panel--top { top: 0; left: 0; right: 0; }
.cu-sideover-panel--bottom { bottom: 0; left: 0; right: 0; }
.cu-sideover-panel--fullscreen { inset: 0; width: 100vw !important; height: 100dvh !important; }

/* Presets de tamaño: se resuelven via CSS vars (override con
   --cu-sideover-size-{sm|md|lg|xl|full} en el host) */
.cu-sideover-panel[data-size='sm'] { --cu-sideover-dimension: var(--cu-sideover-size-sm, 320px); }
.cu-sideover-panel[data-size='md'] { --cu-sideover-dimension: var(--cu-sideover-size-md, 400px); }
.cu-sideover-panel[data-size='lg'] { --cu-sideover-dimension: var(--cu-sideover-size-lg, 512px); }
.cu-sideover-panel[data-size='xl'] { --cu-sideover-dimension: var(--cu-sideover-size-xl, 640px); }
.cu-sideover-panel[data-size='full'] { --cu-sideover-dimension: var(--cu-sideover-size-full, 100%); }
.cu-sideover-panel--left[data-size],
.cu-sideover-panel--right[data-size] { width: var(--cu-sideover-dimension); }
.cu-sideover-panel--top[data-size],
.cu-sideover-panel--bottom[data-size] { height: var(--cu-sideover-dimension); }

.cu-sideover-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--cu-space-sm);
  padding: var(--cu-space-md) var(--cu-space-lg);
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
  flex-shrink: 0;
}

.cu-sideover-title {
  margin: 0;
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-bold);
  color: var(--cu-color-neutral);
}

.cu-sideover-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  padding: var(--cu-space-2xs);
  border: none;
  border-radius: var(--cu-radius-sm);
  background: transparent;
  color: var(--cu-color-neutral);
  cursor: pointer;
  transition: background-color 0.15s ease;
}
.cu-sideover-close:hover { background-color: var(--cu-color-neutral-subtle-hover); }
.cu-sideover-close:focus-visible {
  outline: 2px solid var(--cu-color-primary);
  outline-offset: 2px;
}

.cu-sideover-body {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: var(--cu-space-lg);
}

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