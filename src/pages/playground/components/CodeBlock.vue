<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import Table from "@/components/data/Table.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";

const codeJavaScript = `function hello() {
  console.log("Hola mundo");
  return true;
}`;

const codePython = `def saludar(nombre, veces=3):
    print(f"Hola, {nombre}" * veces)
    return {"nombre": nombre, "saludo": "Hola", "repetido": veces}`;

const codeBash = `#!/usr/bin/env bash
set -e

pnpm install --silent
pnpm build:lib

echo "Build listo: $?"`;

const codeHtml = `<div class="card" id="mi-card">
  <h2 class="card-title">Título</h2>
  <p>Contenido de la card</p>
  <button class="btn btn--primary" disabled>Enviar</button>
</div>`;

const codeCss = `.card {
  display: flex;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid #ccc;
}

.card-title {
  color: #1a1a1a;
  font-size: 1.25rem;
}`;

const codeTs = `interface Usuario {
  id: number;
  nombre: string;
  activo?: boolean;
}

function saludar(usuario: Usuario): string {
  return \`Hola, \${usuario.nombre}!\`;
}`;

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Line numbers', id: 'line-numbers' },
  {
    label: 'Style',
    id: 'style',
    children: [
      { label: 'CSS Variables', id: 'style-variables' },
    ],
  },
  {
    label: 'API',
    id: 'api',
    children: [
      { label: 'Components', id: 'api-components' },
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
    ],
  },
];

// ── Snippets Vue ──

const vueImport = `<script setup>
import CodeBlock from '@/components/markdown/CodeBlock.vue'
import Button from '@/components/buttons/Button.vue';

const code = '// tu código acá'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const variantsVue = vueSnippet(`  <CodeBlock :code="code" language="javascript" variant="default" />
  <CodeBlock :code="code" language="python" variant="outlined" />
  <CodeBlock :code="code" language="bash" variant="solid" />`);

const lineNumbersVue = vueSnippet(`  <CodeBlock :code="code" language="html" variant="default" :line-numbers="true" />
  <CodeBlock :code="code" language="css" variant="outlined" :line-numbers="true" />
  <CodeBlock :code="code" language="ts" variant="solid" :line-numbers="true" />`);

const codeblock_tokens = [
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
];

const componentDeps = [
  { label: 'Badge', path: '/playground/components/badge' },
];

const styleSubComponents = [
  { label: 'Badge', path: '/playground/components/badge#style' },
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'code', type: 'string', default: '(required)', description: 'Código a renderizar (required)' },
  { name: 'language', type: 'string', default: '""', description: 'Lenguaje para highlight.js (js, py, bash, html, css, ts…). Vacío = texto plano' },
  { name: 'variant', type: 'string', default: '"default"', description: 'default, outlined, solid' },
  { name: 'lineNumbers', type: 'boolean', default: 'false', description: 'Muestra números de línea' },
];

const slotsData: { name: string; description: string }[] = [];

const eventsData: { name: string; type: string; description: string }[] = [];

const exposesData: { name: string; type: string; description: string }[] = [];
</script>

<template>
  <PlaygroundLayout title="CodeBlock" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">default</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue">
          <div class="playground-col">
            <h3>default</h3>
            <CodeBlock :code="codeJavaScript" language="javascript" variant="default" />
            <h3>outlined</h3>
            <CodeBlock :code="codePython" language="python" variant="outlined" />
            <h3>solid</h3>
            <CodeBlock :code="codeBash" language="bash" variant="solid" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="line-numbers" class="playground-section">
        <div class="playground-heading">
          <h2>Line Numbers</h2>
          <Badge color="neutral" title="lineNumbers por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="lineNumbersVue">
          <div class="playground-col">
            <h3>default</h3>
            <CodeBlock :code="codeHtml" language="html" variant="default" :line-numbers="true" />
            <h3>outlined</h3>
            <CodeBlock :code="codeCss" language="css" variant="outlined" :line-numbers="true" />
            <h3>solid</h3>
            <CodeBlock :code="codeTs" language="ts" variant="solid" :line-numbers="true" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      

      <hr class="playground-separator" />

      <PlaygroundStyle :tokens="componentTokens" :sub-components="styleSubComponents" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <PlaygroundApiComponents :deps="componentDeps" />

<h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" empty="No tiene slots" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" empty="No emite eventos" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" empty="No expone métodos" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
