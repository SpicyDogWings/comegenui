# `<cu-cells-importer>`

Importador de archivos tabulares (`.xlsx`, `.xls`, `.csv`) que parsea el contenido contra un esquema de columnas, valida cada celda y muestra los errores. Compone `<cu-file-input>` internamente.

Soporta matching de columnas **por label sin importar el orden** (`strict=false`, default) o **respetando el orden** (`strict`), y descarga de plantilla opcional.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `columns` | `CellColumn[]` | `[]` | Esquema de columnas (header esperado, tipo y reglas). **Obligatorio.** |
| `formats` | `string[]` | `[".xlsx",".csv"]` | Formatos deseados; se propagan al input y se muestran al usuario |
| `delimiter` | `string` | `","` | Delimitador para CSV |
| `hasHeader` | `boolean` | `true` | La primera fila del archivo es el encabezado |
| `strict` | `boolean` | `false` | `false` = match por label en cualquier orden; `true` = respeta el orden del schema |
| `sheet` | `string \| number` | `0` | Hoja a leer en `.xlsx` (índice o nombre) |
| `template` | `object` | `{ enabled:false, type:"csv", filename:"template" }` | Configura el botón de descarga de plantilla. `type: "csv" \| "xlsx"` |
| `color` | `string` | `"neutral"` | `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"outlined"` | `outlined`, `soft`, `ghost`, `subtle` |
| `placeholder` | `string` | `"Seleccionar archivo"` | Texto cuando no hay archivo |
| `disabled` | `boolean` | `false` | Deshabilita la selección |
| `readOnly` | `boolean` | `false` | Modo solo lectura |
| `maxSize` | `number` | — | Tamaño máximo en bytes |

> **Atributos en HTML:** `hasHeader` se escribe `has-header`, `readOnly` → `readonly`, `maxSize` → `max-size`. Los arrays y objetos (`columns`, `template`, `formats`, `sheet`) se asignan por JS.

### `CellColumn`

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `key` | `string` | Identificador de la columna |
| `label` | `string` | Header esperado en el archivo |
| `type` | `'string' \| 'integer' \| 'number' \| 'date' \| 'boolean' \| 'email'` | Coerción y validación de tipo |
| `required` | `boolean` | Rechaza celdas vacías |
| `min` / `max` | `number` | Rango para `number`/`integer` |
| `minLength` / `maxLength` | `number` | Largo para `string` |
| `pattern` | `string \| RegExp` | Regex de formato |
| `enum` | `(string \| number)[]` | Valores permitidos |
| `unique` | `boolean` | Rechaza duplicados en la columna |
| `validate` | `function` | Regla custom: `(value, row) => string \| boolean \| undefined` |

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|--------|----------------------|-------------|
| `parse` | `{ rows, headers, fileName }` | Al leer correctamente un archivo |
| `error` | `CellError[]` | Errores de validación del contenido |
| `change` | `File \| null` | Al seleccionar o quitar archivo |

`CellError`: `{ row, columnKey, columnLabel, message }`.

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.getRows()` | Filas parseadas |
| `.getHeaders()` | Encabezados del archivo |
| `.getErrors()` | Errores de validación |
| `.getFile()` | `File` actual o `null` |
| `.validate()` | Re-valida y devuelve errores |
| `.downloadTemplate()` | Descarga la plantilla configurada |
| `.reset()` | Limpia archivo, filas y errores |
| `.set(file)` | Asigna un archivo programáticamente |
| `.trigger()` | Abre el diálogo de selección |
| `.focus()` | Enfoca el input |

---

## Uso en HTML plano

```html
<script src="dist/CuCellsImporter.umd.js"></script>

<cu-cells-importer id="imp"></cu-cells-importer>

<script>
  customElements.whenDefined('cu-cells-importer').then(() => {
    const imp = document.getElementById('imp');

    imp.columns = [
      { key: 'name', label: 'Nombre', required: true },
      { key: 'age', label: 'Edad', type: 'integer', min: 0, max: 120 },
      { key: 'email', label: 'Email', type: 'email' },
    ];
    imp.template = { enabled: true, type: 'csv', filename: 'plantilla' };

    imp.addEventListener('parse', (e) => {
      console.log('Filas:', e.detail.rows);
    });
    imp.addEventListener('error', (e) => {
      console.log('Errores:', e.detail);
    });

    // Importación programática
    const csv = 'Nombre,Edad,Email\nJuan,30,juan@x.com\nAna,200,correo';
    imp.set(new File([csv], 'demo.csv', { type: 'text/csv' }));
    console.log(imp.getRows());
  });
</script>
```

## Notas

- **Orden de columnas:** con `strict=false` (default) el orden del archivo no importa — las columnas se matchean por `label`. Con `strict` se exige que el orden del archivo coincida con el del schema. Las columnas sobrantes del archivo se ignoran en ambos casos.
- **Validación:** `required`, tipos (`integer`/`number`/`date`/`boolean`/`email`), rangos `min`/`max`, largo `minLength`/`maxLength`, `pattern`, `enum` y `unique`. Reglas custom con `validate`.
- **Formato inválido / tamaño:** lo rechaza el `FileInput` interno (usa `accept` y `maxSize`).
- **Peso:** el parser de `.xlsx` (SheetJS) viaja solo en `CuCellsImporter.umd.js`; el resto de la lib no se ve afectado.