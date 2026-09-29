<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import Modal from "@/components/overlay/Modal.vue";

const modal = ref<InstanceType<typeof Modal> | null>(null);
const modalAlto = ref<InstanceType<typeof Modal> | null>(null);
const size = ref("sm");

function abrir(value: string) {
  size.value = value;
  modal.value?.open();
}
</script>

<template>
  <Button @click="abrir('sm')">sm</Button>
  <Button @click="abrir('md')">md</Button>
  <Button @click="abrir('lg')">lg</Button>
  <Button @click="abrir('xl')">xl</Button>
  <Button @click="abrir('full')">full</Button>
  <Button variant="soft" @click="modalAlto?.open()">height full</Button>

  <Modal ref="modal" :size="size" :title="`Tamaño ${size}`">
    <p>El ancho del modal depende de <code>size</code>.</p>
  </Modal>

  <Modal ref="modalAlto" size="md" height="full" title="Altura completa">
    <p>Con <code>height="full"</code> el modal ocupa el 90% de la altura.</p>
  </Modal>
</template>
