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
> Las tablas se renderizan con `<cu-table>`, los code blocks con `<cu-code-block>` y los tokens
> del tema los aporta el CSS del host. Los bloques de **HTML crudo se muestran como bloque de
> código** (no se ejecutan) y las etiquetas de HTML inline se descartan (el texto queda); el HTML que sí se interpreta —el
> embebido en blockquotes y celdas de tabla— se sanitiza con DOMPurify.

## Encabezados

Al terminar de parsear, el componente emite `parsed` con los ids de los encabezados (en
`e.detail`); `headingIds()` los devuelve cuando los necesites. El `id` es el que queda en cada
heading, así que sirve para anclas. Sale del texto visible —el formato no cuenta (`# **Hola**` →
`hola`)—, se numera si el texto se repite (`igual`, `igual-1`, `igual-2`) y cae en `section`
cuando el encabezado no deja texto.

```html
<cu-markdown id="doc">
# Introducción

Texto del documento.

## Detalles
</cu-markdown>

<script>
  const doc = document.getElementById('doc');

  // `parsed` se emite una sola vez, al montar: si el tag ya está definido cuando
  // corre este script, el evento ya pasó. Para leer los ids usá `headingIds()`.
  customElements.whenDefined('cu-markdown').then(() => {
    console.log('headingIds:', doc.headingIds()); // ["introduccion", "detalles"]
  });
</script>
```

Para escuchar `parsed` hay que registrar el listener **antes** de que el elemento se conecte:
crealo por JS, escuchá y recién ahí insertalo con su contenido.

```html
<script>
  const doc = document.createElement('cu-markdown');

  doc.addEventListener('parsed', (e) => console.log('parsed:', e.detail));

  doc.textContent = '# Introducción\n\nTexto del documento.\n\n## Detalles';
  document.body.appendChild(doc);
</script>
```

<!-- demo:markdown-encabezados -->

> `parsed` se emite **una sola vez, al montar**. Si el elemento ya se conectó, el evento ya pasó:
> usá `headingIds()`. Ese método sólo está disponible cuando el tag ya está definido: esperá a
> `customElements.whenDefined('cu-markdown')` antes de llamarlo.

## Atributos

<!--@include: ../partials/markdown/props.md-->

## Eventos

<!--@include: ../partials/markdown/eventos.md-->

## Slots

<!--@include: ../partials/markdown/slots.md-->

## Métodos expuestos

<!--@include: ../partials/markdown/metodos.md-->
