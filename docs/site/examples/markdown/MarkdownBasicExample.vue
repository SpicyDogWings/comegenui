<script setup lang="ts">
import Markdown from "@/components/markdown/Markdown.vue";
</script>

<template>
  <Markdown>
# Encabezado principal

Párrafo con **negrita**, *itálica*, `código inline` y un [link](https://example.com).

- Primer ítem
- Segundo ítem

> Una cita destacada.

```js
const saludo = "hola";
console.log(saludo);
```

| Columna A | Columna B |
|-----------|-----------|
| a         | b         |
  </Markdown>
</template>
