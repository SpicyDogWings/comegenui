<template>
  <!-- Refleja el ejemplo "Uso": el markdown se pasa como texto dentro del tag. -->
  <VanillaDemo :use="['CuMarkdown']">
    <cu-markdown>
# Título

Párrafo con **negrita**, *cita*, y `código inline`.

- Item 1
- Item 2

> Blockquote

```js
const x = 1;
```

| Col A | Col B |
|-------|-------|
| a     | b     |
</cu-markdown>
  </VanillaDemo>
</template>
