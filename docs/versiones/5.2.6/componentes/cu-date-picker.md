[← Volver](../README.md)

# `<cu-date-picker>`

Selector de fecha: un botón-trigger que abre un **dropdown con un calendario adentro** (no es una lista de items seleccionables, es un box con el calendario). `mode="single"` selecciona una fecha; `mode="range"` (o `dual-calendar`) un rango, con uno o dos meses. Compone `cu-calendar` (single o range) y el `DualCalendar` interno (2 meses en range), y administra los valores de ambos.

## Uso en HTML plano

```html
<script src="dist-libs/umd-core/CuDatePicker.umd.js"></script>

<cu-date-picker id="miPicker" placeholder="Elegí una fecha"></cu-date-picker>

<script>
  const picker = document.getElementById('miPicker');

  picker.addEventListener('change', (e) => {
    const d = e.detail;
    console.log(d ? d.toISOString().slice(0, 10) : '— sin fecha');
  });
</script>
```

<!-- demo:date-picker-uso-basico -->

En Vue, importá `DatePicker` de `@/components/form/DatePicker.vue` (ver [ficha Vue](/componentes/vue/date-picker)).

## Colores

`color` tiñe el trigger y el día seleccionado del calendario interno. Los 6 valores son
`primary`, `secondary`, `neutral` (**default**), `success`, `warning` y `danger`.

```html
<cu-date-picker color="primary" label="primary" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="secondary" label="secondary" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="neutral" label="neutral" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="success" label="success" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="warning" label="warning" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="danger" label="danger" model-value="2026-08-11"></cu-date-picker>
```

<!-- demo:date-picker-colores -->

## Variantes

`variant` cambia el aspecto del **trigger**: `outlined`, `soft` (**default**), `ghost` y
`subtle`. En el calendario interno `ghost` se mapea a `soft` (el calendario ya no tiene
ghost).

```html
<cu-date-picker color="primary" variant="outlined" label="outlined" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="primary" variant="soft" label="soft" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="primary" variant="ghost" label="ghost" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="primary" variant="subtle" label="subtle" model-value="2026-08-11"></cu-date-picker>
```

<!-- demo:date-picker-variantes -->

## Fecha inicial y límites

`model-value` fija la fecha de arranque (acepta `Date`, timestamp o `"YYYY-MM-DD"`), y `min`
/ `max` acotan qué días se pueden elegir.

```html
<cu-date-picker
  model-value="2026-08-11"
  min="2026-01-01"
  max="2026-12-31"
  format="dd/MM/yyyy"
></cu-date-picker>
```

<!-- demo:date-picker-con-fecha-inicial-y-limites -->

## Restricciones

Además de `min`/`max`, el calendario interno acepta `disabled-weekdays` (`0`=domingo …
`6`=sábado, en HTML una lista `"0,6"`) y `disabled-dates` (fechas puntuales `"YYYY-MM-DD"`
separadas por coma).

```html
<cu-date-picker
  min="2026-01-01"
  max="2026-12-31"
  disabled-weekdays="0,6"
  disabled-dates="2026-08-15,2026-08-16"
  placeholder="Sin fines de semana ni el 15/16 de agosto"
></cu-date-picker>
```

<!-- demo:date-picker-restricciones -->

## Modo rango

Con `mode="range"` el picker selecciona un rango: el primer click define el **inicio**, el segundo el **fin** (con swap automático si el fin es anterior). El panel queda abierto entre ambos clicks para ver el resaltado.

```html
<script src="dist-libs/umd-core/CuDatePicker.umd.js"></script>

<cu-date-picker id="rango" mode="range" label="Período"></cu-date-picker>

<script>
  const r = document.getElementById('rango');
  r.startDate = '2026-09-03';
  r.endDate = '2026-09-15';
  r.addEventListener('select', (e) => {
    const { start, end } = e.detail;
    console.log(start, end);
  });
</script>
```

<!-- demo:date-picker-modo-rango -->

## Rango dual

`dual-calendar` muestra **dos meses** y, por sí solo, **implica rango**: aunque `mode` quede en
`single`, el picker selecciona un rango. Con `year-navigation` el panel se agranda para los
botones de año.

```html
<cu-date-picker
  dual-calendar
  year-navigation
  start-date="2026-09-03"
  end-date="2026-09-15"
  placeholder="Rango a dos meses"
></cu-date-picker>
```

<!-- demo:date-picker-rango-dual -->

## Formato

`format` define los tokens de la fecha mostrada en el trigger (con `locale`):

| Token | Ejemplo (`es`) |
|-------|----------------|
| `dd` | `11` |
| `MM` | `08` |
| `MMM` | `ago` |
| `MMMM` | `Agosto` |
| `yy` | `26` |
| `yyyy` | `2026` |

`month-format` (`MMMM`/`MMM`/`MM`/`M`) y `year-format` (`yyyy`/`yy`) hacen lo propio en el
header del calendario; `week-start` elige el primer día de la semana (`0` domingo, `1` lunes,
default) y `year-navigation` muestra los botones de año.

```html
<cu-date-picker
  model-value="2026-08-11"
  label="Con formato"
  format="dd MMM yyyy"
  month-format="MMM"
  year-format="yy"
  year-navigation
  week-start="0"
></cu-date-picker>

<cu-date-picker
  model-value="2026-08-11"
  label="locale en"
  locale="en"
  month-format="MMMM"
  year-format="yyyy"
  placeholder="locale en"
></cu-date-picker>
```

<!-- demo:date-picker-formato-y-locale -->

## Valor formateado (`value-format`)

`format` es solo lo que se **muestra**. Si además querés el **valor** como string (p. ej. para mandarlo a un backend), seteá `value-format` con los mismos tokens: el picker emite `update:formattedValue`, `change-formatted` y `select-formatted` con el string en ese formato, y los métodos `getFormattedValue()`/`getFormattedStartDate()`/`getFormattedEndDate()` lo devuelven. Los eventos con `Date` siguen igual.

```html
<cu-date-picker id="picker" value-format="dd-MM-yyyy"></cu-date-picker>

<script>
  const picker = document.getElementById('picker');
  picker.addEventListener('change-formatted', (e) => {
    console.log(e.detail); // "11-08-2026"
  });
</script>
```

<!-- demo:date-picker-value-format -->

## Eventos y grilla

`events` pinta puntos bajo las fechas (se asigna como **propiedad JS**, array de
`{ date, color? }`); `grid` dibuja las líneas interiores y `border` el marco exterior de la
cuadrícula.

```html
<cu-date-picker id="conEventos" grid border placeholder="Con eventos y grilla"></cu-date-picker>

<script>
  const hoy = new Date();
  const iso = (offset) => {
    const d = new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + offset);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };

  document.getElementById('conEventos').events = [
    { date: iso(2), color: 'primary' },
    { date: iso(5), color: 'danger' },
  ];
</script>
```

<!-- demo:date-picker-eventos-y-grilla -->

## Label

El label se muestra sobre el picker y es clickeable — hace foco en el trigger (el botón que abre el
panel) y abre el panel:

```html
<cu-date-picker label="Fecha de nacimiento"></cu-date-picker>
```

<!-- demo:date-picker-con-label -->

## Posición del panel

`position` (`bottom` default, `top`, `left`, `right`), `align` (`start` default, `center`,
`end`) y `fixed` (panel en `position: fixed`, útil en contenedores con overflow) controlan
dónde y cómo se abre el panel.

```html
<cu-date-picker position="bottom" align="start" placeholder="bottom / start"></cu-date-picker>
<cu-date-picker position="top" align="end" placeholder="top / end"></cu-date-picker>
<cu-date-picker position="left" align="center" placeholder="left / center"></cu-date-picker>
<cu-date-picker position="right" align="start" fixed placeholder="right / start / fixed"></cu-date-picker>
```

<!-- demo:date-picker-posicion -->

## Estados y footer

`disabled` deja el picker inerte. El footer trae "Hoy" y "Limpiar": `today-button` y
`clearable` (ambos con default `true` en `single`) los prenden o apagan. Como son booleanos
con default `true`, en HTML plano se apagan **como propiedad** (`p.clearable = false`).

```html
<cu-date-picker disabled model-value="2026-08-11" placeholder="disabled"></cu-date-picker>
<cu-date-picker id="sinFooter" placeholder="Sin Hoy ni Limpiar"></cu-date-picker>

<script>
  const p = document.getElementById('sinFooter');
  p.clearable = false;
  p.todayButton = false;
</script>
```

<!-- demo:date-picker-estados -->

## Control programático

```html
<cu-date-picker id="single" placeholder="Instancia single"></cu-date-picker>
<cu-date-picker id="range" mode="range" placeholder="Instancia range"></cu-date-picker>

<script>
  const single = document.getElementById('single');
  const range = document.getElementById('range');

  single.open();
  single.close();
  single.toggle();
  single.getValue();            // Date | null
  single.setValue('2026-12-24'); // selecciona y emite change
  single.clear();               // limpia (emite null)

  range.setRange('2026-12-01', '2026-12-31');
  range.getStartDate();
  range.getEndDate();
</script>
```

<!-- demo:date-picker-control-programatico -->

## Comportamiento

- **Trigger:** botón con ícono de calendario + fecha formateada (o placeholder) + chevron que rota al abrir. Expone `aria-haspopup="dialog"` y `aria-expanded` según el panel; con `label`, su nombre accesible es `"<label>: <valor>"`.
- **Panel:** box con el calendario adentro (ancho ~280px, o ~330px cuando `year-navigation` está activo — el header con botones de año necesita más espacio) y footer con "Hoy" y "Limpiar" (configurables con `today-button` y `clearable`). En `mode="range"` con `dual-calendar` el panel mide ~580px (o ~700px con year-navigation) y muestra dos meses. El panel se anuncia como `role="dialog"` (adentro hay un grid, no menuitems).
- **Mes inicial:** en `single` abre en el mes de `model-value`; en `range` en el mes de `start-date` (o `end-date` si no hay inicio). Sin valor, el mes actual. Con `dual-calendar` los dos meses se recortan a `min`/`max`.
- **Fuera del rango:** los días deshabilitados no se pueden elegir; "Hoy" y la selección manual respetan `min`/`max` del calendario. Si hoy queda fuera de `min`/`max` (o cae en un día deshabilitado), el botón "Hoy" aparece deshabilitado y no emite nada.
- **Cierre:** al elegir un día en `single`, ir a "Hoy" o limpiar, el panel se cierra. En `range` queda abierto entre el primer y el segundo click para ver el resaltado. También cierra con click afuera o `Escape` (lo maneja el dropdown interno).
- **Foco:** al cerrarse el panel, si el foco estaba adentro (un día, "Hoy", "Limpiar") vuelve al trigger; `Escape` también deja el foco en el trigger.
- **Teclado:** el calendario interno se maneja con flechas, `Home`/`End` y `PageUp`/`PageDown` (ver [teclado y accesibilidad de `cu-calendar`](cu-calendar.md#teclado-y-accesibilidad)).

## Nota de implementación

`<cu-date-picker>` **compone** el `Dropdown.vue` genérico (slot `#toggle` con el botón-trigger + slot `#default` con el calendario). En `single` usa `cu-calendar`; en `range` usa `cu-calendar mode="range"` (un mes) o el `DualCalendar` interno (dos meses, navegación independiente). El DatePicker espeja los valores de sus hijos y re-emite la API pública (`start-date`/`end-date`, `setRange`, etc.). No requiere modificar el componente de dropdown.

## Atributos

<!--@include: ../partials/date-picker/props-vanilla.md-->

## Eventos

<!--@include: ../partials/date-picker/eventos-vanilla.md-->

> Al limpiar, `change` emite `null` (single) o `{ start: null, end: null }` (range).

## Slots

<!--@include: ../partials/date-picker/slots.md-->

## Métodos expuestos

<!--@include: ../partials/date-picker/metodos-vanilla.md-->

## Interfaces

### `CalendarEvent`

```ts
interface CalendarEvent {
  date: string | number | Date
  color?: string
}
```
