<script setup lang="ts">
// docs/site/.vitepress/theme/DocsVersionSelect.vue
// Select de versión de la documentación. Sólo decide a qué URL ir: cada versión
// es un build estático congelado servido bajo su propia base (`/5.1.1/`); `latest`
// además deja una copia en `/` para las URLs sin versión. Al elegir, navega al
// mismo path *relativo* dentro de esa base; si la página no existe en esa versión,
// cae al home de la versión. El catálogo lo comparte `useDocsVersions`.
import { useDocsVersions } from "./useDocsVersions";
import Dropdown from "@/components/overlay/Dropdown.vue";
import Button from "@/components/buttons/Button.vue";
import LucideChevronDown from "@/components/icons/LucideChevronDown.vue";
import LucideCheck from "@/components/icons/LucideCheck.vue";

const { options, current } = useDocsVersions();

function select(option: { link: string; active: boolean }) {
  if (option.active) return;
  // Cada versión es un build/app distinto (otra base): el router de VitePress no
  // conoce las rutas de la otra versión, así que se navega duro.
  window.location.assign(option.link);
}
</script>

<template>
  <Dropdown
    v-if="options.length > 1 && current"
    color="neutral"
    variant="ghost"
    position="bottom"
    align="end"
    panel-width="160px"
  >
    <template #toggle="{ toggle, isOpen }">
      <Button
        variant="ghost"
        color="neutral"
        @click="toggle"
        aria-label="Versión de la documentación"
      >
        <span class="docs-version-label">{{ current.label }}</span>
        <LucideChevronDown
          :class="['docs-version-chevron', { 'docs-version-chevron--open': isOpen }]"
        />
      </Button>
    </template>

    <button
      v-for="option in options"
      :key="option.id"
      type="button"
      role="menuitem"
      class="docs-version-item"
      :class="{ 'docs-version-item--active': option.active }"
      @click="select(option)"
    >
      {{ option.label }}
      <LucideCheck v-if="option.active" class="docs-version-check" />
    </button>
  </Dropdown>
</template>

<style scoped>
.docs-version-label {
  font-size: var(--cu-font-size-sm);
}

.docs-version-chevron {
  transition: transform 150ms ease;
}

.docs-version-chevron--open {
  transform: rotate(180deg);
}

.docs-version-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  width: 100%;
  padding: var(--cu-space-sm) var(--cu-space-md);
  background: transparent;
  border: none;
  border-radius: var(--cu-radius-sm);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  cursor: pointer;
  text-align: left;
}

.docs-version-item:hover {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.docs-version-item--active {
  font-weight: var(--cu-font-weight-semibold);
}

.docs-version-check {
  color: var(--cu-color-primary);
  flex-shrink: 0;
}
</style>
