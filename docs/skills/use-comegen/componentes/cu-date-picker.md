# `<cu-date-picker>`

Selector de fecha: un botón-trigger que abre un **dropdown con un calendario adentro** (no es una lista de items seleccionables, es un box con el calendario). Usa `cu-calendar` internamente.

[← Volver](../SKILL.md)

---

---

## Formato

Tokens soportados en `format` (con `locale`):

| Token | Ejemplo (`es`) |
|-------|----------------|
| `dd` | `11` |
| `MM` | `08` |
| `MMM` | `ago` |
| `MMMM` | `Agosto` |
| `yy` | `26` |
| `yyyy` | `2026` |

```js
picker.format = 'MMMM yyyy';   // "Agosto 2026"
picker.format = 'dd-MM-yy';    // "11-08-26"
```

---

## Uso básico

```html
<script src="dist/CuDatePicker.umd.js"></script>

<cu-date-picker id="miPicker" placeholder="Elegí una fecha"></cu-date-picker>

<script>
  const picker = document.getElementById('miPicker');

  picker.addEventListener('change', (e) => {
    const d = e.detail;
    console.log(d ? d.toISOString().slice(0, 10) : '— sin fecha');
  });
</script>
```

### Con fecha inicial y límites

```html
<cu-date-picker id="miPicker" model-value="2026-08-11" min="2026-01-01" max="2026-12-31" format="dd/MM/yyyy"></cu-date-picker>
```

### Con label

El label se muestra sobre el picker y es clickeable — hace foco en el input y abre el panel:

```html
<cu-date-picker id="miPicker" label="Fecha de nacimiento"></cu-date-picker>
```

---

## Comportamiento

- **Trigger:** botón con ícono de calendario + fecha formateada (o placeholder) + chevron que rota al abrir.
- **Panel:** box con el `cu-calendar` adentro (ancho ~280px, o ~330px cuando `year-navigation` está activo — el header con botones de año necesita más espacio) y footer con "Hoy" y "Limpiar" (configurables con `today-button` y `clearable`).
- **Fuera del rango:** los días deshabilitados no se pueden elegir; "Hoy" y la selección manual respetan `min`/`max` del calendario.
- **Cierre:** al elegir un día, ir a "Hoy" o limpiar, el panel se cierra. También con click afuera o `Escape` (lo maneja el dropdown interno).

---

## Nota de implementación

`<cu-date-picker>` **compone** el `Dropdown.vue` genérico (slot `#toggle` con el botón-trigger + slot `#default` con el calendario) — exactamente como lo hace `<cu-select>` con sus opciones. No requiere modificar el componente de dropdown.

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `modelValue` | `string \| number \| Date \| null` | `null` | Fecha seleccionada |
| `min` | `string \| number \| Date \| null` | `null` | Fecha mínima seleccionable |
| `max` | `string \| number \| Date \| null` | `null` | Fecha máxima seleccionable |
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico del trigger y del día seleccionado del calendario interno (se pasa tal cual; `neutral` = neutral, ya no mapea a primary) |
| `variant` | `"soft" \| "outlined" \| "ghost" \| "subtle"` | `"soft"` | Variante del trigger: `outlined`, `soft`, `ghost`, `subtle`. En el calendario interno `ghost` se mapea a `soft` (el calendario ya no tiene ghost) |
| `disabled` | `boolean` | `false` | Deshabilita el picker completo |
| `placeholder` | `string` | `""` | Texto cuando no hay fecha (default: `"Seleccionar fecha..."`) |
| `locale` | `string` | `"es"` | Locale del calendario y nombres de mes |
| `weekStart` | `number` | `1` | Primer día de la semana (`0` domingo, `1` lunes) |
| `format` | `string` | `"dd/MM/yyyy"` | Formato de la fecha en el trigger (ver [Formato](#formato)) |
| `yearNavigation` | `string \| boolean` | `false` | Controles de mes del calendario interno: botones `«`/`»` de año |
| `monthFormat` | `string` | `"MMMM"` | Formato del mes en el header del calendario interno |
| `yearFormat` | `string` | `"yyyy"` | Formato del año en el header del calendario interno |
| `disabledWeekdays` | `string \| number[]` | `""` | Días de la semana no seleccionables (`0`=domingo … `6`=sábado). En HTML: `disabled-weekdays="0,6"` |
| `disabledDates` | `string \| (string \| Date)[]` | `""` | Fechas puntuales no seleccionables. En HTML: `disabled-dates="2026-08-15,2026-08-16"` |
| `events` | `CalendarEvent[]` | `[]` | Eventos a señalar con puntos bajo la fecha en el calendario interno (ver [Eventos](cu-calendar.md#eventos-puntos)). Se asigna como propiedad JS |
| `grid` | `boolean` | `false` | Líneas **interiores** (cuadrícula) entre los días del calendario interno |
| `border` | `boolean` | `false` | **Marco exterior** alrededor de la cuadrícula de días del calendario interno |
| `position` | `string` | `"bottom"` | `right` |
| `align` | `string` | `"start"` | `end` |
| `fixed` | `boolean` | `false` | Panel en `position: fixed` (útil en contenedores con overflow) |
| `clearable` | `boolean` | `true` | Muestra el botón "Limpiar" en el footer del panel |
| `todayButton` | `boolean` | `true` | Muestra el botón "Hoy" en el footer del panel |
| `label` | `string` | `""` | Texto del label sobre el picker |

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `select` | `Date` | Día clickeado en el calendario |
| `close` | — | El panel se cerró |
| `open` | — | El panel se abrió |
| `update:modelValue` | `null` | Cambio de fecha (al seleccionar, ir a "Hoy" o limpiar) |
| `change` | `null` | Alias de `update:modelValue` |

> Al limpiar, `update:modelValue`/`change` emiten `null`.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.open()` | Abre el panel del calendario. |
| `.close()` | Cierra el panel del calendario. |
| `.toggle()` | Alterna el panel del calendario. |
| `.getValue()` | Devuelve la fecha seleccionada. |
| `.setValue(value: string \| number \| Date \| null)` | Setea la fecha seleccionada y emite change. |
| `.clear()` | Limpia la fecha seleccionada. |
| `.isOpen()` | Indica si el panel está abierto. |

## Interfaces

### `CalendarEvent`

```ts
interface CalendarEvent {
  date: string | number | Date
  color?: string
}
```
