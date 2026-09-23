# `<cu-tooltip>`

Tooltip que aparece al hacer hover sobre el elemento contenido, con posición, alineación, offset y delay configurables.

[← Volver](../SKILL.md)

---

---

## Uso en HTML plano

```html
<script src="dist/CuTooltip.umd.js"></script>

<cu-tooltip text="Guardar cambios" color="primary">
  <cu-button color="primary" variant="soft">Guardar</cu-button>
</cu-tooltip>
```

---

## Posición y contenido custom

```html
<cu-tooltip text="Texto simple" position="bottom"></cu-tooltip>

<cu-tooltip position="right" align="start" delay="300">
  <span>Elemento con tooltip rico</span>
  <span slot="content">
    <strong>Más contexto</strong> con HTML
  </span>
</cu-tooltip>
```

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `text` | `string` | `""` | Texto del tooltip. Si se usa el slot `content`, tiene prioridad |
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del fondo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `position` | `"bottom" \| "top" \| "left" \| "right"` | `"top"` | Lado donde aparece: `top`, `bottom`, `left`, `right` |
| `align` | `"start" \| "center" \| "end"` | `"center"` | Alineación respecto al elemento: `start`, `center`, `end` |
| `offset` | `number` | `6` | Distancia (px) entre el elemento y el tooltip |
| `delay` | `number` | `200` | Retardo (ms) antes de mostrar el tooltip al hacer hover |
| `disabled` | `boolean` | `false` | Deshabilita el tooltip (no se muestra) |

## Eventos

Ninguno (los eventos nativos del DOM como `mouseenter`/`mouseleave` burbujean desde el Shadow DOM).

## Slots

| Slot | Descripción |
|------|------|
| `default` | El elemento que dispara el tooltip al hacer hover |
| `content` | Contenido del tooltip (reemplaza el prop `text`) |

## Métodos expuestos

Ninguno.
