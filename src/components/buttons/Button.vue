<script setup lang="ts">
import { computed, watch, type PropType } from "vue";
import { isButtonType, isColor, isSize, isTarget, isVariantFull } from '@/utils/validators'
import LucideLoader from "@/components/icons/LucideLoader.vue";

const props = defineProps({
  /** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
    validator: isColor,
  },
  /** `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link`, `none` */
  variant: {
    type: String as PropType<'solid' | 'outlined' | 'soft' | 'ghost' | 'subtle' | 'link' | 'none'>,
    required: false,
    default: "ghost",
    validator: isVariantFull,
  },
  /** Tamaño: `sm`, `md`, `lg` */
  size: {
    type: String as PropType<'sm' | 'md' | 'lg'>,
    required: false,
    default: 'md',
    validator: isSize,
  },
  /** Si se especifica, el botón se renderiza como `<a>` */
  to: {
    type: String,
    required: false,
  },
  /** Target del link cuando `to` está definido: `_self`, `_blank`, `_parent`, `_top` */
  target: {
    type: String as PropType<'_self' | '_blank' | '_parent' | '_top'>,
    required: false,
    default: "_self",
    validator: isTarget,
  },
  /** Tipo del `<button>`: `button`, `submit`, `reset` */
  type: {
    type: String as PropType<'button' | 'submit' | 'reset'>,
    required: false,
    default: 'button',
    validator: isButtonType,
  },
  /** Estado deshabilitado */
  disabled: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Antepone un spinner al contenido. Deshabilita el botón mientras está activo */
  loading: {
    type: Boolean,
    required: false,
    default: false,
  },
  /** Padding cuadrado para un botón de solo icono. El contenido necesita nombre accesible (`aria-label` o texto) */
  iconOnly: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const isDisabled = computed(() => props.disabled || props.loading)

// Un color fuera del set no tiene tokens: el botón quedaba sin fondo y con el
// texto del tema encima (invisible en light). Cae al color seguro.
const safeColor = computed(() => (isColor(props.color) ? props.color : 'neutral'))

// `button` es el default; sin el fallback, `type="foo"` cae en el default del
// navegador para un valor inválido, que es submit.
const buttonType = computed(() => (isButtonType(props.type) ? props.type : 'button'))

// `to` puede venir de datos: un esquema ejecutable no se navega y el botón se
// renderiza como `<button>`. Los espacios/controles se ignoran para el chequeo
// (`java\tscript:`), igual que hace el navegador al resolver el esquema.
const safeTo = computed(() => {
  const value = props.to?.trim()
  if (!value) return undefined
  const compact = value.replace(/[\u0000-\u0020]+/g, '')
  if (/^(?:javascript|vbscript|data):/i.test(compact)) return undefined
  return props.to
})

function onLinkClick(event: MouseEvent) {
  if (!isDisabled.value) return
  event.preventDefault()
  event.stopPropagation()
}

// Dentro del shadow DOM el `<button>` no es form-associated: su default no
// envía ni resetea el `<form>` del host. Se replica el submit/reset nativo.
// En Vue (light DOM) `getRootNode()` no es un ShadowRoot y manda el navegador.
function onButtonClick(event: MouseEvent) {
  if (buttonType.value !== 'submit' && buttonType.value !== 'reset') return
  const button = event.currentTarget as HTMLButtonElement | null
  const root = button?.getRootNode()
  if (!button || !(root instanceof ShadowRoot)) return
  const host = root.host as HTMLElement | null
  const formId = host?.getAttribute('form')
  const form = (formId ? document.getElementById(formId) : host?.closest('form')) as HTMLFormElement | null
  if (!form) return
  event.preventDefault()
  if (buttonType.value === 'reset') {
    form.reset()
    return
  }
  if (typeof form.requestSubmit !== 'function') {
    form.submit()
    return
  }
  if (button.formNoValidate) {
    const previous = form.noValidate
    form.noValidate = true
    try {
      form.requestSubmit()
    } finally {
      form.noValidate = previous
    }
    return
  }
  form.requestSubmit()
}

const emit = defineEmits<{
  /** Se dispara cuando cambia `loading`, con el estado nuevo. */
  (e: 'loading-change', value: boolean): void
}>()

// Notifica los cambios de estado de `loading` (el host CE lo recibe como
// CustomEvent `loading-change` con detail: boolean).
watch(() => props.loading, (value) => emit('loading-change', value))

const colorStyles = computed(() => ({
  '--btn-ghost-hover': `var(--cu-color-${safeColor.value}-ghost-hover)`,
  '--btn-ghost-active': `var(--cu-color-${safeColor.value}-ghost-active)`,
  '--btn-soft': `var(--cu-color-${safeColor.value}-soft)`,
  '--btn-soft-hover': `var(--cu-color-${safeColor.value}-soft-hover)`,
  '--btn-soft-active': `var(--cu-color-${safeColor.value}-soft-active)`,
  '--btn-subtle': `var(--cu-color-${safeColor.value}-subtle)`,
  '--btn-subtle-hover': `var(--cu-color-${safeColor.value}-subtle-hover)`,
  '--btn-subtle-active': `var(--cu-color-${safeColor.value}-subtle-active)`,
  '--btn-subtle-border': `var(--cu-color-${safeColor.value}-subtle-border)`,
  // Solid/none: el fondo es la variante segura (ajustada por el generador) y el
  // texto sigue siendo el del tema — nunca un negro/blanco elegido por color.
  '--btn-solid': `var(--cu-color-${safeColor.value}-solid)`,
  '--btn-solid-hover': `var(--cu-color-${safeColor.value}-solid-hover)`,
  '--btn-solid-active': `var(--cu-color-${safeColor.value}-solid-active)`,
  '--btn-solid-text': `var(--cu-color-surface)`,
  // Texto sobre superficie o tintes (ghost/soft/subtle/outlined/link): el color
  // adaptado al tema, no el color crudo.
  '--btn-text': `var(--cu-color-${safeColor.value}-text)`,
  // Borde de outlined sobre superficie (>= 3:1).
  '--btn-border': `var(--cu-color-${safeColor.value}-border)`,
}))

// Mismas clases para `<button>` y para el `<a>` del modo link: antes el `<a>`
// envolvía a un `<button>` (dos nodos interactivos, HTML inválido).
const rootClasses = computed(() => [
  'cu-button',
  `cu-button--${props.variant}`,
  `cu-button--${props.size}`,
  {
    'cu-button--disabled': isDisabled.value,
    'cu-button--icon-only': props.iconOnly,
    'cu-button-link': !!safeTo.value,
  },
])
</script>

<template>
  <a
    v-if="safeTo"
    :href="isDisabled ? undefined : safeTo"
    :target="isDisabled ? undefined : props.target"
    :rel="props.target === '_blank' && !isDisabled ? 'noopener noreferrer' : undefined"
    :role="isDisabled ? 'link' : undefined"
    :aria-disabled="isDisabled ? 'true' : undefined"
    :aria-busy="props.loading ? 'true' : undefined"
    :tabindex="isDisabled ? -1 : undefined"
    :class="rootClasses"
    :style="colorStyles"
    @click="onLinkClick"
  >
    <LucideLoader
      v-if="props.loading"
      class="cu-button-spinner"
      aria-hidden="true"
      focusable="false"
    />
    <!-- Contenido del botón (label y/o íconos SVG inline) -->
    <slot></slot>
  </a>
  <button
    v-else
    :type="buttonType"
    :class="rootClasses"
    :style="colorStyles"
    :disabled="isDisabled"
    :aria-busy="props.loading ? 'true' : undefined"
    @click="onButtonClick"
  >
    <LucideLoader
      v-if="props.loading"
      class="cu-button-spinner"
      aria-hidden="true"
      focusable="false"
    />
    <!-- Contenido del botón (label y/o íconos SVG inline) -->
    <slot></slot>
  </button>
</template>

<style scoped>
.cu-button {
  font-family: var(--cu-font-sans);
  text-decoration: none;
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  padding: var(--cu-space-md) var(--cu-space-lg);
  border-radius: var(--cu-radius);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-xs);
  box-sizing: border-box;
  transition: all 150ms ease;
}

.cu-button:active:not(.cu-button--disabled) {
  transform: scale(0.97);
}

.cu-button--disabled {
  opacity: var(--cu-alpha-disabled, 0.7);
  cursor: not-allowed;
}

/* sizes (md = base; link mantiene su padding 0) */
.cu-button--sm:not(.cu-button--link) {
  font-size: var(--cu-font-size-xs);
  padding: var(--cu-space-xs) var(--cu-space-sm);
}

.cu-button--lg:not(.cu-button--link) {
  font-size: var(--cu-font-size-lg);
  padding: var(--cu-space-lg) var(--cu-space-xl);
}

/* solid */
.cu-button.cu-button--solid {
  background-color: var(--btn-solid);
  color: var(--btn-solid-text);
}
.cu-button.cu-button--solid:hover:not(.cu-button--disabled) {
  background-color: var(--btn-solid-hover);
}
.cu-button.cu-button--solid:active:not(.cu-button--disabled) {
  background-color: var(--btn-solid-active);
}

/* ghost */
.cu-button.cu-button--ghost {
  background-color: transparent;
  color: var(--btn-text);
}
.cu-button.cu-button--ghost:hover:not(.cu-button--disabled) {
  background-color: var(--btn-ghost-hover);
}
.cu-button.cu-button--ghost:active:not(.cu-button--disabled) {
  background-color: var(--btn-ghost-active);
}

/* soft */
.cu-button.cu-button--soft {
  background-color: var(--btn-soft);
  color: var(--btn-text);
}
.cu-button.cu-button--soft:hover:not(.cu-button--disabled) {
  background-color: var(--btn-soft-hover);
}
.cu-button.cu-button--soft:active:not(.cu-button--disabled) {
  background-color: var(--btn-soft-active);
}

/* subtle */
.cu-button.cu-button--subtle {
  background-color: var(--btn-subtle);
  color: var(--btn-text);
  border: var(--cu-border-thin) solid var(--btn-subtle-border);
}
.cu-button.cu-button--subtle:hover:not(.cu-button--disabled) {
  background-color: var(--btn-subtle-hover);
}
.cu-button.cu-button--subtle:active:not(.cu-button--disabled) {
  background-color: var(--btn-subtle-active);
}

/* outlined */
.cu-button.cu-button--outlined {
  background-color: transparent;
  color: var(--btn-text);
  border: var(--cu-border-thin) solid var(--btn-border);
}
.cu-button.cu-button--outlined:hover:not(.cu-button--disabled) {
  background-color: var(--btn-ghost-hover);
}
.cu-button.cu-button--outlined:active:not(.cu-button--disabled) {
  background-color: var(--btn-ghost-active);
}

/* link */
.cu-button.cu-button--link {
  background-color: transparent;
  color: var(--btn-text);
  padding: 0;
  box-shadow: none;
  text-decoration: underline;
  text-underline-offset: var(--cu-space-2xs);
}
.cu-button.cu-button--link:hover:not(.cu-button--disabled) {
  text-decoration-thickness: 2px;
}

/* none */
.cu-button.cu-button--none {
  background-color: var(--btn-solid);
  color: var(--btn-solid-text);
}
.cu-button.cu-button--none:hover:not(.cu-button--disabled) {
  background-color: var(--btn-solid-hover);
}
.cu-button.cu-button--none:active:not(.cu-button--disabled) {
  background-color: var(--btn-solid-active);
}

/* link wrapper */
.cu-button-link {
  text-decoration: none;
}
.cu-button-link:hover {
  text-decoration: underline;
  text-underline-offset: var(--cu-space-2xs);
}
.cu-button-link.cu-button--disabled {
  opacity: var(--cu-alpha-disabled, 0.7);
  cursor: not-allowed;
}

/* icon-only */
.cu-button--icon-only {
  padding: var(--cu-space-sm);
}

/* loading spinner */
.cu-button-spinner {
  animation: cu-spin 0.8s linear infinite;
}

@keyframes cu-spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (prefers-reduced-motion: reduce) {
  .cu-button {
    transition: none;
  }
  .cu-button:active:not(.cu-button--disabled) {
    transform: none;
  }
  .cu-button-spinner {
    animation: none;
  }
}
</style>
