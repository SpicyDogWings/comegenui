<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, type PropType } from "vue";

const props = defineProps({
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
  panelWidth: { type: String, required: false, default: "" },
  disabled: { type: Boolean, required: false, default: false },
  // hover: abre con mouseenter, cierra con mouseleave (para tooltip/contextual).
  hover: { type: Boolean, required: false, default: false },
  hoverDelay: { type: Number, required: false, default: 200 },
  // role del panel (menu, tooltip, dialog...) y clase extra del panel.
  role: { type: String, required: false, default: "" },
  panelClass: {
    type: [String, Array, Object] as PropType<string | string[] | Record<string, boolean>>,
    required: false,
    default: "",
  },
});

const emit = defineEmits(["open", "close"]);

const effectivePosition = computed(() => props.position);
const effectiveAlign = computed(() => props.align);

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

const isOpen = ref(false);
const popoverRef = ref<HTMLElement | null>(null);

// Un click fuera del popover cierra el panel en fase CAPTURA. Si el mismo click
// dispara un toggle() externo, el flag marca "este click ya cerró" y no reabre.
let closedByOutsideClick = false;

function onDocumentClick(e: MouseEvent) {
  if (!isOpen.value || !popoverRef.value) return;
  if (!e.composedPath().includes(popoverRef.value)) {
    closedByOutsideClick = true;
    isOpen.value = false;
    emit("close");
    setTimeout(() => { closedByOutsideClick = false; }, 0);
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
  document.addEventListener("scroll", onViewportChange, true);
});
onUnmounted(() => {
  document.removeEventListener("click", onDocumentClick, true);
  document.removeEventListener("keydown", onKeyDown);
  window.removeEventListener("resize", onViewportChange);
  document.removeEventListener("scroll", onViewportChange, true);
});

// Recalcula la posición del panel en modo fixed (coordenadas de viewport) al
// abrir y en cada scroll/resize mientras está abierto.
function positionPanel() {
  if (!props.fixed || !popoverRef.value) return;
  const r = popoverRef.value.getBoundingClientRect();
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
  } else {
    style.right = `${vw - r.left + props.offset}px`;
    if (align === "start") style.top = `${r.top}px`;
    else if (align === "end") style.bottom = `${vh - r.bottom}px`;
    else { style.top = `${r.top + r.height / 2}px`; style.transform = "translateY(-50%)"; }
  }
  panelPos.value = style;
}

function onViewportChange() {
  if (isOpen.value && props.fixed) positionPanel();
}

let hoverTimer: ReturnType<typeof setTimeout> | null = null;

function onMouseEnter() {
  if (!props.hover || props.disabled) return;
  if (hoverTimer) clearTimeout(hoverTimer);
  hoverTimer = setTimeout(() => open(), props.hoverDelay);
}

function onMouseLeave() {
  if (!props.hover) return;
  if (hoverTimer) clearTimeout(hoverTimer);
  close();
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
  if (closedByOutsideClick) {
    closedByOutsideClick = false;
    return;
  }
  if (isOpen.value) close();
  else open();
}

defineExpose({ open, close, toggle, isOpen: () => isOpen.value });
</script>

<template>
  <div
    ref="popoverRef"
    class="cu-popover"
    @mouseenter="onMouseEnter"
    @mouseleave="onMouseLeave"
  >
    <slot name="toggle" :toggle="toggle" :isOpen="isOpen" />
    <div
      v-if="isOpen"
      :style="panelStyle"
      :class="['cu-popover-panel', panelClass]"
      :role="role || undefined"
    >
      <slot />
    </div>
  </div>
</template>

<style scoped>
.cu-popover {
  position: relative;
  display: inline-block;
  box-sizing: border-box;
}

.cu-popover-panel {
  padding: var(--cu-space-sm);
  border-radius: var(--cu-radius-md);
  font-family: var(--cu-font-sans);
  box-shadow: var(--cu-shadow-xl);
}
</style>