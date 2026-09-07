<script setup lang="ts">
import { ref, computed, type PropType } from "vue";
import Button from "../buttons/Button.vue";
import Loader from "../information/Loader.vue";
import Popover from "./Popover.vue";

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
  panelWidth: { type: String, required: false, default: "" },
  loading: { type: Boolean, required: false, default: false },
  cooldown: { type: Boolean, required: false, default: false },
  cooldownKey: { type: Number, required: false, default: 0 },
  delay: { type: Number, required: false, default: 2000 },
});

const selectedValue = defineModel<string>({ default: "" });

const emit = defineEmits(["open", "close"]);

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);

const panelClass = computed(() => ({
  "cu-dropdown-panel": true,
  "cu-dropdown-panel--loading": props.loading,
}));

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
    :position="position"
    :align="align"
    :offset="offset"
    :fixed="fixed"
    :panel-width="panelWidth"
    :disabled="disabled"
    :role="'menu'"
    :panel-class="panelClass"
    class="cu-dropdown"
    @open="emit('open')"
    @close="emit('close')"
  >
    <template #toggle="{ toggle, isOpen }">
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
    <slot v-if="!loading"></slot>
  </Popover>
</template>

<style scoped>
/* El wrapper: el motor (position/display) lo aporta .cu-popover. Acá solo
   ajustes específicos del dropdown sobre el panel del Popover (que renderiza
   otro scope → usamos :deep). */
.cu-dropdown :deep(.cu-dropdown-panel--loading) {
  pointer-events: none;
}
</style>