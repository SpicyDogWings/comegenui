<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Markdown from "@/components/markdown/Markdown.vue";

const outlineItems = ref<{ label: string; id: string }[]>([])

function handleParsed(headingIds: string[]) {
  const items = headingIds.map(id => ({ label: id.replace(/-/g, ' '), id }))
  // Insertar Style y API al inicio del outline
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
import Button from '@/components/buttons/Button.vue';

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

const markdown_tokens = [
  '--cu-font-sans',
  '--cu-font-size-xs',
  '--cu-font-size-sm',
  '--cu-font-size-xl',
  '--cu-font-size-2xl',
  '--cu-font-size-3xl',
  '--cu-font-size-4xl',
  '--cu-font-weight-bold',
  '--cu-line-height-tight',
  '--cu-line-height-relaxed',
  '--cu-radius-sm',
  '--cu-border-thin',
  '--cu-space-xs',
  '--cu-space-sm',
  '--cu-space-md',
  '--cu-space-lg',
  '--cu-space-xl',
  '--cu-color-neutral-text',
  '--cu-color-neutral-subtle-border',
];

const styleData = markdown_tokens.map(name => ({ name, description: getTokenDescription(name) }));

const componentDeps = [
  { label: 'Table', path: '/playground/components/table' },
  { label: 'CodeBlock', path: '/playground/components/codeblock' },
  { label: 'Blockquote', path: '/playground/components/blockquote' },
];

const styleSubComponents = [
  { label: 'Table', path: '/playground/components/table#style' },
  { label: 'CodeBlock', path: '/playground/components/codeblock#style' },
  { label: 'Blockquote', path: '/playground/components/blockquote#style' },
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
  <PlaygroundLayout title="Markdown" :outlineItems="outlineItems">
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

      

      <hr class="playground-separator" />

      <PlaygroundStyle :tokens="componentTokens" :sub-components="styleSubComponents" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <PlaygroundApiComponents :deps="componentDeps" />

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
