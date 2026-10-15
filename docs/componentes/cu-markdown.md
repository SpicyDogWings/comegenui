[← Volver](../README.md)

# `<cu-markdown>`

Renderizador de Markdown como Custom Element. Convierte markdown en HTML semántico usando los
componentes internos de ComegenUI (tablas, code blocks, blockquotes, listas, headings, párrafos).

## Uso en HTML plano

````html
<script src="dist-libs/umd-core/CuMarkdown.umd.js"></script>

<cu-markdown>
# Título

Párrafo con **negrita**, *cita*, y `código inline`.

- Item 1
- Item 2

> Blockquote

```js
const x = 1;
```

| Col A | Col B |
|-------|-------|
| a     | b     |
</cu-markdown>
````

<!-- demo:markdown-uso -->

> El contenido se pasa como **texto dentro del tag**, no como prop, y se parsea **una vez al
> montarse**: para actualizarlo hay que reemplazar el texto interno y volver a montar.
> Las tablas se renderizan con `<cu-table>`, los code blocks con `<cu-code-block>`, el HTML se
> sanitiza con DOMPurify y los tokens del tema se inyectan en el shadow DOM.

## Encabezados

Al terminar de parsear, el componente emite `parsed` con los ids de los encabezados (en
`e.detail`); `headingIds()` los devuelve cuando los necesites. El `id` es el que queda en cada
heading, así que sirve para anclas.

```html
<cu-markdown id="doc">
# Introducción

Texto del documento.

## Detalles
</cu-markdown>

<script>
  const doc = document.getElementById('doc');

  doc.addEventListener('parsed', (e) => console.log('parsed:', e.detail));

  customElements.whenDefined('cu-markdown').then(() => {
    console.log('headingIds:', doc.headingIds()); // ["introduccion", "detalles"]
  });
</script>
```

<!-- demo:markdown-encabezados -->

> `headingIds()` sólo está disponible cuando el tag ya está definido: esperá a
> `customElements.whenDefined('cu-markdown')` antes de llamarlo.

## Atributos

<!--@include: ../partials/markdown/props.md-->

## Eventos

<!--@include: ../partials/markdown/eventos.md-->

## Slots

<!--@include: ../partials/markdown/slots.md-->

## Métodos expuestos

<!--@include: ../partials/markdown/metodos.md-->
