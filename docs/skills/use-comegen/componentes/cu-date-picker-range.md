# `<cu-date-picker-range>`

Selector de rango de fechas: dos fechas (inicio + fin) con resaltado del período en el calendario. API espejo de [`cu-date-picker`](cu-date-picker.md) pero para rangos.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|------|------|
| `startDate` | `string \| number \| Date \| null` | `null` | Fecha de inicio del rango |
| `endDate` | `string \| number \| Date \| null` | `null` | Fecha de fin del rango |
| `min` | `string \| number \| Date \| null` | `null` | Fecha mínima seleccionable |
| `max` | `string \| number \| Date \| null` | `null` | Fecha máxima seleccionable |
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"neutral"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"soft" \| "outlined" \| "ghost" \| "subtle"` | `"soft"` | Variante del trigger: `outlined`, `soft`, `ghost`, `subtle` |
| `disabled` | `boolean` | `false` | Deshabilita el picker |
| `placeholder` | `string` | `""` | Texto cuando no hay rango seleccionado |
| `locale` | `string` | `"es"` | Locale para nombres de mes y días |
| `weekStart` | `number` | `1` | Día en que arranca la semana: `0` = domingo, `1` = lunes |
| `format` | `string` | `"dd/MM/yyyy"` | Formato del rango en el trigger (tokens: `dd` `MM` `MMM` `MMMM` `yy` `yyyy`) |
| `yearNavigation` | `string \| boolean` | `false` | Muestra botones `«`/`»` para saltar de año |
| `monthFormat` | `string` | `"MMMM"` | Formato del mes en el header |
| `yearFormat` | `string` | `"yyyy"` | Formato del año en el header |
| `disabledWeekdays` | `string \| number[]` | `""` | Días de la semana no seleccionables (`0`=domingo … `6`=sábado) |
| `disabledDates` | `string \| (string \| Date)[]` | `""` | Fechas puntuales no seleccionables |
| `events` | `CalendarEvent[]` | `[]` | Eventos a señalar con puntos bajo la fecha (ver [cu-calendar](cu-calendar.md#eventos-puntos)) |
| `grid` | `boolean` | `false` | Líneas **interiores** (cuadrícula) entre los días de los calendarios internos |
| `border` | `boolean` | `false` | **Marco exterior** alrededor de la cuadrícula de días |
| `dualCalendar` | `boolean` | `false` | Muestra dos meses lado a lado |
| `position` | `string` | `"bottom"` |  |
| `align` | `string` | `"start"` |  |
| `fixed` | `boolean` | `false` |  |
| `clearable` | `boolean` | `true` | Muestra botón "Limpiar" |
| `todayButton` | `boolean` | `false` |  |
| `label` | `string` | `""` | Texto del label sobre el picker |

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `update:startDate` | `null` | Cambia la fecha de inicio |
| `update:endDate` | `null` | Cambia la fecha de fin |
| `select` | `null }` | Rango completo seleccionado |
| `change` | `null }` | Alias de `select` |
| `open` | — | El panel se abre |
| `close` | — | El panel se cierra |

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.open()` | Abre el panel |
| `.close()` | Cierra el panel |
| `.toggle()` | Abre/cierra el panel |
| `.getStartDate()` | null` con la fecha de inicio |
| `.getEndDate()` | null` con la fecha de fin |
| `.setRange(start: string \| number \| Date \| null, end: string \| number \| Date \| null)` | Define el rango (acepta string/number/Date) |
| `.clear()` | Limpia el rango |
| `.isOpen()` | Devuelve `boolean` |

---

## Uso básico

```html
<script src="dist/CuDatePickerRange.umd.js"></script>

<cu-date-picker-range id="rango" label="Período"></cu-date-picker-range>

<script>
  const r = document.getElementById('rango');

  // Definir rango
  r.startDate = '2026-09-03';
  r.endDate = '2026-09-15';

  // Escuchar cambios
  r.addEventListener('select', (e) => {
    const { start, end } = e.detail;
    console.log('Rango:', start?.toISOString().slice(0, 10), '→', end?.toISOString().slice(0, 10));
  });
</script>
```

---

## Selección de rango

El primer click define el **inicio**, el segundo define el **fin**. Si el segundo click es anterior al inicio, se swapea automáticamente:

```js
// Click 1: 2026-09-10 → startDate = 2026-09-10
// Click 2: 2026-09-05 → swapea: startDate = 2026-09-05, endDate = 2026-09-10
// Click 3: reinicia → startDate = nuevo día, endDate = null
```

---

## Dual Calendar

Con `dual-calendar`, se muestran dos meses lado a lado para visualizar mejor rangos que cruzan meses:

```html
<cu-date-picker-range dual-calendar></cu-date-picker-range>
```

---

## Control programático

```js
r.setRange('2026-09-01', '2026-09-30');
console.log(r.getStartDate().toISOString().slice(0, 10)); // "2026-09-01"
console.log(r.getEndDate().toISOString().slice(0, 10));   // "2026-09-30"
r.clear();
```

---

## Nota sobre el renderizado condicional

El panel del datepicker solo se renderiza cuando está abierto. Si asignás `startDate`/`endDate` con el panel cerrado, el resaltado del rango aparece la próxima vez que se abre el calendario (mount fresco del Calendar interno).
