[← Volver](../README.md)

# `Input`

Input de texto con color semántico, variante, tamaño, los tipos de input HTML5 y métodos
`get`/`set`/`reset`/`focus`. El valor es un `v-model` (prop `modelValue` + emit
`update:modelValue`).

## Uso en Vue

```vue
<script setup lang="ts">
import Input from "@/components/form/Input.vue";
import { ref } from "vue";

const email = ref("usuario@dominio.com");
</script>

<template>
  <Input v-model="email" placeholder="Nombre" color="primary" variant="outlined" />
  <Input v-model="email" type="email" placeholder="correo@ejemplo.com" variant="soft" />
  <Input type="number" disabled :model-value="42" />
</template>
```

En HTML plano, cargá el bundle `CuInput` (ver [ficha vanilla](/componentes/cu-input)).

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`), así que el mismo nombre se ve distinto en cada tema.

```vue
<Input color="primary" placeholder="primary" />
<Input color="secondary" placeholder="secondary" />
<Input color="neutral" placeholder="neutral" />
<Input color="success" placeholder="success" />
<Input color="warning" placeholder="warning" />
<Input color="danger" placeholder="danger" />
```

## Variantes

`variant` decide el fondo y el borde: `outlined` (borde), `soft` (fondo tenue, **default**),
`ghost` (transparente) y `subtle` (tenue con borde).

```vue
<Input color="primary" variant="outlined" placeholder="outlined" />
<Input color="primary" variant="soft" placeholder="soft (default)" />
<Input color="primary" variant="ghost" placeholder="ghost" />
<Input color="primary" variant="subtle" placeholder="subtle" />
```

## Tamaños

`size` acepta `sm`, `md` (**default**) y `lg`, y cambia el padding y el tamaño de fuente.

```vue
<Input size="sm" placeholder="sm" />
<Input size="md" placeholder="md (default)" />
<Input size="lg" placeholder="lg" />
```

## Tipos

`type` es el `type` del `<input>` interno: los siete tipos HTML5 que acepta el validador.

```vue
<Input type="text" placeholder="Texto" />
<Input type="password" placeholder="Contraseña" />
<Input type="email" placeholder="correo@ejemplo.com" />
<Input type="number" placeholder="0" />
<Input type="tel" placeholder="+54 11 1234-5678" />
<Input type="url" placeholder="https://..." />
<Input type="search" placeholder="Buscar..." />
```

## Estados

`disabled` bloquea la interacción y atenúa el campo; `readOnly` deja leer y seleccionar el texto,
pero no editarlo.

```vue
<Input model-value="deshabilitado" disabled />
<Input model-value="solo lectura (readOnly)" readOnly />
<Input placeholder="habilitado" />
```

## Valor y cambios

`v-model` cubre el ida y vuelta; escuchando `update:model-value` ves cada cambio (el valor llega
como primer argumento).

```vue
<script setup lang="ts">
import Input from "@/components/form/Input.vue";
import { ref } from "vue";

const nombre = ref("");

function onUpdate(valor: string) {
  console.log("Valor actual:", valor);
}
</script>

<template>
  <Input v-model="nombre" placeholder="Tu nombre" @update:model-value="onUpdate" />
</template>
```

## API imperativa

`get()`, `set(valor)`, `reset()` y `focus()` se llaman sobre la `ref` del componente.

```vue
<script setup lang="ts">
import Input from "@/components/form/Input.vue";
import { ref, useTemplateRef } from "vue";

const valor = ref("Valor por API");
const campo = useTemplateRef("campo");

function usar() {
  campo.value?.set("Valor por API"); // set()
  console.log(campo.value?.get());   // get() → "Valor por API"
  campo.value?.reset();              // reset() → ""
  campo.value?.focus();              // focus()
}
</script>

<template>
  <Input ref="campo" v-model="valor" placeholder="Valor por API" />
</template>
```

> `reset()` limpia a `""`: `startValue` está declarada en el componente pero **no se aplica**.
> Para un valor inicial, usá `v-model`.

## Props

<!--@include: ../../partials/input/props-vue.md-->

## Emits

<!--@include: ../../partials/input/eventos.md-->

## Slots

<!--@include: ../../partials/input/slots.md-->

## Expose

<!--@include: ../../partials/input/metodos-vue.md-->
