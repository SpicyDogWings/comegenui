<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import Modal from "@/components/overlay/Modal.vue";

const modal = ref<InstanceType<typeof Modal> | null>(null);
</script>

<template>
  <Button color="primary" variant="solid" @click="modal?.open()">Abrir modal</Button>

  <Modal
    ref="modal"
    title="Confirmar acción"
    description="¿Querés continuar con esta operación?"
    size="md"
  >
    <p>Esta acción se puede deshacer desde la papelera durante 30 días.</p>
  </Modal>
</template>
