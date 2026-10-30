| Método | Descripción |
| ------ | ------ |
| `open` | Abre, cierra o alterna el panel |
| `close` | — |
| `toggle` | — |
| `getValue` | Devuelve la fecha seleccionada (modo `single`) |
| `setValue` | Selecciona una fecha (string/number/Date) (modo `single`). Ignora los días deshabilitados (`min`/`max`/`disabled-weekdays`/`disabled-dates`) |
| `getStartDate` | Devuelve la fecha de inicio (modo `range`) |
| `getEndDate` | Devuelve la fecha de fin (modo `range`) |
| `getFormattedValue` | Devuelve la fecha seleccionada formateada con `value-format` (modo `single`) |
| `getFormattedStartDate` | Devuelve el inicio del rango formateado con `value-format` (modo `range`) |
| `getFormattedEndDate` | Devuelve el fin del rango formateado con `value-format` (modo `range`) |
| `setRange` | Setea el rango (string/number/Date) (modo `range`) |
| `clear` | Limpia la selección (emite `null`) |
| `isOpen` | Indica si el panel está abierto. |
