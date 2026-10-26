<script setup lang="ts">
import type { PropType } from "vue";
import { isColor, isTarget, isVariantFull } from "@/utils/validators";
import Button from "../buttons/Button.vue";
import LucideCheck from "@/components/icons/LucideCheck.vue";

// Fila de menú compartida por Select, Autocomplete y DropdownMenu: ícono + label y,
// cuando `selected`, el check de lucide al final. Es el ÚNICO lugar que dibuja el
// check; las tres listas consumen este componente. Interno: sin wrapper CE, sin
// entry en `src/lib/` y sin ficha propia.
const props = defineProps({
  /** Texto visible de la fila */
  label: { type: String, required: false, default: "" },
  /** SVG completo inline (`<svg>...</svg>`) */
  icon: { type: String, required: false, default: "" },
  /** Clase del ícono; cada lista conserva la suya (`cu-autocomplete-icon`, …) */
  iconClass: { type: String, required: false, default: "cu-menu-option-icon" },
  /** Color semántico del item */
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
  /** Item deshabilitado (no clickeable, atenuado) */
  disabled: { type: Boolean, required: false, default: false },
  /** Si se especifica, la fila se renderiza como link (`<a>`) */
  href: { type: String, required: false, default: "" },
  /** Target del link cuando hay `href`: `_self`, `_blank`, `_parent`, `_top` */
  target: {
    type: String as PropType<'_self' | '_blank' | '_parent' | '_top'>,
    required: false,
    default: "_self",
    validator: isTarget,
  },
  /** Muestra el check de lucide al final de la fila */
  selected: { type: Boolean, required: false, default: false },
});
</script>

<template>
  <Button
    :color="props.color"
    :variant="props.variant"
    :to="props.href || undefined"
    :target="props.target"
    :disabled="props.disabled"
  >
    <span class="cu-menu-option-main">
      <span v-if="props.icon" v-html="props.icon" :class="props.iconClass"></span>
      <span v-if="props.label">{{ props.label }}</span>
    </span>
    <LucideCheck v-if="props.selected" class="cu-menu-option-check" aria-hidden="true" />
  </Button>
</template>

<style scoped>
/* El bloque ícono + label ocupa el espacio libre de la fila, así el check queda pegado
   al borde derecho sin importar `textAlign`; `justify-content` sigue alineando el bloque
   dentro de ese espacio (hereda el del `Button`, que pone `textAlignStyle`). */
.cu-menu-option-main {
  display: flex;
  align-items: center;
  justify-content: inherit;
  gap: inherit;
  flex: 1 1 auto;
  min-width: 0;
}

.cu-menu-option-check {
  flex-shrink: 0;
}
</style>
