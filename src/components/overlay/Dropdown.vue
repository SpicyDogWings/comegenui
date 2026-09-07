<script setup lang="ts">
import { ref, computed, onMounted, getCurrentInstance, type PropType } from "vue";
import Button from "../buttons/Button.vue";
import Loader from "../information/Loader.vue";
import Popover from "./Popover.vue";
import LucideChevronRight from "@/components/icons/LucideChevronRight.vue";

export interface DropdownMenuItem {
  label?: string;
  to?: string;
  href?: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}

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
  icon: { type: String, required: false, default: "" },
  // Cómo se abre el panel: "click" (por defecto) o "hover" (abre al pasar el
  // mouse por el trigger y cierra al salir, con un pequeño delay).
  trigger: {
    type: String as PropType<'click' | 'hover'>,
    required: false,
    default: 'click',
  },
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
  delay: { type: Number, required: false, default: 2000 },
  // Items de menú nativos (hojas). Se renderizan como filas de menú con el
  // mismo estilo que el trigger de un submenú anidado. Útil para menús de
  // navegación sin tener que armar Buttons a mano.
  items: { type: Array as () => DropdownMenuItem[], required: false, default: () => [] },
});

const selectedValue = defineModel<string>({ default: "" });

const emit = defineEmits(["open", "close"]);

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);

// Un dropdown anidado (renderizado dentro del panel de otro dropdown) se
// comporta como un submenú en cascada: su trigger es una fila de menú nativa,
// se abre hacia la derecha y mantiene el padre abierto mientras se navega.
const isNested = ref(false);

function detectNested() {
  const el = popoverRef.value?.$el as HTMLElement | null;
  if (!el) return;
  let parent = el.parentElement;
  while (parent) {
    if (parent.classList.contains("cu-dropdown")) {
      isNested.value = true;
      return;
    }
    parent = parent.parentElement;
  }
}

onMounted(() => {
  detectNested();
});

// Si el usuario setea position explícitamente, respetarlo; si no, un dropdown
// anidado abre en cascada hacia la derecha.
const instance = getCurrentInstance();
const positionExplicit = computed(
  () => instance?.vnode?.props?.position !== undefined,
);

const effectivePosition = computed(() =>
  isNested.value && !positionExplicit.value ? "right" : props.position
);
const effectiveAlign = computed(() => props.align);

const panelClass = computed(() => ({
  "cu-dropdown-panel": true,
  "cu-dropdown-panel--loading": props.loading,
}));

function onItemClick(item: DropdownMenuItem) {
  if (item.disabled || item.divider) return;
  if (item.onClick) item.onClick();
  popoverRef.value?.close();
}

function get() { return selectedValue.value; }
function set(val: string) { selectedValue.value = val; }
function reset() { selectedValue.value = ""; }

defineExpose({
  open: () => popoverRef.value?.open(),
  close: () => popoverRef.value?.close(),
  toggle: () => popoverRef.value?.toggle(),
  get,
  set,
  reset,
  isOpen: () => popoverRef.value?.isOpen() ?? false,
});
</script>

<template>
  <Popover
    ref="popoverRef"
    :position="effectivePosition"
    :align="effectiveAlign"
    :offset="offset"
    :fixed="fixed"
    :panel-width="panelWidth"
    :disabled="disabled"
    :hover="trigger === 'hover'"
    :hover-delay="0"
    :role="'menu'"
    :panel-class="panelClass"
    class="cu-dropdown"
    :class="{ 'cu-dropdown--nested': isNested }"
    @open="emit('open')"
    @close="emit('close')"
  >
    <template #toggle="{ toggle, isOpen }">
      <slot name="toggle" :toggle="toggle" :isOpen="isOpen">
        <button
          v-if="isNested"
          type="button"
          class="cu-dropdown-menu-item"
          @click="toggle"
        >
          <span v-if="icon" class="cu-dropdown-menu-item-icon" v-html="icon"></span>
          <span class="cu-dropdown-menu-item-label">{{ label || "Submenú" }}</span>
          <LucideChevronRight :width="14" :height="14" class="cu-dropdown-menu-item-chevron" />
        </button>
        <Button
          v-else
          :color="color"
          :variant="variant"
          :disabled="disabled"
          @click="toggle"
        >
          {{ label || "Dropdown" }}
        </Button>
      </slot>
    </template>

    <Loader
      v-if="loading"
      :color="color"
      animation="loading"
    />
    <Loader
      v-if="cooldown && !loading"
      :key="cooldownKey"
      :color="color"
      animation="cooldown"
      :delay="delay"
    />
    <template v-if="!loading">
      <template v-for="(item, i) in props.items" :key="i">
        <hr v-if="item.divider" class="cu-dropdown-menu-divider" />
        <a
          v-else-if="item.to || item.href"
          :href="item.to || item.href"
          :class="['cu-dropdown-menu-item', { 'cu-dropdown-menu-item--disabled': item.disabled }]"
          @click="onItemClick(item)"
        >
          <span v-if="item.icon" class="cu-dropdown-menu-item-icon" v-html="item.icon"></span>
          <span class="cu-dropdown-menu-item-label">{{ item.label }}</span>
        </a>
        <button
          v-else
          type="button"
          :class="['cu-dropdown-menu-item', { 'cu-dropdown-menu-item--disabled': item.disabled }]"
          :disabled="item.disabled"
          @click="onItemClick(item)"
        >
          <span v-if="item.icon" class="cu-dropdown-menu-item-icon" v-html="item.icon"></span>
          <span class="cu-dropdown-menu-item-label">{{ item.label }}</span>
        </button>
      </template>
      <slot></slot>
    </template>
  </Popover>
</template>

<style scoped>
/* El wrapper: el motor (position/display) lo aporta .cu-popover. Acá solo
   ajustes específicos del dropdown sobre el panel del Popover. */

.cu-dropdown :deep(.cu-dropdown-panel--loading) {
  pointer-events: none;
}

/* Dropdown anidado: ocupa el ancho de la fila del menú padre y el panel en
   cascada es más angosto (auto) */
.cu-dropdown.cu-dropdown--nested {
  display: block;
  width: 100%;
  --cu-popover-width: auto;
  --cu-popover-min-width: 160px;
}

.cu-dropdown-panel--nested {
  padding: var(--cu-space-2xs);
}

/* Item de menú nativo (hojas + trigger de submenú anidado) */
.cu-dropdown-menu-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--cu-space-md);
  width: 100%;
  padding: var(--cu-space-sm) var(--cu-space-md);
  box-sizing: border-box;
  background: transparent;
  border: none;
  cursor: pointer;
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  text-decoration: none;
  border-radius: var(--cu-radius-sm);
  transition: background-color 150ms ease;
}

.cu-dropdown-menu-item:hover:not(.cu-dropdown-menu-item--disabled) {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.cu-dropdown-menu-item--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.cu-dropdown-menu-item-label {
  text-align: left;
  white-space: nowrap;
}

.cu-dropdown-menu-item-chevron {
  flex-shrink: 0;
  opacity: 0.5;
}

.cu-dropdown-menu-item-icon {
  flex-shrink: 0;
  opacity: 0.6;
}

.cu-dropdown-menu-divider {
  margin: var(--cu-space-2xs) 0;
  border: 0;
  border-top: var(--cu-border-thin) solid var(--cu-border-color);
}
</style>