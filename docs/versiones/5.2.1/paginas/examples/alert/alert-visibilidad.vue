<script setup lang="ts">
// Refleja el ejemplo "Visibilidad": el atributo `show` y los métodos
// `open()` / `toggle()` / `isOpen()` (en el CE, `close` es el nombre del
// atributo que muestra la X y tapa al método).
import { ref } from "vue";

type AlertElement = HTMLElement & {
  open: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};

const show = ref(true);
const alerta = ref<AlertElement | null>(null);
const estado = ref("isOpen() → true");

function sync() {
  estado.value = `isOpen() → ${alerta.value?.isOpen() ?? "?"}`;
}

function abrir() {
  alerta.value?.open();
  sync();
}

function alternar() {
  alerta.value?.toggle();
  sync();
}
</script>

<template>
  <VanillaDemo :use="['CuAlert']">
    <div class="cu-demo-controls">
      <button type="button" @click="show = true">show = true</button>
      <button type="button" @click="show = false">show = false</button>
    </div>

    <cu-alert color="primary" variant="soft" title="Control por show" :show="show">
      La visibilidad sigue al atributo <code>show</code>.
    </cu-alert>

    <div class="cu-demo-controls">
      <button type="button" @click="abrir">open()</button>
      <button type="button" @click="alternar">toggle()</button>
    </div>

    <cu-alert ref="alerta" color="success" variant="soft" title="Control por métodos">
      Sin <code>show</code>: se maneja con <code>open()</code> y <code>toggle()</code>.
    </cu-alert>

    <p class="cu-demo-output">{{ estado }}</p>
  </VanillaDemo>
</template>
