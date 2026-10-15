# AuthorCard — `<cu-author-card>` / `<AuthorCard>`

Tarjeta de autor: avatar (imagen o iniciales derivadas del nombre), nombre y rol. Para sólo la foto
o las iniciales usá `cu-avatar`.

## Receta

- `name` es obligatorio: de ahí salen las iniciales del avatar.
- `src` reemplaza las iniciales por una imagen.
- `role` va debajo del nombre y se oculta si está vacío.
- `color` y `size` se pasan al avatar.

```html
<cu-author-card name="<name>" role="<role>" src="<url>" color="<color>" size="<size>"></cu-author-card>
```

```vue
<AuthorCard name="<name>" role="<role>" src="<url>" color="<color>" size="<size>" />
```

Los valores de `color` / `size` están en «Atributos» / «Props», abajo.

## Límites

- Presentación pura: no emite eventos, no tiene slots y no expone métodos.
- `name` es `required`; sin él no hay tarjeta útil.
- `src` manda sobre las iniciales y si la imagen falla no hay fallback (queda rota).
- Iniciales: con dos o más palabras, primera del primero y del último nombre; con una, sus dos primeras letras.
- Siempre avatar a la izquierda y texto a la derecha; no tiene `theme`.
- `role` vacío desaparece: no hay placeholder ni línea vacía.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `""` | Color semántico del avatar: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño del avatar: `sm`, `md`, `lg` |
| `role` | `string` | `""` | Rol o cargo que se muestra bajo el nombre (se oculta si está vacío) |
| `src` | `string` | `""` | URL de la imagen del avatar (reemplaza las iniciales) |
| `name` | `string` | `—` | Nombre del autor. Genera las iniciales automáticamente (primeras letras del primero y último nombre) |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
Ninguno.
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
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `""` | — |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | — |
| `role` | `string` | `""` | — |
| `src` | `string` | `""` | — |
| `name` | `string` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
Ninguno.
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
