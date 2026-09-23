// src/plugins/khadgar-docs/theme.mjs — Traduce los tokens de diseño de
// ComegenUI (fuente de verdad: `comegen.config.json`) al formato de tema de
// VitePress.
//
// - `buildThemesCss`: los temas CU con selectores que VitePress entiende
//   (`:root`, `html.dark`, `[data-theme=...]`).
// - `buildVitePressBridgeCss`: puente de variables `--vp-*` → `--cu-*`, para que
//   el chrome de VitePress use la paleta/tipografía de ComegenUI.
//
// Se ejecuta con `tsx` (importa el generador TS de `cu-tokens`).
import { generateThemesCSS } from "@/plugins/cu-tokens/css";
import { DEFAULTS, DEFAULT_OPACITIES, extractColors, extractShared } from "@/plugins/cu-tokens/defaults";

/** CSS de los temas CU con selectores compatibles con VitePress. */
export function buildThemesCss(cuConfig = {}) {
  const shared = extractShared({ ...DEFAULTS, ...cuConfig });
  const opacities = { ...DEFAULT_OPACITIES, ...(cuConfig.opacities ?? {}) };
  const defaultColors = extractColors(DEFAULTS);
  const themes = {};
  for (const [name, tokens] of Object.entries(cuConfig.themes ?? {})) {
    const colors = tokens?.colors ?? tokens;
    themes[name] = { colors: { ...defaultColors, ...colors } };
  }
  const css = generateThemesCSS(themes, shared, opacities);
  // VitePress marca el modo oscuro con la clase `dark` en <html>; el resto de los
  // temas se siguen activando por `data-theme` (ThemeBuilder / prop `theme`).
  return `${css.replace(/\[data-theme="dark"\]/g, 'html.dark, [data-theme="dark"]')}\n`;
}

/** Puente `--vp-*` → `--cu-*`. */
export function buildVitePressBridgeCss() {
  return `/* Generado por khadgar-docs: puente VitePress → tokens de ComegenUI. */
html:root {
  --vp-font-family-base: var(--cu-font-sans);
  --vp-font-family-mono: var(--cu-font-mono);

  --vp-c-brand-1: var(--cu-color-primary);
  --vp-c-brand-2: var(--cu-color-primary-hover);
  --vp-c-brand-3: var(--cu-color-primary-active);
  --vp-c-brand-soft: var(--cu-color-primary-soft);

  --vp-c-bg: var(--cu-color-surface);
  --vp-c-bg-alt: color-mix(in srgb, var(--cu-color-surface), var(--cu-color-neutral) 4%);
  --vp-c-bg-soft: color-mix(in srgb, var(--cu-color-surface), var(--cu-color-neutral) 3%);
  --vp-c-bg-elv: var(--cu-color-surface);

  --vp-c-text-1: var(--cu-color-neutral);
  --vp-c-text-2: color-mix(in srgb, var(--cu-color-neutral) 72%, transparent);
  --vp-c-text-3: color-mix(in srgb, var(--cu-color-neutral) 50%, transparent);

  --vp-c-divider: var(--cu-border-color);
  --vp-c-border: var(--cu-border-color);
  --vp-c-gutter: var(--cu-border-color);

  --vp-c-default-1: var(--cu-color-neutral);
  --vp-c-default-2: var(--cu-color-neutral);
  --vp-c-default-3: var(--cu-color-neutral);
  --vp-c-default-soft: var(--cu-color-neutral-soft);

  --vp-c-tip-1: var(--cu-color-success);
  --vp-c-tip-2: var(--cu-color-success);
  --vp-c-tip-3: var(--cu-color-success);
  --vp-c-tip-soft: var(--cu-color-success-soft);

  --vp-c-warning-1: var(--cu-color-warning);
  --vp-c-warning-2: var(--cu-color-warning);
  --vp-c-warning-3: var(--cu-color-warning);
  --vp-c-warning-soft: var(--cu-color-warning-soft);

  --vp-c-danger-1: var(--cu-color-danger);
  --vp-c-danger-2: var(--cu-color-danger);
  --vp-c-danger-3: var(--cu-color-danger);
  --vp-c-danger-soft: var(--cu-color-danger-soft);

  --vp-c-important-1: var(--cu-color-primary);
  --vp-c-important-2: var(--cu-color-primary);
  --vp-c-important-3: var(--cu-color-primary);
  --vp-c-important-soft: var(--cu-color-primary-soft);

  --vp-c-info-1: var(--cu-color-secondary);
  --vp-c-info-2: var(--cu-color-secondary);
  --vp-c-info-3: var(--cu-color-secondary);
  --vp-c-info-soft: var(--cu-color-secondary-soft);

  --vp-button-brand-border: var(--cu-color-primary);
  --vp-button-brand-text: var(--cu-color-surface);
  --vp-button-brand-bg: var(--cu-color-primary);
  --vp-button-brand-hover-border: var(--cu-color-primary-hover);
  --vp-button-brand-hover-text: var(--cu-color-surface);
  --vp-button-brand-hover-bg: var(--cu-color-primary-hover);
  --vp-button-brand-active-border: var(--cu-color-primary-active);
  --vp-button-brand-active-text: var(--cu-color-surface);
  --vp-button-brand-active-bg: var(--cu-color-primary-active);

  --vp-code-block-bg: var(--cu-code-bg);
  --vp-code-color: var(--cu-color-primary);
  --vp-code-line-highlight-color: var(--cu-color-neutral-soft);

  --vp-home-hero-name-color: var(--cu-color-primary);
  --vp-home-hero-image-background-image: none;
  --vp-home-hero-image-filter: none;
}
`;
}
