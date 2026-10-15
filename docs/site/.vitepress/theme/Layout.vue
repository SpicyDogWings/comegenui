<script setup lang="ts">
import { computed } from "vue";
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import type { CommandItem } from "@/components/overlay/CommandPalette.vue";
import AppTopbar from "@/layouts/AppTopbar.vue";
import DocsModeSelect from "./DocsModeSelect.vue";
import DocsVersionSelect from "./DocsVersionSelect.vue";
import { useDocsVersions } from "./useDocsVersions";

const { frontmatter } = useData();
const { options } = useDocsVersions();

// Comandos de versión para la paleta (CTRL+K): una entrada por versión a la que
// se puede saltar (se omite la actual, que sería un no-op).
const versionCommands = computed<CommandItem[]>(() =>
  options.value
    .filter((option) => !option.active)
    .map((option) => ({
      id: `version-${option.id}`,
      label: `Ir a la versión ${option.label}`,
      description: option.base,
      category: "Versión",
      action: () => window.location.assign(option.link),
    })),
);
</script>

<template>
  <!-- Header propio del sitio (reemplaza el navbar de VitePress). Las páginas
       `standalone` (ej. la home) traen su propio layout. -->
  <AppTopbar v-if="!frontmatter.standalone" fixed :extra-commands="versionCommands">
    <template #version>
      <DocsVersionSelect />
    </template>
    <template #mode>
      <DocsModeSelect />
    </template>
  </AppTopbar>
  <DefaultTheme.Layout />
</template>

<style>
/* El header del sitio es AppTopbar (fijo); se oculta el de VitePress. */
.VPNav {
  display: none !important;
}
</style>
