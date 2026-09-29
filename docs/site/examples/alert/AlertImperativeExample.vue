<script setup lang="ts">
import { ref } from "vue";
import Alert from "@/components/information/Alert.vue";
import Button from "@/components/buttons/Button.vue";

const alertRef = ref<InstanceType<typeof Alert> | null>(null);
const estado = ref("isOpen() → true");

function sync() {
  estado.value = `isOpen() → ${alertRef.value?.isOpen()}`;
}

function abrir() {
  alertRef.value?.open();
  sync();
}

function cerrar() {
  alertRef.value?.close();
  sync();
}

function alternar() {
  alertRef.value?.toggle();
  sync();
}
</script>

<template>
  <div class="cu-demo-controls">
    <Button color="success" variant="soft" @click="abrir">open()</Button>
    <Button color="danger" variant="soft" @click="cerrar">close()</Button>
    <Button color="primary" variant="outlined" @click="alternar">toggle()</Button>
  </div>

  <Alert ref="alertRef" color="primary" title="API imperativa">
    Controlada sólo por ref: <code>open()</code>, <code>close()</code>,
    <code>toggle()</code> e <code>isOpen()</code>.
  </Alert>

  <p class="cu-demo-output">{{ estado }}</p>
</template>
