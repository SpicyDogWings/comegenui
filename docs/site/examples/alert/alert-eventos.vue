<script setup lang="ts">
// Refleja el ejemplo "Interacción": los eventos `open`, `close` y `update:show`.
// En el custom element van por addEventListener: Vue reserva `@update:show` para `v-model`.
import { ref, watch } from "vue";

type AlertElement = HTMLElement & {
  open: () => void;
  toggle: () => void;
};

const alerta = ref<AlertElement | null>(null);
const log = ref<string[]>([]);

function record(entry: string) {
  log.value = [entry, ...log.value].slice(0, 6);
}

watch(alerta, (el) => {
  if (!el) return;
  el.addEventListener("open", () => record("open"));
  el.addEventListener("close", () => record("close"));
  el.addEventListener("update:show", (e) =>
    record(`update:show → ${(e as CustomEvent<boolean>).detail}`),
  );
});
</script>

<template>
  <VanillaDemo :use="['CuAlert']">
    <div class="cu-demo-controls">
      <button type="button" @click="alerta?.open()">open()</button>
      <button type="button" @click="alerta?.toggle()">toggle()</button>
    </div>

    <cu-alert ref="alerta" color="danger" variant="soft" title="Errores" close>
      <code>update:show</code> avisa cada cambio; <code>open</code> y <code>close</code> se
      disparan con los métodos y con el botón de cierre.
    </cu-alert>

    <p class="cu-demo-output">{{ log.length ? log.join("\n") : "Sin eventos todavía." }}</p>
  </VanillaDemo>
</template>
