<script setup lang="ts">
import { ref } from "vue";
import Collapse from "@/components/overlay/Collapse.vue";

const collapseRef = ref<InstanceType<typeof Collapse> | null>(null);
const salida = ref("");

function toggle() {
  collapseRef.value?.toggle();
  salida.value = "toggle() → no-op (disabled)";
}
function open() {
  collapseRef.value?.open();
  salida.value = "open() → no-op (disabled)";
}
function close() {
  collapseRef.value?.close();
  salida.value = "close() → funciona";
}
</script>

<template>
  <Collapse ref="collapseRef" label="Sección bloqueada" color="secondary" default-open disabled>
    <p>El trigger no responde al click y muestra cursor <code>not-allowed</code>.</p>
  </Collapse>

  <div class="cu-demo-controls">
    <button type="button" @click="toggle">toggle()</button>
    <button type="button" @click="open">open()</button>
    <button type="button" @click="close">close()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
