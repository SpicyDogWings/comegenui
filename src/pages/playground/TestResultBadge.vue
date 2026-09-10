<script setup lang="ts">
import { computed } from "vue";
import Badge from "@/components/information/Badge.vue";
import { useTestResults } from "@/composables/useTestResults";

const props = defineProps<{
  /** tag del componente: 'cu-button' */
  component: string;
  /** id de la sección: 'colors' */
  section: string;
}>();

const { results, loaded, available } = useTestResults();

const sectionResult = computed(
  () => results.value?.components[props.component]?.sections[props.section],
);

const label = computed(() => {
  if (!available.value) return loaded.value ? "sin correr" : "…";
  const status = sectionResult.value?.status;
  if (!status) return "sin tests";
  return status === "passed" ? "tests ✓" : "tests ✗";
});

const color = computed(() => {
  if (!available.value || !sectionResult.value) return "neutral";
  return sectionResult.value.status === "passed" ? "success" : "danger";
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

const title = computed(() => {
  if (!available.value) return "Sin resultados: corré ./scripts/preflight.sh";
  if (!sectionResult.value) return "Esta sección todavía no tiene tests";
  if (failures.value.length) return failures.value.join("\n");
  const count = Object.values(sectionResult.value.variants).reduce(
    (acc, variant) => acc + variant.checks.length,
    0,
  );
  return `${count} check(s) en verde`;
});
</script>

<template>
  <Badge :color="color" variant="soft" :title="title">{{ label }}</Badge>
</template>
