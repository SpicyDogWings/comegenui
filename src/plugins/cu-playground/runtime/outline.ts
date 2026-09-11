import type { ComponentStory } from "@/stories/types";

export interface OutlineItem {
  label: string;
  id: string;
  children?: { label: string; id: string }[];
}

/**
 * Construye el outline de una story: secciones + extras + Style + API.
 * Lo usan la página genérica y las páginas físicas generadas.
 */
export function buildOutline(story: ComponentStory): OutlineItem[] {
  const items: OutlineItem[] = story.sections.map((section) => ({
    label: section.title,
    id: section.id,
  }));

  for (const extra of story.extras ?? []) {
    items.push({ label: extra.title, id: extra.id });
  }

  const styleChildren: { label: string; id: string }[] = [
    { label: "CSS Variables", id: "style-variables" },
  ];
  if (story.classes?.length) styleChildren.push({ label: "CSS Classes", id: "style-classes" });
  items.push({ label: "Style", id: "style", children: styleChildren });

  const apiChildren: { label: string; id: string }[] = [];
  if (story.api?.components?.length) apiChildren.push({ label: "Components", id: "api-components" });
  apiChildren.push(
    { label: "Props", id: "api-props" },
    { label: "Slots", id: "api-slots" },
    { label: "Events", id: "api-events" },
    { label: "Exposes", id: "api-exposes" },
  );
  if (story.api?.interfaceCode) apiChildren.push({ label: "Interfaces", id: "api-interfaces" });
  items.push({ label: "API", id: "api", children: apiChildren });

  return items;
}
