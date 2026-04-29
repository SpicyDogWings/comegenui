<script setup lang="ts">
import { ref } from "vue";
import Modal from "./components/Modal.ce.vue";
import Button from "./components/Button.ce.vue";

const isModalOpen = ref(false);
const isPrimaryModalOpen = ref(false);
const isPersistentModalOpen = ref(false);
const isFullModalOpen = ref(false);
const modalMessage = ref("");

function openModal() {
  isModalOpen.value = true;
  modalMessage.value = "Este es un modal básico con botones dentro.";
}

function openPrimaryModal() {
  isPrimaryModalOpen.value = true;
}

function openPersistentModal() {
  isPersistentModalOpen.value = true;
  modalMessage.value = "Modal persistente. No se cierra haciendo clic fuera o con ESC.";
}

function openFullModal() {
  isFullModalOpen.value = true;
  modalMessage.value = "Modal a pantalla completa.";
}

function closePersistentModal() {
  isPersistentModalOpen.value = false;
}
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">ComegenUI - Modal Examples</h1>

    <div class="flex gap-4 mb-6 flex-wrap">
      <Button @click="openModal" color="primary">Abrir Modal Básico</Button>
      <Button @click="openPrimaryModal" color="primary">Abrir Modal Primary</Button>
      <Button @click="openPersistentModal" color="warning">Abrir Modal Persistente</Button>
      <Button @click="openFullModal" color="success">Abrir Modal Full</Button>
    </div>

    <!-- Modal Básico -->
    <Modal v-model="isModalOpen" title="Modal Básico" description="Un modal estándar con acciones.">
      <p class="mb-4">{{ modalMessage }}</p>
      <template #footer>
        <Button color="neutral" @click="isModalOpen = false">Cancelar</Button>
        <Button color="primary" @click="isModalOpen = false">Aceptar</Button>
      </template>
    </Modal>

    <!-- Modal Primary -->
    <Modal
      v-model="isPrimaryModalOpen"
      title="Modal Primary"
      color="primary"
      description="Modal con tema primary."
    >
      <p class="mb-4">Contenido con estilo primary.</p>
      <template #footer>
        <Button color="neutral" @click="isPrimaryModalOpen = false">Cerrar</Button>
      </template>
    </Modal>

    <!-- Modal Persistente -->
    <Modal
      v-model="isPersistentModalOpen"
      title="Modal Persistente"
      color="warning"
      description="No se cierra con clic fuera o ESC."
      :persistent="true"
    >
      <p class="mb-4">{{ modalMessage }}</p>
      <template #footer>
        <Button color="warning" @click="closePersistentModal">Cerrar Manual</Button>
      </template>
    </Modal>

    <!-- Modal Full -->
    <Modal
      v-model="isFullModalOpen"
      title="Modal Full Screen"
      color="success"
      size="full"
      description="Ocupa toda la pantalla."
    >
      <p class="mb-4">{{ modalMessage }}</p>
      <template #footer>
        <Button color="neutral" @click="isFullModalOpen = false">Cerrar</Button>
      </template>
    </Modal>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
