<script setup lang="ts">
// Refleja el ejemplo "Ejemplo completo": abrir, ejecutar una acción y cerrar.
import { ref } from "vue";

type ModalEl = HTMLElement & { open: () => void; close: () => void };
const modal = ref<ModalEl | null>(null);
const salida = ref("");

function handleAction() {
  salida.value = "Acción ejecutada";
  modal.value?.close();
}
</script>

<template>
  <VanillaDemo :use="['CuButton', 'CuModal']">
    <cu-button color="primary" variant="solid" @click="modal?.open()">Abrir Modal</cu-button>

    <cu-modal ref="modal" title="Mi Modal" description="Ventana de ejemplo">
      <div>Contenido del modal.</div>
      <div slot="footer">
        <cu-button variant="ghost" @click="modal?.close()">Cancelar</cu-button>
        <cu-button color="primary" variant="solid" @click="handleAction">Acción</cu-button>
      </div>
    </cu-modal>

    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
