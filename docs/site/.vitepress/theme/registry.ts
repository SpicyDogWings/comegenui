// Registro de los `.vue` reales para las demos. Se resuelve en el cliente.
// Se excluyen en el propio glob (no solo al buscar) para no bundlear los
// componentes internos/legacy (varios tienen imports rotos).
const modules = import.meta.glob(
  ["@/components/**/*.vue", "!@/components/{customElements,icons,lab,legacy,archived}/**"],
  { import: "default" },
) as Record<string, () => Promise<unknown>>;

/** Loader del componente por nombre (`Button` → `@/components/buttons/Button.vue`). */
export function loadComponent(name: string): (() => Promise<unknown>) | null {
  const key = Object.keys(modules).find((path) => path.endsWith(`/${name}.vue`));
  return key ? modules[key]! : null;
}
