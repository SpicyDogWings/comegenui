<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Markdown from "@/components/information/Markdown.vue";

const outlineItems = [
  { label: "Headings", id: "headings" },
  { label: "Text", id: "text" },
  { label: "Lists", id: "lists" },
  { label: "Code", id: "code" },
  { label: "Tables", id: "tables" },
  { label: "Blockquotes", id: "blockquotes" },
  { label: "Links & HR", id: "links" },
];
</script>

<template>
  <PlaygroundLayout title="Markdown" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="full-demo" class="playground-section">
        <h2>Demo completa</h2>
        <Markdown>
# Título Principal

Este es un párrafo con **texto en negrita** y *texto en cursiva*. También podemos tener `código inline`.

## Subtítulo nivel 2

### Subtítulo nivel 3

#### Subtítulo nivel 4

##### Subtítulo nivel 5

###### Subtítulo nivel 6

## Texto enriquecido

Este párrafo tiene **negrita**, *cursiva*, `codigo`, y [un link](https://example.com) todo junto.

También podemos tener ~~texto tachado~~.

## Listas desordenadas

- Item uno
- Item dos
- Item tres con **negrita**
- Item cuatro con `codigo`

## Listas ordenadas

1. Primero
2. Segundo
3. Tercero con *cursiva*
4. Cuarto

## Código

```javascript
function hello() {
  console.log("Hola mundo");
  return true;
}
```

```python
def saludar(nombre):
    print(f"Hola, {nombre}")
```

## Tabla

| Nombre | Edad | Ciudad |
|--------|------|--------|
| Ana | 25 | Madrid |
| Carlos | 30 | Barcelona |
| María | 28 | Valencia |
| Pedro | 35 | Sevilla |

## Blockquote

> Esta es una cita importante.
> Puede tener múltiples líneas.
> Y continúa aquí.

## Regla horizontal

Arriba

---

Abajo

## Links

[Visita Google](https://www.google.com)

[ComegenUI en GitLab](https://gitlab.com/SpicyDogWings/comegen-ui)
        </Markdown>
      </section>
    </div>
  </PlaygroundLayout>
</template>
