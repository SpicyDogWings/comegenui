# `<cu-file-input>`

Input de archivo compacto con drag & drop, estilo idéntico a `<cu-input>`. Single file, sin directorio, con validación de tipo y tamaño.

[← Volver](../README.md)

## Uso en HTML plano

```html
<script src="dist/CuFileInput.umd.js"></script>

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

---

## Drag & drop

Soporta arrastrar un solo archivo sobre el componente. Durante el drag se ilumina el borde y fondo. Los directorios se descartan automáticamente (`size === 0 && !type`).

---

## Notas

- No soporta `multiple`, `directory` ni `directory-deep` — usá `<cu-file-input-zone>` para esos casos.
- Al hacer click en el nombre del archivo seleccionado se abre en una nueva pestaña.
- La validación por `accept` y `maxSize` se aplica tanto en el diálogo nativo como al soltar archivos por drag.

---

## Atributos

<!-- @api:atributos -->
| Atributo | Tipo | Default | Descripción |
| ------ | ------ | ------ | ------ |
| `color` | `"primary" \| "secondary" \| "neutral" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"outlined" \| "soft" \| "ghost" \| "subtle"` | `"outlined"` | `outlined`, `soft`, `ghost`, `subtle` |
| `disabled` | `boolean` | `—` | Deshabilita click, drag y drop |
| `model-value` | `File \| null` | `null` | Archivo seleccionado (vía JS, no HTML) |
| `read-only` | `boolean` | `—` | Modo solo lectura |
| `placeholder` | `string` | `"Seleccionar archivo"` | Texto cuando no hay archivo |
| `max-size` | `number` | `—` | Tamaño máximo en bytes |
| `accept` | `string` | `—` | Tipos aceptados (ej: `"image/*"`, `".pdf,.doc"`) |
<!-- /@api:atributos -->

> **Atributos en HTML:** `readOnly` se escribe como `readonly`, `maxSize` como `max-size`.

## Eventos

<!-- @api:eventos -->
Ninguno.
<!-- /@api:eventos -->

## Slots

<!-- @api:slots -->
Ninguno.
<!-- /@api:slots -->

## Métodos expuestos

<!-- @api:metodos -->
| Método | Descripción |
| ------ | ------ |
| `get` | — |
| `set` | — |
| `reset` | — |
| `focus` | — |
| `trigger` | — |
<!-- /@api:metodos -->
