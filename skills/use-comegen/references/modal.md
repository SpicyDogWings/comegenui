# Modal — `<cu-modal>` / `<Modal>`

Diálogo con backdrop, `size`/`height`, slots `icon`/`default`/`footer` y apertura/cierre por
métodos. Para paneles laterales usá `<cu-side-over>`; para menús contextuales, `<cu-dropdown-menu>`.

## Receta

- Abrí/cerrá por métodos: `open()`, `close()`, `toggle()`, `isOpen()`. **No hay prop `open`** ni `v-model`.
- El cuerpo va al slot default; las acciones a `#footer` (`slot="footer"` en el CE). Sin footer, hay uno por defecto.
- Definí `title` y `description`; el acento con `color` y el tamaño con `size`/`height`.
- `persistent` bloquea el cierre por backdrop y `Escape`; con eso, el footer por defecto emite `cancel` y `accept`.
- Escuchá `opened` (terminó de abrir), `close` (inicia el cierre) y `closed` (cierre completo).

```html
<cu-modal id="<id>" title="<title>" color="<color>" size="<size>"><p><content></p><div slot="footer"><cu-button><label></cu-button></div></cu-modal>
```

```vue
<Modal ref="<ref>" title="<title>" color="<color>" size="<size>" @closed="<handler>"><p><content></p><template #footer><Button @click="<ref>?.close()"><label></Button></template></Modal>
```

Los valores de `color` / `size` / `height` están en «Atributos» / «Props», abajo.

## Límites

- Sin prop `open` ni `v-model`: la visibilidad sólo se maneja por métodos.
- `cancel` y `accept` sólo salen del footer por defecto; con un `#footer` propio no se emiten.
- Con `persistent` no hay botón X ni cierre por backdrop/Escape.
- `close` y `closed` se emiten juntos al cerrar (mismo watcher): no hay detección real del fin de la animación; `opened` sale al abrir.
- No hay slots para `title`/`description` (son props de texto) ni forma de customizar el backdrop.
- `size` y `height` se parecen a un enum de botón, pero incluyen `auto` y `full`.
- No tiene `variant` ni `theme`.

## API del custom element

### Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `size` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Ancho del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `height` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | Alto del modal: `auto`, `sm`, `md`, `lg`, `xl`, `full` |
| `persistent` | `boolean` | `—` | Si es `true`, no se cierra con click en el backdrop ni con `Escape` |
| `title` | `string` | `—` | Título del modal (se muestra en la cabecera) |
| `description` | `string` | `—` | Descripción bajo el título (texto secundario) |
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `close` | — | Cierra el modal. |
| `opened` | — | — |
| `closed` | — | — |
| `cancel` | — | — |
| `accept` | — | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `icon` | — |
| `default` | — |
| `footer` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el modal |
| `close` | Cierra el modal |
| `toggle` | Alterna visibilidad |
| `isOpen` | Devuelve el estado actual (`boolean`) |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
| Prop | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | — |
| `size` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | — |
| `title` | `string` | `""` | — |
| `description` | `string` | `""` | — |
| `height` | `"sm" \| "md" \| "lg" \| "auto" \| "xl" \| "full"` | `"auto"` | — |
| `persistent` | `boolean` | `false` | — |
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `close` | — | Cierra el modal. |
| `accept` | — | — |
| `opened` | — | — |
| `closed` | — | — |
| `cancel` | — | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `icon` | — |
| `default` | — |
| `footer` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `open` | Abre el modal. |
| `close` | Cierra el modal. |
| `toggle` | Alterna la visibilidad del modal. |
| `isOpen` | Devuelve true si el modal está abierto. |
<!-- /@api:expose -->
