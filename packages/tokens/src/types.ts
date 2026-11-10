import type { Ref } from "vue";

/**
 * Tipos propios del composable de tema.
 *
 * Se declaran acá (en vez de re-exportar los de gandalf) para que las
 * declaraciones publicadas no dependan de `@spicydogwings/gandalf-tokens`:
 * el runtime de gandalf queda empaquetado en `dist/`, pero los tipos son
 * de este paquete.
 */
export interface UseThemeOptions {
  /** Nombres de temas disponibles, por ejemplo `["light", "dark"]`. */
  themes: readonly string[];
  /** Tema inicial si no hay preferencia guardada, atributo ni sistema. */
  defaultTheme?: string;
  /** Atributo HTML que se actualiza. Default: `data-theme`. */
  attribute?: string;
  /** Clave de `localStorage`. Default: `gandalf-theme`. */
  storageKey?: string;
  /** Persistir la elección en `localStorage`. Default: `true`. */
  persist?: boolean;
  /** Inferir el tema inicial de `prefers-color-scheme`. Default: `true`. */
  system?: boolean;
}

export interface UseTheme {
  /** Tema actual. Solo cambia mediante `setTheme`/`toggleTheme`. */
  theme: Readonly<Ref<string>>;
  /** Temas disponibles. */
  themes: readonly string[];
  /** Cambia el tema y actualiza el atributo HTML. */
  setTheme: (theme: string) => void;
  /** Avanza al siguiente tema de `themes` (ciclo). */
  toggleTheme: () => void;
}
