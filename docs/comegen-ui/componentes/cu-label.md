# `<cu-label>`

Label semántico con auto-foco. Al hacer clic, busca un input hijo y lo enfoca.

[← Volver](../SKILL.md)

---
## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` |
| `for` | `string` | `""` | ID del elemento a enfocar al hacer clic |
| `label` | `string` | `""` | Texto del label |
| `color` | `string` | `"neutral"` | Color semántico (`primary`, `neutral`, `success`, `warning`, `danger`) |
| `hightContrast` | `boolean` | `false` | Alto contraste |

## Slots

| Slot | Descripción |
|------|-------------|
| `default` | Contenido asociado (input, checkbox, etc.) |

## Uso en HTML plano

```html
<script src="dist/CuLabel.umd.js"></script>

<cu-label label="Correo electrónico">
  <cu-input type="email" placeholder="correo@ejemplo.com"></cu-input>
</cu-label>

<cu-label label="Acepto los términos">
  <cu-checkbox></cu-checkbox>
</cu-label>
```

Al hacer clic en el label, se enfoca automáticamente el input o checkbox hijo.
