<script setup lang="ts">
import { version } from "../../package.json";
import Badge from "@/components/information/Badge.vue";
import LucideGitLab from "@/components/icons/LucideGitLab.vue";
import ThemeDropdown from "@/components/theme/ThemeDropdown.vue";
</script>

<template>
  <section class="app-layout">
    <header class="app-topbar">
      <div class="app-topbar-left">
        <RouterLink to="/" class="app-topbar-brand">ComegenUI</RouterLink>
        <Badge color="neutral" variant="subtle">v{{ version }}</Badge>
        <slot name="title" />
      </div>
      <div class="app-topbar-actions">
        <slot name="actions" />
        <a
          class="app-topbar-icon"
          href="https://gitlab.com/SpicyDogWings/comegen-ui"
          target="_blank"
          rel="noopener"
          aria-label="Repositorio en GitLab"
          title="GitLab"
        >
          <LucideGitLab />
        </a>
        <ThemeDropdown />
      </div>
    </header>
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

.app-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

.app-topbar-left,
.app-topbar-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.app-topbar-brand {
  font-size: var(--cu-font-size-md);
  font-weight: var(--cu-font-weight-bold);
  letter-spacing: -0.01em;
  color: var(--cu-color-neutral);
  text-decoration: none;
}

.app-topbar-brand:hover {
  opacity: 0.8;
}

.app-topbar-icon {
  display: inline-flex;
  font-size: var(--cu-font-size-md);
  color: var(--cu-color-neutral);
  opacity: 0.75;
  transition: opacity 150ms ease, color 150ms ease;
}

.app-topbar-icon:hover {
  opacity: 1;
  color: var(--cu-color-primary);
}

.app-body {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>
