<script setup lang="ts">
// Refleja el ejemplo "API imperativa": set / increment / decrement / get / reset.
import { ref, watch } from "vue";

type CuNumberInputElement = HTMLElement & {
  get?: () => number | null;
  set?: (value: number | null) => void;
  reset?: () => void;
  focus?: () => void;
  increment?: () => void;
  decrement?: () => void;
};

const campo = ref<CuNumberInputElement | null>(null);
const salida = ref("(sin llamadas todavía)");

watch(campo, (el) => {
  if (el) el.set?.(4);
});

function llamar(accion: string) {
  const el = campo.value;
  if (!el) return;
  switch (accion) {
    case "set": el.set?.(4); break;
    case "increment": el.increment?.(); break;
    case "decrement": el.decrement?.(); break;
    case "reset": el.reset?.(); break;
    case "focus": el.focus?.(); break;
  }
  salida.value = accion === "focus" ? "focus()" : `${accion}() → get() = ${JSON.stringify(el.get?.())}`;
}
</script>

<template>
  <VanillaDemo :use="['CuNumberInput']">
    <cu-number-input ref="campo" :min="0" :max="10"></cu-number-input>
    <div class="cu-demo-controls">
      <button type="button" @click="llamar('set')">set(4)</button>
      <button type="button" @click="llamar('increment')">increment()</button>
      <button type="button" @click="llamar('decrement')">decrement()</button>
      <button type="button" @click="llamar('reset')">reset()</button>
      <button type="button" @click="llamar('focus')">focus()</button>
    </div>
    <pre class="cu-demo-output">{{ salida }}</pre>
  </VanillaDemo>
</template>
