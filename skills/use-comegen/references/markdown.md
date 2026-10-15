# Markdown — `<cu-markdown>` / `<Markdown>`

Renderiza Markdown a HTML semántico con los componentes internos (tablas, code blocks, blockquotes,
listas, headings, párrafos). No es un editor.

## Receta

- El markdown va como **texto del slot default**: no hay prop de contenido.
- Se parsea **una sola vez al montar**: para cambiar el contenido, remontá el componente.
- El color sale del tema del host; no hay prop `theme`.
- Escuchá `parsed` (ids de headings) y usá `headingIds()` para armar anclas.
- El HTML se sanitiza con DOMPurify; tablas y code blocks los renderizan los componentes internos.

```html
<cu-markdown id="<id>"><markdown></cu-markdown>
```

```vue
<Markdown @parsed="<handler>"><markdown></Markdown>
```

Sin atributos ni props: el contenido va por el slot default (ver «Atributos» / «Props», abajo).

## Límites

- No hay prop de contenido (`modelValue`/`content`).
- Se parsea una sola vez al montar: no es reactivo, hay que remontar.
- No es un editor ni emite eventos de edición.
- No acepta `color`, `variant` ni `size`.
- Sin slots de renderers: no se pueden customizar tablas, code blocks ni blockquotes.
- El idioma del code block sale del fence, no de una prop.
- No acepta `theme`: se define en `<html data-theme="…">`.

## API del custom element

### Atributos

<!-- @api:atributos -->
Ninguno.
<!-- /@api:atributos -->

### Eventos

<!-- @api:eventos -->
| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `parsed` | `string[]` | — |
<!-- /@api:eventos -->

### Slots

<!-- @api:slots -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots -->

### Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `headingIds` | Devuelve los ids generados para los encabezados parseados. |
<!-- /@api:metodos -->

## API del componente Vue

### Props

<!-- @api:props -->
Ninguna.
<!-- /@api:props -->

### Emits

<!-- @api:emits -->
| Evento | Payload | Descripción |
| ------ | ------ | ------ |
| `parsed` | `string[]` | — |
<!-- /@api:emits -->

### Slots

<!-- @api:slots-vue -->
| Slot | Descripción |
| ------ | ------ |
| `default` | — |
<!-- /@api:slots-vue -->

### Expose

<!-- @api:expose -->
| Método | Descripción |
| ------ | ------ |
| `headingIds` | Devuelve los ids generados para los encabezados parseados. |
<!-- /@api:expose -->
