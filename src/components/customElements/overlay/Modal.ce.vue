<script setup lang="ts">
import { ref, getCurrentInstance, onMounted, onUnmounted, useHost, type PropType } from "vue";
import Modal from "../../overlay/Modal.vue";

const props = defineProps({
  /** Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` */
  color: {
    type: String as PropType<'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'>,
    default: "neutral",
  },
  /** Título del modal (se muestra en la cabecera) */
  title: String,
  /** Descripción bajo el título (texto secundario) */
  description: String,
  /** Si es `true`, no se cierra con click en el backdrop ni con `Escape` */
  persistent: Boolean,
  /** Ancho del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` */
  size: { type: String as PropType<'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>, default: "auto" },
  /** Alto del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` */
  height: { type: String as PropType<'auto' | 'sm' | 'md' | 'lg' | 'xl' | 'full'>, default: "auto" },
});

const modalRef = ref<InstanceType<typeof Modal> | null>(null);

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

/** Abre el modal */
function open() { modalRef.value?.open(); }
/** Cierra el modal */
function close() { modalRef.value?.close(); }
/** Alterna visibilidad */
function toggle() { modalRef.value?.toggle(); }
/** Devuelve el estado actual (`boolean`) */
function isOpen() { return modalRef.value?.isOpen() ?? false; }

defineExpose({ open, close, toggle, isOpen });

// Un CE con shadow root no tiene `$slots`: el `footer` lo asigna el navegador al
// `<slot name="footer">` del shadow tree. Si el host no trae ningún hijo con
// `slot="footer"` hay que NO reenviar el slot, o un slot vacío pisa el pie por
// defecto de `Modal.vue` (Cancelar/Aceptar en `persistent`, Cerrar si no) y el
// modal queda sin botones. Por eso se mira la luz del host, no `useSlots()`.
const host = useHost() as HTMLElement | null;
const hasFooter = ref(!!host?.querySelector('[slot="footer"]'));
let observer: MutationObserver | null = null;

function syncFooter() {
  hasFooter.value = !!host?.querySelector('[slot="footer"]');
}

onMounted(() => {
  if (!host) return;
  syncFooter();
  // El contenido puede llegar después del upgrade (frameworks, render diferido):
  // altas/bajas de hijos o cambios del atributo `slot` recalculan la presencia.
  observer = new MutationObserver(syncFooter);
  observer.observe(host, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["slot"],
  });
});

onUnmounted(() => {
  observer?.disconnect();
  observer = null;
});
</script>

<template>
  <Modal
    ref="modalRef"
    :color="props.color"
    :title="props.title"
    :description="props.description"
    :persistent="props.persistent"
    :size="props.size"
    :height="props.height"
    @close="ceEmit('close', $event)"
    @opened="ceEmit('opened', $event)"
    @closed="ceEmit('closed', $event)"
    @cancel="ceEmit('cancel', $event)"
    @accept="ceEmit('accept', $event)"
  >
    <template #icon>
      <!-- Ícono en la cabecera (junto al título) -->
      <slot name="icon"></slot>
    </template>
    <!-- Cuerpo del modal -->
    <slot></slot>
    <!-- Pie del modal (típicamente botones de acción). Sin footer propio manda el
         pie por defecto de `Modal.vue`, así que el slot no se reenvía vacío. -->
    <template v-if="hasFooter" #footer>
      <slot name="footer"></slot>
    </template>
  </Modal>
</template>

<style>
@unocss-placeholder;
</style>
