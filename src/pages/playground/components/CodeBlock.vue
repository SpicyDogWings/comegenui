<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
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
];
</script>

<template>
  <PlaygroundLayout title="CodeBlock" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <h3>default</h3>
        <CodeBlock :code="codeJavaScript" language="javascript" variant="default" />
        <h3>outlined</h3>
        <CodeBlock :code="codePython" language="python" variant="outlined" />
        <h3>solid</h3>
        <CodeBlock :code="codeBash" language="bash" variant="solid" />
      </section>

      <hr class="playground-separator" />

      <section id="line-numbers" class="playground-section">
        <h2>Line Numbers</h2>
        <h3>default</h3>
        <CodeBlock :code="codeHtml" language="html" variant="default" :line-numbers="true" />
        <h3>outlined</h3>
        <CodeBlock :code="codeCss" language="css" variant="outlined" :line-numbers="true" />
        <h3>solid</h3>
        <CodeBlock :code="codeTs" language="ts" variant="solid" :line-numbers="true" />
      </section>
    </div>
  </PlaygroundLayout>
</template>
