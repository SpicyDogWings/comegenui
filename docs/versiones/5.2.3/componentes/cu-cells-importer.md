[← Volver](../README.md)

# `<cu-cells-importer>`

Importador de archivos tabulares (`.xlsx`, `.xls`, `.csv`) que parsea el contenido contra un esquema de columnas, valida cada celda y muestra los errores. Compone `<cu-file-input>` internamente.

Soporta matching de columnas **por label sin importar el orden** (`strict=false`, default) o **respetando el orden** (`strict`), y descarga de plantilla opcional.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuCellsImporter.umd.js"></script>

<cu-cells-importer id="imp"></cu-cells-importer>

<script>
  customElements.whenDefined('cu-cells-importer').then(() => {
    const imp = document.getElementById('imp');

    imp.columns = [
      { key: 'name',  label: 'Nombre',  required: true },
      { key: 'dni',   label: 'DNI',     type: 'integer', min: 1000000, unique: true },
      { key: 'email', label: 'Email',   type: 'email' },
    ];

    imp.addEventListener('parse', (e) => {
      console.log('Filas:', e.detail.rows);
    });
    imp.addEventListener('error', (e) => {
      console.log('Errores:', e.detail);
    });

    // Importación programática
    const csv = 'Nombre,DNI,Email\nJuan,30500000,juan@x.com\n';
    imp.set(new File([csv], 'demo.csv', { type: 'text/csv' }));
    console.log(imp.getRows());
  });
</script>
```

En Vue, importá `CellsImporter` de `@/components/form/CellsImporter.vue` (ver [ficha Vue](/componentes/vue/cells-importer)).

<!-- demo:cells-importer-uso -->

> Todos los ejemplos de abajo asumen `columns` ya cargado (ver arriba).

## Plantilla

`template` activa el botón **Descargar plantilla** y define el formato del archivo generado. La plantilla se construye **siempre desde `columns`** (usa el `label` de cada columna como encabezado). El botón solo aparece si `enabled: true` **y** `columns.length > 0`; también se puede disparar con `.downloadTemplate()`.

El CSV se genera con el `delimiter` configurado (se puede reimportar con la misma config) y con BOM UTF-8 para que Excel respete los acentos.

```html
<!-- Plantilla CSV -->
<cu-cells-importer id="impCsv" color="primary" placeholder="Plantilla CSV"></cu-cells-importer>

<!-- Plantilla XLSX -->
<cu-cells-importer id="impXlsx" color="primary" placeholder="Plantilla XLSX"></cu-cells-importer>

<script>
  const columns = [
    { key: 'nombre', label: 'Nombre', required: true },
    { key: 'dni', label: 'DNI', type: 'integer' },
    { key: 'email', label: 'Email', type: 'email' },
  ];

  const csv = document.getElementById('impCsv');
  csv.columns = columns;
  csv.template = { enabled: true, type: 'csv', filename: 'plantilla-alumnos' };

  const xlsx = document.getElementById('impXlsx');
  xlsx.columns = columns;
  xlsx.template = { enabled: true, type: 'xlsx', filename: 'plantilla-alumnos' };

  // También por código: csv.downloadTemplate();
</script>
```

<!-- demo:cells-importer-plantilla -->

## Colores

`color` es un nombre semántico (`primary`, `secondary`, `neutral`, `success`, `warning`, `danger`) que tiñe el input y los botones internos.

```html
<cu-cells-importer color="primary" placeholder="primary"></cu-cells-importer>
<cu-cells-importer color="secondary" placeholder="secondary"></cu-cells-importer>
<cu-cells-importer color="neutral" placeholder="neutral"></cu-cells-importer>
<cu-cells-importer color="success" placeholder="success"></cu-cells-importer>
<cu-cells-importer color="warning" placeholder="warning"></cu-cells-importer>
<cu-cells-importer color="danger" placeholder="danger"></cu-cells-importer>
```

<!-- demo:cells-importer-colores -->

## Variantes

`variant` decide el aspecto del input: `outlined` (**default**; borde), `soft` (fondo tenue), `ghost` (transparente) y `subtle` (tenue con borde). No aplica con `input-type="zone"` (la zona no tiene variantes).

```html
<cu-cells-importer color="primary" variant="outlined" placeholder="outlined"></cu-cells-importer>
<cu-cells-importer color="primary" variant="soft" placeholder="soft"></cu-cells-importer>
<cu-cells-importer color="primary" variant="ghost" placeholder="ghost"></cu-cells-importer>
<cu-cells-importer color="primary" variant="subtle" placeholder="subtle"></cu-cells-importer>
```

<!-- demo:cells-importer-variantes -->

## Selector

`input-type` elige el selector: `input` (**default**; `<cu-file-input>` compacto) o `zone` (zona drag & drop, single file). `formats` y `max-size` se propagan al selector en ambos casos.

```html
<cu-cells-importer
  id="imp-zona"
  input-type="zone"
  color="primary"
  placeholder="Arrastrá tu CSV de productos"
  max-size="1048576"
></cu-cells-importer>

<script>
  const imp = document.getElementById('imp-zona');
  imp.columns = [/* ... */];
  imp.formats = ['.csv']; // los arrays van por JS
</script>
```

<!-- demo:cells-importer-zona -->

## Estados

`disabled` bloquea la selección; `readonly` (atributo `readonly`) deja ver el resultado sin poder cambiar el archivo.

```html
<cu-cells-importer color="primary" placeholder="habilitado"></cu-cells-importer>
<cu-cells-importer color="danger" variant="soft" disabled placeholder="disabled"></cu-cells-importer>
<cu-cells-importer readonly placeholder="readonly"></cu-cells-importer>
```

<!-- demo:cells-importer-estados -->

## Opciones de parseo

`delimiter` (CSV, default `,`), `has-header` (default `true`), `strict` (respeta el orden del schema), `sheet` (hoja de `.xlsx`, índice o nombre), `formats` (default `[".xlsx", ".csv"]`) y `max-size` (bytes) ajustan cómo se lee el archivo.

```html
<cu-cells-importer
  id="imp"
  delimiter=";"
  strict
  max-size="1048576"
></cu-cells-importer>

<script>
  const imp = document.getElementById('imp');
  imp.columns = [
    { key: 'nombre', label: 'Nombre', type: 'string', required: true },
    { key: 'edad', label: 'Edad', type: 'integer' },
  ];
  imp.hasHeader = false; // Boolean con default `true`: se apaga por JS
  imp.formats = ['.csv'];
  imp.sheet = 0;

  // Separador `;` y sin fila de encabezado: las columnas se mapean por posición.
  imp.set(new File(['Ana;30\nBeto;25\n'], 'sin-header.csv', { type: 'text/csv' }));
</script>
```

<!-- demo:cells-importer-parseo -->

> Con `strict=false` (default) el orden del archivo no importa: las columnas se matchean por `label` y las sobrantes se ignoran. Con `strict` se exige que el orden coincida con el del schema. Con `hasHeader: false`, las columnas se mapean por posición. Las celdas con formato de fecha de un `.xlsx` se leen como fechas (no como número de serie) y el BOM del CSV se descarta.

> `.xlsx` requiere SheetJS, que viaja solo en `CuCellsImporter.umd.js`; el resto de la lib no se ve afectado. Formato inválido o tamaño excedido los rechaza el selector interno.

## Validación

Cada `CellColumn` puede declarar reglas por celda. Si alguna falla, la fila queda marcada, los errores se listan en un `Collapse` (`danger`) con tabla paginada y buscador, y las advertencias van en su propio `Collapse` (`warning`).

```js
imp.columns = [
  { key: 'name',  label: 'Nombre',  required: true },
  { key: 'dni',   label: 'DNI',     type: 'integer', min: 1000000, unique: true },
  { key: 'email', label: 'Email',   type: 'email' },
  { key: 'code',  label: 'Código',  pattern: /^[A-Z]{2}-\d{3}$/ },
  { key: 'state', label: 'Estado',  enum: ['Activo', 'Inactivo'] },
];
```

<!-- demo:cells-importer-validacion -->

- **Reglas:** `required`, tipos (`integer`/`number`/`date`/`boolean`/`email`), rangos `min`/`max`, largo `minLength`/`maxLength`, `pattern`, `enum`, `unique` y `validate` custom.
- **`validate`:** devolvé un `string` (mensaje de error), `false` (error genérico) o `true`/`undefined` (ok). Recibís el valor ya convertido por `type` y la fila completa.
- El resumen de filas OK / con errores queda siempre visible; el `Collapse` de errores arranca abierto.

## Atributos

<!--@include: ../partials/cells-importer/props-vanilla.md-->

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

<!--@include: ../partials/cells-importer/eventos-vanilla.md-->

`CellError`: `{ row, columnKey, columnLabel, message }`.

## Slots

<!--@include: ../partials/cells-importer/slots.md-->

## Métodos expuestos

<!--@include: ../partials/cells-importer/metodos-vanilla.md-->
