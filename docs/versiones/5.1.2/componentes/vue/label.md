[← Volver](../README.md)

# `Label`

Label con color semántico. Al hacer clic —en el texto o en el espacio libre del label— enfoca el
primer control del slot o, si se define `for`, el elemento con ese id. Útil para agrupar `<Input>`,
`<Checkbox>`, `<Switch>`, etc. y ganar área clickeable. El foco busca el control focuseable dentro
del hijo: sirve un campo nativo, un componente Vue cuyo root no es el campo (`Checkbox`, `Switch`) o
un custom element, en cuyo caso entra a su shadow root (el host no es focuseable).

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

El texto va por la prop `label`; el slot es el control que se enfoca. Al hacer clic en el label (el
texto o el espacio libre), se busca el primer control focuseable dentro del slot
(`input`, `select`, `textarea`, `button`, `[tabindex]`) y se lo enfoca, **sin activarlo**: el toggle
de un `Checkbox`/`Switch` lo hace el propio control al clickearse. Funciona igual con un campo
nativo, con un componente cuyo root no es un campo (`Checkbox`, `Switch`) o con un custom element,
entrando a su shadow root.

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

Con `for`, el foco va al elemento que tenga ese id, aunque esté fuera del label. El `<label>` lo
expone además como atributo (asociación nativa, útil para lectores de pantalla).

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

El componente emite `click` en cada clic sobre el label (el texto o el espacio libre), no sólo sobre
el `<span>` del texto; además, el clic enfoca el control.

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
