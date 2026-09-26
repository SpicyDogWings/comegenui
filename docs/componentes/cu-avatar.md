# `<cu-avatar>`

Avatar circular (imagen o iniciales) con color semántico y tres tamaños. Si no se pasa `color`, elige un color determinístico a partir de las iniciales.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist/CuAvatar.umd.js"></script>

<cu-avatar initials="JP" color="primary"></cu-avatar>
<cu-avatar initials="MR" color="success" size="lg"></cu-avatar>
<cu-avatar initials="CD" size="sm"></cu-avatar>
```

---

## Tamaños

```html
<cu-avatar initials="A" size="sm"></cu-avatar>
<cu-avatar initials="A" size="md"></cu-avatar>
<cu-avatar initials="A" size="lg"></cu-avatar>
```

---

## Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `""` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño: `sm`, `md`, `lg` |
| `src` | `string` | `""` | URL de la imagen |
| `initials` | `string` | `""` | Texto que se muestra como iniciales cuando no hay `src` |
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
