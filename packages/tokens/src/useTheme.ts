import { ref, type Ref } from "vue";

export interface UseThemeOptions {
  /** Temas válidos. Si se omite, cualquier string se acepta. */
  themes?: readonly string[];
  /** Tema inicial cuando no hay preferencia guardada ni del sistema. */
  defaultTheme?: string;
  /** Atributo HTML que se escribe en `<html>`. Default: `data-theme`. */
  attribute?: string;
  /** Clave de `localStorage`. Default: `comegen-theme`. */
  storageKey?: string;
  /** Persistir la elección en `localStorage`. Default: `true`. */
  persist?: boolean;
}

export interface UseThemeReturn {
  /** Tema activo (readonly: se cambia con `setTheme`). */
  theme: Ref<string>;
  /** Temas válidos. */
  themes: readonly string[];
  setTheme: (value: string) => void;
  /** Avanza al siguiente tema de la lista. */
  toggleTheme: () => void;
}

function readStored(storageKey: string, persist: boolean): string | undefined {
  if (!persist || typeof localStorage === "undefined") return undefined;
  try {
    return localStorage.getItem(storageKey) ?? undefined;
  } catch {
    return undefined;
  }
}

/**
 * Tema de ComegenUI: resuelve el tema inicial (guardado → atributo actual →
 * preferencia del sistema → default) y escribe el atributo en `<html>`.
 *
 * No genera CSS: los temas tienen que existir en `tokens.css`.
 */
export function useTheme(options: UseThemeOptions = {}): UseThemeReturn {
  const attribute = options.attribute ?? "data-theme";
  const storageKey = options.storageKey ?? "comegen-theme";
  const persist = options.persist ?? true;
  const themes = options.themes ?? [];

  const root = typeof document !== "undefined" ? document.documentElement : undefined;

  const currentAttribute = root?.getAttribute(attribute) ?? undefined;
  const systemTheme =
    typeof window !== "undefined" && typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light"
      : undefined;

  const isValid = (value: string | undefined): value is string =>
    value !== undefined && (themes.length === 0 || themes.includes(value));

  const initial =
    [readStored(storageKey, persist), currentAttribute, systemTheme, options.defaultTheme, themes[0]]
      .find(isValid) ?? themes[0] ?? options.defaultTheme ?? "light";

  const theme = ref(initial);

  function apply(value: string) {
    theme.value = value;
    root?.setAttribute(attribute, value);
    if (!persist || typeof localStorage === "undefined") return;
    try {
      localStorage.setItem(storageKey, value);
    } catch {
      // localStorage puede estar bloqueado (modo privado/iframe): el tema
      // sigue aplicándose en el DOM, solo no persiste.
    }
  }

  if (root) apply(initial);

  function setTheme(value: string) {
    if (themes.length > 0 && !themes.includes(value)) {
      throw new Error(`Unknown theme "${value}"`);
    }
    apply(value);
  }

  function toggleTheme() {
    const list = themes.length > 0 ? themes : [theme.value];
    const index = list.indexOf(theme.value);
    setTheme(list[(index + 1) % list.length]!);
  }

  return { theme, themes, setTheme, toggleTheme };
}
