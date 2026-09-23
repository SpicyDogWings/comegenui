import { existsSync, readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vitepress";

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, "../../..");
const dataPath = resolve(repoRoot, "public/khadgar.json");

interface Row {
  name: string;
  type?: string;
  default?: string;
  description?: string;
}
interface Component {
  name: string;
  tag?: string;
  category: string;
  description: string;
  props: Row[];
}

const index: { components: Component[] } = existsSync(dataPath)
  ? JSON.parse(readFileSync(dataPath, "utf-8"))
  : { components: [] };
const publicComponents = index.components.filter((component) => component.tag);

const GROUP_LABELS: Record<string, string> = {
  buttons: "Buttons",
  form: "Formularios",
  controls: "Controles",
  information: "Información",
  markdown: "Markdown",
  overlay: "Overlay",
  navigation: "Navegación",
  data: "Datos",
};

const GROUP_ORDER = Object.keys(GROUP_LABELS);
const rank = (category: string) => {
  const index = GROUP_ORDER.indexOf(category);
  return index < 0 ? GROUP_ORDER.length : index;
};

const groups = new Map<string, Component[]>();
for (const component of publicComponents) {
  const key = component.category || "otros";
  (groups.get(key) ?? groups.set(key, []).get(key)!).push(component);
}

const sidebar = [...groups.entries()]
  .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]))
  .map(([category, items]) => ({
    text: GROUP_LABELS[category] ?? category,
    items: [...items]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map((component) => ({ text: component.name, link: `/componentes/${component.tag}` })),
  }));

export default defineConfig({
  title: "ComegenUI",
  description: "Componentes web de ComegenUI (API autogenerada con Khadgar).",
  cleanUrls: true,
  // Las fichas son compartidas con la skill: `../SKILL.md` y links al playground
  // no existen como páginas del sitio (todavía).
  ignoreDeadLinks: [/SKILL/, /playground/],
  themeConfig: {
    nav: [{ text: "Componentes", link: "/componentes/cu-button" }],
    sidebar,
  },
  vite: {
    resolve: {
      alias: {
        "@": resolve(repoRoot, "src"),
        "#khadgar-data": dataPath,
      },
    },
    server: { fs: { allow: [repoRoot] } },
  },
  transformPageData(pageData) {
    const match = /componentes\/(cu-[\w-]+)\.md$/.exec(pageData.relativePath);
    if (!match) return;
    const component = publicComponents.find((item) => item.tag === match[1]);
    if (!component) return;
    return { frontmatter: { ...pageData.frontmatter, demo: component.name } };
  },
});
