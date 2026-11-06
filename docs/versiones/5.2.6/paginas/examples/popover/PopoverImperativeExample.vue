<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import Popover from "@/components/overlay/Popover.vue";

const popoverRef = ref<InstanceType<typeof Popover> | null>(null);
const salida = ref("");

function open() {
  popoverRef.value?.open();
  salida.value = "open()";
}
function close() {
  popoverRef.value?.close();
  salida.value = "close()";
}
function toggle() {
  popoverRef.value?.toggle();
  salida.value = "toggle()";
}
function isOpen() {
  salida.value = `isOpen() → ${popoverRef.value?.isOpen()}`;
}
</script>

<template>
  <Popover ref="popoverRef" position="bottom" align="start">
    <template #toggle>
      <Button variant="soft">Ancla del popover</Button>
    </template>
    <div>Panel controlado desde la ref.</div>
  </Popover>

  <div class="cu-demo-controls">
    <button type="button" @click="open">open()</button>
    <button type="button" @click="close">close()</button>
    <button type="button" @click="toggle">toggle()</button>
    <button type="button" @click="isOpen">isOpen()</button>
  </div>
  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
