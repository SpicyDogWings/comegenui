<script setup lang="ts">
import AppTopbar from "./AppTopbar.vue";
</script>

<template>
  <section class="app-layout">
    <AppTopbar>
      <template #title><slot name="title" /></template>
      <template #actions><slot name="actions" /></template>
    </AppTopbar>
    <main class="app-body">
      <slot />
    </main>
  </section>
</template>

<style scoped>
.app-layout {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  background-color: var(--cu-color-surface);
  font-family: var(--cu-font-sans);
  color: var(--cu-color-neutral);
}

.app-layout :is(h1, h2, h3, h4, h5, h6, p, span) {
  margin: 0;
  color: inherit;
}

.app-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
