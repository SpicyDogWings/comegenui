[← Volver](../README.md)

# `<cu-file-input>`

Input de archivo compacto con drag & drop, estilo idéntico a `<cu-input>`. Single file, sin directorio, con validación de tipo y tamaño.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuFileInput.umd.js"></script>

<cu-file-input placeholder="Elige un archivo..." color="primary"></cu-file-input>
<cu-file-input accept="image/*" variant="outlined" id="miInput"></cu-file-input>
<cu-file-input disabled placeholder="Deshabilitado"></cu-file-input>

<script>
  const input = document.getElementById('miInput');
  input.addEventListener('update:modelValue', (e) => {
    console.log('Archivo:', e.detail?.name);
  });
  input.set(new File(['contenido'], 'ejemplo.txt'));
  console.log(input.get()?.name);
</script>
```

<!-- demo:file-input-uso -->

> **Drag & drop:** se puede soltar un archivo sobre el componente; durante el arrastre se ilumina el borde y el fondo (también al pasar sobre sus propios íconos y textos). Los directorios se descartan solos (`size === 0 && !type`) y la validación de `accept`/`max-size` también corre al soltar.

> **Teclado:** Enter o Espacio sobre el campo abren el diálogo. El botón de quitar y el nombre del archivo responden a su propio teclado (el botón de quitar no abre el diálogo). Después de procesar una selección el input nativo queda vacío, así que se puede volver a elegir el mismo archivo —por ejemplo después de un rechazo o de quitarlo—. Con `disabled` el nombre del archivo no abre una pestaña nueva.

## Colores

`color` tiñe el borde, el texto y el fondo según el tema activo, con los 6 nombres semánticos.

```html
<cu-file-input color="primary" variant="outlined" placeholder="primary"></cu-file-input>
<cu-file-input color="secondary" variant="outlined" placeholder="secondary"></cu-file-input>
<cu-file-input color="neutral" variant="outlined" placeholder="neutral"></cu-file-input>
<cu-file-input color="success" variant="outlined" placeholder="success"></cu-file-input>
<cu-file-input color="warning" variant="outlined" placeholder="warning"></cu-file-input>
<cu-file-input color="danger" variant="outlined" placeholder="danger"></cu-file-input>
```

<!-- demo:file-input-colores -->

## Variantes

`variant` decide el aspecto del campo con las 4 variantes de campo (`outlined` es el default).

```html
<cu-file-input color="primary" variant="outlined" placeholder="outlined"></cu-file-input>
<cu-file-input color="primary" variant="soft" placeholder="soft"></cu-file-input>
<cu-file-input color="primary" variant="ghost" placeholder="ghost"></cu-file-input>
<cu-file-input color="primary" variant="subtle" placeholder="subtle"></cu-file-input>
```

<!-- demo:file-input-variantes -->

## Estados

`disabled` y `read-only` cortan click, drag y drop; `disabled` además atenúa el componente y esconde el botón de quitar.

```html
<cu-file-input disabled placeholder="Deshabilitado"></cu-file-input>
<cu-file-input read-only placeholder="Solo lectura"></cu-file-input>
```

<!-- demo:file-input-estados -->

## Validación

`accept` y `max-size` se anuncian en el placeholder y se aplican tanto en el diálogo nativo como al soltar; si un archivo no pasa, aparece una `Alert` danger debajo con el motivo.

```html
<cu-file-input accept="image/*" placeholder="Imagen"></cu-file-input>
<cu-file-input accept=".pdf,.doc,.docx" placeholder="Documento"></cu-file-input>
<cu-file-input accept="image/*,.pdf" max-size="1048576" placeholder="Imagen o PDF hasta 1 MB"></cu-file-input>
```

<!-- demo:file-input-validacion -->

> No soporta `multiple`, `directory` ni `directory-deep`: para eso está `<cu-file-input-zone>`. Al hacer click en el nombre del archivo, se abre en una pestaña nueva.

## Interacción

`update:modelValue` avisa cada cambio de archivo (con el `File` o `null`) y `get()`, `set()`, `reset()`, `focus()` y `trigger()` manejan la selección por código.

```html
<cu-file-input id="miInput" placeholder="Archivo por API"></cu-file-input>

<script>
  const input = document.getElementById('miInput');

  input.set(new File(['contenido'], 'por-api.txt', { type: 'text/plain' }));
  console.log(input.get()?.name);

  input.focus();     // enfoca el contenedor
  input.trigger();   // abre el selector nativo
  input.reset();     // limpia la selección

  input.addEventListener('update:modelValue', (e) => {
    console.log('Archivo:', e.detail?.name ?? null);
  });
</script>
```

<!-- demo:file-input-metodos -->

## Atributos

<!--@include: ../partials/file-input/props-vanilla.md-->

> **Atributos en HTML:** van en kebab-case: `readOnly` → `read-only`, `maxSize` → `max-size`.

## Eventos

<!--@include: ../partials/file-input/eventos.md-->

## Slots

<!--@include: ../partials/file-input/slots.md-->

## Métodos expuestos

<!--@include: ../partials/file-input/metodos-vanilla.md-->
