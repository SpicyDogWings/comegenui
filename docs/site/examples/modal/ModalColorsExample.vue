<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import Modal from "@/components/overlay/Modal.vue";

const modal = ref<InstanceType<typeof Modal> | null>(null);
const color = ref("primary");

function abrir(value: string) {
  color.value = value;
  modal.value?.open();
}
</script>

<template>
  <Button color="primary" @click="abrir('primary')">primary</Button>
  <Button color="secondary" @click="abrir('secondary')">secondary</Button>
  <Button color="success" @click="abrir('success')">success</Button>
  <Button color="warning" @click="abrir('warning')">warning</Button>
  <Button color="danger" @click="abrir('danger')">danger</Button>
  <Button color="neutral" @click="abrir('neutral')">neutral</Button>

  <Modal ref="modal" :color="color" :title="`Color ${color}`">
    <p>El color se aplica al título y al acento del header.</p>
  </Modal>
</template>
