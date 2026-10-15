// docs/site/.vitepress/theme/useDocsVersions.ts
// Catálogo de versiones de la doc, compartido por el select del topbar y la paleta
// de comandos. Lo escribe `scripts/docs-versions.mjs` en `/versions.json` (raíz y
// copia en cada versión). En `vitepress dev` no existe: queda vacío y los que lo
// usan se ocultan.
import { computed, ref } from "vue";
import { useData, withBase } from "vitepress";

export interface VersionEntry {
  id: string;
  label: string;
  /** Base de la versión, siempre `/<id>/` (la raíz `/` es el alias de latest). */
  base: string;
  /** Rutas (relativas a la base) que existen en esa versión. */
  routes?: string[];
  latest?: boolean;
}

export interface VersionOption extends VersionEntry {
  /** URL de la página actual dentro de esa versión (o su home). */
  link: string;
  /** Si es la versión que se está viendo. */
  active: boolean;
}

interface DocsVersion {
  id: string;
  label: string;
}

// Estado a nivel módulo: el fetch se hace una sola vez para todos los consumidores
// y sobrevive a la navegación SPA.
const versions = ref<VersionEntry[]>([]);
let pending: Promise<void> | null = null;

function load(): Promise<void> {
  if (pending) return pending;
  pending = fetch(withBase("/versions.json"), { cache: "no-cache" })
    .then((res) => (res.ok ? res.json() : null))
    .then((data: unknown) => {
      const list = (data as { versions?: VersionEntry[] } | null)?.versions;
      if (Array.isArray(list)) versions.value = list;
    })
    .catch(() => {
      /* sin catálogo (dev): select y comandos de versión quedan ocultos */
    });
  return pending;
}

export function useDocsVersions() {
  const { page, site, theme } = useData();

  // Sólo en cliente: VitePress es SSG y no queremos un fetch por página en build.
  // El primer render (SSR e hidratación) va sin versiones → sin desajuste.
  if (typeof window !== "undefined") void load();

  const own = computed<DocsVersion | null>(
    () => (theme.value.docsVersion as DocsVersion | undefined) ?? null,
  );

  /** Path relativo a la raíz del sitio, sin el `.md` ni la base de la versión. */
  const relPath = computed(() => {
    const relative = page.value.relativePath.replace(/\.md$/, "");
    const withoutIndex = relative.replace(/(^|\/)index$/, "$1");
    return withoutIndex ? `/${withoutIndex}` : "/";
  });

  const current = computed(
    () =>
      versions.value.find((entry) => entry.base === site.value.base) ??
      versions.value.find((entry) => entry.id === own.value?.id) ??
      versions.value.find((entry) => entry.latest) ??
      null,
  );

  /** URL de esta página dentro de otra versión (o su home si no existe ahí). */
  function linkTo(entry: VersionEntry): string {
    const home = entry.base;
    if (relPath.value === "/") return home;
    if (entry.routes && !entry.routes.includes(relPath.value)) return home;
    return `${entry.base.replace(/\/$/, "")}${relPath.value}`;
  }

  const options = computed<VersionOption[]>(() =>
    versions.value.map((entry) => ({
      ...entry,
      link: linkTo(entry),
      active: current.value?.id === entry.id,
    })),
  );

  return { versions, current, options, linkTo };
}
