<script setup lang="ts">
import { computed, useTemplateRef, type PropType } from "vue";

const props = defineProps({
  for: {
    type: String,
    required: false,
    default: "",
  },
  label: {
    type: String,
    required: false,
    default: "",
  },
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  hightContrast: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const colorStyles = computed(() => ({
  '--label-fg': `var(--cu-color-${props.color})`,
}));

const emit = defineEmits<{
  (e: 'click'): void
}>()

const labelRef = useTemplateRef<HTMLLabelElement>("label");

/**
 * Primer control del slot. En el custom element los hijos viven en el light DOM
 * del host (el `<label>` está en el shadow root), así que se mira el host; en
 * Vue, el `<label>` es el dueño real de los hijos.
 */
function slotControl(): HTMLElement | null {
  const label = labelRef.value;
  if (!label) return null;
  const root = label.getRootNode() as ShadowRoot | Document;
  const scope = (root as ShadowRoot).host ?? label;
  return Array.from(scope.children).find(
    (el): el is HTMLElement =>
      el instanceof HTMLElement && !el.classList.contains("cu-label-text"),
  ) ?? null;
}

/**
 * Enfoca el control. Si es un custom element (`<cu-input>`, `<cu-checkbox>`, …)
 * el host no es focuseable: se enfoca el control de su shadow root. En Vue el
 * slot es el componente (un `<div>`/`<label>` con el campo adentro), así que se
 * busca el control focuseable dentro del elemento.
 */
const FOCUSABLE = 'input:not([type="hidden"]), select, textarea, button, [tabindex]:not([tabindex="-1"])';

/** Control real a enfocar/activar: el del shadow root, el propio elemento o uno interno. */
function controlTarget(el: HTMLElement | null): HTMLElement | null {
  if (!el) return null;
  const inner =
    el.shadowRoot?.querySelector<HTMLElement>(FOCUSABLE)
    ?? (el.matches(FOCUSABLE) ? el : el.querySelector<HTMLElement>(FOCUSABLE));
  return inner ?? el;
}

const handleClick = (event: MouseEvent) => {
  const control = props.for ? document.getElementById(props.for) : slotControl();
  // Si el click nace en el control (checkbox, switch, input), que el control haga
  // lo suyo: no se duplica la activación.
  const path = event.composedPath?.() ?? [];
  const desdeElControl = !!control && (event.target === control || path.includes(control));

  if (!desdeElControl) {
    // El <label> nativo activaría al control; se cancela para hacerlo una sola
    // vez acá (y que funcione igual en Vue y con el custom element).
    event.preventDefault();
    const target = controlTarget(control);
    if (target) {
      // Como el <label> nativo: el control queda enfocado…
      target.focus();
      const esToggle =
        target instanceof HTMLInputElement && (target.type === 'checkbox' || target.type === 'radio');
      // …y un checkbox/radio además se activa (toggle). El resto sólo se enfoca.
      if (esToggle) target.click();
    }
  }
  emit('click');
};
</script>

<template>
  <label
    ref="label"
    :for="props.for || undefined"
    :style="colorStyles"
    class="cu-label"
    @click="handleClick"
  >
    <span v-if="props.label" class="cu-label-text">{{ props.label }}</span>
    <slot></slot>
  </label>
</template>

<style scoped>
.cu-label {
  display: inline-flex;
  flex-direction: column;
  gap: var(--cu-space-xs);
  font-family: var(--cu-font-sans);
}

.cu-label-text {
  width: fit-content;
  cursor: pointer;
  font-family: var(--cu-font-sans);
}

/* Clases duplicadas a propósito: le ganan a las reglas globales del
   consumidor que fuerzan color en label/span (p. ej. el playground:
   `.playground :is(..., span, label)` → (0,2,1)). Scoped compila a (0,3,0). */
.cu-label.cu-label,
.cu-label-text.cu-label-text {
  color: var(--label-fg);
}
</style>
