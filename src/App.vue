<script setup lang="ts">
import { ref } from "vue";
import Modal from "./components/Modal.ce.vue";
import Button from "./components/Button.ce.vue";

const smModalRef = ref<InstanceType<typeof Modal> | null>(null);
const mdModalRef = ref<InstanceType<typeof Modal> | null>(null);
const lgModalRef = ref<InstanceType<typeof Modal> | null>(null);
const xlModalRef = ref<InstanceType<typeof Modal> | null>(null);
const fullModalRef = ref<InstanceType<typeof Modal> | null>(null);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Modal Sizes</h1>

    <div class="flex gap-4 mb-6 flex-wrap">
      <Button @click="smModalRef?.open()" color="primary">SM</Button>
      <Button @click="mdModalRef?.open()" color="primary">MD</Button>
      <Button @click="lgModalRef?.open()" color="primary">LG</Button>
      <Button @click="xlModalRef?.open()" color="primary">XL</Button>
      <Button @click="fullModalRef?.open()" color="primary">FULL</Button>
    </div>

    <!-- SM -->
    <Modal ref="smModalRef" title="Small" size="sm">
      <p class="mb-4">Modal Small (max-w-sm)</p>
      <template #footer>
        <Button @click="smModalRef?.close()">Cerrar</Button>
      </template>
    </Modal>

    <!-- MD -->
    <Modal ref="mdModalRef" title="Medium" size="md">
      <p class="mb-4">Modal Medium (max-w-md) - por defecto</p>
      <template #footer>
        <Button @click="mdModalRef?.close()">Cerrar</Button>
      </template>
    </Modal>

    <!-- LG -->
    <Modal ref="lgModalRef" title="Large" size="lg">
      <p class="mb-4">Modal Large (max-w-lg)</p>
      <template #footer>
        <Button @click="lgModalRef?.close()">Cerrar</Button>
      </template>
    </Modal>

    <!-- XL -->
    <Modal ref="xlModalRef" title="Extra Large" size="xl">
      <p class="mb-4">Modal XL (max-w-xl)</p>
      <template #footer>
        <Button @click="xlModalRef?.close()">Cerrar</Button>
      </template>
    </Modal>

    <!-- FULL -->
    <Modal ref="fullModalRef" title="Full Screen" size="full">
      <p class="mb-4">Modal Full (max-w-[90vw])</p>
      <template #footer>
        <Button @click="fullModalRef?.close()">Cerrar</Button>
      </template>
    </Modal>
  </div>
</template>

<style>
@unocss-placeholder;
</style>
