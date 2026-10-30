<script setup lang="ts">
// Refleja el ejemplo "Uso en HTML plano": abrir el modal y cerrarlo desde el footer.
import { ref } from "vue";

type ModalEl = HTMLElement & { open: () => void; close: () => void };
const modal = ref<ModalEl | null>(null);
</script>

<template>
  <VanillaDemo :use="['CuButton', 'CuModal']">
    <button type="button" @click="modal?.open()">Abrir modal</button>

    <cu-modal
      ref="modal"
      title="Confirmar eliminación"
      description="¿Estás seguro?"
      size="md"
    >
      <p>Esta acción no se puede deshacer.</p>

      <div slot="footer">
        <cu-button color="danger" variant="solid" @click="modal?.close()">Eliminar</cu-button>
        <cu-button variant="ghost" @click="modal?.close()">Cancelar</cu-button>
      </div>
    </cu-modal>
  </VanillaDemo>
</template>
