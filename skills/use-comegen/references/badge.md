# Badge — `<cu-badge>` / `<Badge>`

Etiqueta pequeña para estados, categorías o metadata.

## Cuándo usarlo

Para marcar algo con un rótulo corto y de color (estado, tag, contador). Si necesitás una acción o
navegación, usá `cu-button`; si es un aviso extenso, `cu-alert`.

## Receta

1. El texto va por el slot default.
2. Combiná `color` (semántico) con `variant` (estilo) para definir el look.
3. Podés meter un `<svg>` inline junto al texto; hereda el color del badge.

```html
<!-- HTML plano (UMD) -->
<script src="dist-libs/umd-core/CuBadge.umd.js"></script>

<cu-badge color="primary" variant="solid">Nuevo</cu-badge>
<cu-badge color="success" variant="soft">Activo</cu-badge>
<cu-badge color="warning" variant="outlined">Pendiente</cu-badge>
<cu-badge color="danger" variant="subtle">Error</cu-badge>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Badge from "@/components/information/Badge.vue";
</script>

<template>
  <Badge color="primary" variant="solid">Nuevo</Badge>
  <Badge color="success" variant="soft">Activo</Badge>
  <Badge color="warning" variant="outlined">Pendiente</Badge>
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`), 5 variantes
(`solid`, `outlined`, `soft`, `ghost`, `subtle`) y contenido libre por el slot default (texto y/o
SVG inline).

**No puede:**

- **Presentación pura:** no emite eventos, no expone métodos y no tiene slots con nombre.
- **No tiene `size`:** el tamaño es fijo (no hay `sm`/`md`/`lg`).
- **No tiene `theme`.**
- **No navega ni acciona:** no acepta `to`/`href` ni emite `click` custom. Para un badge clickeable,
  usá `cu-button variant="soft"` o envolvelo con tu propio handler.
- **No se puede cerrar** ni tiene estado de descarte.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
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
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
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
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
