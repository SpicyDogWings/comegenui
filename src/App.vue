<script setup lang="ts">
import { ref } from "vue";
import Modal from "./components/Modal.ce.vue";
import Button from "./components/Button.ce.vue";

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const persistentModalRef = ref<InstanceType<typeof Modal> | null>(null);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Modal Examples</h1>

    <div class="flex gap-4 mb-6">
      <Button @click="modalRef?.open()" color="primary">
        Modal Normal
      </Button>
      <Button @click="persistentModalRef?.open()" color="danger">
        Modal Persistente
      </Button>
    </div>

    <!-- Modal Normal -->
    <Modal ref="modalRef" title="Modal Básico">
      <p class="mb-4">Contenido del modal normal.</p>
      <template #footer>
        <Button color="neutral" @click="modalRef?.close()">Cancelar</Button>
        <Button color="primary" @click="modalRef?.close()">Aceptar</Button>
      </template>
    </Modal>

    <!-- Modal Persistente -->
    <Modal ref="persistentModalRef" title="Modal Persistente" persistent>
      <p class="mb-4">
        <strong>No se puede cerrar</strong> con Escape, clic fuera o el botón X. 
        Solo con el botón de abajo.
      </p>
      <template #footer>
        <Button color="danger" @click="persistentModalRef?.close()">
          Cerrar (único método)
        </Button>
      </template>
    </Modal>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
