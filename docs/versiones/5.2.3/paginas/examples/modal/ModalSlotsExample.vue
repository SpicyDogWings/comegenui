<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import Modal from "@/components/overlay/Modal.vue";

const modal = ref<InstanceType<typeof Modal> | null>(null);
</script>

<template>
  <Button color="success" variant="soft" @click="modal?.open()">Modal con slots</Button>

  <Modal ref="modal" title="Slots del modal" color="success">
    <!-- icon: a la izquierda del título -->
    <template #icon>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </template>

    <!-- default: cuerpo del modal -->
    <p>Este es el slot <code>default</code>.</p>

    <!-- footer: reemplaza los botones por defecto -->
    <template #footer>
      <Button variant="ghost" @click="modal?.close()">Cancelar</Button>
      <Button color="success" variant="solid" @click="modal?.close()">Confirmar</Button>
    </template>
  </Modal>
</template>
