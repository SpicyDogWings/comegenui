<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import { version } from "../../package.json";
import Badge from "@/components/information/Badge.vue";
import LucideGitLab from "@/components/icons/LucideGitLab.vue";
import LucidePalette from "@/components/icons/LucidePalette.vue";
import ThemeDropdown from "@/components/theme/ThemeDropdown.vue";
import CommandPalette from "@/components/overlay/CommandPalette.vue";
import { navigationCommands } from "@/utils/command-routes";

defineProps<{ fixed?: boolean }>();

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
  <header class="app-topbar" :class="{ 'app-topbar--fixed': fixed }">
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
  <CommandPalette
    ref="navPaletteRef"
    title="Navegar"
    placeholder="Buscar página…"
    :commands="navigationCommands()"
  />
</template>

<style scoped>
.app-topbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2.5rem;
  background-color: var(--cu-color-surface);
  border-bottom: var(--cu-border-thin) solid var(--cu-border-color);
}

/* Como header fijo del sitio (ocupa el alto del nav de VitePress). */
.app-topbar--fixed {
  position: fixed;
  inset: 0 0 auto 0;
  z-index: 40;
  height: var(--vp-nav-height, 64px);
  padding-top: 0;
  padding-bottom: 0;
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
</style>
