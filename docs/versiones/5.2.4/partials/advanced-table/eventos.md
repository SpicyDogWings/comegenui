| Evento | Payload (`e.detail`) | Descripción |
| ------ | ------ | ------ |
| `update:currentPage` | `number` | — |
| `update:itemsPerPage` | `number` | — |
| `update:search` | `string` | — |
| `edit-start` | — | — |
| `edit-save` | — | — |
| `edit-cancel` | — | — |
| `edit-error` | — | — |
| `export-click` | `ExportPayload` | Se emite al llamar `exportToExcel`, con el resumen (`scope`, filas, columnas, celdas y `heavy`). |
| `export-heavy` | `ExportPayload` | Se emite además de `export-click` cuando la exportación llega a `EXPORT_HEAVY_CELLS` celdas o más. |
