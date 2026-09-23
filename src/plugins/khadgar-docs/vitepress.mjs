// src/plugins/khadgar-docs/vitepress.mjs — Traduce la data de Khadgar al formato
// de configuración de VitePress (nav/sidebar). khadgar-docs es el único que
// conoce VitePress; khadgar no.

const DEFAULT_ROUTE_BASE = "/componentes";

/**
 * @param {{ components: Array<{ name: string, tag?: string, category: string }> }} index
 * @param {object} [docs] scope `docs` de `khadgar.config.json`
 */
export function buildVitepressConfig(index, docs = {}) {
  const routeBase = (docs.routeBase ?? DEFAULT_ROUTE_BASE).replace(/\/+$/, "");
  const groups = docs.groups ?? {};
  const order = docs.order ?? Object.keys(groups);
  const rank = (category) => {
    const position = order.indexOf(category);
    return position < 0 ? order.length : position;
  };

  const publicComponents = index.components.filter((component) => component.tag);
  const byCategory = new Map();
  for (const component of publicComponents) {
    const key = component.category || "otros";
    (byCategory.get(key) ?? byCategory.set(key, []).get(key)).push(component);
  }

  const sidebar = [...byCategory.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]))
    .map(([category, items]) => ({
      text: groups[category] ?? category,
      items: [...items]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((component) => ({ text: component.name, link: `${routeBase}/${component.tag}` })),
    }));

  const nav = docs.nav ?? [
    {
      text: docs.navLabel ?? "Componentes",
      link: sidebar[0]?.items[0]?.link ?? routeBase,
    },
  ];

  return {
    title: docs.title ?? "ComegenUI",
    description: docs.description ?? "",
    routeBase,
    nav,
    sidebar,
    components: publicComponents.map((component) => ({
      tag: component.tag,
      name: component.name,
      category: component.category,
    })),
  };
}
