[← Volver](../README.md)

# `<cu-file-input-zone>`

Selector de archivos con zona de drag & drop amplia, soporte para carpetas (recursivo con control de profundidad), múltiples archivos y preview de lista.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuFileInputZone.umd.js"></script>

<!-- Básico -->
<cu-file-input-zone placeholder="Arrastra un archivo"></cu-file-input-zone>

<!-- Múltiple + imágenes -->
<cu-file-input-zone color="primary" multiple accept="image/*"
  placeholder="Subí tus imágenes"></cu-file-input-zone>

<!-- Carpeta con scroll -->
<cu-file-input-zone directory max-height="200px"
  placeholder="Carpeta de documentos"></cu-file-input-zone>

<script>
  const zone = document.querySelector('cu-file-input-zone');
  zone.addEventListener('update:modelValue', (e) => {
    const files = e.detail;
    if (Array.isArray(files)) {
      console.log(`${files.length} archivos seleccionados`);
    }
  });
</script>
```

<!-- demo:file-input-zone-uso -->

## Colores

`color` tiñe el borde, el texto y los íconos según el tema activo, con los 6 nombres semánticos.

```html
<cu-file-input-zone color="primary" placeholder="primary"></cu-file-input-zone>
<cu-file-input-zone color="secondary" placeholder="secondary"></cu-file-input-zone>
<cu-file-input-zone color="neutral" placeholder="neutral"></cu-file-input-zone>
<cu-file-input-zone color="success" placeholder="success"></cu-file-input-zone>
<cu-file-input-zone color="warning" placeholder="warning"></cu-file-input-zone>
<cu-file-input-zone color="danger" placeholder="danger"></cu-file-input-zone>
```

<!-- demo:file-input-zone-colores -->

## Estados

`disabled` y `read-only` cortan click, drag y drop; `disabled` además atenúa la zona y esconde el botón de quitar de cada archivo.

```html
<cu-file-input-zone disabled placeholder="Deshabilitado"></cu-file-input-zone>
<cu-file-input-zone read-only placeholder="Solo lectura"></cu-file-input-zone>
```

<!-- demo:file-input-zone-estados -->

## Múltiples archivos y carpetas

`multiple` acepta varios archivos; `directory` activa el modo carpeta (e incluye `multiple` implícitamente) y `directory-deep` limita la recursión.

| `directory-deep` | Archivos que entran |
|-----------------|-------------------|
| `0` (default) | Solo archivos directos de la carpeta raíz |
| `1` | Raíz + 1 subnivel |
| `5` | Hasta 5 subniveles |
| `-1` | Sin límite (recursión completa) |

```html
<cu-file-input-zone multiple accept=".txt,.pdf" placeholder="Varios archivos"></cu-file-input-zone>
<cu-file-input-zone directory directory-deep="0" placeholder="Carpeta (sólo la raíz)"></cu-file-input-zone>
<cu-file-input-zone directory directory-deep="1" placeholder="Carpeta hasta 1 subnivel"></cu-file-input-zone>
<cu-file-input-zone directory directory-deep="-1" placeholder="Carpeta sin límite de profundidad"></cu-file-input-zone>
```

<!-- demo:file-input-zone-multiple-carpetas -->

> Los archivos con `size === 0 && !type` (directorios sueltos) se filtran solos. El listado usa `<cu-file-list>` por dentro: icono por extensión, nombre, tamaño y botón X para quitar; al hacer click en un archivo se abre en una pestaña nueva.

> Al soltar varios archivos se listan en el orden del drop (aunque la lectura de cada uno termine antes o después) y, si el origen del arrastre no expone `items`, se usan los `files` del `DataTransfer`. Enter/Espacio sobre la zona abren el diálogo; el botón X de cada fila no lo abre. El input nativo queda vacío al procesar, así que se puede volver a elegir el mismo archivo.

## Alto máximo

Sin `max-height` el listado crece con los archivos; con `max-height` (ej. `"200px"`) scrollea al excederlo.

```html
<cu-file-input-zone multiple placeholder="Sin max-height"></cu-file-input-zone>
<cu-file-input-zone multiple max-height="120px" placeholder="max-height: 120px"></cu-file-input-zone>
```

<!-- demo:file-input-zone-alto-maximo -->

## Validación

`accept` y `max-size` se anuncian en la zona y se aplican en el diálogo nativo y al soltar; cada archivo rechazado aparece listado en una `Alert` danger debajo.

```html
<cu-file-input-zone accept=".txt,.csv" placeholder="Sólo .txt y .csv"></cu-file-input-zone>
<cu-file-input-zone multiple accept="image/*" max-size="2097152"
  placeholder="Imágenes hasta 2 MB"></cu-file-input-zone>
```

<!-- demo:file-input-zone-validacion -->

## Interacción

`update:modelValue` avisa cada cambio (con un `File`, un `File[]` o `null`) y `get()`, `set()`, `reset()`, `focus()` y `trigger()` manejan la selección por código.

```html
<cu-file-input-zone id="miZona" multiple placeholder="Archivos por API"></cu-file-input-zone>

<script>
  const zona = document.getElementById('miZona');

  zona.set([
    new File(['uno'], 'a.txt', { type: 'text/plain' }),
    new File(['dos'], 'b.txt', { type: 'text/plain' }),
  ]);
  console.log(zona.get());

  zona.focus();     // enfoca la zona
  zona.trigger();   // abre el selector nativo
  zona.reset();     // limpia la selección

  zona.addEventListener('update:modelValue', (e) => {
    console.log('Archivos:', e.detail);
  });
</script>
```

<!-- demo:file-input-zone-metodos -->

## Atributos

<!--@include: ../partials/file-input-zone/props-vanilla.md-->

> **Atributos en HTML:** van en kebab-case: `readOnly` → `read-only`, `maxSize` → `max-size`, `directoryDeep` → `directory-deep`, `maxHeight` → `max-height`.

> **El Custom Element no expone prop `variant`.**

## Eventos

<!--@include: ../partials/file-input-zone/eventos.md-->

## Slots

<!--@include: ../partials/file-input-zone/slots.md-->

## Métodos expuestos

<!--@include: ../partials/file-input-zone/metodos-vanilla.md-->
