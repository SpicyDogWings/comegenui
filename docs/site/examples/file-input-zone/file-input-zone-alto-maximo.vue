<script setup lang="ts">
// Refleja el ejemplo "Alto máximo": sin `max-height` la lista crece, con
// `max-height` scrollea.
import { onMounted, ref } from "vue";

const nombres = [
  "informe-anual.pdf",
  "presupuesto.xlsx",
  "foto-equipo.png",
  "contrato.pdf",
  "backup.zip",
  "notas.txt",
];

type ZoneEl = HTMLElement & { set: (files: File[]) => void };

const sinLimite = ref<HTMLElement | null>(null);
const conScroll = ref<HTMLElement | null>(null);

onMounted(async () => {
  await customElements.whenDefined("cu-file-input-zone");
  const files = nombres.map((name, i) => new File([new Uint8Array((i + 1) * 20480)], name));
  (sinLimite.value as ZoneEl | null)?.set(files);
  (conScroll.value as ZoneEl | null)?.set(files);
});
</script>

<template>
  <VanillaDemo :use="['CuFileInputZone']">
    <cu-file-input-zone ref="sinLimite" multiple placeholder="Sin max-height"></cu-file-input-zone>
    <cu-file-input-zone
      ref="conScroll"
      multiple
      max-height="120px"
      placeholder="max-height: 120px"
    ></cu-file-input-zone>
  </VanillaDemo>
</template>
