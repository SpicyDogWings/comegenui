# `<cu-badge>`

Etiqueta o badge pequeño para estados, categorías o metadata. Componente de presentación pura: no emite eventos ni expone métodos.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuBadge.umd.js"></script>

<cu-badge color="primary" variant="solid">Nuevo</cu-badge>
<cu-badge color="success" variant="soft">Activo</cu-badge>
<cu-badge color="warning" variant="outlined">Pendiente</cu-badge>
<cu-badge color="danger" variant="subtle">Error</cu-badge>
```

---

## Variantes visuales

```html
<cu-badge color="primary" variant="solid">solid</cu-badge>
<cu-badge color="primary" variant="outlined">outlined</cu-badge>
<cu-badge color="primary" variant="soft">soft</cu-badge>
<cu-badge color="primary" variant="ghost">ghost</cu-badge>
<cu-badge color="primary" variant="subtle">subtle</cu-badge>
```

---

## Con ícono

```html
<cu-badge color="success" variant="soft">
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block;vertical-align:middle;margin-right:4px">
    <path d="M20 6 9 17l-5-5"/>
  </svg>
  Verificado
</cu-badge>
```

---

## Vista Vue

### Uso en Vue

```vue
<script setup lang="ts">
import Badge from "@/components/information/Badge.vue";
</script>

<template>
  <Badge color="primary" variant="solid">Nuevo</Badge>
  <Badge color="success" variant="soft">Activo</Badge>
  <Badge color="warning" variant="outlined">Pendiente</Badge>
  <Badge color="danger" variant="subtle">Error</Badge>
</template>
```

### Variantes visuales

```vue
<template>
  <Badge color="primary" variant="solid">solid</Badge>
  <Badge color="primary" variant="outlined">outlined</Badge>
  <Badge color="primary" variant="soft">soft</Badge>
  <Badge color="primary" variant="ghost">ghost</Badge>
  <Badge color="primary" variant="subtle">subtle</Badge>
</template>
```

### Con ícono

```vue
<template>
  <Badge color="success" variant="soft">
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="display:inline-block;vertical-align:middle;margin-right:4px">
      <path d="M20 6 9 17l-5-5"/>
    </svg>
    Verificado
  </Badge>
</template>
```

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "subtle" \| "ghost"` | `"soft"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |

## Eventos

Ninguno.

## Slots

| Slot | Descripción |
|------|------|
| `default` | Contenido textual o ícono del badge |

## Métodos expuestos

Ninguno.
