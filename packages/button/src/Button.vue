<script setup lang="ts">
import { computed, watch, type PropType } from "vue";
import { Primitive } from "reka-ui";

type Color = "primary" | "secondary" | "neutral" | "success" | "warning" | "danger";
type Variant = "solid" | "outlined" | "soft" | "ghost" | "subtle" | "link";
type Size = "sm" | "md" | "lg";
type Target = "_self" | "_blank" | "_parent" | "_top";
type ButtonType = "button" | "submit" | "reset";

const COLORS: readonly Color[] = ["primary", "secondary", "neutral", "success", "warning", "danger"];
const VARIANTS: readonly Variant[] = ["solid", "outlined", "soft", "ghost", "subtle", "link"];
const SIZES: readonly Size[] = ["sm", "md", "lg"];
const TARGETS: readonly Target[] = ["_self", "_blank", "_parent", "_top"];
const TYPES: readonly ButtonType[] = ["button", "submit", "reset"];

const isColor = (value: unknown): value is Color => COLORS.includes(value as Color);
const isVariant = (value: unknown): value is Variant => VARIANTS.includes(value as Variant);
const isSize = (value: unknown): value is Size => SIZES.includes(value as Size);
const isTarget = (value: unknown): value is Target => TARGETS.includes(value as Target);
const isButtonType = (value: unknown): value is ButtonType => TYPES.includes(value as ButtonType);

const props = defineProps({
  /** Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<Color>,
    required: false,
    default: "neutral",
    validator: (value: unknown) => ["primary", "secondary", "neutral", "success", "warning", "danger"].includes(value as string),
  },
  /** `solid`, `outlined`, `soft`, `ghost`, `subtle`, `link` */
  variant: {
    type: String as PropType<Variant>,
    required: false,
    default: "ghost",
    validator: (value: unknown) => ["solid", "outlined", "soft", "ghost", "subtle", "link"].includes(value as string),
  },
  /** Tamaño: `sm`, `md`, `lg` */
  size: {
    type: String as PropType<Size>,
    required: false,
    default: "md",
    validator: (value: unknown) => ["sm", "md", "lg"].includes(value as string),
  },
  /** Si se especifica, el botón se renderiza como `<a>` */
  to: {
    type: String,
    required: false,
  },
  /** Target del link cuando `to` está definido: `_self`, `_blank`, `_parent`, `_top` */
  target: {
    type: String as PropType<Target>,
    required: false,
    default: "_self",
    validator: (value: unknown) => ["_self", "_blank", "_parent", "_top"].includes(value as string),
  },
  /** Tipo del `<button>`: `button`, `submit`, `reset` */
  type: {
    type: String as PropType<ButtonType>,
    required: false,
    default: "button",
    validator: (value: unknown) => ["button", "submit", "reset"].includes(value as string),
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

const isDisabled = computed(() => props.disabled || props.loading);

// Un color fuera del set no tiene tokens: cae al color seguro.
const safeColor = computed(() => (isColor(props.color) ? props.color : "neutral"));
// Una variante fuera del set no tiene estilos: cae a `ghost`, el default.
const safeVariant = computed(() => (isVariant(props.variant) ? props.variant : "ghost"));
// `button` es el default; sin el fallback, `type="foo"` cae en el default del navegador (submit).
const buttonType = computed(() => (isButtonType(props.type) ? props.type : "button"));

// `to` puede venir de datos: un esquema ejecutable no se navega y el botón se
// renderiza como `<button>`. Los espacios/controles se ignoran para el chequeo.
const safeTo = computed(() => {
  const value = props.to?.trim();
  if (!value) return undefined;
  const compact = value.replace(/[\u0000-\u0020]+/g, "");
  if (/^(?:javascript|vbscript|data):/i.test(compact)) return undefined;
  return props.to;
});

const isLink = computed(() => !!safeTo.value);

function onLinkClick(event: MouseEvent) {
  if (!isDisabled.value) return;
  event.preventDefault();
  event.stopPropagation();
}

// Dentro del shadow DOM el `<button>` no es form-associated: su default no
// envía ni resetea el `<form>` del host. Se replica el submit/reset nativo.
// En Vue (light DOM) `getRootNode()` no es un ShadowRoot y manda el navegador.
function onButtonClick(event: MouseEvent) {
  if (buttonType.value !== "submit" && buttonType.value !== "reset") return;
  const button = event.currentTarget as HTMLButtonElement | null;
  const root = button?.getRootNode();
  if (!button || !(root instanceof ShadowRoot)) return;
  const host = root.host as HTMLElement | null;
  const formId = host?.getAttribute("form");
  const form = (formId ? document.getElementById(formId) : host?.closest("form")) as HTMLFormElement | null;
  if (!form) return;
  event.preventDefault();
  if (buttonType.value === "reset") {
    form.reset();
    return;
  }
  if (typeof form.requestSubmit !== "function") {
    form.submit();
    return;
  }
  if (button.formNoValidate) {
    const previous = form.noValidate;
    form.noValidate = true;
    try {
      form.requestSubmit();
    } finally {
      form.noValidate = previous;
    }
    return;
  }
  form.requestSubmit();
}

const emit = defineEmits<{
  /** Se dispara cuando cambia `loading`, con el estado nuevo. */
  (e: "loading-change", value: boolean): void;
}>();

watch(
  () => props.loading,
  (value) => emit("loading-change", value),
);

// Atributos del nodo raíz: Reka `Primitive` decide el tag (`a`/`button`).
const rootAttrs = computed(() => {
  if (isLink.value) {
    return {
      href: isDisabled.value ? undefined : safeTo.value,
      target: isDisabled.value ? undefined : props.target,
      rel: props.target === "_blank" && !isDisabled.value ? "noopener noreferrer" : undefined,
      role: isDisabled.value ? "link" : undefined,
      "aria-disabled": isDisabled.value ? "true" : undefined,
      "aria-busy": props.loading ? "true" : undefined,
      tabindex: isDisabled.value ? -1 : undefined,
      onClick: onLinkClick,
    };
  }

  return {
    type: buttonType.value,
    disabled: isDisabled.value,
    "aria-busy": props.loading ? "true" : undefined,
    onClick: onButtonClick,
  };
});

const colorStyles = computed(() => ({
  "--btn-ghost-hover": `var(--cu-color-${safeColor.value}-ghost-hover)`,
  "--btn-ghost-active": `var(--cu-color-${safeColor.value}-ghost-active)`,
  "--btn-soft": `var(--cu-color-${safeColor.value}-soft)`,
  "--btn-soft-hover": `var(--cu-color-${safeColor.value}-soft-hover)`,
  "--btn-soft-active": `var(--cu-color-${safeColor.value}-soft-active)`,
  "--btn-subtle": `var(--cu-color-${safeColor.value}-subtle)`,
  "--btn-subtle-hover": `var(--cu-color-${safeColor.value}-subtle-hover)`,
  "--btn-subtle-active": `var(--cu-color-${safeColor.value}-subtle-active)`,
  "--btn-subtle-border": `var(--cu-color-${safeColor.value}-subtle-border)`,
  "--btn-solid": `var(--cu-color-${safeColor.value}-solid)`,
  "--btn-solid-hover": `var(--cu-color-${safeColor.value}-solid-hover)`,
  "--btn-solid-active": `var(--cu-color-${safeColor.value}-solid-active)`,
  "--btn-solid-text": `var(--cu-color-${safeColor.value}-solid-text)`,
  // Texto por variante: gandalf lo emite medido contra el peor tinte de cada
  // familia (`-ghost-active-text` = 20 %, `-soft-active-text` = 35 %,
  // `-subtle-active-text` = 30 %), equivalente a `-text-on-*` de cu-tokens.
  "--btn-text": `var(--cu-color-${safeColor.value}-ghost-text)`,
  "--btn-text-ghost": `var(--cu-color-${safeColor.value}-ghost-active-text)`,
  "--btn-text-soft": `var(--cu-color-${safeColor.value}-soft-active-text)`,
  "--btn-text-subtle": `var(--cu-color-${safeColor.value}-subtle-active-text)`,
  // Borde medido contra `surface` (≥ 3:1): la variante ghost lo emite así.
  "--btn-border": `var(--cu-color-${safeColor.value}-ghost-border)`,
}));

const rootClasses = computed(() => [
  "cu-button",
  `cu-button--${safeVariant.value}`,
  `cu-button--${props.size}`,
  {
    "cu-button--disabled": isDisabled.value,
    "cu-button--icon-only": props.iconOnly,
    "cu-button-link": isLink.value,
  },
]);
</script>

<template>
  <Primitive
    :as="isLink ? 'a' : 'button'"
    :class="rootClasses"
    :style="colorStyles"
    v-bind="rootAttrs"
  >
    <svg
      v-if="props.loading"
      class="cu-button-spinner"
      xmlns="http://www.w3.org/2000/svg"
      width="1em"
      height="1em"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
    <!-- Contenido del botón (label y/o íconos SVG inline) -->
    <slot></slot>
  </Primitive>
</template>

<style scoped>
.cu-button {
  font-family: var(--cu-font-family-sans);
  text-decoration: none;
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  padding: var(--cu-space-3) var(--cu-space-4);
  border-radius: var(--cu-radius-default);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-1);
  box-sizing: border-box;
  transition: all 150ms ease;
}

.cu-button:active:not(.cu-button--disabled) {
  transform: scale(0.97);
}

.cu-button--disabled {
  /* gandalf expone el tono disabled como token (default 0.7). */
  opacity: var(--cu-opacity-disabled, 0.7);
  cursor: not-allowed;
}

/* sizes (md = base; link mantiene su padding 0) */
.cu-button--sm:not(.cu-button--link) {
  font-size: var(--cu-font-size-xs);
  padding: var(--cu-space-1) var(--cu-space-2);
}

.cu-button--lg:not(.cu-button--link) {
  font-size: var(--cu-font-size-lg);
  padding: var(--cu-space-4) var(--cu-space-6);
}

/* solid */
/* El relleno conserva el color del tema; el borde (`-border`, ≥3:1 contra la
   superficie) dibuja el límite del control cuando el relleno no llega solo. */
.cu-button.cu-button--solid {
  background-color: var(--btn-solid);
  color: var(--btn-solid-text);
  border: var(--cu-border-width) solid var(--btn-border);
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
  color: var(--btn-text-ghost);
}
.cu-button.cu-button--ghost:active:not(.cu-button--disabled) {
  background-color: var(--btn-ghost-active);
  color: var(--btn-text-ghost);
}

/* soft */
.cu-button.cu-button--soft {
  background-color: var(--btn-soft);
  color: var(--btn-text-soft);
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
  color: var(--btn-text-subtle);
  border: var(--cu-border-width) solid var(--btn-subtle-border);
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
  border: var(--cu-border-width) solid var(--btn-border);
}
.cu-button.cu-button--outlined:hover:not(.cu-button--disabled) {
  background-color: var(--btn-ghost-hover);
  color: var(--btn-text-ghost);
}
.cu-button.cu-button--outlined:active:not(.cu-button--disabled) {
  background-color: var(--btn-ghost-active);
  color: var(--btn-text-ghost);
}

/* link */
.cu-button.cu-button--link {
  background-color: transparent;
  color: var(--btn-text);
  padding: 0;
  box-shadow: none;
  text-decoration: underline;
  text-underline-offset: var(--cu-space-0-5);
}
.cu-button.cu-button--link:hover:not(.cu-button--disabled) {
  text-decoration-thickness: 2px;
}

/* link wrapper */
.cu-button-link {
  text-decoration: none;
}
.cu-button-link:hover {
  text-decoration: underline;
  text-underline-offset: var(--cu-space-0-5);
}
.cu-button-link.cu-button--disabled {
  opacity: var(--cu-opacity-disabled, 0.7);
  cursor: not-allowed;
}

/* icon-only: cuadrado. El `:not(.cu-button--link)` sube la especificidad para
   ganarle al padding de `.cu-button--sm/lg`; en `link` no aplica. */
.cu-button--icon-only:not(.cu-button-link) {
  padding: var(--cu-space-2);
}

/* `lg` mantiene la escala: 16 px de padding por lado (48×48 con un ícono de 16). */
.cu-button--lg.cu-button--icon-only:not(.cu-button-link) {
  padding: var(--cu-space-4);
}

/* loading spinner */
.cu-button-spinner {
  animation: cu-spin 0.8s linear infinite;
}

@keyframes cu-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
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
