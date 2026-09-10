import type { InjectionKey } from "vue";
import type { ComponentStory } from "@/stories/types";

export interface StoryEntry {
  /** Nombre del archivo, ej: 'Button'. */
  name: string;
  story: ComponentStory;
}

export type GetStory = (name: string) => StoryEntry | undefined;

/** Inyección del registry de stories (la provee el plugin `story-playground`). */
export const storyRegistryKey: InjectionKey<GetStory> = Symbol("comegen-story-registry");
