<script setup lang="ts">
// Refleja el ejemplo "Interacción": métodos (`open`/`close`/`toggle`/`isOpen`) y eventos
// (`update:open`, `close`) del custom element.
import { ref } from "vue";

type SideOverEl = HTMLElement & {
  open?: () => void;
  close?: () => void;
  toggle?: () => void;
  isOpen?: () => boolean;
};

const side = ref<SideOverEl | null>(null);
const salida = ref("(sin eventos todavía)");

function abrir() {
  side.value?.open?.();
}
function cerrar() {
  side.value?.close?.();
}
function alternar() {
  side.value?.toggle?.();
}
function leer() {
  salida.value = `isOpen() → ${JSON.stringify(side.value?.isOpen?.())}`;
}
</script>

<template>
  <VanillaDemo :use="['CuSideOver']">
    <div class="cu-demo-controls">
      <button type="button" @click="abrir">open()</button>
      <button type="button" @click="cerrar">close()</button>
      <button type="button" @click="alternar">toggle()</button>
      <button type="button" @click="leer">isOpen()</button>
    </div>

    <cu-side-over
      ref="side"
      position="right"
      title="Eventos del panel"
      @update:open="(e: CustomEvent) => (salida = `update:open → ${e.detail}`)"
      @close="salida = 'close'"
    >
      <p>Al cambiar el estado se emite <code>update:open</code>; al cerrar, <code>close</code>.</p>
    </cu-side-over>

    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
