import { computed } from "vue";
import { useRoute } from "vue-router";
import type { PlaygroundLibStatus } from "../keys";

/**
 * Estado dinámico de "inclusión en la lib" para los playgrounds.
 *
 * - `libKey`: nombre del entry point en la lib, derivado de la ruta actual
 *   (último segmento, ej. /playground/components/date-picker → "date-picker").
 * - `inLib`: si ese entry point existe realmente en la lib (verdict calculado
 *   a partir de los `entries` inyectados por el host, no hardcodeado por página).
 *
 * El host inyecta el glob de sus entry points (`libStatus`). Sin config, el
 * badge queda deshabilitado (`enabled === false`).
 */
export function useLibStatus(config: PlaygroundLibStatus | undefined) {
  const route = useRoute();

  const names = computed(() => {
    const set = new Set<string>();
    for (const file of Object.keys(config?.entries ?? {})) {
      const name = file.split("/").pop()?.replace(/\.ts$/, "") ?? "";
      if (name !== "index" && name !== "tokens") set.add(name);
    }
    return set;
  });

  const aliases = config?.aliases ?? {};

  const libKey = computed(() => {
    const segments = route.path.split("/").filter(Boolean);
    const last = segments[segments.length - 1] ?? "";
    return aliases[last] ?? last;
  });

  const inLib = computed(() => names.value.has(libKey.value));
  const enabled = computed(() => Boolean(config));

  return { libKey, inLib, enabled };
}