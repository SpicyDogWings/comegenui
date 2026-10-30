<script setup lang="ts">
import { ref, watch, getCurrentInstance, type PropType } from "vue";
import SideOver from "../../overlay/SideOver.vue";

const props = defineProps({
  /** Estado de visibilidad (v-model). Ver nota de atributo abajo */
  open: { type: Boolean, default: false },
  /** Título de la cabecera (si está vacío y no es `persistent`, igual muestra el botón de cerrar) */
  title: { type: String, default: "" },
  /** Borde desde donde desliza: `left`, `right`, `top`, `bottom` */
  position: { type: String as PropType<'bottom' | 'top' | 'left' | 'right'>, default: "right" },
  /** Ancho (`left`/`right`) o alto (`top`/`bottom`) del panel. Valor CSS (`300px`, `40vw`) o preset: `sm`, `md`, `lg`, `xl`, `full`. Ignorado con `fullscreen` */
  size: { type: String, default: "300px" },
  /** Ocupa toda la pantalla */
  fullscreen: { type: Boolean, default: false },
  /** Si es `true`, no se cierra por backdrop, `Escape` ni el botón de cerrar */
  persistent: { type: Boolean, default: false },
  /** Z-index del overlay (en HTML se usa como `z-index`) */
  zIndex: { type: Number, default: 1100 },
});

/** Devuelve el estado actual (`boolean`) */
const isOpen = ref(props.open);
watch(() => props.open, (value) => {
  isOpen.value = value;
});

const instance = getCurrentInstance();
function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = el?.getRootNode()?.host || el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, {
      detail: payload,
      bubbles: true,
      composed: true,
    }));
  }
}

function onUpdate(value: boolean) {
  setOpen(value);
}

// Todo cambio de estado pasa por acá: `show()`, `close()`, `toggle()` y las
// acciones internas (backdrop, Escape, botón) emiten `update:open`; al cerrarse
// se emite `close`. Antes los métodos no emitían nada y `update:open` nunca
// llegaba al consumidor.
function setOpen(value: boolean) {
  if (isOpen.value === value) return;
  isOpen.value = value;
  ceEmit("update:open", value);
  if (!value) ceEmit("close", undefined);
}

// Se llama `show()` y no `open()` porque `open` es la prop booleana del CE: en
// el elemento registrado, la prop tapa al método (`el.open` es un booleano).
// Mismo patrón que `<dialog>` (`open` + `show()`).
/** Abre el panel */
function show() { setOpen(true); }
/** Cierra el panel */
function close() { setOpen(false); }
/** Alterna visibilidad */
function toggle() { setOpen(!isOpen.value); }
function isOpenValue() { return isOpen.value; }

defineExpose({ show, close, toggle, isOpen: isOpenValue });
</script>

<template>
  <SideOver
    :model-value="isOpen"
    :title="props.title"
    :position="props.position"
    :size="props.size"
    :fullscreen="props.fullscreen"
    :persistent="props.persistent"
    :z-index="props.zIndex"
    :teleport="false"
    @update:model-value="onUpdate"
  >
    <!-- Contenido del cuerpo del panel -->
    <slot></slot>
  </SideOver>
</template>

<style>
@unocss-placeholder;
</style>