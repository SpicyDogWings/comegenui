<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Markdown from "@/components/markdown/Markdown.vue";

const outlineItems = ref<{ label: string; id: string }[]>([])

function handleParsed(headingIds: string[]) {
  const items = headingIds.map(id => ({ label: id.replace(/-/g, ' '), id }))
  outlineItems.value = [
    { label: 'Style', id: 'style', children: [{ label: 'CSS Variables', id: 'style-variables' }] },
    { label: 'API', id: 'api', children: [
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
    ]},
    ...items,
  ]
}

// ── Snippets Vue ──

const markdownVue = `<script setup>
import { ref } from 'vue'
import Markdown from '@/components/markdown/Markdown.vue'

const outlineItems = ref([])

function handleParsed(headingIds) {
  outlineItems.value = headingIds.map(id => ({ label: id.replace(/-/g, ' '), id }))
}
<\/script>

<template>
  <Markdown @parsed="handleParsed">
# Título

Párrafo con **negrita**, *cursiva* y \`código inline\`.

## Lista

- Item uno
- Item dos

## Tabla

| Nombre | Edad |
|--------|------|
| Ana    | 25   |

## Código

\`\`\`js
console.log('hola')
\`\`\`

<!-- ...el resto del markdown va acá... -->
  </Markdown>
</template>`;

// ── Snippets Vanilla ──

const markdownVanilla = `<script src="dist/CuMarkdown.umd.js"><\/script>

<cu-markdown theme="light">
# Título

Párrafo con **negrita**, *cursiva* y \`código inline\`.

## Lista

- Item uno
- Item dos

## Código

\`\`\`js
console.log('hola')
\`\`\`
</cu-markdown>`;

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const styleData = [
  { name: '--cu-font-sans', description: 'Fuente' },
  { name: '--cu-font-size-xs', description: 'Tamaño xs' },
  { name: '--cu-font-size-sm', description: 'Tamaño sm' },
  { name: '--cu-font-size-xl', description: 'Tamaño xl' },
  { name: '--cu-font-size-2xl', description: 'Tamaño 2xl' },
  { name: '--cu-font-size-3xl', description: 'Tamaño 3xl' },
  { name: '--cu-font-size-4xl', description: 'Tamaño 4xl' },
  { name: '--cu-font-weight-bold', description: 'Peso bold' },
  { name: '--cu-line-height-tight', description: 'Altura línea tight' },
  { name: '--cu-line-height-relaxed', description: 'Altura línea relaxed' },
  { name: '--cu-radius-sm', description: 'Radio' },
  { name: '--cu-border-thin', description: 'Borde fino' },
  { name: '--cu-space-xs', description: 'Espaciado xs' },
  { name: '--cu-space-sm', description: 'Espaciado sm' },
  { name: '--cu-space-md', description: 'Espaciado md' },
  { name: '--cu-space-lg', description: 'Espaciado lg' },
  { name: '--cu-space-xl', description: 'Espaciado xl' },
  { name: '--cu-color-neutral-text', description: 'Texto neutral' },
  { name: '--cu-color-neutral-subtle-border', description: 'Borde neutral' },
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData: { name: string; type: string; default: string; description: string }[] = [];

const slotsData = [
  { name: 'default', description: 'Contenido Markdown a parsear y renderizar (headings, listas, tablas, código, blockquotes, links…)' },
];

const eventsData = [
  { name: 'parsed', type: '(headingIds: string[]) => void', description: 'Emite los ids de los headings tras parsear (para construir outlines). Nota: el Custom Element (cu-markdown) no lo puentea' },
];

const exposesData = [
  { name: 'headingIds', type: '() => string[]', description: 'Devuelve los ids de los headings parseados' },
];
</script>

<template>
  <PlaygroundLayout title="Markdown" :outline-items="outlineItems">
    <div class="playground-content">
      <section id="full-demo" class="playground-section">
        <div class="playground-heading">
          <h2>Demo completa</h2>
        </div>
        <p class="playground-desc">
          Todo lo que parsea el renderer. El outline de la derecha se genera automáticamente desde los headings via el evento <code>parsed</code>.
        </p>
        <SectionDemo :vue-code="markdownVue" :vanilla-code="markdownVanilla">
          <div class="playground-col">
            <Markdown @parsed="handleParsed">
# Título Principal

Este es un párrafo con **texto en negrita** y *texto en cursiva*. También podemos tener `código inline` que se renderiza como badge.

## Subtítulo nivel 2

### Subtítulo nivel 3

#### Subtítulo nivel 4

##### Subtítulo nivel 5

###### Subtítulo nivel 6

## Texto enriquecido

Este párrafo tiene **negrita**, *cursiva*, `codigo`, y [un link](https://example.com) que se renderiza como botón. También podemos tener ~~texto tachado~~.

## Links

[Visita Google](https://www.google.com)

[ComegenUI en GitLab](https://gitlab.com/SpicyDogWings/comegen-ui)

Párrafo con [múltiples](https://example.com) links en el [mismo texto](https://example.org).

## Código inline

Usa la función `calculateTotal()` para sumar. El valor `null` representa ausencia de datos. Puedes usar `async/await` para operaciones asíncronas. La constante `MAX_SIZE` define el límite.

## Bloques de código

```javascript
function hello() {
  console.log("Hola mundo");
  return true;
}
```

```python
def saludar(nombre):
    print(f"Hola, {nombre}")
    return {"nombre": nombre, "saludo": "Hola"}
```

```html
<!DOCTYPE html>
<html>
  <head><title>Ejemplo</title></head>
  <body><h1>Hola</h1></body>
</html>
```

```
Sin lenguaje especificado
```

## Listas desordenadas

- Item uno
- Item dos
- Item tres con **negrita**
- Item cuatro con `codigo`
- Item cinco con [un link](https://example.com)

## Listas ordenadas

1. Primero
2. Segundo
3. Tercero con *cursiva*
4. Cuarto con `codigo`
5. Quinto con [link](https://example.com)

## Tabla

| Nombre | Edad | Ciudad | Estado |
|--------|------|--------|--------|
| **Ana** | 25 | Madrid | `activo` |
| *Carlos* | 30 | Barcelona | **inactivo** |
| ~~Pedro~~ Luis | 35 | Valencia | *pendiente* |
| María | ~~28~~ 29 | Sevilla | [Ver](https://example.com) |

## Blockquote

> Esta es una cita importante.
> Puede tener múltiples líneas.
> Y **formato inline** también.

## Regla horizontal

Arriba

---

Abajo

## Imagen

![Placeholder](https://picsum.photos/300/200)
            </Markdown>
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
        <Table :columns="apiColumns" :data="propsData" empty="No tiene props (el contenido va por slot)" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-desc {
  margin: 0;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}
</style>
