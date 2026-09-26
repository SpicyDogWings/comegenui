import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";
import { buildSidebars } from "./sidebar";
import shikiThemes from "./theme/shiki.gen.mjs";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");

const ROUTE_BASE = "/componentes";
// El sidebar sale del frontmatter de `docs/site/componentes/**/*.md`, partido en
// dos familias por prefijo de ruta: `/componentes/vue/` (doc Vue) y
// `/componentes/` (doc del Custom Element). VitePress elige el prefijo más
// específico, así que el sidebar queda filtrado por modo sin JS.
const sidebar = buildSidebars();
const firstVanilla = sidebar["/componentes/"]?.[0]?.items[0]?.link ?? ROUTE_BASE;

type Item = { text: string; link: string };

/**
 * Mapa `link → { contraparte, modo }` entre las dos familias del sidebar. Las
 * dos páginas de un componente comparten `title`, así que la contraparte se
 * encuentra comparando títulos (no hay tabla que mantener a mano).
 */
function buildModeMap(): Map<string, { counterpart: string; mode: "vue" | "vanilla" }> {
  const vue = sidebar["/componentes/vue/"] ?? [];
  const vanilla = sidebar["/componentes/"] ?? [];
  const byText = (groups: { items: Item[] }[], text: string) =>
    groups.flatMap((group) => group.items).find((item) => item.text === text);
  const map = new Map<string, { counterpart: string; mode: "vue" | "vanilla" }>();
  for (const group of vanilla) {
    for (const item of group.items) {
      const twin = byText(vue, item.text);
      if (!twin) continue;
      map.set(item.link, { counterpart: twin.link, mode: "vanilla" });
      map.set(twin.link, { counterpart: item.link, mode: "vue" });
    }
  }
  return map;
}

const modeMap = buildModeMap();

export default defineConfig({
  title: "ComegenUI",
  description: "Componentes web de ComegenUI.",
  cleanUrls: true,
  // Syntax highlighting con la paleta CU (generado por cu-tokens).
  markdown: {
    theme: (shikiThemes as { vitepress: { light: unknown; dark: unknown } }).vitepress as never,
  },
  // Las fichas se incluyen tal cual en las páginas: sus links al índice de
  // fichas (`../README.md`) y al playground no existen como rutas del sitio.
  ignoreDeadLinks: [/README/, /playground/],
  // Redirect antes del primer paint: si la preferencia guardada (`cu-docs-mode`,
  // la escribe el select del topbar) no coincide con el modo de esta página, el
  // browser salta a la contraparte sin pintar la página equivocada. Es lo único
  // en runtime y no decide qué se renderiza: el sidebar ya viene filtrado por
  // prefijo de ruta en build.
  transformHead({ pageData }) {
    const link = `/${pageData.relativePath.replace(/\.md$/, "")}`;
    const entry = modeMap.get(link);
    if (!entry) return;
    return [
      [
        "script",
        {},
        `try{var m=localStorage.getItem("cu-docs-mode");if((m==="vue"||m==="vanilla")&&m!=="${entry.mode}")location.replace("${entry.counterpart}");}catch(e){}`,
      ],
    ];
  },
  themeConfig: {
    nav: [
      { text: "Componentes", link: firstVanilla },
      { text: "Theme Builder", link: "/theme-builder" },
    ],
    sidebar,
  },
  vite: {
    resolve: {
      alias: {
        "@": resolve(repoRoot, "src"),
      },
    },
    server: { fs: { allow: [repoRoot] } },
  },
});
