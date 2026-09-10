import type { Component, VNodeChild } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import type { ExpectStatic } from "vitest";

/**
 * Contrato de una story de ComegenUI.
 *
 * Una story es la fuente única de un componente: alimenta el preview del
 * playground (`StoryRenderer`), los snippets de código, y los tests de las
 * 3 capas (L1 `.vue`, L2 `.ce`, L3 `.umd`).
 */

/** Contenido de un slot: texto plano o función que devuelve VNodes. */
export type SlotContent = string | number | (() => VNodeChild);

/** Una variante = una fila del demo del playground. */
export interface Variant {
  /** id corto y estable: 'primary', 'sm', 'external'… */
  id: string;
  /** Props Vue (L1 y preview). */
  props?: Record<string, unknown>;
  /** Atributos HTML kebab para las capas ce/umd (ej: `{ "aria-label": "…" }`). */
  attrs?: Record<string, string>;
  /** Slots (`default` y/o nombrados). */
  slots?: Record<string, SlotContent>;
}

export interface L1Context {
  wrapper: VueWrapper;
  /** expect de vitest inyectado por el runner (las stories no importan vitest). */
  expect: ExpectStatic;
  variant: Variant;
}

export interface CeContext {
  host: HTMLElement;
  expect: ExpectStatic;
  variant: Variant;
}

export interface UmdContext {
  host: HTMLElement;
  expect: ExpectStatic;
  variant: Variant;
}

/** Un check corre sobre una variante en una capa concreta. */
export interface SectionCheck<Ctx> {
  /** nombre corto y descriptivo: 'aplica token --btn-bg' */
  name: string;
  run: (ctx: Ctx, variant: Variant) => void | Promise<void>;
}

export interface SectionChecks {
  /** Capa 1: `.vue` mounteado con @vue/test-utils (jsdom). */
  l1?: SectionCheck<L1Context>[];
  /** Capa 2: custom element real (`*.ce.vue`), browser. */
  ce?: SectionCheck<CeContext>[];
  /** Capa 3: artefacto UMD (`dist-lib/CuX.umd.js`), browser. */
  umd?: SectionCheck<UmdContext>[];
}

/** Una sección del playground (mismo `id` que el nav). */
export interface Section {
  /** id del nav del playground: 'colors', 'disabled'… */
  id: string;
  /** título visible de la sección. */
  title: string;
  /** párrafo descriptivo opcional, arriba del demo. */
  description?: string;
  /** texto del Badge del heading (ej: 'ghost'). */
  badge?: string;
  /** title/tooltip del Badge. */
  badgeTitle?: string;
  /** layout del preview. */
  layout?: "row" | "col";
  /** filas del demo; alimentan preview y las 3 capas. */
  variants: Variant[];
  /** demo interactiva que reemplaza al loop de variantes (opcional). */
  preview?: Component;
  /** demo interactiva extra, pintada DESPUÉS de los variants (opcional). */
  extra?: Component;
  /** snippet de uso en Vue (SFC). */
  vue?: string;
  /** snippet de uso en vanilla (custom element). */
  vanilla?: string;
  checks: SectionChecks;
}

/** Fila de las tablas de API (props/slots/events/exposes). */
export interface ApiRow {
  name: string;
  type?: string;
  default?: string;
  description?: string;
}

/** Metadata de API que la página genérica pinta como tablas. */
export interface StoryApi {
  components?: { label: string; path: string }[];
  props?: ApiRow[];
  slots?: ApiRow[];
  events?: ApiRow[];
  exposes?: ApiRow[];
  interfaceCode?: string;
}

/** Sección extra de la story (ej: Programmatic), con demo en vivo y snippets. */
export interface StoryExtra {
  /** id del nav: 'programmatic'. */
  id: string;
  /** título visible: 'Programmatic'. */
  title: string;
  /** párrafo descriptivo opcional. */
  description?: string;
  /** demo en vivo. */
  render: () => VNodeChild;
  /** snippet de uso en Vue (opcional). */
  vue?: string;
  /** snippet de uso en vanilla (opcional). */
  vanilla?: string;
}

export interface ComponentStory {
  /** tag del custom element: 'cu-button'. */
  component: string;
  /** componente `.vue` real (preview + L1). */
  vue: Component;
  /** wrapper `.ce.vue` (L2). */
  ce?: Component;
  /** Tokens CSS que usa el componente (sección Style). */
  tokens?: string[];
  /** Sub-componentes con estilos propios (sección Style). */
  subComponents?: { label: string; path: string }[];
  /** API declarada: la página genérica la pinta como tablas. */
  api?: StoryApi;
  /** Secciones extra (ej: Programmatic) pintadas después de las secciones. */
  extras?: StoryExtra[];
  /** Setup previo a cada test L1 (ej: inicializar stores o plugins). */
  setup?: () => void | Promise<void>;
  /** Opciones de mount por test (ej: `{ plugins: [createPinia()] }`). */
  global?: () => Record<string, unknown>;
  sections: Section[];
}
