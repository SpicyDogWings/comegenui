# `<cu-label>`

Label con color semántico. Al hacer clic, enfoca el input hijo o, si se define `for`, el elemento con ese id. Útil para agrupar `<cu-input>`, `<cu-checkbox>`, etc. y ganar área clickeable.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `for` | `string` | `""` | ID del elemento a enfocar al hacer clic (atributo HTML `for`) |
| `label` | `string` | `""` | Texto del label (modo declarativo) |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `hightContrast` | `boolean` | `false` | Modo de alto contraste para el texto |

## Slots

| Slot | Descripción |
|------|-------------|
| `default` | Contenido asociado (input, checkbox, etc.) |

## Eventos

Ninguno.

## Métodos

Ninguno.

---

## Uso en HTML plano

### Modo declarativo (prop `label`)

```html
<script src="dist/CuLabel.umd.js"></script>

<cu-label label="Correo electrónico" color="primary">
  <cu-input type="email" placeholder="correo@ejemplo.com"></cu-input>
</cu-label>
```

### Con `for` apuntando a un input externo

```html
<cu-label for="miInput" label="Nombre"></cu-label>
<input id="miInput" type="text" />
```

### Con cualquier control como hijo

```html
<cu-label label="Acepto los términos">
  <cu-checkbox></cu-checkbox>
</cu-label>

<cu-label label="Suscripción">
  <cu-switch></cu-switch>
</cu-label>
```

Al hacer clic en el label, el control hijo se enfoca automáticamente. Si pasás `for`, se enfoca el elemento con ese id en lugar del hijo.

## Combinación con `<cu-input>`

```html
<cu-label label="Búsqueda">
  <cu-input type="search" placeholder="Buscar..."></cu-input>
</cu-label>
```
