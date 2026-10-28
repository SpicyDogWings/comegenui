<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import Modal from "@/components/overlay/Modal.vue";

const modal = ref<InstanceType<typeof Modal> | null>(null);
const modalPersistente = ref<InstanceType<typeof Modal> | null>(null);
const eventos = ref<string[]>([]);

function log(nombre: string) {
  eventos.value = [...eventos.value, nombre];
}
function onAccept() {
  log("accept");
}
function onCancel() {
  log("cancel");
}
</script>

<template>
  <Button @click="modal?.open()">Modal normal</Button>
  <Button @click="modalPersistente?.open()">Modal persistente</Button>

  <Modal
    ref="modal"
    title="Todos los eventos"
    @opened="log('opened')"
    @close="log('close')"
    @closed="log('closed')"
  >
    <p>Al abrir se emite <code>opened</code>; al cerrar, <code>close</code> y <code>closed</code>.</p>
  </Modal>

  <Modal
    ref="modalPersistente"
    persistent
    title="Persistente"
    color="primary"
    @opened="log('opened (persistent)')"
    @close="log('close (persistent)')"
    @closed="log('closed (persistent)')"
    @accept="onAccept"
    @cancel="onCancel"
  >
    <p>El footer por defecto emite <code>accept</code> y <code>cancel</code>.</p>
  </Modal>

  <pre class="cu-demo-output">{{ eventos.join("\n") || "Sin eventos todavía." }}</pre>
</template>
