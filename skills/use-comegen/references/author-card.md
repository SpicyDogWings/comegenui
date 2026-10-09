# AuthorCard — `<cu-author-card>` / `<AuthorCard>`

Tarjeta de autor: avatar (imagen o iniciales generadas del nombre), nombre y rol.

## Cuándo usarlo

Para firmar contenido o listar autores/equipo. Es la composición de `Avatar` + nombre + rol; si
necesitás sólo la foto o las iniciales, usá `cu-avatar`.

## Receta

1. `name` es obligatorio: de ahí salen las iniciales del avatar.
2. `role` se muestra debajo del nombre y se oculta si está vacío.
3. `src` reemplaza las iniciales por una imagen; `color` y `size` se los pasa al avatar.

```html
<!-- HTML plano (UMD) -->
<script src="dist/CuAuthorCard.core.umd.js"></script>

<cu-author-card name="Ana Pérez" role="Desarrolladora" color="primary"></cu-author-card>
<cu-author-card name="Marcos Ruiz" color="success" size="lg"></cu-author-card>
<cu-author-card name="Laura Gómez" role="Diseñadora" src="https://example.com/avatar.jpg"></cu-author-card>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import AuthorCard from "@/components/information/AuthorCard.vue";
</script>

<template>
  <AuthorCard name="Ana Pérez" role="Desarrolladora" color="primary" />
  <AuthorCard name="Marcos Ruiz" color="success" size="lg" />
</template>
```

## Qué puede y qué no puede

**Puede:** `name` (obligatorio), `role`, imagen (`src`), color del avatar (`color`) y tamaño del
avatar (`size`: `sm`, `md`, `lg`).

**No puede:**

- **Presentación pura:** no emite eventos, no tiene slots y no expone métodos.
- **Sin `name` no hay tarjeta útil:** es `required` y es lo que genera las iniciales.
- **`src` manda sobre las iniciales:** si la imagen falla no hay fallback, queda la imagen rota.
- **Iniciales acotadas:** con dos o más palabras toma la primera letra del primero y del último
  nombre; con una sola palabra, sus dos primeras letras.
- **No tiene `theme`** ni control de layout (siempre avatar a la izquierda, texto a la derecha).
- **`role` vacío desaparece:** no hay placeholder ni línea vacía.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `""` | Color semántico del avatar: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del avatar: `sm`, `md`, `lg` |
| `role` | `string` | `""` | Rol o cargo que se muestra bajo el nombre (se oculta si está vacío) |
| `src` | `string` | `""` | URL de la imagen del avatar (reemplaza las iniciales) |
| `name` | `string` | `—` | Nombre del autor. Genera las iniciales automáticamente (primeras letras del primero y último nombre) |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
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
| `role` | `string` | `""` | — |
| `src` | `string` | `""` | — |
| `name` | `string` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
