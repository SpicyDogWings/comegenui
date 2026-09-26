# `Avatar`

Avatar circular (imagen o iniciales) con color semántico y tres tamaños. Si no se pasa `color`, elige un color determinístico a partir de las iniciales.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Avatar from "@/components/information/Avatar.vue";
</script>

<template>
  <Avatar initials="JP" color="primary" />
  <Avatar initials="MR" color="success" size="lg" />
  <Avatar initials="CD" size="sm" />
</template>
```

## Tamaños

```vue
<template>
  <Avatar initials="A" size="sm" />
  <Avatar initials="A" size="md" />
  <Avatar initials="A" size="lg" />
</template>
```

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `""` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño: `sm`, `md`, `lg` |
| `initials` | `string` | `""` | Texto que se muestra como iniciales cuando no hay `src` |
| `src` | `string` | `""` | URL de la imagen. **Nota:** el wrapper CE declara la prop pero no la forwardea al componente interno (ver `docs/notes/05-wrappers-ce-incompletos.md`); por ahora la imagen no se renderiza vía Custom Element |

## Emits

Ninguno.

## Slots

Ninguno (el wrapper CE no forwardea slots).

## Expose

Ninguno.
