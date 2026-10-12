// docs/site/.vitepress/theme/comegen-demos.ts
// Auto-registro de los demos vanilla: el `id` de cada `<ComegenDemo id="…" />`
// (el de los marcadores `<!-- demo:id -->` de las fichas) es el **nombre del
// archivo** del demo, en kebab-case, bajo `docs/site/examples/<comp>/`.
//
//   examples/button/button-variantes.vue  →  id = "button-variantes"
//
// Los ejemplos Vue (`<Comp><Thing>Example.vue`, PascalCase) se excluyen por el
// filtro kebab-case. Así nadie tiene que mantener un registro a mano.
import { defineAsyncComponent, type Component } from "vue";

const modules = import.meta.glob("../../examples/**/*.vue");
const KEBAB = /^[a-z][a-z0-9]*(?:-[a-z0-9]+)*$/;

export const demos: Record<string, Component> = {};
for (const [path, loader] of Object.entries(modules)) {
  const id = path.replace(/^.*\//, "").replace(/\.vue$/, "");
  if (!KEBAB.test(id)) continue;
  demos[id] = defineAsyncComponent(loader as () => Promise<{ default: Component }>);
}
