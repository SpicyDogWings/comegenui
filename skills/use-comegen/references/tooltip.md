# Tooltip — `<cu-tooltip>` / `<Tooltip>`

Tooltip que aparece al hacer hover sobre el elemento contenido, con posición, alineación, offset y delay configurables.

## Cuándo usarlo

Para aclarar qué hace un elemento al pasar el mouse. Si necesitás abrir contenido con click
(o controlarlo por código), usá `cu-popover` o `cu-dropdown-menu`.

## Receta

1. Poné el elemento disparador en el slot default.
2. Para texto simple usá `text`; para HTML usá el slot `content`, que tiene prioridad sobre
   `text`.
3. Elegí `position` (`top` default) y `align` (`center` default); separá el panel con
   `offset` y esperá `delay` ms.
4. `disabled` apaga el tooltip; `color` define el color de fondo (el texto siempre es
   `surface`).

```html
<!-- HTML plano (UMD) -->
<script src="dist-libs/umd-core/CuTooltip.umd.js"></script>

<cu-tooltip text="Guardar cambios" color="primary">
  <cu-button color="primary" variant="soft">Guardar</cu-button>
</cu-tooltip>

<cu-tooltip position="right" align="start" delay="300">
  <span>Elemento con tooltip rico</span>
  <span slot="content"><strong>Más contexto</strong> con HTML</span>
</cu-tooltip>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Tooltip from "@/components/overlay/Tooltip.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Tooltip text="Guardar cambios" color="primary">
    <Button color="primary" variant="soft">Guardar</Button>
  </Tooltip>

  <Tooltip position="right" align="start" :delay="300">
    <span>Elemento con tooltip rico</span>
    <template #content><strong>Más contexto</strong> con HTML</template>
  </Tooltip>
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores de fondo, 4 posiciones (`top`, `bottom`, `left`, `right`), 3 alineaciones
(`start`, `center`, `end`), `offset` (6 px) y `delay` (200 ms), `text` o slot `content` con
HTML, y `disabled`.

**No puede:**

- **Sólo aparece con hover del mouse:** no hay trigger por click, no se muestra con foco de
  teclado y no está pensado para touch.
- **No emite eventos ni expone métodos.**
- **No dibuja flecha** (arrow).
- **`color` sólo cambia el fondo:** no hay prop de color del texto (siempre `surface`).
- **No acepta contenido rico fuera del slot `content`:** el slot default es el trigger, no el
  contenido.
- El ancho está topeado a `18rem`, no es configurable por prop.
- No expone props de posicionamiento tipo `fixed`: el panel se ubica con CSS relativo al trigger.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del fondo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `text` | `string` | `""` | Texto del tooltip. Si se usa el slot `content`, tiene prioridad |
| `disabled` | `boolean` | `false` | Deshabilita el tooltip (no se muestra) |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"top"` | Lado donde aparece: `top`, `bottom`, `left`, `right` |
| `align` | `"center" \| "start" \| "end"` | `"center"` | Alineación respecto al elemento: `start`, `center`, `end` |
| `offset` | `number` | `6` | Distancia (px) entre el elemento y el tooltip |
| `delay` | `number` | `200` | Retardo (ms) antes de mostrar el tooltip al hacer hover |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
| `content` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
No expone métodos.
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `text` | `string` | `""` | — |
| `disabled` | `boolean` | `false` | — |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"top"` | — |
| `align` | `"center" \| "start" \| "end"` | `"center"` | — |
| `offset` | `number` | `6` | — |
| `delay` | `number` | `200` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
| `content` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
