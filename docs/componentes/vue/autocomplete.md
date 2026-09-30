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

Al seleccionar, el input se completa con el `label` del item (o con su `value` si el item no tiene `label`).

## Mínimo de caracteres

Por defecto el menú se abre al recibir foco. Con `:min-chars="2"` solo se abre tras escribir 2+ caracteres, **o al enfocar un campo cuyo texto ya tenga esos 2+ caracteres** (por ejemplo, precargado con `set()`).

```vue
<script setup lang="ts">
import Autocomplete from "@/components/form/Autocomplete.vue";
import { ref } from "vue";

const ac = ref<InstanceType<typeof Autocomplete> | null>(null);
const items = ref([/* ... */]);

function precargarYEnfocar() {
  ac.value?.set("Chile"); // texto precargado (5 caracteres, cumple min-chars)
  ac.value?.focus(); // al enfocar, el panel se abre
}

function abrir() {
  ac.value?.open(); // abre el panel sin importar min-chars
}
</script>

<template>
  <Autocomplete ref="ac" :items="items" :min-chars="2" placeholder="Escribí al menos 2 letras..." />
</template>
```

> `open()` ignora `min-chars`: es la salida programática. Lo que sí lo bloquea es `disabled`.

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
  ac.value?.focus(); // enfoca (abre si el texto cumple min-chars)
  console.log(ac.value?.selectedItem()); // último item seleccionado
  console.log(ac.value?.isOpen()); // true / false
  ac.value?.open(); // abre el panel (ignora min-chars)
  ac.value?.close(); // lo cierra
  ac.value?.toggle(); // alterna abierto/cerrado
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

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `type` | `string` | `"text"` | — |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | — |
| `disabled` | `boolean` | `false` | — |
| `readOnly` | `boolean` | `false` | — |
| `placeholder` | `string` | `""` | — |
| `minChars` | `number` | `0` | — |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` | — |
| `align` | `"center" \| "start" \| "end"` | `"start"` | — |
| `fixed` | `boolean` | `false` | — |
| `items` | `AutocompleteItem[]` | `[]` | — |
<!-- /@api:props -->

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

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `get` | Devuelve el texto actual. |
| `set` | Setea el texto actual en el input. |
| `reset` | Limpia el texto de búsqueda. |
| `focus` | Enfoca el input. |
| `open` | Abre el panel de sugerencias (ignora `minChars`). |
| `close` | Cierra el panel de sugerencias. |
| `toggle` | Alterna la visibilidad del panel de sugerencias. |
| `isOpen` | Indica si el panel está abierto. |
| `selectedItem` | Devuelve el item seleccionado o null. |
<!-- /@api:expose -->

> `.reset()` limpia el texto de búsqueda; `.set('')` deja el input vacío sin tocar el estado de búsqueda.
