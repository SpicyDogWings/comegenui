<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
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

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const styleData = [
  { name: '--cb-text', description: 'Texto código' },
  { name: '--cb-hl-keyword', description: 'Keywords' },
  { name: '--cb-hl-string', description: 'Strings' },
  { name: '--cb-hl-number', description: 'Números' },
  { name: '--cb-hl-title', description: 'Títulos' },
  { name: '--cb-hl-tag', description: 'Tags' },
  { name: '--cb-hl-attr', description: 'Atributos' },
  { name: '--cb-hl-meta', description: 'Meta' },
  { name: '--cb-hl-comment', description: 'Comentarios' },
  { name: '--cu-font-mono', description: 'Fuente monoespaciada' },
  { name: '--cu-font-size-sm', description: 'Tamaño texto' },
  { name: '--cu-font-weight-bold', description: 'Peso bold' },
  { name: '--cu-font-weight-medium', description: 'Peso medio' },
  { name: '--cu-line-height-relaxed', description: 'Altura línea' },
  { name: '--cu-radius-sm', description: 'Radio' },
  { name: '--cu-border-thin', description: 'Borde fino' },
  { name: '--cu-space-xs', description: 'Espaciado xs' },
  { name: '--cu-space-sm', description: 'Espaciado sm' },
  { name: '--cu-space-md', description: 'Espaciado md' },
  { name: '--cu-space-lg', description: 'Espaciado lg' },
  { name: '--cu-space-xl', description: 'Espaciado xl' },
  { name: '--cu-space-2xl', description: 'Espaciado 2xl' },
  { name: '--cu-code-bg', description: 'Fondo código' },
  { name: '--cu-code-text', description: 'Texto código (tema)' },
  { name: '--cu-code-faded', description: 'Texto atenuado' },
  { name: '--cu-color-neutral-soft', description: 'Fondo neutral' },
  { name: '--cu-color-neutral-subtle-border', description: 'Borde neutral' },
  { name: '--cu-color-neutral-text', description: 'Texto neutral' },
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

      <section id="style" class="playground-section">
        <h2>Style</h2>

        <h3 id="style-variables">CSS Variables</h3>
        <Table :columns="styleColumns" :data="styleData" variant="ghost" compact />
      </section>

      <hr class="playground-separator" />

      <section id="api" class="playground-section">
        <h2>API</h2>

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
