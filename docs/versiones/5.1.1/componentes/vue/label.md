[← Volver](../README.md)

# `Label`

Label con color semántico. Al hacer clic, enfoca el input hijo o, si se define `for`, el
elemento con ese id. Útil para agrupar `<Input>`, `<Checkbox>`, etc. y ganar área clickeable.

## Uso en Vue

```vue
<script setup lang="ts">
import Label from "@/components/form/Label.vue";
import Input from "@/components/form/Input.vue";
</script>

<template>
  <Label label="Correo electrónico" color="primary">
    <Input type="email" placeholder="correo@ejemplo.com" />
  </Label>
  <Label label="Búsqueda">
    <Input type="search" placeholder="Buscar..." />
  </Label>
</template>
```

En HTML plano, cargá el bundle `CuLabel` (ver [ficha vanilla](/componentes/cu-label)).

## Colores

`color` pinta el texto con el token del tema activo (`--cu-color-{color}`), así que el mismo
nombre se ve distinto en cada tema.

```vue
<Label label="primary" color="primary" />
<Label label="secondary" color="secondary" />
<Label label="neutral" color="neutral" />
<Label label="success" color="success" />
<Label label="warning" color="warning" />
<Label label="danger" color="danger" />
```

> `hightContrast` está declarado en el componente pero hoy **no cambia el render**: el demo lo
> incluye sólo para dejarlo a la vista.

## Contenido (slot)

El slot acepta cualquier control: al hacer clic en el label, el control hijo recibe el foco.

```vue
<script setup lang="ts">
import Label from "@/components/form/Label.vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Switch from "@/components/form/Switch.vue";
</script>

<template>
  <Label label="Acepto los términos">
    <Checkbox />
  </Label>

  <Label label="Suscripción">
    <Switch />
  </Label>
</template>
```

## Enfocar con `for`

Con `for`, el foco va al elemento que tenga ese id, aunque esté fuera del label.

```vue
<script setup lang="ts">
import Label from "@/components/form/Label.vue";
import Input from "@/components/form/Input.vue";
</script>

<template>
  <Label for="miInput" label="Nombre" />
  <Input id="miInput" type="text" placeholder="Elemento con id miInput" />
</template>
```

## Click

El componente emite `click` en cada clic sobre el texto del label (el `<span>` que renderiza
`label`); además, el clic enfoca el control.

```vue
<script setup lang="ts">
import Label from "@/components/form/Label.vue";
import Input from "@/components/form/Input.vue";
import { ref } from "vue";

const clicks = ref(0);
</script>

<template>
  <Label
    for="label-target"
    label="Nombre (el click enfoca el input de abajo)"
    color="primary"
    @click="clicks++"
  />
  <Input id="label-target" placeholder="Elemento con id label-target" />
  <pre>{{ clicks }}</pre>
</template>
```

## Props

<!--@include: ../../partials/label/props-vue.md-->

## Emits

<!--@include: ../../partials/label/eventos-vue.md-->

## Slots

<!--@include: ../../partials/label/slots.md-->

## Expose

<!--@include: ../../partials/label/metodos.md-->
