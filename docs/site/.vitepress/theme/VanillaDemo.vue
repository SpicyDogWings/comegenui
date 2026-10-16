<script setup lang="ts">
// docs/site/.vitepress/theme/VanillaDemo.vue
// Contenedor de los "demos vanilla": registra los custom elements reales (build
// `esm-shared`) y recién DESPUÉS renderiza el contenido.
//
// Cargar antes de renderizar importa: si el `<cu-*>` todavía no está definido
// cuando Vue monta los hijos, un binding de objeto/array (`:items="…"`) se setea
// como ATRIBUTO string ("[object Object]"). Con el CE ya definido, Vue lo
// resuelve como propiedad. Por eso el `v-if="ready"`.
import { onMounted, ref } from "vue";
import { loadComegenShared, type ComegenSharedName } from "./comegen-shared";

const props = defineProps<{ use: ComegenSharedName[] }>();

const ready = ref(false);
const failed = ref(false);

onMounted(async () => {
  try {
    await loadComegenShared(props.use);
    ready.value = true;
  } catch (err) {
    failed.value = true;
    console.error(
      "[docs] no pude cargar los custom elements del build `esm-shared`. Corré `pnpm build:lib`.",
      err,
    );
  }
});
</script>

<template>
  <div class="cu-demo cu-demo--stack">
    <p v-if="failed" class="cu-demo-output">
      No pude cargar el build <code>esm-shared</code>: corré <code>pnpm build:lib</code> y recargá.
    </p>
    <template v-else-if="ready"><slot /></template>
  </div>
</template>
