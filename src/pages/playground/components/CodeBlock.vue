<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import CodeBlock from "@/components/information/CodeBlock.vue";

const codeJavaScript = `function hello() {
  console.log("Hola mundo");
  return true;
}`;

const codePython = `def saludar(nombre):
    print(f"Hola, {nombre}")
    return {"nombre": nombre, "saludo": "Hola"}`;

const codeHtml = `<!DOCTYPE html>
<html>
  <head>
    <title>Ejemplo</title>
  </head>
  <body>
    <h1>Hola</h1>
  </body>
</html>`;

const codeSinLenguaje = `Texto de código sin
ningún lenguaje especificado.`;

const outlineItems = [
  { label: 'Con lenguaje', id: 'con-lenguaje' },
  { label: 'Sin lenguaje', id: 'sin-lenguaje' },
  { label: 'Múltiples bloques', id: 'multiples' },
];
</script>

<template>
  <PlaygroundLayout title="CodeBlock" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="con-lenguaje" class="playground-section">
        <h2>Con lenguaje</h2>
        <CodeBlock :code="codeJavaScript" language="javascript" />
        <CodeBlock :code="codePython" language="python" />
        <CodeBlock :code="codeHtml" language="html" />
      </section>

      <hr class="playground-separator" />

      <section id="sin-lenguaje" class="playground-section">
        <h2>Sin lenguaje</h2>
        <CodeBlock :code="codeSinLenguaje" />
      </section>

      <hr class="playground-separator" />

      <section id="multiples" class="playground-section">
        <h2>Múltiples bloques</h2>
        <p>Los bloques de código se apilan con margen inferior automático.</p>
        <CodeBlock :code="codeJavaScript" language="javascript" />
        <CodeBlock :code="codePython" language="python" />
      </section>
    </div>
  </PlaygroundLayout>
</template>
