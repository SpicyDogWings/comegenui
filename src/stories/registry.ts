import type { ComponentStory } from "./types";

const modules = import.meta.glob("./**/*.stories.ts", { eager: true }) as Record<
  string,
  Record<string, unknown>
>;

export interface StoryEntry {
  /** Nombre del archivo, ej: 'Button'. */
  name: string;
  story: ComponentStory;
}

function storyOf(module: Record<string, unknown>): ComponentStory | undefined {
  return Object.values(module).find(
    (value): value is ComponentStory =>
      Boolean(
        value &&
          typeof value === "object" &&
          "component" in value &&
          "sections" in value,
      ),
  );
}

const entries = new Map<string, StoryEntry>();

for (const [path, module] of Object.entries(modules)) {
  const story = storyOf(module);
  if (!story) continue;
  const file = path.split("/").pop()?.replace(/\.stories\.ts$/, "") ?? "";
  const kebabFile = file.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
  const entry = { name: file, story };
  entries.set(file, entry);
  entries.set(file.toLowerCase(), entry);
  entries.set(kebabFile, entry);
  entries.set(story.component, entry);
  entries.set(story.component.replace(/^cu-/, ""), entry);
}

/** Busca una story por nombre de archivo, tag (`cu-button`) o kebab (`button`). */
export function getStory(name: string): StoryEntry | undefined {
  return entries.get(name) ?? entries.get(name.toLowerCase());
}
