#!/usr/bin/env node
// tools/scaffold-component.mjs — Genera el esqueleto completo de un componente
// nuevo de ComegenUI (componente + CE + entry + story + test).
//
// Uso:
//   pnpm run new:component MiComponente buttons
//   pnpm run new:component MiComponente buttons --internal
//
// Después: playground (página + router + nav) y docs. Ver
// .opencode/skills/comegen-dev/02-crear-componente.md.
import { existsSync, mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const ROOT = process.cwd();
const [name, category, ...flags] = process.argv.slice(2);
const internal = flags.includes("--internal");

if (!name || !/^[A-Z][A-Za-z0-9]*$/.test(name)) {
  console.error("Uso: pnpm run new:component <MiComponente> <category> [--internal]");
  console.error("     <MiComponente> en PascalCase (ej: StatusCard), <category> ej: information");
  process.exit(1);
}

const kebab = name.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase();
const tag = `cu-${kebab}`;
const componentPath = internal ? `src/components/${name}.vue` : `src/components/${category}/${name}.vue`;
const cePath = `src/components/customElements/${category}/${name}.ce.vue`;
const libPath = `src/lib/${category}/${kebab}.ts`;
const storyPath = category ? `src/stories/${category}/${name}.stories.ts` : `src/stories/${name}.stories.ts`;
const testPath = category ? `src/stories/${category}/${name}.l1.test.ts` : `src/stories/${name}.l1.test.ts`;

for (const path of [componentPath, storyPath, testPath, ...(internal ? [] : [cePath, libPath])]) {
  if (existsSync(resolve(ROOT, path))) {
    console.error(`❌ Ya existe ${path}`);
    process.exit(1);
  }
}

function write(path, content) {
  mkdirSync(resolve(ROOT, path.split("/").slice(0, -1).join("/")), { recursive: true });
  writeFileSync(resolve(ROOT, path), content);
  console.log(`✅ ${path}`);
}

// ── Componente ──────────────────────────────────────────────────────────────

write(
  componentPath,
  `<script setup lang="ts">
import { computed, type PropType } from "vue";

type CuColor = "primary" | "secondary" | "neutral" | "success" | "warning" | "danger";

const props = defineProps({
  color: { type: String as PropType<CuColor>, default: "neutral" },
});

const colorStyles = computed(() => ({
  "--${kebab}-bg": \`var(--cu-color-\${props.color})\`,
  "--${kebab}-text": \`var(--cu-color-\${props.color}-text)\`,
}));
</script>

<template>
  <div class="cu-${kebab}" :style="colorStyles">
    <slot />
  </div>
</template>

<style scoped>
.cu-${kebab} {
  display: inline-flex;
  align-items: center;
  gap: var(--cu-space-xs);
  padding: var(--cu-space-xs) var(--cu-space-sm);
  border-radius: var(--cu-radius);
  background-color: var(--${kebab}-bg);
  color: var(--${kebab}-text);
  font-family: var(--cu-font-sans);
  font-size: var(--cu-font-size-sm);
}
</style>
`,
);

// ── Wrapper CE + entry (solo públicos) ──────────────────────────────────────

if (!internal) {
  write(
    cePath,
    `<script setup lang="ts">
import { getCurrentInstance, type PropType } from "vue";
import ${name} from "../../${category}/${name}.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const props = defineProps({
  color: { type: String as PropType<"primary" | "secondary" | "neutral" | "success" | "warning" | "danger">, default: "neutral" },
});

const instance = getCurrentInstance();

// TODO: llamar a ceEmit('evento', payload) cuando el componente emita algo.
function ceEmit(event: string, payload: unknown) {
  const el = instance?.vnode.el as HTMLElement | null;
  const host = el?.getRootNode()?.host || el;
  if (host) {
    host.dispatchEvent(new CustomEvent(event, { detail: payload, bubbles: true, composed: true }));
  }
}
</script>

<template>
  <${name} :color="props.color">
    <slot></slot>
  </${name}>
</template>
`,
  );

  write(
    libPath,
    `import { defineCustomElement } from "vue";
import ${name} from "@/components/customElements/${category}/${name}.ce.vue";

const Cu${name} = defineCustomElement(${name});
customElements.define("${tag}", Cu${name});

export default Cu${name};
`,
  );
}

// ── Story + test ────────────────────────────────────────────────────────────

const isPublic = !internal;
const vanillaSnippet = isPublic ? `\nvanilla: \`<${tag}>${name}</${tag}>\`,` : "";

write(
  storyPath,
  `import ${name} from "@/components/${category ? `${category}/` : ""}${name}.vue";
import type { ComponentStory } from "@/stories/types";

export const cu${name}Stories: ComponentStory = {
  component: "${tag}",
  vue: ${name},
  sections: [
    {
      id: "default",
      title: "Default",
      variants: [
        { id: "default", props: {}, slots: { default: "${name}" } },
      ],
      vue: \`<${name}>${name}</${name}>\`,${vanillaSnippet}
      checks: {
        l1: [
          {
            name: "renderiza la raíz .cu-${kebab}",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-${kebab}").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el contenido del slot",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-${kebab}").text()).toContain("${name}");
            },
          },
        ],
      },
    },
  ],
};
`,
);

write(
  testPath,
  `import { cu${name}Stories } from "./${name}.stories";
import { runL1Story } from "@/stories/runner.l1";

runL1Story(cu${name}Stories);
`,
);

// ── Próximos pasos ──────────────────────────────────────────────────────────

console.log("");
console.log("Próximos pasos (ver 02-crear-componente.md):");
console.log("  1. Completar el contrato real (props/slots/eventos) y la story.");
console.log("  2. Página del playground + route en src/router/index.ts + nav en PlaygroundLayout.vue.");
if (!internal) console.log("  3. Docs: docs/skills/use-comegen/componentes/" + tag + ".md (skill comegen-ui-docs).");
console.log("  4. ./scripts/preflight.sh && pnpm run build:lib");
