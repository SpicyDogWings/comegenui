import { useTheme as gandalfUseTheme } from "@spicydogwings/gandalf-tokens/vue";
import type { UseTheme, UseThemeOptions } from "./types";

/**
 * Tema de ComegenUI. Implementado por gandalf (empaquetado en el build):
 * escribe `data-theme` en `<html>`, persiste en `localStorage` y resuelve
 * el tema inicial (guardado → atributo → sistema → default).
 */
export function useTheme(options: UseThemeOptions): UseTheme {
  return gandalfUseTheme(options);
}

export type { UseTheme, UseThemeOptions };
