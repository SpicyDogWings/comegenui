| Método | Descripción |
| ------ | ------ |
| `open` | Abre el panel. |
| `close` | Cierra el panel. |
| `toggle` | Alterna el panel. |
| `getValue` | Devuelve la fecha seleccionada (modo simple). |
| `setValue` | Setea la fecha seleccionada y emite change (modo simple). |
| `clear` | Limpia la selección. En modo simple cierra el panel; en rango lo deja abierto. |
| `getStartDate` | Devuelve la fecha de inicio (solo con calendario de rango). |
| `getEndDate` | Devuelve la fecha de fin (solo con calendario de rango). |
| `setRange` | Setea el rango completo y emite los cambios (solo con calendario de rango). |
| `getFormattedValue` | Devuelve la fecha seleccionada formateada con `value-format` (modo simple); `null` sin `value-format` o sin fecha. |
| `getFormattedStartDate` | Devuelve el inicio del rango formateado con `value-format` (modo rango). |
| `getFormattedEndDate` | Devuelve el fin del rango formateado con `value-format` (modo rango). |
| `isOpen` | Indica si el panel está abierto. |
