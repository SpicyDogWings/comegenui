| Método | Descripción |
| ------ | ------ |
| `nextMonth` | Va al mes siguiente (respeta `max`) |
| `prevMonth` | Va al mes anterior (respeta `min`) |
| `goToMonth` | Navega al mes de la fecha dada |
| `getValue` | Devuelve la fecha seleccionada (modo `single`) |
| `setValue` | Selecciona una fecha (acepta string/number/Date). Ignora los días deshabilitados (`min`/`max`/`disabled-weekdays`/`disabled-dates`) |
| `getRange` | Devuelve el rango seleccionado (modo `range`) |
| `setRange` | Setea el rango (acepta string/number/Date) (modo `range`) |
| `clear` | Limpia el rango seleccionado (solo modo `range`; en `single` no hace nada) |
