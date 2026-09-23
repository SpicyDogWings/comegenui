<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { version } from "../../package.json";
import Badge from "@/components/information/Badge.vue";
import LucideGitLab from "@/components/icons/LucideGitLab.vue";
import LucidePalette from "@/components/icons/LucidePalette.vue";
import ThemeDropdown from "@/components/theme/ThemeDropdown.vue";
import CommandPalette from "@/components/overlay/CommandPalette.vue";
import { navigationCommands } from "@/utils/command-routes";

const navPaletteRef = ref<InstanceType<typeof CommandPalette> | null>(null);

function handleNavShortcut(event: KeyboardEvent) {
  if (event.ctrlKey && !event.altKey && !event.shiftKey && event.key.toLowerCase() === "k") {
    event.preventDefault();
    navPaletteRef.value?.open();
  }
}

onMounted(() => {
  window.addEventListener("keydown", handleNavShortcut);
});
onBeforeUnmount(() => {
  window.removeEventListener("keydown", handleNavShortcut);
});
</script>

<template>
  <section class="app-layout">
    <header class="app-topbar">
      <div class="app-topbar-left">
        <a href="/" class="app-topbar-brand">
          <img src="/img/comegen.webp" alt="ComegenUI" class="app-topbar-logo" />
          ComegenUI
        </a>
        <Badge color="neutral" variant="subtle">v{{ version }}</Badge>
        <slot name="title" />
      </div>
      <div class="app-topbar-actions">
        <ThemeDropdown />
        <Badge
          color="neutral"
          variant="subtle"
          class="app-topbar-shortcut"
          title="Abrir paleta de comandos"
          @click="navPaletteRef?.open()"
        >
          CTRL+K comandos
        </Badge>
        <slot name="actions" />
        <a
          href="/theme-builder"
          class="app-topbar-icon"
          aria-label="Theme Builder"
          title="Theme Builder"
        >
          <LucidePalette />
        </a>
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
      </div>
    </header>
    <main class="app-body">
      <slot />
    </main>
    <CommandPalette
      ref="navPaletteRef"
      title="Navegar"
      placeholder="Buscar página…"
      :commands="navigationCommands()"
    />
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
  gap: 2rem;
}

.app-topbar-brand {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: var(--cu-font-size-md);
  font-weight: var(--cu-font-weight-bold);
  letter-spacing: -0.01em;
  color: var(--cu-color-neutral);
  text-decoration: none;
}

.app-topbar-brand:hover {
  opacity: 0.8;
}

.app-topbar-logo {
  height: 1.5rem;
  width: auto;
}

.app-topbar-icon {
  display: inline-flex;
  font-size: var(--cu-font-size-md);
  color: var(--cu-color-neutral);
  opacity: 0.75;
  transition: opacity 150ms ease, color 150ms ease;
}

.app-topbar-shortcut {
  cursor: pointer;
  user-select: none;
  transition: opacity 150ms ease;
}

.app-topbar-shortcut:hover {
  opacity: 0.75;
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
