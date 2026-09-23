# `<cu-card>`

Tarjeta para mostrar información agrupada con jerarquía visual: media, header (título + subtítulo), contenido y footer. Componente de presentación: no emite eventos ni expone métodos.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"ghost"` | `ghost` (default), `outlined`, `soft`, `subtle`, `solid` |
| `layout` | `"vertical" \| "horizontal"` | `"vertical"` | `vertical` (media arriba) o `horizontal` (media al costado) |
| `title` | `string` | — | Título del header |
| `subtitle` | `string` | — | Subtítulo bajo el título |
| `image` | `string` | — | URL de imagen que se muestra como media en la parte superior (o al costado con `layout="horizontal"`) |

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `click` | `MouseEvent` | Click en la tarjeta (re-emitido por el wrapper) |

## Slots

| Slot | Descripción |
|------|------|
| `media` | Contenido de la parte superior (si no se usa el prop `image`). Reemplaza la imagen |
| `header` | Reemplaza el título/subtítulo por defecto |
| `footer` | Contenido al pie de la tarjeta (se separa con una línea) |
| `default` | Contenido principal del cuerpo de la tarjeta |

## Métodos expuestos

Ninguno.

---

## Uso en HTML plano

```html
<script src="dist/CuCard.umd.js"></script>

<cu-card title="Resumen" subtitle="Último corte" color="primary">
  Contenido principal de la tarjeta.
  <div slot="footer">
    <cu-button color="primary" variant="soft">Ver más</cu-button>
  </div>
</cu-card>
```

---

## Variantes visuales

```html
<cu-card title="Ghost">ghost (default)</cu-card>
<cu-card title="Outlined" variant="outlined" color="primary">outlined</cu-card>
<cu-card title="Soft" variant="soft" color="primary">soft</cu-card>
<cu-card title="Subtle" variant="subtle" color="primary">subtle</cu-card>
<cu-card title="Solid" variant="solid" color="primary">solid</cu-card>
```

---

## Con imagen

```html
<cu-card
  title="Proyecto"
  subtitle="Equipo de desarrollo"
  image="https://example.com/cover.jpg"
  color="success"
>
  Descripción del proyecto.
</cu-card>
```

---

## Layout horizontal

Media (imagen o slot `media`) al costado del contenido:

```html
<cu-card layout="horizontal" title="Perfil" subtitle="Información del usuario" image="https://example.com/avatar.jpg">
  Datos del perfil.
</cu-card>
```

---

## Slots custom

```html
<cu-card color="neutral">
  <div slot="media">
    <img src="https://example.com/banner.jpg" alt="Banner" style="width:100%;display:block" />
  </div>
  <h3 style="margin:0">Título custom</h3>
  <p style="margin:0">Contenido.</p>
  <div slot="footer">
    <cu-badge color="success" variant="solid">Activo</cu-badge>
  </div>
</cu-card>
```
