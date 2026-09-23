<script setup lang="ts">
import { useData } from "vitepress";
import DefaultTheme from "vitepress/theme";
import Demo from "./Demo.vue";

const { frontmatter } = useData();
</script>

<template>
  <DefaultTheme.Layout>
    <template #doc-before>
      <Demo v-if="frontmatter.demo" :name="String(frontmatter.demo)" />
    </template>
  </DefaultTheme.Layout>
</template>
