<script setup lang="ts">
import { ref } from "vue";
import Modal from "./components/Modal.ce.vue";
import Button from "./components/Button.ce.vue";

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Modal Básico</h1>

    <Button @click="modalRef?.open()" color="primary">
      Abrir Modal
    </Button>

    <Modal ref="modalRef" title="Modal Básico" description="Un modal estándar.">
      <p class="mb-4">Contenido del modal.</p>
      <template #footer>
        <Button color="neutral" @click="modalRef?.close()">Cancelar</Button>
        <Button color="primary" @click="modalRef?.close()">Aceptar</Button>
      </template>
    </Modal>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
