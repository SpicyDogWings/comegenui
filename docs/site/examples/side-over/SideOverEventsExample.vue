<script setup lang="ts">
import { ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import SideOver from "@/components/overlay/SideOver.vue";

const abierto = ref(false);
const salida = ref("Sin eventos todavía.");

function onUpdate(valor: boolean) {
  salida.value = `@update:modelValue → ${valor}`;
}
function onClose() {
  salida.value = "@close";
}
</script>

<template>
  <Button color="primary" @click="abierto = true">Abrir panel</Button>

  <SideOver
    v-model="abierto"
    title="Eventos del panel"
    position="right"
    size="360px"
    @update:model-value="onUpdate"
    @close="onClose"
  >
    <p>Al cambiar el estado se emite <code>update:modelValue</code>; al cerrar, <code>close</code>.</p>
  </SideOver>

  <pre class="cu-demo-output">{{ salida }}</pre>
</template>
