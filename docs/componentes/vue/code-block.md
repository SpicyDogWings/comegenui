[← Volver](../README.md)

# `CodeBlock`

Bloque de código con resaltado de sintaxis (highlight.js), botón de copiar, badge de lenguaje y gutter opcional. Es un componente **sólo Vue**: no tiene custom element.

## Uso en Vue

```vue
<script setup lang="ts">
import CodeBlock from "@/components/markdown/CodeBlock.vue";
</script>

<template>
  <CodeBlock language="js" :code="'console.log(\"hola\")'" />
</template>
```

## Variantes

`variant` acepta `default` (fondo soft neutro), `outlined` (transparente con borde) y `solid`
(esquema de código oscuro, con los tokens `--cu-code-*`). Cambia el fondo y el borde, no el
resaltado.

```vue
<script setup lang="ts">
import CodeBlock from "@/components/markdown/CodeBlock.vue";

const code = `const total = items.reduce((sum, item) => sum + item.price, 0);
console.log(total);`;
</script>

<template>
  <CodeBlock variant="default" language="js" :code="code" />
  <CodeBlock variant="outlined" language="js" :code="code" />
  <CodeBlock variant="solid" language="js" :code="code" />
</template>
```

## Lenguajes

`language` activa el resaltado (y muestra el badge). Trae registrados `xml` (html/svg), `css`,
`javascript`, `typescript`, `bash`, `json` y `python`, con alias: `html`, `vue`, `sfc`, `js`,
`ts`, `sh`, `shell` y `py`. Un lenguaje desconocido cae a texto plano.

```vue
<script setup lang="ts">
import CodeBlock from "@/components/markdown/CodeBlock.vue";

const typescript = `interface User {
  name: string;
  role: "admin" | "user";
}

function greet(user: User): string {
  return \`Hola, \${user.name}\`;
}`;

const bash = `pnpm install
pnpm build
git status`;
</script>

<template>
  <CodeBlock language="typescript" :code="typescript" />
  <CodeBlock language="bash" :code="bash" />
</template>
```

## Números de línea

`line-numbers` agrega la gutter con el número de cada línea (también si hay resaltado).

```vue
<script setup lang="ts">
import CodeBlock from "@/components/markdown/CodeBlock.vue";

const typescript = `interface User {
  name: string;
  role: "admin" | "user";
}

function greet(user: User): string {
  return \`Hola, \${user.name}\`;
}`;
</script>

<template>
  <CodeBlock language="typescript" :line-numbers="true" :code="typescript" />
</template>
```

## Props

<!--@include: ../../partials/code-block/props.md-->

## Emits

<!--@include: ../../partials/code-block/eventos.md-->

## Slots

<!--@include: ../../partials/code-block/slots.md-->

## Expose

<!--@include: ../../partials/code-block/metodos.md-->
