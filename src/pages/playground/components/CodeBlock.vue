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

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors (solid)', id: 'colors' },
  { label: 'Sin lenguaje', id: 'sin-lenguaje' },
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
        <CodeBlock :code="codeJavaScript" language="javascript" variant="outlined" />
        <h3>solid</h3>
        <CodeBlock :code="codeJavaScript" language="javascript" variant="solid" />
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors (solid variant)</h2>
        <CodeBlock :code="codePython" language="python" variant="solid" color="neutral" />
        <CodeBlock :code="codePython" language="python" variant="solid" color="primary" />
        <CodeBlock :code="codePython" language="python" variant="solid" color="secondary" />
        <CodeBlock :code="codePython" language="python" variant="solid" color="success" />
        <CodeBlock :code="codePython" language="python" variant="solid" color="warning" />
        <CodeBlock :code="codePython" language="python" variant="solid" color="danger" />
      </section>

      <hr class="playground-separator" />

      <section id="sin-lenguaje" class="playground-section">
        <h2>Sin lenguaje</h2>
        <CodeBlock :code="codeJavaScript" />
      </section>
    </div>
  </PlaygroundLayout>
</template>
