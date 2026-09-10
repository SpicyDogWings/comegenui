import type { InjectionKey } from "vue";
import type { ComponentStory } from "@/stories/types";

/** Un componente registrado en el playground. */
export interface StoryEntry {
  /** Nombre del archivo, ej: 'Button'. */
  name: string;
  /** Nombre kebab, ej: 'button'. */
  kebab: string;
  /** Categoría (subcarpeta del glob), ej: 'buttons'. '' si está en la raíz. */
  category: string;
  /** Ruta absoluta del playground, ej: '/playground/components/button'. */
  route: string;
  /** Carga perezosa de la story (code-splitting). */
  load: () => Promise<ComponentStory | undefined>;
}

/** Hoja del nav lateral. */
export interface NavLeaf {
  label: string;
  path: string;
}

/** Grupo del nav lateral (una categoría de carpeta). */
export interface NavGroup {
  label: string;
  children: NavLeaf[];
}

/**
 * Registry que provee el plugin `cu-playground` al runtime del playground.
 *
 * El nav y el listado se derivan de la ruta de cada story (sin cargar su
 * contenido). El contenido de la story se resuelve de forma perezosa en la
 * página (`load()`), para no pagar el costo de importar todas al boot.
 */
export interface PlaygroundRegistry {
  /** Base de las rutas de componentes, ej: '/playground/components'. */
  base: string;
  /** Busca una story por nombre de archivo, kebab o tag. */
  getStory(name: string): StoryEntry | undefined;
  /** Todas las stories registradas. */
  entries(): StoryEntry[];
  /** Árbol del nav lateral (categorías → componentes). */
  nav(): NavGroup[];
  /** Página física de override para un componente (si existe). */
  getPage(name: string): (() => Promise<unknown>) | undefined;
}

/** Inyección del registry del playground. */
export const playgroundKey: InjectionKey<PlaygroundRegistry> = Symbol("cu-playground-registry");
