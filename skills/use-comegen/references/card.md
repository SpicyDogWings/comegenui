# Card — `<cu-card>` / `<Card>`

Tarjeta de presentación que agrupa media, header (título/subtítulo), contenido y footer, con
color y variante de superficie. No emite eventos propios ni expone métodos.

## Cuándo usarlo

Para mostrar un bloque de información con jerarquía visual (resumen, perfil, ficha de proyecto).
No es un componente interactivo: si necesitás una tarjeta clickeable, poné el contenido
interactivo adentro o envolvé todo vos.

## Receta

1. El contenido va por el slot default; `title` y `subtitle` arman el header.
2. La media se define con `image` (URL) o con el slot `media` — si hay slot, pisa a `image`.
3. El slot `header` reemplaza por completo `title`/`subtitle`.
4. El `footer` sólo se renderiza si tiene contenido (no reserva el espacio).
5. `variant` cambia la superficie (`ghost` default, `outlined`, `soft`, `subtle`, `solid`);
   `layout="horizontal"` pone la media al costado.
6. `color` tiñe la variante elegida.

```html
<!-- HTML plano (UMD) -->
<script src="dist-libs/umd-core/CuCard.umd.js"></script>

<cu-card title="Resumen" subtitle="Último corte" color="primary" variant="soft">
  Contenido principal de la tarjeta.
  <div slot="footer">
    <cu-button color="primary" variant="soft">Ver más</cu-button>
  </div>
</cu-card>
```

```vue
<!-- Vue -->
<script setup lang="ts">
import Card from "@/components/information/Card.vue";
import Button from "@/components/buttons/Button.vue";
</script>

<template>
  <Card title="Resumen" subtitle="Último corte" color="primary" variant="soft">
    Contenido principal de la tarjeta.
    <template #footer>
      <Button color="primary" variant="soft">Ver más</Button>
    </template>
  </Card>
</template>
```

## Qué puede y qué no puede

**Puede:** 6 colores (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`),
5 variantes (`ghost`, `outlined`, `soft`, `subtle`, `solid`), 2 layouts (`vertical`,
`horizontal`), `title`/`subtitle`, `image` y los slots `media`, `header`, `footer`, `default`.

**No puede:**

- **No expone métodos** y, en Vue, **no emite eventos**.
- **No acepta `theme`.** El tema se define en `<html data-theme="...">` (ver `theming.md`).
- **`header` pisa `title`/`subtitle`:** si usás el slot, las props no se renderizan.
- **`media` (slot) pisa `image`:** el slot gana siempre.
- **`layout="horizontal"` fija la media al 40%** del ancho; no es configurable.
- **No hay tamaño, padding ni radio configurables.**
- **`image` renderiza un `<img alt="">`** sin `srcset`, `loading` ni atributos extra; para
  controlar la imagen usá el slot `media`.
- **El evento `click` del CE es el nativo del DOM**, no un evento propio; no trae un payload de
  negocio.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"ghost"` | `ghost` (default), `outlined`, `soft`, `subtle`, `solid` |
| `layout` | `"vertical" \| "horizontal"` | `"vertical"` | `vertical` (media arriba) o `horizontal` (media al costado) |
| `title` | `string` | `—` | Título del header |
| `subtitle` | `string` | `—` | Subtítulo bajo el título |
| `image` | `string` | `—` | URL de imagen que se muestra como media en la parte superior (o al costado con `layout="horizontal"`) |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `click` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `media` | — |
| `header` | — |
| `footer` | — |
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
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"ghost"` | — |
| `layout` | `"vertical" \| "horizontal"` | `"vertical"` | — |
| `title` | `string` | `—` | — |
| `subtitle` | `string` | `—` | — |
| `image` | `string` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `media` | — |
| `header` | — |
| `default` | — |
| `footer` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
