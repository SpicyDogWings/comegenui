<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import AppTopbar from "@/layouts/AppTopbar.vue";
import Demo from "./Demo.vue";
import ViewTabs from "./ViewTabs.vue";

const { frontmatter } = useData();
</script>

<template>
  <!-- Header propio del sitio (reemplaza el navbar de VitePress). Las páginas
       `standalone` (ej. la home) traen su propio layout. -->
  <AppTopbar v-if="!frontmatter.standalone" fixed />
  <DefaultTheme.Layout>
    <template #doc-before>
      <Demo v-if="frontmatter.demo" :name="String(frontmatter.demo)" />
      <ViewTabs
        v-if="frontmatter.componentSlug"
        :slug="String(frontmatter.componentSlug)"
        :view="frontmatter.componentView === 'vanilla' ? 'vanilla' : 'vue'"
        :has-vanilla="Boolean(frontmatter.hasVanilla)"
      />
    </template>
  </DefaultTheme.Layout>
</template>

<style>
/* El header del sitio es AppTopbar (fijo); se oculta el de VitePress. */
.VPNav {
  display: none !important;
}
</style>
