# `Dropdown`

[← Volver](../SKILL.md)

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

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` |  |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle" \| "link" \| "none"` | `"ghost"` |  |
| `disabled` | `boolean` | `false` |  |
| `label` | `string` | `""` |  |
| `icon` | `string` | `""` | Ícono del trigger (SVG/HTML). |
| `trigger` | `"click" \| "hover"` | `"click"` |  |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"bottom"` |  |
| `align` | `"center" \| "start" \| "end"` | `"start"` |  |
| `offset` | `number` | `4` |  |
| `fixed` | `boolean` | `false` |  |
| `panelWidth` | `string` | `""` |  |
| `loading` | `boolean` | `false` |  |
| `cooldown` | `boolean` | `false` |  |
| `cooldownKey` | `number` | `0` |  |
| `delay` | `number` | `2000` |  |
| `items` | `DropdownMenuItem[]` | `[]` |  |
| `modelValue` | `string` | `""` | Valor seleccionado (v-model). |

## Eventos

| Evento | Payload | Descripción |
|------|------|------|
| `update:modelValue` | `value: string` |  |
| `open` | — | Abre el panel. |
| `close` | — | Cierra el panel. |

## Slots

| Slot | Descripción |
|------|------|
| `toggle` |  |
| `default` |  |

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.open()` | Abre el panel. |
| `.close()` | Cierra el panel. |
| `.toggle()` | Alterna la visibilidad del panel. |
| `.get()` | Devuelve el valor seleccionado. |
| `.set(val: string)` | Setea el valor seleccionado. |
| `.reset()` | Limpia el valor seleccionado. |
| `.isOpen()` | Devuelve true si el panel está abierto. |

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
