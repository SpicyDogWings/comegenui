<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type PropType } from "vue";
import Button from "../buttons/Button.vue";

const props = defineProps({
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    required: false,
    default: "neutral",
  },
  variant: {
    type: String,
    required: false,
    default: "ghost",
    validator: (value: string) =>
      ["solid", "outlined", "soft", "ghost", "subtle", "link", "none"].includes(value),
  },
  disabled: { type: Boolean, required: false, default: false },
  label: { type: String, required: false, default: "" },
  position: {
    type: String,
    required: false,
    default: "bottom",
    validator: (value: string) => ["bottom", "top", "left", "right"].includes(value),
  },
  align: {
    type: String,
    required: false,
    default: "start",
    validator: (value: string) => ["start", "center", "end"].includes(value),
  },
  offset: { type: Number, required: false, default: 4 },
  fixed: { type: Boolean, required: false, default: false },
  // Ancho del panel (CSS, ej: "280px"). Default "" = width:100% del trigger.
  // Útil cuando el contenido del panel es más ancho que el trigger (ej: un calendario).
  panelWidth: { type: String, required: false, default: "" },
  loading: { type: Boolean, required: false, default: false },
  cooldown: { type: Boolean, required: false, default: false },
  cooldownKey: { type: Number, required: false, default: 0 },
  cooldownVariant: { type: String, required: false, default: "ghost" },
  delay: { type: Number, required: false, default: 2000 },
});

const effectivePosition = computed(() => props.position);
const effectiveAlign = computed(() => props.align);

const cooldownColor = computed(() => {
  if (props.cooldownVariant === "solid") return `var(--cu-color-${props.color})`;
  return `var(--cu-color-${props.color}-ghost-hover)`;
});

const panelPos = ref<Record<string, string>>({ top: "0px", left: "0px" });

const panelStyle = computed(() => {
  const base: Record<string, string> = {
    backgroundColor: "var(--cu-color-surface)",
    minWidth: "200px",
    maxWidth: "80vw",
  };

  if (props.fixed) {
    return {
      ...base,
      position: "fixed",
      ...panelPos.value,
      zIndex: "10000",
      ...(props.panelWidth ? { width: props.panelWidth } : {}),
    };
  }

  base.position = "absolute";
  base.zIndex = "1000";
  base.width = props.panelWidth || "100%";

  // Eje vertical (bottom/top) → panel abajo/arriba del trigger; eje horizontal (left/right) → a los costados.
  const pos = effectivePosition.value;
  if (pos === "bottom") {
    base.top = "100%";
    base.marginTop = `${props.offset}px`;
  } else if (pos === "top") {
    base.bottom = "100%";
    base.marginBottom = `${props.offset}px`;
  } else if (pos === "right") {
    base.left = "100%";
    base.marginLeft = `${props.offset}px`;
  } else if (pos === "left") {
    base.right = "100%";
    base.marginRight = `${props.offset}px`;
  }

  // Alineación: horizontal para bottom/top, vertical para left/right.
  if (pos === "left" || pos === "right") {
    if (effectiveAlign.value === "start") {
      base.top = "0";
    } else if (effectiveAlign.value === "end") {
      base.bottom = "0";
    } else {
      base.top = "50%";
      base.transform = "translateY(-50%)";
    }
  } else {
    if (effectiveAlign.value === "start") {
      base.left = "0";
    } else if (effectiveAlign.value === "end") {
      base.right = "0";
    } else {
      base.left = "50%";
      base.transform = "translateX(-50%)";
    }
  }

  return base;
});

const selectedValue = defineModel<string>({ default: "" });

const emit = defineEmits(["open", "close"]);
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

function onDocumentClick(e: MouseEvent) {
  if (!isOpen.value || !dropdownRef.value) return;
  if (!e.composedPath().includes(dropdownRef.value)) {
    isOpen.value = false;
    emit("close");
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === "Escape" && isOpen.value) {
    isOpen.value = false;
    emit("close");
  }
}

onMounted(() => {
  document.addEventListener("click", onDocumentClick, true);
  document.addEventListener("keydown", onKeyDown);
  window.addEventListener("resize", onViewportChange);
  // capture: captura el scroll de TODOS los contenedores (página y overflow interno tipo tabla)
  document.addEventListener("scroll", onViewportChange, true);
});
onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick, true);
  document.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("resize", onViewportChange);
  document.removeEventListener("scroll", onViewportChange, true);
});

// Recalcula la posición del panel en modo fixed (coordenadas de viewport). Se llama al
// abrir y de nuevo en cada scroll/resize mientras está abierto: como el panel es
// position: fixed, no sigue solo al trigger cuando scrollea la página o un contenedor
// interno (ej. la tabla con overflow) — sin esto quedaría flotando en las coordenadas
// viejas (o escondido si quedó fuera de pantalla).
function positionPanel() {
  if (!props.fixed || !dropdownRef.value) return;
  // El modo fixed espeja EXACTAMENTE el modo absolute pero en coordenadas de viewport:
  // en vez de "top: 100% / bottom: 100% / left: 100% / right: 100%" sobre el trigger,
  // usamos top/bottom/left/right del viewport calculados con getBoundingClientRect.
  // Importante: para top/left el panel se ancla por el borde OPUESTO (bottom/right) —
  // si se usara "top: r.top - offset" el panel crecería hacia abajo y taparía el trigger.
  // El centrado usa transform (no estima el ancho/alto del panel).
  const r = dropdownRef.value.getBoundingClientRect();
  const vw = window.innerWidth;
  const vh = window.innerHeight;
  const pos = effectivePosition.value;
  const align = effectiveAlign.value;
  const style: Record<string, string> = {};

  if (pos === "bottom") {
    style.top = `${r.bottom + props.offset}px`;
    if (align === "start") style.left = `${r.left}px`;
    else if (align === "end") style.right = `${vw - r.right}px`;
    else { style.left = `${r.left + r.width / 2}px`; style.transform = "translateX(-50%)"; }
  } else if (pos === "top") {
    style.bottom = `${vh - r.top + props.offset}px`;
    if (align === "start") style.left = `${r.left}px`;
    else if (align === "end") style.right = `${vw - r.right}px`;
    else { style.left = `${r.left + r.width / 2}px`; style.transform = "translateX(-50%)"; }
  } else if (pos === "right") {
    style.left = `${r.right + props.offset}px`;
    if (align === "start") style.top = `${r.top}px`;
    else if (align === "end") style.bottom = `${vh - r.bottom}px`;
    else { style.top = `${r.top + r.height / 2}px`; style.transform = "translateY(-50%)"; }
  } else { // left
    style.right = `${vw - r.left + props.offset}px`;
    if (align === "start") style.top = `${r.top}px`;
    else if (align === "end") style.bottom = `${vh - r.bottom}px`;
    else { style.top = `${r.top + r.height / 2}px`; style.transform = "translateY(-50%)"; }
  }
  panelPos.value = style;
}

// Mientras el panel está abierto en modo fixed, re-posicionarlo en cada scroll/resize
// para que siga al trigger (el fixed no se mueve solo con el contenido).
function onViewportChange() {
  if (isOpen.value && props.fixed) positionPanel();
}

function open() {
  if (props.disabled) return;
  positionPanel();
  isOpen.value = true;
  emit("open");
}
function close() {
  isOpen.value = false;
  emit("close");
}
function toggle() {
  if (props.disabled) return;
  if (isOpen.value) close();
  else open();
}

function get() { return selectedValue.value; }
function set(val: string) { selectedValue.value = val; }
function reset() { selectedValue.value = ""; }

defineExpose({ open, close, toggle, get, set, reset, isOpen: () => isOpen.value });
</script>

<template>
  <div ref="dropdownRef" class="cu-dropdown">
    <slot name="toggle" :toggle="toggle" :isOpen="isOpen">
      <Button
        :color="color"
        :variant="variant"
        :disabled="disabled"
        @click="toggle"
      >
        {{ label || "Dropdown" }}
      </Button>
    </slot>

    <div
      v-if="isOpen"
      :style="panelStyle"
      class="cu-dropdown-panel"
      :class="{ 'cu-dropdown-panel--loading': loading }"
      role="menu"
    >
      <div v-if="loading" class="cu-dropdown-loader">
        <div
          class="cu-dropdown-loader-bar"
          :style="{ '--cu-dropdown-color': `var(--cu-color-${color}-soft)` }"
        />
      </div>
      <div v-if="cooldown && !loading" class="cu-dropdown-cooldown">
        <div
          :key="cooldownKey"
          class="cu-dropdown-cooldown-bar"
          :style="{ '--cu-dropdown-delay': `${delay}ms`, '--cu-dropdown-color': cooldownColor }"
        />
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
.cu-dropdown {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
}

.cu-dropdown-panel {
  padding: var(--cu-space-sm);
  border-radius: var(--cu-radius-md);
  font-family: var(--cu-font-sans);
  box-shadow: var(--cu-shadow-xl);
}

.cu-dropdown-panel--loading {
  opacity: 0.6;
  pointer-events: none;
}

.cu-dropdown-loader {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  overflow: hidden;
  height: 3px;
  background: var(--cu-color-neutral-subtle, rgba(0, 0, 0, 0.08));
}

.cu-dropdown-loader-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: var(--cu-dropdown-color, var(--cu-color-primary));
  animation: cu-dropdown-cooldown var(--cu-dropdown-delay, 2000ms) linear forwards;
}

.cu-dropdown-cooldown {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 30;
  overflow: hidden;
  height: 2px;
  background: transparent;
}

.cu-dropdown-cooldown-bar {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  background: var(--cu-dropdown-color, var(--cu-color-primary));
  animation: cu-dropdown-cooldown var(--cu-dropdown-delay, 2000ms) linear forwards;
}

@keyframes cu-dropdown-cooldown {
  from { width: 100%; }
  to { width: 0%; }
}
</style>
