# `<cu-author-card>`

Tarjeta de autor con avatar (imagen o iniciales generadas del nombre), nombre y rol. Componente de presentación: no emite eventos ni expone métodos.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuAuthorCard.umd.js"></script>

<cu-author-card name="Ana Pérez" role="Desarrolladora" color="primary"></cu-author-card>
<cu-author-card name="Marcos Ruiz" color="success" size="lg"></cu-author-card>
```

---

## Con imagen

```html
<cu-author-card
  name="Laura Gómez"
  role="Diseñadora"
  src="https://example.com/avatar.jpg"
></cu-author-card>
```

---

## Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `""` | Color semántico del avatar: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del avatar: `sm`, `md`, `lg` |
| `role` | `string` | `""` | Rol o cargo que se muestra bajo el nombre (se oculta si está vacío) |
| `src` | `string` | `""` | URL de la imagen del avatar (reemplaza las iniciales) |
| `name` | `string` | `—` | Nombre del autor. Genera las iniciales automáticamente (primeras letras del primero y último nombre) |
<!-- /@api:atributos -->

## Eventos

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Métodos expuestos

<!-- @api:metodos -->
No expone métodos.
<!-- /@api:metodos -->
