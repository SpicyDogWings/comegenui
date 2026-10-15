# Card — `<cu-card>` / `<Card>`

Tarjeta que agrupa media, header (título/subtítulo), contenido y footer, con color y variante de
superficie. No es interactiva: para una tarjeta clickeable, envolvela vos.

## Receta

- Contenido por el **slot default**; `title` y `subtitle` arman el header.
- Media: `image` (URL) o slot `media` (el slot pisa a `image`).
- El slot `header` reemplaza por completo `title`/`subtitle`.
- `footer` sólo se renderiza si tiene contenido (no reserva el espacio).
- `variant` cambia la superficie; `layout="horizontal"` pone la media al costado.
- `color` tiñe la variante elegida.

```html
<cu-card title="<title>" subtitle="<subtitle>" image="<url>" color="<color>" variant="<variant>" layout="<layout>"><body><div slot="footer"><footer></div></cu-card>
```

```vue
<Card title="<title>" subtitle="<subtitle>" image="<url>" color="<color>" variant="<variant>" layout="<layout>"><body><template #footer><footer></template></Card>
```

Los valores de `color` / `variant` / `layout` están en «Atributos» / «Props», abajo.

## Límites

- No expone métodos y, en Vue, no emite eventos propios.
- No acepta `theme`: se define en `<html data-theme="…">`.
- `header` pisa `title`/`subtitle`; `media` (slot) pisa `image`.
- `layout="horizontal"` fija la media al 40% del ancho; no es configurable.
- No hay tamaño, padding ni radio configurables.
- `image` renderiza un `<img alt="">` sin `srcset`, `loading` ni atributos extra; para controlarla usá el slot `media`.
- El `click` del CE es el nativo del DOM, sin payload de negocio.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"ghost"` | `ghost` (default), `outlined`, `soft`, `subtle`, `solid` |
| `layout` | `"vertical" \| "horizontal"` | `"vertical"` | `vertical` (media arriba) o `horizontal` (media al costado) |
| `title` | `string` | `—` | Título del header |
| `subtitle` | `string` | `—` | Subtítulo bajo el título |
| `image` | `string` | `—` | URL de imagen que se muestra como media en la parte superior (o al costado con `layout="horizontal"`) |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `click` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `media` | — |
| `header` | — |
| `footer` | — |
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
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `variant` | `"solid" \| "outlined" \| "soft" \| "ghost" \| "subtle"` | `"ghost"` | — |
| `layout` | `"vertical" \| "horizontal"` | `"vertical"` | — |
| `title` | `string` | `—` | — |
| `subtitle` | `string` | `—` | — |
| `image` | `string` | `—` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
Ninguno.
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `media` | — |
| `header` | — |
| `default` | — |
| `footer` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
No expone métodos.
<!-- /@api:expose -->
