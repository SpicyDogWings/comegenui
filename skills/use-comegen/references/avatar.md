# Avatar — `<cu-avatar>` / `<Avatar>`

Avatar circular: imagen (`src`) o iniciales, con color semántico o elegido automáticamente por hash.
Para nombre + rol usá `cu-author-card`.

## Receta

- Con `src` mostrás una imagen; sin `src`, pasá `initials` (o contenido por el slot default).
- Si no pasás `color`, se elige uno determinístico a partir de las iniciales.
- `size` define el diámetro.

```html
<cu-avatar src="<url>" initials="<AB>" color="<color>" size="<size>"></cu-avatar>
```

```vue
<Avatar src="<url>" initials="<AB>" color="<color>" size="<size>" />
```

Los valores de `color` / `size` están en «Atributos» / «Props», abajo.

## Límites

- Sin `src`, `initials` ni contenido queda vacío: se ve el círculo de fondo, sin texto ni imagen.
- No emite eventos, no tiene slots con nombre y no expone métodos.
- `color` default `""`: sin él se resuelve por hash de las iniciales.
- No renderiza gradiente: el estilo sólo aplica un fondo plano.
- El slot default se suma a `initials`/`src`, no los reemplaza.
- Siempre circular; `size` sólo admite `sm`/`md`/`lg`.
- No tiene `theme`, `alt` ni manejo de error de imagen.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `""` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger`. Si se omite, se elige por hash de las iniciales |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Tamaño: `sm`, `md`, `lg` |
| `src` | `string` | `""` | URL de la imagen |
| `initials` | `string` | `""` | Texto que se muestra como iniciales cuando no hay `src` |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
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
| `src` | `string` | `""` | — |
| `initials` | `string` | `""` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
