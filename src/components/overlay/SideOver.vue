<script lang="ts">
// Estado compartido por todas las instancias (module scope, no por setup).
// El body se bloquea una sola vez y Escape/Tab sólo los atiende el panel que
// está arriba de la pila: con dos paneles abiertos, cerrar el de abajo no puede
// devolverle el scroll a la página ni Escape puede cerrarlos a los dos.
const openInstances: symbol[] = [];

let scrollLocks = 0;
let previousBodyOverflow = "";

function lockBodyScroll() {
  if (scrollLocks === 0) {
    previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  scrollLocks += 1;
}

function unlockBodyScroll() {
  if (scrollLocks === 0) return;
  scrollLocks -= 1;
  if (scrollLocks === 0) document.body.style.overflow = previousBodyOverflow;
}
</script>

<script setup lang="ts">
import { computed, nextTick, watch, onMounted, onUnmounted, ref, useAttrs, useId, type PropType } from 'vue'
import { isPosition } from '@/utils/validators'

// SideOver: panel overlay que desliza desde un borde (izquierda/derecha/arriba/
// abajo) sobre el contenido, con scrim y cierre por backdrop/Escape. Opción
// fullscreen para ocupar toda la pantalla.
const props = defineProps({
  modelValue: { type: Boolean, required: false, default: false },
  title: { type: String, required: false, default: '' },
  position: {
    type: String as PropType<'bottom' | 'top' | 'left' | 'right'>,
    required: false,
    default: 'right',
    validator: isPosition,
  },
  // Ancho (left/right) o alto (top/bottom) del panel. Ignorado en fullscreen.
  // Acepta un valor CSS ('300px', '40vw') o un preset: 'sm' | 'md' | 'lg' | 'xl' | 'full'.
  size: { type: String, required: false, default: '300px' },
  fullscreen: { type: Boolean, required: false, default: false },
  // Con persistent no se cierra por backdrop ni Escape ni el botón de cerrar.
  persistent: { type: Boolean, required: false, default: false },
  zIndex: { type: Number, required: false, default: 1100 },
  /** Teleporta el panel a `body`; el CE lo desactiva para conservar el slot. */
  teleport: { type: Boolean, required: false, default: true },
})

// Los atributos no se heredan al Teleport (Vue no puede): se consumen acá para
// que `aria-label`, reenviado por el custom element, nombre al diálogo.
defineOptions({ inheritAttrs: false })

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const attrs = useAttrs()
const uid = useId()
const titleId = `${uid}-title`

const panelRef = ref<HTMLElement | null>(null)
/** Elemento que tenía el foco al abrir: se le devuelve al cerrar. */
const trigger = ref<HTMLElement | null>(null)

// Nombre accesible del diálogo: con `title` manda `aria-labelledby`; sin él el
// rol `dialog` quedaría sin nombre, así que se usa `aria-label` del consumidor
// o un fallback. Sin esto un lector de pantalla anuncia "diálogo" a secas.
const dialogLabel = computed(() =>
  props.title ? undefined : ((attrs['aria-label'] as string | undefined) || 'Panel'),
)

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'area[href]',
  'button:not([disabled])',
  'input:not([disabled]):not([type="hidden"])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  'iframe',
  'object',
  'embed',
  'audio[controls]',
  'video[controls]',
  'summary',
  '[contenteditable="true"]',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/** Oculta por atributo/inline style (v-show): `focus()` no serviría y el trap no debe contarla. */
function isHidden(el: Element): boolean {
  for (let node: Element | null = el; node; node = node.parentElement) {
    if (node.hasAttribute('hidden')) return true;
    const style = (node as HTMLElement).style;
    if (style && (style.display === 'none' || style.visibility === 'hidden')) return true;
  }
  return false;
}

function isFocusable(el: Element): el is HTMLElement {
  return el instanceof HTMLElement && el.matches(FOCUSABLE_SELECTOR) && !isHidden(el);
}

/**
 * Focusables del panel en orden de tabulación. Recorre slots (`assignedElements`)
 * y shadow roots anidados: en el custom element el contenido vive en el light DOM
 * del host y `querySelectorAll` no cruza ninguna de las dos fronteras.
 */
function collectFocusables(root: ParentNode, out: HTMLElement[] = []): HTMLElement[] {
  for (const child of Array.from(root.children)) {
    if (child.tagName === 'SLOT' && 'assignedElements' in child) {
      const slot = child as HTMLSlotElement;
      const assigned = slot.assignedElements({ flatten: true });
      const source = assigned.length ? assigned : Array.from(slot.children);
      for (const node of source) {
        if (isFocusable(node)) out.push(node);
        if (node.shadowRoot) collectFocusables(node.shadowRoot, out);
        collectFocusables(node, out);
      }
      continue;
    }
    if (isFocusable(child)) out.push(child);
    if (child.shadowRoot) collectFocusables(child.shadowRoot, out);
    collectFocusables(child, out);
  }
  return out;
}

function panelFocusables(): HTMLElement[] {
  return panelRef.value ? collectFocusables(panelRef.value) : [];
}

/** Elemento realmente enfocado, atravesando shadow roots anidados. */
function deepActiveElement(): Element | null {
  let active: Element | null = document.activeElement;
  while (active?.shadowRoot?.activeElement) active = active.shadowRoot.activeElement;
  return active;
}

/** Foco inicial: `[autofocus]` si existe, si no el primer focusable, si no el panel. */
function focusFirst() {
  const panel = panelRef.value;
  if (!panel) return;
  const focusables = panelFocusables();
  const active = deepActiveElement();
  if (active && (focusables.includes(active as HTMLElement) || panel.contains(active))) return;
  const autofocus = panel.querySelector('[autofocus]') as HTMLElement | null;
  (autofocus ?? focusables[0] ?? panel).focus();
}

/** Devuelve el foco al trigger; si es un custom element, a su control interno. */
function restoreFocus() {
  const el = trigger.value;
  trigger.value = null;
  if (!el || !el.isConnected) return;
  el.focus();
  if (document.activeElement !== el && el.shadowRoot) {
    collectFocusables(el.shadowRoot)[0]?.focus();
  }
}

function trapTab(event: KeyboardEvent) {
  if (event.key !== 'Tab') return;
  const panel = panelRef.value;
  if (!panel) return;
  const focusables = panelFocusables();
  if (!focusables.length) {
    event.preventDefault();
    panel.focus();
    return;
  }
  const path = typeof event.composedPath === 'function' ? event.composedPath() : [];
  const target = (path[0] as Element | undefined) ?? (event.target as Element | null);
  const index = target ? focusables.indexOf(target as HTMLElement) : -1;
  const first = focusables[0]!;
  const last = focusables[focusables.length - 1]!;

  if (index === -1) {
    event.preventDefault();
    (event.shiftKey ? last : first).focus();
  } else if (event.shiftKey && index === 0) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && index === focusables.length - 1) {
    event.preventDefault();
    first.focus();
  }
}

const instanceId = Symbol('cu-sideover');
let registered = false;

function isTopmost() {
  return openInstances[openInstances.length - 1] === instanceId;
}

function onKeydown(e: KeyboardEvent) {
  if (!props.modelValue || !isTopmost()) return;
  if (e.key === 'Escape') {
    close();
    return;
  }
  if (e.key === 'Tab') trapTab(e);
}

function register() {
  if (registered) return;
  registered = true;
  openInstances.push(instanceId);
  lockBodyScroll();
  // `deepActiveElement` para que, dentro de un custom element, el foco vuelva
  // al control real del shadow (el host no siempre es enfocable).
  const active = deepActiveElement();
  trigger.value = active instanceof HTMLElement ? active : null;
  document.addEventListener('keydown', onKeydown);
  nextTick(() => {
    if (props.modelValue) focusFirst();
  });
}

function unregister() {
  if (!registered) return;
  registered = false;
  const index = openInstances.indexOf(instanceId);
  if (index !== -1) openInstances.splice(index, 1);
  unlockBodyScroll();
  document.removeEventListener('keydown', onKeydown);
  restoreFocus();
}

// Scroll lock + foco: el estado se sincroniza con la prop. `onMounted` cubre el
// montaje ya abierto (`v-if` del consumidor), que el `watch` no vería.
watch(() => props.modelValue, (open) => {
  if (open) register();
  else unregister();
});

onMounted(() => {
  if (props.modelValue) register();
});

onUnmounted(() => {
  unregister();
});

function close() {
  if (props.persistent) return;
  emit('update:modelValue', false);
  emit('close');
}

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
  <Teleport to="body" :disabled="!props.teleport">
    <Transition name="cu-sideover">
      <div
        v-if="modelValue"
        class="cu-sideover"
        :style="{ zIndex: props.zIndex }"
        role="dialog"
        aria-modal="true"
        :aria-labelledby="props.title ? titleId : undefined"
        :aria-label="dialogLabel"
      >
        <div class="cu-sideover-backdrop" @click="close"></div>
        <div
          ref="panelRef"
          class="cu-sideover-panel"
          tabindex="-1"
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
            <h2 v-if="props.title" :id="titleId" class="cu-sideover-title">{{ props.title }}</h2>
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
  /* Un preset mayor que el viewport no puede dejar el título fuera de pantalla. */
  max-width: 100%;
  max-height: 100%;
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

@media (prefers-reduced-motion: reduce) {
  .cu-sideover-enter-active,
  .cu-sideover-leave-active,
  .cu-sideover-enter-active .cu-sideover-panel,
  .cu-sideover-leave-active .cu-sideover-panel {
    transition: none;
  }
}
</style>