import type { Plugin } from "vite";
import { gandalfTokens } from "@spicydogwings/gandalf-tokens/vite";
import { gandalfConfig } from "./gandalf.config";

export interface ComegenTokensPluginOptions {
  /** Emite el CSS en esta ruta y enlaza un `<link>`. */
  output?: string | false;
  /** Inyecta el CSS en el HTML. Default: `true`. */
  inject?: boolean;
}

/**
 * Plugin de Vite preconfigurado con los tokens de ComegenUI.
 *
 * - Sin `output`: inyecta un `<style>` inline.
 * - Con `output`: sirve/emite el CSS y lo enlaza desde el HTML.
 */
export function comegenTokens(options: ComegenTokensPluginOptions = {}): Plugin {
  return gandalfTokens({ config: gandalfConfig, ...options });
}
