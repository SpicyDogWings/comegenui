# `Dropdown`

Motor genérico de panel desplegable (toggle + panel + posicionamiento). Es interno: lo componen `Select`, `Autocomplete`, `DropdownMenu`, `DatePicker` y `Tooltip`.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Dropdown from "@/components/overlay/Dropdown.vue";
import { ref } from "vue";

const value = ref("");
// props: items
</script>

<template>
  <Dropdown v-model="value" color="neutral" variant="ghost" trigger="click" position="bottom" align="start">
    Dropdown
  </Dropdown>
</template>
```

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` | — |
| `disabled` | `boolean` | `false` | — |
| `loading` | `boolean` | `false` | — |
| `label` | `string` | `""` | — |
| `position` | `"bottom" \| "top" \| "left" \| "right"` | `"bottom"` | — |
| `align` | `"start" \| "center" \| "end"` | `"start"` | — |
| `offset` | `number` | `4` | — |
| `fixed` | `boolean` | `false` | — |
| `items` | `DropdownMenuItem[]` | `[]` | — |
| `icon` | `string` | `""` | Ícono del trigger (SVG/HTML). |
| `trigger` | `"click" \| "hover"` | `'click'` | — |
| `panelWidth` | `string` | `""` | — |
| `cooldown` | `boolean` | `false` | — |
| `cooldownKey` | `number` | `0` | — |
| `delay` | `number` | `2000` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `update:modelValue` | `string` | — |
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `toggle` | — |
| `default` | — |
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el panel. |
| `close` | Cierra el panel. |
| `toggle` | Alterna la visibilidad del panel. |
| `get` | — |
| `set` | — |
| `reset` | — |
| `isOpen` | Devuelve true si el panel está abierto. |
<!-- /@api:expose -->

## Interfaces

### `DropdownMenuItem`

```ts
export interface DropdownMenuItem {
  label?: string;
  to?: string;
  href?: string;
  icon?: string;
  disabled?: boolean;
  divider?: boolean;
  onClick?: () => void;
}
```
