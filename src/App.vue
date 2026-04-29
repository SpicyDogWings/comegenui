<script setup lang="ts">
import { ref } from "vue";
import Modal from "./components/Modal.ce.vue";
import Button from "./components/Button.ce.vue";

const isModalOpen = ref(false);
const modalMessage = ref("Este es un modal básico con botones dentro.");

function openModal() {
  isModalOpen.value = true;
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Modal Básico</h1>

    <Button @click="openModal" color="primary">
      Abrir Modal
    </Button>

    <Modal v-model="isModalOpen" title="Modal Básico" description="Un modal estándar.">
      <p class="mb-4">{{ modalMessage }}</p>
      <template #footer>
        <Button color="neutral" @click="isModalOpen = false">Cancelar</Button>
        <Button color="primary" @click="isModalOpen = false">Aceptar</Button>
      </template>
    </Modal>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
