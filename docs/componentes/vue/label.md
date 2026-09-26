# `Label`

Label con color semántico. Al hacer clic, enfoca el input hijo o, si se define `for`, el elemento con ese id. Útil para agrupar `<cu-input>`, `<cu-checkbox>`, etc. y ganar área clickeable.

[← Volver](../README.md)

---

## Uso en Vue

## Modo declarativo (prop `label`)

```vue
<script setup lang="ts">
import Label from "@/components/form/Label.vue";
import Input from "@/components/form/Input.vue";
</script>

<template>
  <Label label="Correo electrónico" color="primary">
    <Input type="email" placeholder="correo@ejemplo.com" />
  </Label>
</template>
```

## Con `for` apuntando a un input externo

```vue
<script setup lang="ts">
import Label from "@/components/form/Label.vue";
</script>

<template>
  <Label for="miInput" label="Nombre" />
  <input id="miInput" type="text" />
</template>
```

## Con cualquier control como hijo

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

Al hacer clic en el label, el control hijo se enfoca automáticamente. Si pasás `for`, se enfoca el elemento con ese id en lugar del hijo.

## Combinación con `<cu-input>`

```vue
<script setup lang="ts">
import Label from "@/components/form/Label.vue";
import Input from "@/components/form/Input.vue";
</script>

<template>
  <Label label="Búsqueda">
    <Input type="search" placeholder="Buscar..." />
  </Label>
</template>
```

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `for` | `string` | `""` | ID del elemento a enfocar al hacer clic (atributo HTML `for`) |
| `label` | `string` | `""` | Texto del label (modo declarativo) |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del texto; se resuelve vía el token `--cu-color-{color}` |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste para el texto |

## Emits

Ninguno.

## Slots

| Slot | Descripción |
|------|------|
| `default` | Contenido asociado (input, checkbox, etc.) |

## Expose

Ninguno.
