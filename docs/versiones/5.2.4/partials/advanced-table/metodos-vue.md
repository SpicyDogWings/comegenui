| Método | Descripción |
| ------ | ------ |
| `updateRow` | Actualiza una fila por índice con los campos indicados. |
| `getData` | Devuelve una copia de las filas actuales, opcionalmente filtradas. |
| `getRow` | Devuelve una copia de la fila en el índice indicado. |
| `removeRow` | Elimina la fila en el índice indicado. |
| `addRow` | Agrega una fila al final si respeta las columnas existentes. |
| `pushData` | Agrega varias filas al final si respetan las columnas existentes. |
| `getExportData` | Columnas exportables y **valores crudos** de las filas (sin `cell`, badges ni botones). `scope: "all"` (default) usa todas las filas de `data`; `"visible"` usa lo renderizado ahora (página y filtros/búsqueda actuales). |
| `exportToExcel` | Exporta y descarga el archivo. No depende de que el botón esté visible: funciona con `exportEnabled: false` y sin instanciar `<ExportButton>`. Emite `before-download` (cancelable), `export-click` y `export-heavy`; recién después genera y descarga el archivo, salvo que un listener haya cancelado. |
