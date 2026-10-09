# `<cu-tooltip>`

Tooltip que aparece al hacer hover sobre el elemento contenido, con posición, alineación, offset y delay configurables.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist/CuTooltip.core.umd.js"></script>

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

---

## Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del fondo: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `text` | `string` | `""` | Texto del tooltip. Si se usa el slot `content`, tiene prioridad |
| `disabled` | `boolean` | `false` | Deshabilita el tooltip (no se muestra) |
| `position` | `"left" \| "right" \| "bottom" \| "top"` | `"top"` | Lado donde aparece: `top`, `bottom`, `left`, `right` |
| `align` | `"center" \| "start" \| "end"` | `"center"` | Alineación respecto al elemento: `start`, `center`, `end` |
| `offset` | `number` | `6` | Distancia (px) entre el elemento y el tooltip |
| `delay` | `number` | `200` | Retardo (ms) antes de mostrar el tooltip al hacer hover |
<!-- /@api:atributos -->

## Eventos

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

## Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
| `content` | — |
<!-- /@api:slots -->

## Métodos expuestos

<!-- @api:metodos -->
No expone métodos.
<!-- /@api:metodos -->
