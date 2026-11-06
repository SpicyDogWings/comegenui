<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import Input from "@/components/form/Input.vue";
import Modal from "@/components/overlay/Modal.vue";

const modal = ref<InstanceType<typeof Modal> | null>(null);
const nombre = ref("");
</script>

<template>
  <Button color="primary" @click="modal?.open()">Editar perfil</Button>

  <!-- persistent: no cierra con backdrop ni Escape; el footer por defecto
       muestra Cancelar (emite cancel) y Aceptar (emite accept). -->
  <Modal ref="modal" persistent title="Editar perfil" color="primary">
    <Input v-model="nombre" placeholder="Nombre" />
  </Modal>
</template>
