# `<cu-label>`

Label con color semántico. Al hacer clic, enfoca el input hijo o, si se define `for`, el elemento con ese id. Útil para agrupar `<cu-input>`, `<cu-checkbox>`, etc. y ganar área clickeable.

[← Volver](../README.md)

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

---

## Combinación con `<cu-input>`

```html
<cu-label label="Búsqueda">
  <cu-input type="search" placeholder="Buscar..."></cu-input>
</cu-label>
```

---

## Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del texto; se resuelve vía el token `--cu-color-{color}` |
| `label` | `string` | `""` | Texto del label (modo declarativo) |
| `for` | `string` | `""` | ID del elemento a enfocar al hacer clic (atributo HTML `for`) |
| `hight-contrast` | `boolean` | `false` | Modo de alto contraste para el texto |
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
<!-- /@api:slots -->

## Métodos expuestos

<!-- @api:metodos -->
No expone métodos.
<!-- /@api:metodos -->
