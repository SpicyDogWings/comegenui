import { nextTick } from "vue";
import Markdown from "@/components/markdown/Markdown.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./Markdown.stories.extras";

const MD = [
  "# Título Principal",
  "",
  "Este es un párrafo con **negrita** y *cursiva* y `código inline`.",
  "",
  "## Lista",
  "",
  "- Item uno",
  "- Item dos con **negrita**",
  "",
  "## Tabla",
  "",
  "| Nombre | Edad |",
  "| ------ | ---- |",
  "| Ana    | 25   |",
  "",
  "## Código",
  "",
  "```javascript",
  "function hello() {",
  "  console.log('Hola mundo')",
  "}",
  "```",
  "",
  "## Blockquote",
  "",
  "> Esta es una cita importante.",
  "> Con **formato inline**.",
].join("\n");

const vueSnippet = [
  "<script setup>",
  "import { ref } from 'vue'",
  "import Markdown from '@/components/markdown/Markdown.vue'",
  "",
  "const outlineItems = ref([])",
  "",
  "const handleParsed = (headingIds) =>",
  "  (outlineItems.value = headingIds.map((id) => ({ label: id.replace(/-/g, ' '), id })))",
  "<\\/script>",
  "",
  "<template>",
  "  <Markdown @parsed=\"handleParsed\">",
  "# Título Principal",
  "",
  "Párrafo con **negrita**, *cursiva* y `código inline`.",
  "",
  "## Lista",
  "",
  "- Item uno",
  "- Item dos",
  "",
  "## Tabla",
  "",
  "| Nombre | Edad |",
  "| ------ | ---- |",
  "| Ana    | 25   |",
  "",
  "## Código",
  "",
  "```javascript",
  "console.log('hola')",
  "```",
  "  </Markdown>",
  "</template>",
].join("\n");

const vanillaSnippet = [
  "<script src=\"dist/CuMarkdown.umd.js\"><\\/script>",
  "",
  "<cu-markdown>",
  "# Título Principal",
  "",
  "Párrafo con **negrita**, *cursiva* y `código inline`.",
  "",
  "## Lista",
  "",
  "- Item uno",
  "- Item dos",
  "",
  "## Código",
  "",
  "```javascript",
  "console.log('hola')",
  "```",
  "</cu-markdown>",
].join("\n");

export const cuMarkdownStories: ComponentStory = {
  component: "cu-markdown",
  vue: Markdown,
  extras,
  tokens: [
    "--cu-font-sans",
    "--cu-font-size-xs",
    "--cu-font-size-sm",
    "--cu-font-size-xl",
    "--cu-font-size-2xl",
    "--cu-font-size-3xl",
    "--cu-font-size-4xl",
    "--cu-font-weight-bold",
    "--cu-line-height-tight",
    "--cu-line-height-relaxed",
    "--cu-radius-sm",
    "--cu-border-thin",
    "--cu-space-xs",
    "--cu-space-sm",
    "--cu-space-md",
    "--cu-space-lg",
    "--cu-space-xl",
    "--cu-color-neutral-text",
    "--cu-color-neutral-subtle-border",
  ],
  api: {
    props: [],
    slots: [
      {
        name: "default",
        description:
          "Contenido Markdown a parsear y renderizar (headings, listas, tablas, código, blockquotes, links…)",
      },
    ],
    events: [
      {
        name: "parsed",
        type: "(headingIds: string[]) => void",
        description:
          "Emite los ids de los headings tras parsear (para construir outlines). Nota: el Custom Element (cu-markdown) no lo puentea",
      },
    ],
    exposes: [
      {
        name: "headingIds",
        type: "() => string[]",
        description: "Devuelve los ids de los headings parseados",
      },
    ],
  },
  sections: [
    {
      id: "full-demo",
      title: "Demo completa",
      layout: "col",
      variants: [{ id: "v1", slots: { default: MD } }],
      vue: vueSnippet,
      vanilla: vanillaSnippet,
      checks: {
        l1: [
          {
            name: "renderiza .cu-markdown",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-markdown").exists()).toBe(true);
            },
          },
          {
            name: "parsea el markdown del slot en el output",
            async run({ wrapper, expect }) {
              await nextTick();
              await nextTick();
              const output = wrapper.find(".cu-md-output");
              expect(output.exists()).toBe(true);
              expect(output.find(".cu-md-heading").exists()).toBe(true);
              expect(output.find("strong").exists()).toBe(true);
              expect(output.text()).toContain("Ana");
              expect(output.html()).toContain("javascript");
            },
          },
          {
            name: "emite parsed con los ids de los headings",
            async run({ wrapper, expect }) {
              await nextTick();
              await nextTick();
              const parsed = wrapper.emitted("parsed") as unknown[][] | undefined;
              expect(parsed).toBeTruthy();
              expect(JSON.stringify(parsed![0]![0])).toContain("titulo-principal");
            },
          },
          {
            name: "expone headingIds()",
            async run({ wrapper, expect }) {
              await nextTick();
              await nextTick();
              const ids = (wrapper.vm as unknown as { headingIds: () => string[] }).headingIds();
              expect(Array.isArray(ids)).toBe(true);
              expect(ids.length).toBeGreaterThan(0);
            },
          },
        ],
      },
    },
  ],
};
