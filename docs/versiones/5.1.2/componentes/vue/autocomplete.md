[← Volver](../README.md)

# `Autocomplete`

Campo de texto con sugerencias en menú desplegable. Filtra los `items` en vivo según lo que escribe el usuario.

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
]);
</script>

<template>
  <Autocomplete v-model="value" :items="items" placeholder="Buscá un rol..." color="primary" />
</template>
```

En HTML plano, cargá el bundle `CuAutocomplete` (ver [ficha vanilla](/componentes/cu-autocomplete)).

> **No existe la prop `label`.** Para mostrar un rótulo sobre el campo, combiná con `<Label>`. Todos los ejemplos de abajo asumen `items` ya definido (ver arriba).

## Colores

`color` es un nombre semántico (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`) que tiñe el campo y el panel.

```vue
<template>
  <Autocomplete color="primary" placeholder="primary" :items="items" />
  <Autocomplete color="secondary" placeholder="secondary" :items="items" />
  <Autocomplete color="neutral" placeholder="neutral" :items="items" />
  <Autocomplete color="success" placeholder="success" :items="items" />
  <Autocomplete color="warning" placeholder="warning" :items="items" />
  <Autocomplete color="danger" placeholder="danger" :items="items" />
</template>
```

## Variantes

`variant` decide el aspecto del campo: `outlined` (borde), `soft` (**default**; fondo tenue), `ghost` (transparente) y `subtle` (tenue con borde).

```vue
<template>
  <Autocomplete color="primary" variant="outlined" placeholder="outlined" :items="items" />
  <Autocomplete color="primary" variant="soft" placeholder="soft" :items="items" />
  <Autocomplete color="primary" variant="ghost" placeholder="ghost" :items="items" />
  <Autocomplete color="primary" variant="subtle" placeholder="subtle" :items="items" />
</template>
```

## Estados

`disabled` bloquea el campo y no abre el panel. `readOnly` deja leer y abrir el panel, pero no escribir.
`loading` muestra el spinner de carga en el panel de sugerencias (como en `Select`), para cuando los
items se están buscando.

```vue
<template>
  <Autocomplete placeholder="habilitado" :items="items" />
  <Autocomplete disabled placeholder="disabled" :items="items" />
  <Autocomplete read-only placeholder="readOnly" :items="items" />
</template>
```

## Items del menú

Cada item puede llevar un `icon` (SVG inline), un `value` distinto del `label`, o estar `disabled`.

```vue
<script setup lang="ts">
import Autocomplete from "@/components/form/Autocomplete.vue";
import { ref } from "vue";

const icon = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>';

const items = ref([
  { label: "Administrador", icon },
  { label: "Editor de contenido", icon },
  { label: "Juan Pérez (juan@mail.com)", value: "Juan Pérez" },
  { label: "Invitado externo", disabled: true },
]);
</script>

<template>
  <Autocomplete placeholder="Elegí un item..." :items="items" @select="(item) => console.log(item)" />
</template>
```

Al seleccionar, el input se completa con el `label` (o con el `value` si el item no tiene `label`).

## Mínimo de caracteres

Por defecto el menú se abre al recibir foco. Con `:min-chars="2"` solo se abre tras escribir 2+ caracteres, **o al enfocar un campo cuyo texto ya tenga esos 2+ caracteres** (por ejemplo, precargado con `set()`).

```vue
<script setup lang="ts">
import Autocomplete from "@/components/form/Autocomplete.vue";
import { ref, useTemplateRef } from "vue";

const ac = useTemplateRef("ac");
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

`position` (`bottom` **default**, `top`, `left`, `right`) y `align` (`start` **default**, `center`, `end`) ubican el panel respecto al campo. `fixed` lo posiciona en `position: fixed` (útil en contenedores con `overflow`).

```vue
<template>
  <Autocomplete position="top" align="end" placeholder="position=top / align=end" :items="items" />
  <Autocomplete position="bottom" align="end" placeholder="position=bottom / align=end" :items="items" />
</template>
```

## Tipos de input

`type` es el tipo del `<input>` interno: `text` (**default**), `password`, `email`, `number`, `tel`, `url` o `search`.

```vue
<template>
  <Autocomplete type="text" placeholder="Buscar..." :items="items" />
  <Autocomplete type="search" placeholder="Buscar..." :items="items" />
  <Autocomplete type="email" placeholder="Email..." :items="items" />
</template>
```

## Selección

`select` se dispara al elegir un item (con el item como payload) y `blur` al salir del campo.

```vue
<script setup lang="ts">
import Autocomplete from "@/components/form/Autocomplete.vue";
import { ref } from "vue";

const items = ref([{ label: "Argentina" }, { label: "Brasil" }, { label: "Chile" }]);

function onSelect(item: { label: string }) {
  console.log("select:", item);
}

function onBlur() {
  console.log("blur: el foco salió del campo");
}
</script>

<template>
  <Autocomplete placeholder="Buscá un país..." :items="items" @select="onSelect" @blur="onBlur" />
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

## Props

<!--@include: ../../partials/autocomplete/props-vue.md-->

### Items

Cada item del array `items` puede tener:

| Campo | Tipo | Default | Descripción |
|-------|------|---------|-------------|
| `label` | `string` | — | Texto que se muestra y sobre el que se busca |
| `value` | `string` | `label` | Valor que se asigna al input al seleccionar el item |
| `icon` | `string` | — | SVG completo inline (`<svg>...</svg>`) |
| `disabled` | `boolean` | `false` | Opción deshabilitada (no clickeable, atenuada) |

> La búsqueda se hace sobre `label` y `value` (cuando existe). Es **case-insensitive** y **acento-insensitive**: buscar `"matricula"` encuentra `"Matrícula"`.

## Emits

<!--@include: ../../partials/autocomplete/eventos.md-->

## Slots

<!--@include: ../../partials/autocomplete/slots.md-->

## Expose

<!--@include: ../../partials/autocomplete/metodos-vue.md-->

> `.reset()` limpia el texto de búsqueda; `.set('')` deja el input vacío sin tocar el estado de búsqueda.
