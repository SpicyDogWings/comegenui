# `Autocomplete`

Campo de texto con sugerencias en menú desplegable. Filtra los `items` en vivo según lo que escribe el usuario.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Autocomplete from "@/components/form/Autocomplete.vue";
import { ref } from "vue";

const value = ref("");
const items = ref([
  { label: "Administrador" },
  { label: "Editor de contenido" },
  { label: "Visor de reportes" },
  { label: "Invitado externo" },
  { label: "Supervisor" },
  { label: "Analista de datos" },
  { label: "Gestor de usuarios" },
]);

function onSelect(item: { label: string }) {
  console.log("Seleccionado:", item.label);
}
</script>

<template>
  <Autocomplete
    v-model="value"
    :items="items"
    placeholder="Buscá un rol..."
    color="primary"
    @select="onSelect"
  />
</template>
```

## Con label

El label se muestra sobre el input:

```vue
<template>
  <Autocomplete label="Buscar rol" placeholder="Escriba para buscar..." />
</template>
```

## Items con ícono

```vue
<script setup lang="ts">
import { ref } from "vue";

const icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';

const items = ref([
  { label: "Administrador", icon },
  { label: "Editor de contenido", icon },
]);
</script>
```

## Items con `value` distinto del `label`

Útil cuando querés mostrar más contexto (ej. email) pero asignar un valor más corto:

```vue
<script setup lang="ts">
import { ref } from "vue";

const items = ref([
  { label: "Juan Pérez (juan@mail.com)", value: "Juan Pérez" },
  { label: "María García (maria@mail.com)", value: "María García" },
]);
</script>
```

Al seleccionar, el input se completa con el `value` en vez del `label`.

## Mínimo de caracteres

Por defecto el menú se abre al recibir foco. Con `:min-chars="2"` solo se abre tras escribir 2+ caracteres:

```vue
<template>
  <Autocomplete :min-chars="2" placeholder="Escribí al menos 2 letras..." />
</template>
```

## Posicionamiento

```vue
<template>
  <!-- Con position + align -->
  <Autocomplete position="top" align="end" />

  <Autocomplete position="bottom" align="end" />
</template>
```

## Control programático

```vue
<script setup lang="ts">
import Autocomplete from "@/components/form/Autocomplete.vue";
import { ref, useTemplateRef } from "vue";

const value = ref("");
const items = ref([/* ... */]);
const ac = useTemplateRef("ac");

function demo() {
  ac.value?.set("Admin"); // asigna texto
  console.log(ac.value?.get()); // "Admin"
  ac.value?.focus(); // enfoca
  console.log(ac.value?.selectedItem()); // último item seleccionado
  console.log(ac.value?.isOpen()); // true / false
}
</script>

<template>
  <Autocomplete ref="ac" v-model="value" :items="items" placeholder="Buscá..." color="primary" />
</template>
```

## Tipos de input

```vue
<template>
  <Autocomplete type="text" placeholder="Buscar..." />
  <Autocomplete type="search" placeholder="Buscar..." />
  <Autocomplete type="email" placeholder="Email..." />
</template>
```

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `outlined`, `soft`, `ghost`, `subtle` |
| `type` | `string` | `"text"` | `text`, `password`, `email`, `number`, `tel`, `url`, `search` |
| `disabled` | `boolean` | `false` | Estado deshabilitado |
| `readOnly` | `boolean` | `false` | Solo lectura (en HTML se usa como `readonly`) |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste |
| `placeholder` | `string` | `""` | Placeholder del input |
| `minChars` | `number` | `0` | Caracteres mínimos para abrir el menú (atributo HTML: `min-chars`) |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` | Posición del dropdown: `bottom`, `top` |
| `align` | `"center" \| "start" \| "end"` | `"start"` | Alineación: `start`, `center`, `end` |
| `items` | `unknown[]` | `[]` | Opciones del menú (ver abajo). Se asigna como propiedad JS |
| `modelValue` | `string` | `""` | Valor controlado |
| `label` | `string` | `""` | Texto del label sobre el input |

### Items

Cada item del array `items` puede tener:

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `label` | `string` | — | Texto que se muestra y sobre el que se busca |
| `value` | `string` | `label` | Valor que se asigna al input al seleccionar el item |
| `icon` | `string` | — | SVG completo inline (`<svg>...</svg>`) |
| `disabled` | `boolean` | `false` | Opción deshabilitada (no clickeable, atenuada) |

> La búsqueda se hace sobre `label` y `value` (cuando existe). Es **case-insensitive** y **acento-insensitive**: buscar `"matricula"` encuentra `"Matrícula"`.

> **Importante:** `items` se asigna como propiedad JS (`ac.items = [...]`), no como atributo HTML.

## Emits

| Evento | Payload | Descripción |
|------|------|------|
| `update:modelValue` | `string` | Se emite en cada cambio de valor (al escribir) |
| `select` | `{ label, value?, icon? }` | Se emite al elegir un item de la lista |
| `blur` | `FocusEvent` | Pérdida de foco (útil en celdas editables) |

## Slots

Ninguno.

## Expose

| Método | Descripción |
|------|------|
| `.get()` | Texto actual del input |
| `.set(val: string)` | Asigna texto al input |
| `.focus()` | Enfoca el input |
| `.isOpen()` | Estado del menú (`boolean`) |
| `.selectedItem()` | Último item seleccionado o `null` |

> El componente **no expone** `.reset()`. Si necesitás limpiar programáticamente, usá `.set('')`.
