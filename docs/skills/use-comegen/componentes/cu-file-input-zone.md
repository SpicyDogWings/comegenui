# `<cu-file-input-zone>`

Selector de archivos con zona de drag & drop amplia, soporte para carpetas (recursivo con control de profundidad), múltiples archivos y preview de lista.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `modelValue` | `File \| File[] \| null` | `null` | Archivo/s seleccionados |
| `color` | `primary \| secondary \| neutral \| success \| warning \| danger` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `placeholder` | `string` | `"Selecciona un archivo o arrastra aquí"` | Texto cuando no hay archivos |
| `disabled` | — | — | Deshabilita interacción |
| `readOnly` | — | — | Modo solo lectura |
| `accept` | — | — | Tipos aceptados (ej: `"image/*"`) |
| `multiple` | — | — | Permite múltiples archivos |
| `maxSize` | — | — | Tamaño máximo en bytes |
| `directory` | — | — | Activa modo carpeta (incluye `multiple` implícitamente) |
| `directoryDeep` | `number` | `0` | Niveles de recursión en carpetas: `0` = solo raíz, `1` = +1 subnivel, `-1` = sin límite |
| `maxHeight` | `string` | `""` | Altura máxima del listado (ej: `"200px"`). Sin scroll si se omite. |

> **Atributos en HTML:** `readOnly` → `readonly`, `maxSize` → `max-size`, `directoryDeep` → `directory-deep`, `maxHeight` → `max-height`.

> **El Custom Element no expone prop `variant`.**

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:modelValue` | `null` | Se emite al cambiar la selección |

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.get()` | Devuelve el/los archivo/s actual/es |
| `.set()` | Asigna archivos programáticamente |
| `.reset()` | Limpia la selección |
| `.focus()` | Enfoca la zona |
| `.trigger()` | Abre el diálogo nativo |

---

## Uso en HTML plano

```html
<script src="dist/CuFileInputZone.umd.js"></script>

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

---

## Directorio recursivo

Con `directory` activo, se puede controlar la profundidad con `directory-deep`:

| `directory-deep` | Archivos que entran |
|-----------------|-------------------|
| `0` (default) | Solo archivos directos de la carpeta raíz |
| `1` | Raíz + 1 subnivel |
| `5` | Hasta 5 subniveles |
| `-1` | Sin límite (recursión completa) |

El listado de archivos se renderiza con `<cu-file-list>` (componente interno) que muestra icono por extensión, nombre, tamaño y botón X para quitar archivos individuales. Al hacer click en un archivo se abre en una nueva pestaña.

---

## Notas

- `directory` activa automáticamente `multiple` internamente.
- Los directorios (archivos con `size === 0 && !type`) se filtran automáticamente.
- Con `max-height` activo, el listado tiene scroll vertical cuando excede esa altura.
