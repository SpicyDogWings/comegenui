// docs/site/.vitepress/theme/comegen-shared.ts
// Carga los custom elements desde el build `esm-shared` (`dist-libs/esm-shared/CuX.js`).
//
// Cada bundle hace `customElements.define(...)` / `initTokens()` a nivel módulo,
// así que SÓLO puede importarse en el cliente (en SSR no hay `customElements` ni
// `document`): por eso los `import()` se disparan desde `onMounted`.
//
// Se usa `import.meta.glob` (no eager): si `dist-libs/esm-shared` todavía no se
// construyó, el glob devuelve `{}` y el build NO rompe; el demo muestra el aviso.
// Prerrequisito para verlos: `pnpm build:lib`.
const modules = import.meta.glob([
  "../../../../dist-libs/esm-shared/*.js",
  // `comegen-vue.js` es el runtime ESM de Vue para hosts sin bundler; en el sitio
  // no se usa (Vue lo aporta VitePress), así que se excluye del build.
  "!../../../../dist-libs/esm-shared/comegen-vue.js",
]);
const bundles = modules;

export type ComegenSharedName = string;

/** Nombres de bundle disponibles (p. ej. "CuButton"), derivados del archivo. */
export function availableShared(): string[] {
  return Object.keys(bundles)
    .map((p) => p.replace(/^.*\//, "").replace(/\.js$/, ""))
    .sort();
}

/** Importa (y así registra) los custom elements pedidos. Cliente únicamente. */
export async function loadComegenShared(names: ComegenSharedName[]): Promise<void> {
  const entries = Object.entries(bundles);
  await Promise.all(
    names.map((name) => {
      const entry = entries.find(([path]) => path.endsWith(`/${name}.js`));
      if (!entry) {
        throw new Error(`falta el bundle «${name}.js» en dist-libs/esm-shared (corré \`pnpm build:lib\`)`);
      }
      return entry[1]();
    }),
  );
}
