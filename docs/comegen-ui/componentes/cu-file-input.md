# `<cu-file-input>`

Input de archivo compacto con drag & drop, estilo idéntico a `<cu-input>`. Single file, sin directorio, con validación de tipo y tamaño.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `theme` | `string` | `""` | Tema: `light`, `dark`, `sigacadv2` (hereda de `<html data-theme>` si se omite) |
| `modelValue` | `File \| null` | `null` | Archivo seleccionado (vía JS, no HTML) |
| `color` | `string` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"none"` | `outlined`, `soft`, `ghost`, `subtle`, `none` |
| `placeholder` | `string` | `"Seleccionar archivo"` | Texto cuando no hay archivo |
| `disabled` | `boolean` | `false` | Deshabilita click, drag y drop |
| `readOnly` | `boolean` | `false` | Modo solo lectura |
| `accept` | `string` | — | Tipos aceptados (ej: `"image/*"`, `".pdf,.doc"`) |
| `maxSize` | `number` | — | Tamaño máximo en bytes |
| `hightContrast` | `boolean` | `false` | Alto contraste |

> **Atributos en HTML:** `readOnly` se escribe como `readonly`, `maxSize` como `max-size`.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|--------|----------------------|-------------|
| `file-change` | `File \| null` | Se dispara al seleccionar, soltar o limpiar un archivo |
| `update:modelValue` | `File \| null` | Para v-model |

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.get()` | Devuelve el `File` actual o `null` |
| `.set(file)` | Asigna un archivo programáticamente |
| `.reset()` | Limpia la selección |
| `.focus()` | Enfoca el input |
| `.trigger()` | Abre el diálogo nativo de selección de archivos |

---

## Uso en HTML plano

```html
<script src="dist/CuFileInput.umd.js"></script>

<cu-file-input placeholder="Elige un archivo..." color="primary"></cu-file-input>
<cu-file-input accept="image/*" variant="outlined" id="miInput"></cu-file-input>
<cu-file-input disabled placeholder="Deshabilitado"></cu-file-input>

<script>
  const input = document.getElementById('miInput');
  input.addEventListener('file-change', (e) => {
    console.log('Archivo:', e.detail?.name);
  });
  input.set(new File(['contenido'], 'ejemplo.txt'));
  console.log(input.get()?.name);
</script>
```

## Drag & drop

Soporta arrastrar un solo archivo sobre el componente. Durante el drag se ilumina el borde y fondo. Los directorios se descartan automáticamente (`size === 0 && !type`).

## Notas

- No soporta `multiple`, `directory` ni `directory-deep` — usá `<cu-file-input-zone>` para esos casos.
- Al hacer click en el nombre del archivo seleccionado se abre en una nueva pestaña.
- La validación por `accept` y `maxSize` se aplica tanto en el diálogo nativo como al soltar archivos por drag.
