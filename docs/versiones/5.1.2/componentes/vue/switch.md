[← Volver](../README.md)

# `Switch`

Toggle de encendido/apagado con color semántico, dos tamaños y etiqueta opcional. Mantiene su
estado y también se controla vía `modelValue` o los métodos `get`/`set`.

## Uso en Vue

```vue
<script setup lang="ts">
import Switch from "@/components/form/Switch.vue";
import { ref } from "vue";

const activo = ref(true);
</script>

<template>
  <Switch v-model="activo" color="primary" size="md" />
</template>
```

En HTML plano, cargá el bundle `CuSwitch` (ver [ficha vanilla](/componentes/cu-switch)).

## Colores

`color` es un nombre semántico, no un hex: se resuelve con los tokens del tema activo
(`--cu-color-{color}*`), así que el mismo nombre se ve distinto en cada tema. El color se ve en
el track cuando el switch está encendido.

```vue
<Switch color="primary" label="primary" :model-value="true" />
<Switch color="secondary" label="secondary" :model-value="true" />
<Switch color="neutral" label="neutral" :model-value="true" />
<Switch color="success" label="success" :model-value="true" />
<Switch color="warning" label="warning" :model-value="true" />
<Switch color="danger" label="danger" :model-value="true" />
```

## Tamaños

`size` acepta `sm` (32×20px) y `md` (**default**, 48×32px), y escala también la etiqueta.

```vue
<Switch size="sm" color="primary" />
<Switch size="md" color="primary" />
```

## Estado deshabilitado

`disabled` bloquea el click y atenúa el track y la etiqueta; el estado se sigue leyendo con
`get()`.

```vue
<Switch disabled label="Encendido y deshabilitado" :model-value="true" />
<Switch disabled label="Apagado y deshabilitado" />
```

## Etiqueta

`label` es la etiqueta de texto y el slot `default` la reemplaza cuando hace falta marcado.

```vue
<Switch color="primary" label="Notificaciones" />
<Switch color="success">
  Acepto los <strong>términos</strong>
</Switch>
```

## Escuchar cambios

El switch se mueve solo: `update:modelValue` (convención Vue, lo que consume `v-model`) y
`change`, los dos con el valor nuevo (`boolean`).

```vue
<script setup lang="ts">
import Switch from "@/components/form/Switch.vue";
import { ref } from "vue";

const activo = ref(false);

function onUpdate(estado: boolean) {
  console.log("Estado:", estado);
}

function onChange(estado: boolean) {
  console.log("Toggle a:", estado);
}
</script>

<template>
  <Switch v-model="activo" @update:model-value="onUpdate" @change="onChange" />
</template>
```

## Estado y modo controlado

Con `v-model` el estado vive en tu `ref`: el switch ya se mueve solo y `v-model` sólo espeja el
valor, así que no hace falta reasignarlo. Si querés decidir vos el valor, usá
`:model-value` + `@update:model-value`:

```vue
<script setup lang="ts">
import Switch from "@/components/form/Switch.vue";
import { nextTick, ref } from "vue";

const activo = ref(false);

// Sólo permite activarlo: si el usuario lo apaga, lo forzamos de nuevo.
async function onUpdate(estado: boolean) {
  activo.value = estado;
  if (!estado) {
    await nextTick();
    activo.value = true;
  }
}
</script>

<template>
  <Switch :model-value="activo" @update:model-value="onUpdate" />
</template>
```

## Control programático

```vue
<script setup lang="ts">
import { ref, useTemplateRef } from "vue";
import Switch from "@/components/form/Switch.vue";

const activo = ref(false);
const sw = useTemplateRef("sw");

function prender() {
  sw.value?.set(true);   // encender
}
function apagar() {
  sw.value?.reset();     // apagar
}
function leer() {
  console.log(sw.value?.get()); // estado actual
}
</script>

<template>
  <Switch ref="sw" v-model="activo" label="API imperativa" />
</template>
```

## Props

<!--@include: ../../partials/switch/props-vue.md-->

## Emits

<!--@include: ../../partials/switch/eventos.md-->

## Slots

<!--@include: ../../partials/switch/slots.md-->

## Expose

<!--@include: ../../partials/switch/metodos-vue.md-->
