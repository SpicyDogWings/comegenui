<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type PropType } from "vue";
import Button from "./buttons/Button.vue";

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
  placement: { type: String, required: false, default: "bottom-start" },
  position: {
    type: String,
    required: false,
    default: "",
    validator: (value: string) => ["", "bottom", "top", "left", "right"].includes(value),
  },
  align: {
    type: String,
    required: false,
    default: "",
    validator: (value: string) => ["", "start", "center", "end"].includes(value),
  },
  offset: { type: Number, required: false, default: 4 },
  fixed: { type: Boolean, required: false, default: false },
  // Ancho del panel (CSS, ej: "280px"). Default "" = width:100% del trigger.
  // Útil cuando el contenido del panel es más ancho que el trigger (ej: un calendario).
  panelWidth: { type: String, required: false, default: "" },
});

const effectivePosition = computed(() => props.position || props.placement.split("-")[0] || "bottom");
const effectiveAlign = computed(() => props.align || props.placement.split("-")[1] || "start");

const panelPos = ref({ top: "0px", left: "0px" });

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
      top: panelPos.value.top,
      left: panelPos.value.left,
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
});
onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick, true);
  document.removeEventListener("keydown", onKeyDown);
});

function open() {
  if (props.disabled) return;
  if (props.fixed && dropdownRef.value) {
    const r = dropdownRef.value.getBoundingClientRect();
    const pos = effectivePosition.value;
    // Mitad del panel (min-width 200px) para centrar en modo fixed.
    const half = 100;
    const alignH = (align: string) =>
      align === "start" ? r.left : align === "end" ? r.right - half * 2 : r.left + r.width / 2 - half;
    const alignV = (align: string) =>
      align === "start" ? r.top : align === "end" ? r.bottom - half * 2 : r.top + r.height / 2 - half;
    const t = pos === "bottom" ? r.bottom + props.offset
      : pos === "top" ? r.top - props.offset
      : alignV(effectiveAlign.value);
    const l = pos === "right" ? r.right + props.offset
      : pos === "left" ? r.left - props.offset
      : alignH(effectiveAlign.value);
    panelPos.value = { top: `${Math.max(0, t)}px`, left: `${Math.max(0, l)}px` };
  }
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
      role="menu"
    >
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
</style>
