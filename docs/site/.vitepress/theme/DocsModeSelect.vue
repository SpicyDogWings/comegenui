<script setup lang="ts">
// docs/site/.vitepress/theme/DocsModeSelect.vue
// Select de modo (Vue / Vanilla) del topbar. Sólo decide a qué URL ir: lo que se
// renderiza sale del build (el modo de la página se deriva de la ruta y el
// sidebar ya viene filtrado por prefijo). Al elegir, recuerda la preferencia en
// localStorage; de eso se encarga el script de `transformHead` (config.ts), que
// redirige antes del primer paint si la preferencia no coincide con la página.
import { computed, ref } from "vue";
import { useData, useRouter } from "vitepress";
import Dropdown from "@/components/overlay/Dropdown.vue";
import Button from "@/components/buttons/Button.vue";
import LucideChevronDown from "@/components/icons/LucideChevronDown.vue";
import LucideCheck from "@/components/icons/LucideCheck.vue";

const { page, theme } = useData();
const router = useRouter();

interface Item {
  text: string;
  link: string;
}
interface Group {
  text: string;
  items: Item[];
}

const families = computed(() => {
  const sidebar = (theme.value.sidebar ?? {}) as Record<string, Group[]>;
  return {
    vue: sidebar["/componentes/vue/"] ?? [],
    vanilla: sidebar["/componentes/"] ?? [],
  };
});

const currentLink = computed(() => `/${page.value.relativePath.replace(/\.md$/, "")}`);

function findByLink(groups: Group[], link: string): Item | null {
  for (const group of groups) for (const item of group.items) if (item.link === link) return item;
  return null;
}
function findByText(groups: Group[], text: string): Item | null {
  for (const group of groups) for (const item of group.items) if (item.text === text) return item;
  return null;
}

/** Modo de la página actual + la contraparte en la otra familia (si existe). */
const context = computed(() => {
  for (const mode of ["vue", "vanilla"] as const) {
    const current = findByLink(families.value[mode], currentLink.value);
    if (!current) continue;
    const other = mode === "vue" ? "vanilla" : "vue";
    return { mode, counterpart: findByText(families.value[other], current.text) };
  }
  return null;
});

/** Opciones del select: siempre Vue; Vanilla sólo si el componente la tiene. */
const options = computed(() => {
  const ctx = context.value;
  if (!ctx) return [];
  const vueLink = ctx.mode === "vue" ? currentLink.value : ctx.counterpart?.link;
  const vanillaLink = ctx.mode === "vanilla" ? currentLink.value : ctx.counterpart?.link;
  return ([
    vueLink && { mode: "vue", label: "Vue", link: vueLink },
    vanillaLink && { mode: "vanilla", label: "Vanilla", link: vanillaLink },
  ] as ({ mode: string; label: string; link: string } | undefined)[]).filter(
    (option): option is { mode: string; label: string; link: string } => !!option,
  );
});

const currentLabel = computed(
  () => options.value.find((option) => option.mode === context.value?.mode)?.label ?? "",
);

const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);

function select(option: { mode: string; label: string; link: string }) {
  if (typeof localStorage !== "undefined") localStorage.setItem("cu-docs-mode", option.mode);
  dropdownRef.value?.close();
  router.go(option.link);
}
</script>

<template>
  <Dropdown
    v-if="options.length > 1"
    ref="dropdownRef"
    color="neutral"
    variant="ghost"
    position="bottom"
    align="end"
    panel-width="160px"
  >
    <template #toggle="{ toggle, isOpen }">
      <Button variant="ghost" color="neutral" @click="toggle" aria-label="Modo de la documentación">
        <span class="docs-mode-label">{{ currentLabel }}</span>
        <LucideChevronDown
          :class="['docs-mode-chevron', { 'docs-mode-chevron--open': isOpen }]"
        />
      </Button>
    </template>

    <button
      v-for="option in options"
      :key="option.mode"
      type="button"
      role="menuitem"
      class="docs-mode-item"
      :class="{ 'docs-mode-item--active': option.mode === context?.mode }"
      @click="select(option)"
    >
      {{ option.label }}
      <LucideCheck v-if="option.mode === context?.mode" class="docs-mode-check" />
    </button>
  </Dropdown>
</template>

<style scoped>
.docs-mode-label {
  font-size: var(--cu-font-size-sm);
}

.docs-mode-chevron {
  transition: transform 150ms ease;
}

.docs-mode-chevron--open {
  transform: rotate(180deg);
}

.docs-mode-item {
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

.docs-mode-item:hover {
  background-color: var(--cu-color-neutral-ghost-hover);
}

.docs-mode-item--active {
  font-weight: var(--cu-font-weight-semibold);
}

.docs-mode-check {
  color: var(--cu-color-primary);
  flex-shrink: 0;
}
</style>
