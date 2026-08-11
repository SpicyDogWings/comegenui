# `<cu-calendar>`

Calendario de mes: muestra el mes actual y/o seleccionado con sus días distribuidos en **7 columnas** que se reparten todo el ancho disponible del contenedor. Navegación por meses, día de hoy, día seleccionado y límites `min`/`max`.

[← Volver](../SKILL.md)

---

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `modelValue` | `string \| number \| Date \| null` | `null` | Fecha seleccionada. Acepta `Date`, timestamp o `"YYYY-MM-DD"` (ver [Formato de fechas](#formato-de-fechas)) |
| `min` | `string \| number \| Date \| null` | `null` | Fecha mínima seleccionable (días anteriores quedan deshabilitados) |
| `max` | `string \| number \| Date \| null` | `null` | Fecha máxima seleccionable |
| `color` | `string` | `"primary"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `string` | `"soft"` | Variante del día seleccionado: `solid`, `outlined`, `soft`, `subtle` (sin `ghost`: se confunde con el día de hoy) |
| `disabledWeekdays` | `number[] \| string` | `""` | Días de la semana no seleccionables (`0`=domingo … `6`=sábado). En HTML plano: `disabled-weekdays="0,6"` |
| `disabledDates` | `(string \| Date)[] \| string` | `""` | Fechas puntuales no seleccionables `"YYYY-MM-DD"`. En HTML plano: `disabled-dates="2026-08-15,2026-08-16"` |
| `disabled` | `boolean` | `false` | Deshabilita todo el calendario |
| `locale` | `string` | `"es"` | Locale para nombres de mes y días de la semana |
| `weekStart` | `number` | `1` | Día en que arranca la semana: `0` = domingo, `1` = lunes |
| `yearNavigation` | `boolean` | `false` | Muestra botones `«`/`»` para saltar de año en el header |
| `monthFormat` | `string` | `"MMMM"` | Formato del mes en el header (tokens como MonthSlider) |
| `yearFormat` | `string` | `"yyyy"` | Formato del año en el header |

> **API espejo de los sliders:** las fechas aceptan `Date`, timestamp numérico o string `"YYYY-MM-DD"`. En HTML plano los atributos llegan como string; `modelValue="2026-08-11"` funciona directo.

---

## Formato de fechas

Igual que `MonthSlider` / `YearSlider`: `""`, valores inválidos (`NaN`) y entradas vacías se tratan como **sin fecha**. El string `"YYYY-MM-DD"` se parsea como **fecha local** (evita el desfase UTC).

```js
// Válidos
'2026-08-11'   // fecha completa
'2026-08'      // mes (se normaliza al día 1)
2026           // ⚠️ número = timestamp (Date(2026) ≈ 1970), NO es un año
```

> A diferencia de los sliders (que ignoran el día), el calendario **conserva el día** de `modelValue`.

---

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|--------|----------------------|-------------|
| `update:modelValue` | `Date` | Cambio de la fecha seleccionada |
| `change` | `Date` | Fecha seleccionada (alias de `update:modelValue`) |
| `select` | `Date` | Click en un día válido |

> Los tres emiten un objeto `Date` normalizado a medianoche local.

---

## Métodos expuestos

| Método | Descripción |
|--------|-------------|
| `.nextMonth()` | Va al mes siguiente (respeta `max`) |
| `.prevMonth()` | Va al mes anterior (respeta `min`) |
| `.goToMonth(value)` | Navega al mes de la fecha dada |
| `.getValue()` | Devuelve `Date \| null` con la fecha seleccionada |
| `.setValue(value)` | Selecciona una fecha (acepta string/number/Date) |

---

## Uso básico

```html
<script src="dist/CuCalendar.umd.js"></script>

<cu-calendar id="miCalendario" color="primary"></cu-calendar>

<script>
  const cal = document.getElementById('miCalendario');

  // Seleccionar una fecha (string "YYYY-MM-DD")
  cal.modelValue = '2026-08-11';

  cal.addEventListener('select', (e) => {
    console.log('Seleccionado:', e.detail.toISOString().slice(0, 10));
  });
</script>
```

### Grilla de 7 columnas

Los días se distribuyen en `grid-template-columns: repeat(7, 1fr)`: **7 columnas iguales que se reparten el ancho que mida el contenedor** (los "7 width"). Si el contenedor es de 280px cada columna mide 40px; si es de 500px, ~71px. Cada día usa `aspect-ratio: 1` para mantenerse cuadrado.

```html
<!-- Ocupa todo el ancho disponible -->
<cu-calendar id="cal" style="width: 100%; max-width: 420px;"></cu-calendar>

<!-- Ancho fijo -->
<cu-calendar id="cal2" style="width: 280px;"></cu-calendar>
```

---

## Controles de mes (reutiliza `MonthSlider`)

El header del calendario **reutiliza el componente `MonthSlider` del repo**: chevrons prev/next mes, label con **drag** para navegar meses, año automático cuando navegás a otro año, y navegación de año opcional. Las props `monthFormat`, `yearFormat` y `locale` se delegan tal cual al slider.

```html
<!-- Con saltos de año (botones « ») y mes abreviado -->
<cu-calendar year-navigation month-format="MMM yyyy"></cu-calendar>

<!-- Solo mes: drag sobre el label para navegar -->
<cu-calendar></cu-calendar>
```

- **`year-navigation`** (default `false`): agrega los botones `«` / `»` para saltar de año (atributo booleano en HTML plano: `year-navigation`).
- **Drag** sobre el label del mes navega meses (misma lógica que el slider).
- **Año automático:** con `month-format="MMMM"` y el mes del año en curso, el año se oculta; al navegar a otro año aparece al lado del mes.
- La navegación respeta `min`/`max` (los botones se deshabilitan en el borde).
- El label del header usa la misma `variant` y `color` del calendario.

---

## Límites min / max

Los días fuera del rango se renderizan deshabilitados (opacidad reducida, sin click) y la navegación se recorta al mes del límite (los chevrons se deshabilitan en el borde, como en los sliders):

```js
cal.min = '2026-01-10';
cal.max = '2026-12-24';
```

```html
<cu-calendar min="2026-01-10" max="2026-12-24"></cu-calendar>
```

> El mes visible se re-ajusta automáticamente si `modelValue`, `min` o `max` cambian en runtime.

---

## Semana y locale

```html
<!-- Semana que empieza en domingo -->
<cu-calendar week-start="0"></cu-calendar>

<!-- Mes en inglés -->
<cu-calendar locale="en"></cu-calendar>
```

---

## Variantes del día seleccionado

El día seleccionado usa la variante elegida (`solid`, `outlined`, `soft`, `subtle`). **La variante `ghost` se eliminó**: su look (transparente + número en color) es el mismo que el del día de hoy y confundía.

El **día de hoy** se muestra como ghost: número en el color accent, sin fondo (si hoy coincide con la selección, gana la variante de seleccionado):

```html
<cu-calendar model-value="2026-08-11" variant="solid"></cu-calendar>
<cu-calendar model-value="2026-08-11" variant="outlined"></cu-calendar>
<cu-calendar model-value="2026-08-11" variant="soft"></cu-calendar>
```

---

## Días deshabilitados

Además de `min`/`max`, podés deshabilitar días de la semana o fechas puntuales. Se complementan entre sí:

```html
<!-- De → hasta (10 al 25) + fines de semana deshabilitados en el medio -->
<cu-calendar min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6"></cu-calendar>

<!-- Ventana + un feriado puntual -->
<cu-calendar min="2026-08-10" max="2026-08-25" disabled-dates="2026-08-15,2026-08-16"></cu-calendar>

<!-- Solo fines de semana, todo el mes -->
<cu-calendar disabled-weekdays="0,6"></cu-calendar>
```

> Los días deshabilitados no se pueden seleccionar (ni con click ni con `setValue`) y se ven atenuados.

---

## Disabled

```html
<cu-calendar disabled></cu-calendar>
```
