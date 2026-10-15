[← Volver](../README.md)

# `Textarea`

Área de texto multilínea con color, variante, cantidad de filas, redimensionado opcional, estados
(`disabled` / `readOnly`) y método de foco/reset.

## Uso en Vue

```vue
<script setup lang="ts">
import Textarea from "@/components/form/Textarea.vue";
import { ref } from "vue";

const comentarios = ref("Texto predefinido");
</script>

<template>
  <Textarea placeholder="Escribe aquí..." rows="5" color="primary" variant="outlined" />
  <Textarea v-model="comentarios" no-resize variant="soft" />
</template>
```

## Colores

`color` es un nombre semántico: tiñe el fondo (o el borde, según la variante) con los tokens del tema.

```vue
<Textarea placeholder="primary" color="primary" />
<Textarea placeholder="secondary" color="secondary" />
<Textarea placeholder="neutral" color="neutral" />
<Textarea placeholder="success" color="success" />
<Textarea placeholder="warning" color="warning" />
<Textarea placeholder="danger" color="danger" />
```

## Variantes

`variant` decide el aspecto: `outlined` (transparente con borde), `soft` (fondo tenue y **default**),
`ghost` (transparente) y `subtle` (tenue con borde).

```vue
<Textarea placeholder="outlined" variant="outlined" color="success" />
<Textarea placeholder="soft" variant="soft" color="primary" />
<Textarea placeholder="ghost" variant="ghost" color="warning" />
<Textarea placeholder="subtle" variant="subtle" color="danger" />
```

## Filas

`rows` fija cuántas filas visibles tiene el textarea (por defecto `3`).

```vue
<Textarea placeholder="2 filas" :rows="2" />
<Textarea placeholder="3 filas (default)" :rows="3" />
<Textarea placeholder="6 filas" :rows="6" />
```

## Sin redimensionar

`noResize` saca el handle de redimensionado (por defecto el usuario puede estirarlo en vertical).

```vue
<Textarea placeholder="Tamaño fijo" :rows="4" no-resize />
```

## Estados

`disabled` bloquea la interacción y atenúa el campo; `readOnly` deja seleccionable el contenido pero
no editarlo.

```vue
<Textarea model-value="Deshabilitado" disabled />
<Textarea model-value="Solo lectura" read-only />
<Textarea placeholder="Habilitado" />
```

## Métodos

El `ref` expone `get`, `set`, `reset` y `focus`.

```vue
<script setup lang="ts">
import Textarea from "@/components/form/Textarea.vue";
import { useTemplateRef, ref } from "vue";

const notas = ref("Plantilla inicial");
const campo = useTemplateRef("campo");
</script>

<template>
  <Textarea ref="campo" v-model="notas" />
  <button @click="campo?.focus()">focus()</button>
  <button @click="campo?.reset()">reset()</button>
</template>
```

> `startValue` se acepta como prop, pero hoy `reset()` **limpia** el campo: no lo restaura.

## Cambios

`update:modelValue` se emite en cada tecleo (es el evento detrás de `v-model`).

```vue
<script setup lang="ts">
import Textarea from "@/components/form/Textarea.vue";
import { ref } from "vue";

const bio = ref("");
</script>

<template>
  <Textarea v-model="bio" placeholder="Biografía"
            @update:model-value="(valor) => console.log('Bio:', valor)" />
</template>
```

## Props

<!--@include: ../../partials/textarea/props-vue.md-->

## Emits

<!--@include: ../../partials/textarea/eventos.md-->

## Slots

<!--@include: ../../partials/textarea/slots.md-->

## Expose

<!--@include: ../../partials/textarea/metodos-vue.md-->
