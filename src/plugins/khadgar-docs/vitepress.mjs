// src/plugins/khadgar-docs/vitepress.mjs — Traduce la data de Khadgar al formato
// de configuración de VitePress (nav/sidebar). khadgar-docs es el único que
// conoce VitePress; khadgar no.

const DEFAULT_ROUTE_BASE = "/componentes";

/**
 * @param {{ components: Array<{ name: string, tag?: string, group: string }> }} index
 * @param {object} [docs] scope `docs` de `khadgar.config.json`
 */
export function buildVitepressConfig(index, docs = {}) {
  const routeBase = (docs.routeBase ?? DEFAULT_ROUTE_BASE).replace(/\/+$/, "");
  const order = docs.order ?? [];
  const rank = (group) => {
    const position = order.indexOf(group);
    return position < 0 ? order.length : position;
  };

  const components = index.components;
  const byGroup = new Map();
  for (const component of components) {
    const key = component.group || "Otros";
    (byGroup.get(key) ?? byGroup.set(key, []).get(key)).push(component);
  }

  const sidebar = [...byGroup.entries()]
    .sort((a, b) => rank(a[0]) - rank(b[0]) || a[0].localeCompare(b[0]))
    .map(([group, items]) => ({
      text: group,
      items: [...items]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((component) => ({ text: component.name, link: `${routeBase}/${component.slug}` })),
    }));

  const nav = [
    {
      text: docs.nav?.label ?? "Componentes",
      link: sidebar[0]?.items[0]?.link ?? routeBase,
    },
    ...(docs.nav?.extras ?? []),
  ];

  return {
    title: docs.title ?? "ComegenUI",
    description: docs.description ?? "",
    routeBase,
    nav,
    sidebar,
    components: components.map((component) => ({
      tag: component.tag,
      name: component.name,
      slug: component.slug,
      group: component.group,
      customElement: component.customElement === true,
    })),
  };
}
