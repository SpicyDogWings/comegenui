# `<cu-badge>`

Etiqueta o badge pequeño para estados, categorías o metadata.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema |
| `color` | `string` | `"neutral"` | Color semántico |
| `variant` | `string` | `"ghost"` | `solid`, `outlined`, `soft`, `ghost`, `subtle` |
| `hightContrast` | `boolean` | `false` | Alto contraste |

## Slots

| Slot | Descripción |
|------|-------------|
| `default` | Contenido del badge |

## Uso en HTML plano

```html
<script src="dist/CuBadge.umd.js"></script>

<cu-badge color="primary" variant="solid">Nuevo</cu-badge>
<cu-badge color="success" variant="soft">Activo</cu-badge>
<cu-badge color="warning" variant="outlined">Pendiente</cu-badge>
<cu-badge color="danger" variant="subtle">Error</cu-badge>
```

## Variantes visuales

```html
<cu-badge color="primary" variant="solid">solid</cu-badge>
<cu-badge color="primary" variant="outlined">outlined</cu-badge>
<cu-badge color="primary" variant="soft">soft</cu-badge>
<cu-badge color="primary" variant="ghost">ghost</cu-badge>
<cu-badge color="primary" variant="subtle">subtle</cu-badge>
```
