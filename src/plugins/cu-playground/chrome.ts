import type { Component, InjectionKey } from "vue";
import DefaultAppLayout from "./runtime/chrome/AppLayout.vue";
import DefaultNavbar from "./runtime/chrome/Navbar.vue";
import DefaultOutline from "./runtime/chrome/Outline.vue";
import DefaultBadge from "./runtime/chrome/Badge.vue";
import DefaultTable from "./runtime/chrome/Table.vue";
import DefaultButton from "./runtime/chrome/Button.vue";
import DefaultTabs from "./runtime/chrome/Tabs.vue";
import DefaultCodeBlock from "./runtime/chrome/CodeBlock.vue";
import type { NavItem } from "./runtime/chrome/types";

/**
 * Componentes de "chrome" del playground: la piel que el runtime necesita para
 * renderizar (layout, nav, tablas, badges, tabs y bloques de código).
 *
 * Por defecto el plugin usa fallbacks mínimos (estilo solo CSS vars), así que
 * se puede copiar y andar en cualquier proyecto. El host puede inyectar sus
 * propios componentes vía `chrome` en las opciones del plugin.
 */
export interface PlaygroundChrome {
  appLayout?: Component;
  navbar?: Component;
  outline?: Component;
  badge?: Component;
  table?: Component;
  button?: Component;
  tabs?: Component;
  codeBlock?: Component;
}

export interface ResolvedChrome {
  appLayout: Component;
  navbar: Component;
  outline: Component;
  badge: Component;
  table: Component;
  button: Component;
  tabs: Component;
  codeBlock: Component;
}

export const DEFAULT_CHROME: ResolvedChrome = {
  appLayout: DefaultAppLayout,
  navbar: DefaultNavbar,
  outline: DefaultOutline,
  badge: DefaultBadge,
  table: DefaultTable,
  button: DefaultButton,
  tabs: DefaultTabs,
  codeBlock: DefaultCodeBlock,
};

/** Mergea el chrome del host con los fallbacks (los fallbacks son el default). */
export function resolveChrome(chrome?: PlaygroundChrome): ResolvedChrome {
  return { ...DEFAULT_CHROME, ...chrome };
}

/** Inyección del chrome resuelto. */
export const chromeKey: InjectionKey<ResolvedChrome> = Symbol("cu-playground-chrome");

export type { NavItem };

/** Descripción por defecto de un token CSS (usada si el host no inyecta una). */
export function defaultTokenDescription(name: string): string {
  if (name.startsWith("--cu-color-")) return "Color semántico del tema";
  if (name.startsWith("--cu-")) return "Token compartido del sistema";
  return "Token del componente";
}