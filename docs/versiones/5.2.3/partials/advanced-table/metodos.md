| Método | Descripción |
| ------ | ------ |
| `updateRow` | Actualiza una fila por índice con los campos indicados. |
| `getData` | Devuelve una copia de las filas actuales, opcionalmente filtradas. |
| `getRow` | Devuelve una copia de la fila en el índice indicado. |
| `removeRow` | Elimina la fila en el índice indicado. |
| `addRow` | Agrega una fila al final si respeta las columnas existentes. |
| `pushData` | Agrega varias filas al final si respetan las columnas existentes. |
| `getExportData` | Columnas exportables y **valores crudos** de las filas (sin `cell`, badges ni botones). `scope: "all"` (default) usa todas las filas de `data`; `"visible"` usa lo renderizado ahora (página y filtros/búsqueda actuales). |
| `exportToExcel` | Punto de entrada de la exportación (lo usa el botón y lo pueden llamar los consumidores). Calcula `getExportData`, emite `export-click` siempre y `export-heavy` si `cellCount >= EXPORT_HEAVY_CELLS`, y devuelve el payload. **No genera ni descarga ningún archivo.** |
