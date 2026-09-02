<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Markdown from "@/components/markdown/Markdown.vue";

const outlineItems = [
  { label: "Headings", id: "headings" },
  { label: "Texto", id: "text" },
  { label: "Links", id: "links" },
  { label: "Código inline", id: "inline-code" },
  { label: "Listas", id: "lists" },
  { label: "Código", id: "code" },
  { label: "Tablas", id: "tables" },
  { label: "Citas", id: "blockquotes" },
  { label: "Imagenes", id: "images" },
];
</script>

<template>
  <PlaygroundLayout title="Markdown" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="full-demo" class="playground-section">
        <h2>Demo completa</h2>
        <Markdown>
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

![Placeholder](https://via.placeholder.com/150)
        </Markdown>
      </section>
    </div>
  </PlaygroundLayout>
</template>
