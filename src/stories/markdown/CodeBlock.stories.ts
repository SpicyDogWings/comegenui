import CodeBlock from "@/components/markdown/CodeBlock.vue";
import type { ComponentStory } from "@/stories/types";

const JS = ["function hello() {", "  console.log('hola')", "}"].join("\n");
const PY = ["def saludar(nombre):", "    print(f'Hola, {nombre}')"].join("\n");
const BASH = ["# Reinicia el servicio", "systemctl restart nginx"].join("\n");
const HTML = ["<div class=\"app\">", "  <h1>Hola</h1>", "</div>"].join("\n");
const CSS = [".app {", "  display: flex;", "  gap: 8px;", "}"].join("\n");
const TS = ["const suma = (a: number, b: number): number => a + b"].join("\n");

export const cuCodeBlockStories: ComponentStory = {
  component: "cu-code-block",
  vue: CodeBlock,
  tokens: [
    '--cb-text',
    '--cb-hl-keyword',
    '--cb-hl-string',
    '--cb-hl-number',
    '--cb-hl-title',
    '--cb-hl-tag',
    '--cb-hl-attr',
    '--cb-hl-meta',
    '--cb-hl-comment',
    '--cu-font-mono',
    '--cu-font-size-sm',
    '--cu-font-weight-bold',
    '--cu-font-weight-medium',
    '--cu-line-height-relaxed',
    '--cu-radius-sm',
    '--cu-border-thin',
    '--cu-space-xs',
    '--cu-space-sm',
    '--cu-space-md',
    '--cu-space-lg',
    '--cu-space-xl',
    '--cu-space-2xl',
    '--cu-code-bg',
    '--cu-code-text',
    '--cu-code-faded',
    '--cu-color-neutral-soft',
    '--cu-color-neutral-subtle-border',
    '--cu-color-neutral-text',
  ],
  subComponents: [
    { label: 'Badge', path: '/playground/components/badge#style' },
  ],
  api: {
    components: [
      { label: 'Badge', path: '/playground/components/badge' },
    ],
    props: [
      { name: 'code', type: 'string', default: '(required)', description: 'Código a renderizar (required)' },
      { name: 'language', type: 'string', default: '""', description: 'Lenguaje para highlight.js (js, py, bash, html, css, ts…). Vacío = texto plano' },
      { name: 'variant', type: 'string', default: '"default"', description: 'default, outlined, solid' },
      { name: 'lineNumbers', type: 'boolean', default: 'false', description: 'Muestra números de línea' },
    ],
    slots: [],
    events: [],
    exposes: [],
  },
  sections: [
    {
      id: "variants",
      title: "Variants",
      badge: "default",
      layout: "col",
      variants: [
        { id: "default", props: { code: JS, language: "javascript", variant: "default" } },
        { id: "outlined", props: { code: PY, language: "python", variant: "outlined" } },
        { id: "solid", props: { code: BASH, language: "bash", variant: "solid" } },
      ],
      vue: `  <CodeBlock :code="code" language="javascript" variant="default" />
  <CodeBlock :code="code" language="python" variant="outlined" />
  <CodeBlock :code="code" language="bash" variant="solid" />`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-code-block y el código",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-code-block").exists()).toBe(true);
              const code = variant.props?.code as string;
              expect(wrapper.find(".cu-code-block-code").text()).toContain(code.split("\n")[0]);
            },
          },
          {
            name: "aplica la clase cu-code-block--{variant}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.variant as string;
              expect(wrapper.find(".cu-code-block").classes()).toContain(`cu-code-block--${value}`);
            },
          },
          {
            name: "muestra el badge del lenguaje",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-code-block-lang").text()).toBe(String(variant.props?.language));
            },
          },
          {
            name: "incluye el CopyButton",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-code-block-copy").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "line-numbers",
      title: "Line Numbers",
      badge: "false",
      layout: "col",
      variants: [
        { id: "default", props: { code: HTML, language: "html", variant: "default", lineNumbers: true } },
        { id: "outlined", props: { code: CSS, language: "css", variant: "outlined", lineNumbers: true } },
        { id: "solid", props: { code: TS, language: "ts", variant: "solid", lineNumbers: true } },
      ],
      vue: `  <CodeBlock :code="code" language="html" variant="default" :line-numbers="true" />
  <CodeBlock :code="code" language="css" variant="outlined" :line-numbers="true" />
  <CodeBlock :code="code" language="ts" variant="solid" :line-numbers="true" />`,
      checks: {
        l1: [
          {
            name: "aplica la clase de números de línea",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-code-block").classes()).toContain("cu-code-block--line-numbers");
              expect(
                wrapper.find(".cu-code-block-gutter, .cu-code-block-line-number").exists(),
              ).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "scroll",
      title: "Scroll",
      badge: "max-height",
      layout: "col",
      variants: [
        { id: "solid", props: { code: CSS, language: "css", variant: "solid" } },
      ],
      vue: `  <!-- Código largo con scroll interno -->
  <div style="max-height: 200px;">
    <CodeBlock :code="codeLargo" language="css" variant="solid" />
  </div>`,
      checks: {
        l1: [
          {
            name: "renderiza el bloque de código con scroll propio",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-code-block").exists()).toBe(true);
              expect(wrapper.find(".cu-code-block-pre").exists()).toBe(true);
            },
          },
        ],
      },
    },
  ],
};
