# `Card`

Tarjeta para mostrar información agrupada con jerarquía visual: media, header (título + subtítulo), contenido y footer. Componente de presentación: no emite eventos ni expone métodos.

[← Volver](../README.md)

---

## Uso en Vue

```vue
<script setup lang="ts">
import Card from "@/components/information/Card.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Card title="Resumen" subtitle="Último corte" color="primary">
    Contenido principal de la tarjeta.
    <template #footer>
      <Button color="primary" variant="soft">Ver más</Button>
    </template>
  </Card>
</template>
```

## Variantes visuales

```vue
<template>
  <Card title="Ghost">ghost (default)</Card>
  <Card title="Outlined" variant="outlined" color="primary">outlined</Card>
  <Card title="Soft" variant="soft" color="primary">soft</Card>
  <Card title="Subtle" variant="subtle" color="primary">subtle</Card>
  <Card title="Solid" variant="solid" color="primary">solid</Card>
</template>
```

## Con imagen

```vue
<template>
  <Card
    title="Proyecto"
    subtitle="Equipo de desarrollo"
    image="https://example.com/cover.jpg"
    color="success"
  >
    Descripción del proyecto.
  </Card>
</template>
```

## Layout horizontal

Media (imagen o slot `media`) al costado del contenido:

```vue
<template>
  <Card layout="horizontal" title="Perfil" subtitle="Información del usuario" image="https://example.com/avatar.jpg">
    Datos del perfil.
  </Card>
</template>
```

## Slots custom

```vue
<script setup lang="ts">
import Card from "@/components/information/Card.vue";
import Badge from "@/components/information/Badge.vue";
</script>

<template>
  <Card color="neutral">
    <template #media>
      <img src="https://example.com/banner.jpg" alt="Banner" style="width:100%;display:block" />
    </template>
    <h3 style="margin:0">Título custom</h3>
    <p style="margin:0">Contenido.</p>
    <template #footer>
      <Badge color="success" variant="solid">Activo</Badge>
    </template>
  </Card>
</template>
```

---

## Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"ghost"` | — |
| `layout` | `"vertical" \| "horizontal"` | `"vertical"` | — |
| `title` | `string` | `—` | — |
| `subtitle` | `string` | `—` | — |
| `image` | `string` | `—` | — |
<!-- /@api:props -->

## Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

## Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `media` | — |
| `header` | — |
| `default` | — |
| `footer` | — |
<!-- /@api:slots -->

## Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
