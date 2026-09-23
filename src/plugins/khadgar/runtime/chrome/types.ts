/**
 * Tipos compartidos por los componentes de chrome del playground.
 *
 * Se mantienen en un archivo propio (sin importar los `.vue` fallback) para
 * evitar ciclos: `chrome.ts` importa los fallbacks y los fallbacks importan
 * estos tipos.
 */

/** Hoja/grupo del nav lateral. */
export interface NavItem {
  label: string;
  path?: string;
  icon?: string;
  children?: NavItem[];
}