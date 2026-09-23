<script setup lang="ts">
import { computed, inject } from "vue";
import { chromeKey } from "../chrome";
import { useTestResults } from "./useTestResults";

const props = defineProps<{
  /** tag del componente: 'cu-button' */
  component: string;
  /** id de la sección: 'colors' */
  section: string;
}>();

const chrome = inject(chromeKey)!;

const { results, loaded, available } = useTestResults();

const sectionResult = computed(
  () => results.value?.components[props.component]?.sections[props.section],
);

const totals = computed(() => {
  const result = sectionResult.value;
  if (!result) return { total: 0, failed: 0 };
  let total = 0;
  let failed = 0;
  for (const variant of Object.values(result.variants)) {
    for (const check of variant.checks) {
      total++;
      if (check.status === "failed") failed++;
    }
  }
  return { total, failed };
});

const failures = computed(() => {
  if (!sectionResult.value) return [];
  const list: string[] = [];
  for (const variant of Object.values(sectionResult.value.variants)) {
    for (const check of variant.checks) {
      if (check.status === "failed") {
        list.push(`${check.name}${check.error ? `: ${check.error}` : ""}`);
      }
    }
  }
  return list;
});

const label = computed(() => {
  if (!available.value) return loaded.value ? "—" : "…";
  if (!sectionResult.value) return "—";
  const { total, failed } = totals.value;
  return failed > 0 ? `✗ ${failed}/${total}` : `✓ ${total}`;
});

const color = computed(() => {
  if (!available.value || !sectionResult.value) return "neutral";
  return totals.value.failed > 0 ? "danger" : "success";
});

const title = computed(() => {
  if (!available.value) return "Sin resultados: corré ./scripts/preflight.sh";
  if (!sectionResult.value) return "Esta sección todavía no tiene tests";
  if (failures.value.length) return failures.value.join("\n");
  return `${totals.value.total} check(s) en verde`;
});
</script>

<template>
  <component :is="chrome.badge" :color="color" variant="soft" :title="title">{{ label }}</component>
</template>