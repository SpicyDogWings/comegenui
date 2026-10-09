# Avatar — `<cu-avatar>` / `<Avatar>`

Avatar circular: imagen (`src`) o iniciales, con color semántico o elegido automáticamente por hash.

## Cuándo usarlo

Para representar a una persona o entidad en poco espacio (listados, headers, comentarios). Si además
necesitás nombre y rol, usá `cu-author-card`.

## Receta

1. Con `src` mostrás una imagen; sin `src`, pasá `initials` (o contenido por el slot default).
2. Si no pasás `color`, se elige uno determinístico a partir de las iniciales.
3. `size` define el diámetro: `sm`, `md` o `lg`.

```html
<!-- HTML plano (UMD) -->
<script src="dist-libs/umd-core/CuAvatar.umd.js"></script>

<cu-avatar initials="JP" color="primary"></cu-avatar>
<cu-avatar initials="MR" color="success" size="lg"></cu-avatar>
<cu-avatar src="https://example.com/foto.jpg" size="sm"></cu-avatar>
<cu-avatar initials="LV"></cu-avatar>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Avatar from "@/components/information/Avatar.vue";
</script>

<template>
  <Avatar initials="JP" color="primary" />
  <Avatar initials="MR" color="success" size="lg" />
  <Avatar src="https://example.com/foto.jpg" size="sm" />
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`) o color
automático por hash, 3 tamaños (`sm`, `md`, `lg`), imagen (`src`), iniciales (`initials`) y contenido
libre por el slot default.

**No puede:**

- **Sin `src`, `initials` ni contenido queda vacío:** se ve el círculo de fondo, pero sin texto ni
  imagen.
- **No emite eventos, no tiene slots con nombre y no expone métodos.**
- **`color` es opcional (`""` por default):** si no lo pasás, se resuelve por hash de las iniciales.
- **No renderiza gradiente:** aunque el código calcula un segundo color, el estilo sólo aplica un
  fondo plano.
- **El slot default se suma a `initials`/`src`**, no los reemplaza.
- **La forma es siempre circular** y el tamaño sólo admite los tres valores de `size`.
- **No tiene `theme`, `alt` ni manejo de error de imagen.**

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `""` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño: `sm`, `md`, `lg` |
| `src` | `string` | `""` | URL de la imagen |
| `initials` | `string` | `""` | Texto que se muestra como iniciales cuando no hay `src` |
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
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `""` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | — |
| `src` | `string` | `""` | — |
| `initials` | `string` | `""` | — |
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
