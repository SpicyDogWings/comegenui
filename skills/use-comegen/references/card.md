# Card — `<cu-card>` / `<Card>`

Tarjeta que agrupa media, header (título/subtítulo), contenido y footer, con color y variante de
superficie. No es interactiva: para una tarjeta clickeable, envolvela vos.

## Receta

- Contenido por el **slot default**; `heading` arma el título del header (`subtitle` debajo).
  `heading` es el alias recomendado: no deja atributo `title` en el host, así que no aparece el
  tooltip nativo del navegador. `title` sigue funcionando (compatibilidad) y, si vienen ambos,
  gana `heading`.
- Media: `image` (URL) o slot `media` (el slot pisa a `image`).
- El slot `header` reemplaza por completo el título (`heading`/`title`) y `subtitle`.
- En el custom element, `title` queda como atributo del host: el navegador muestra su tooltip
  nativo sobre toda la tarjeta. Usá `heading` para evitarlo (deuda de compatibilidad).
- En el **custom element** los tres slots (`media`, `header`, `footer`) funcionan igual: el contenido
  va en el light DOM del host (`<div slot="media">…`), no hace falta ningún atributo extra.
- `footer` sólo se renderiza si tiene contenido (no reserva el espacio).
- `variant` cambia la superficie; `layout="horizontal"` pone la media al costado.
- `color` tiñe la variante elegida.

```html
<cu-card heading="<heading>" subtitle="<subtitle>" image="<url>" color="<color>" variant="<variant>" layout="<layout>"><body><div slot="footer"><footer></div></cu-card>
```

```vue
<Card heading="<heading>" subtitle="<subtitle>" image="<url>" color="<color>" variant="<variant>" layout="<layout>"><body><template #footer><footer></template></Card>
```

Los valores de `color` / `variant` / `layout` están en «Atributos» / «Props», abajo.

## Límites

- No expone métodos y, en Vue, no emite eventos propios.
- No acepta `theme`: se define en `<html data-theme="…">`.
- `header` pisa `title`/`subtitle`; `media` (slot) pisa `image`.
- Los bloques sin contenido no ocupan lugar: en `layout="horizontal"` sin `media` ni `image` no
  queda la columna vacía del 40 %.
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
| `title` | `string` | `—` | Título del header. Se mantiene por compatibilidad: el atributo `title` queda en el host y el navegador muestra su tooltip nativo sobre toda la tarjeta. Usá `heading` para evitar el tooltip. |
| `heading` | `string` | `—` | Título del header (alias preferido de `title`). Si vienen ambos, gana `heading`. |
| `subtitle` | `string` | `—` | Subtítulo bajo el título |
| `image` | `string` | `—` | URL de imagen que se muestra como media en la parte superior (o al costado con `layout="horizontal"`) |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
Ninguno.
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
| `title` | `string` | `—` | Título visible del header. Se mantiene por compatibilidad: en el custom element el atributo `title` queda en el host y el navegador muestra su tooltip nativo sobre toda la tarjeta. Usá `heading` para evitarlo. |
| `heading` | `string` | `—` | Título visible del header (alias preferido de `title`). Si vienen ambos, gana `heading`. |
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
