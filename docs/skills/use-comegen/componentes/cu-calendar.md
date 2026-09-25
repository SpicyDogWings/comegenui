# `<cu-calendar>`

Calendario de mes: muestra el mes actual y/o seleccionado con sus días distribuidos en **7 columnas** que se reparten todo el ancho disponible del contenedor. Navegación por meses, día de hoy, día seleccionado y límites `min`/`max`.

[← Volver](../SKILL.md)

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

## Eventos (puntos)

Puntos bajo las fechas para señalar eventos (entradas a bodega, vencimientos, etc.). Cada evento es un objeto con `date` (fecha) y opcional `color` (nombre semántico: `primary`, `success`, `warning`, `danger`…).

> **Importante:** `events` se asigna como **propiedad JS** (`cal.events = [...]`), no como atributo HTML.

```js
const cal = document.getElementById('miCalendario');

cal.events = [
  { date: '2026-08-03', color: 'primary' },   // entrada a bodega
  { date: '2026-08-07', color: 'success' },   // recepción
  { date: '2026-08-11', color: 'warning' },   // vencimiento
  { date: '2026-08-15', color: 'danger' },    // urgente
];

// Múltiples puntos en un mismo día:
cal.events.push({ date: '2026-08-11', color: 'primary' });
```

- Los puntos se muestran centrados bajo el número del día.
- Si un día tiene varios eventos, se muestran varios puntos en fila.
- Si no se especifica `color`, usa el `color` del calendario (`--cal-accent`).

---

## Rango (resaltado de días)

Las props `rangeStart` y `rangeEnd` resaltan visualmente los días entre dos fechas. Útil para mostrar períodos selecciónados o rangos en un `<cu-date-picker-range>`.

```js
const cal = document.getElementById('miCalendario');

cal.rangeStart = '2026-09-03';
cal.rangeEnd = '2026-09-15';
```

- Los días entre inicio y fin se resaltan con fondo soft.
- Los extremos (inicio y fin) se resaltan con fondo accent.
- Se asignan como **propiedad JS** (`cal.rangeStart = [...]`, no como atributo HTML).

---

## Disabled

---

## Disabled

```html
<cu-calendar disabled></cu-calendar>
```

---

## Vista Vue

### Formato de fechas

Igual que `MonthSlider` / `YearSlider`: `""`, valores inválidos (`NaN`) y entradas vacías se tratan como **sin fecha**. El string `"YYYY-MM-DD"` se parsea como **fecha local** (evita el desfase UTC).

```js
// Válidos
'2026-08-11'   // fecha completa
'2026-08'      // mes (se normaliza al día 1)
2026           // ⚠️ número = timestamp (Date(2026) ≈ 1970), NO es un año
```

> A diferencia de los sliders (que ignoran el día), el calendario **conserva el día** de `modelValue`.

### Uso en Vue

```vue
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
import { ref } from "vue";

const fecha = ref('2026-08-11');

function onSelect(date: Date) {
  console.log('Seleccionado:', date.toISOString().slice(0, 10));
}
</script>

<template>
  <Calendar v-model="fecha" color="primary" @select="onSelect" />
</template>
```

### Grilla de 7 columnas

Los días se distribuyen en `grid-template-columns: repeat(7, 1fr)`: **7 columnas iguales que se reparten el ancho que mida el contenedor** (los "7 width"). Si el contenedor es de 280px cada columna mide 40px; si es de 500px, ~71px. Cada día usa `aspect-ratio: 1` para mantenerse cuadrado.

```vue
<template>
  <!-- Ocupa todo el ancho disponible -->
  <Calendar style="width: 100%; max-width: 420px;" />

  <!-- Ancho fijo -->
  <Calendar style="width: 280px;" />
</template>
```

### Controles de mes (reutiliza `MonthSlider`)

El header del calendario **reutiliza el componente `MonthSlider` del repo**: chevrons prev/next mes, label con **drag** para navegar meses, año automático cuando navegás a otro año, y navegación de año opcional. Las props `monthFormat`, `yearFormat` y `locale` se delegan tal cual al slider.

```vue
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
</script>

<template>
  <!-- Con saltos de año (botones « ») y mes abreviado -->
  <Calendar year-navigation month-format="MMM yyyy" />

  <!-- Solo mes: drag sobre el label para navegar -->
  <Calendar />
</template>
```

- **`year-navigation`** (default `false`): agrega los botones `«` / `»` para saltar de año (atributo booleano en HTML plano: `year-navigation`).
- **Drag** sobre el label del mes navega meses (misma lógica que el slider).
- **Año automático:** con `month-format="MMMM"` y el mes del año en curso, el año se oculta; al navegar a otro año aparece al lado del mes.
- La navegación respeta `min`/`max` (los botones se deshabilitan en el borde).
- El label del header usa la misma `variant` y `color` del calendario.

### Límites min / max

Los días fuera del rango se renderizan deshabilitados (opacidad reducida, sin click) y la navegación se recorta al mes del límite (los chevrons se deshabilitan en el borde, como en los sliders):

```vue
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
import { ref } from "vue";

const min = ref('2026-01-10');
const max = ref('2026-12-24');
</script>

<template>
  <Calendar :min="min" :max="max" />
</template>
```

> El mes visible se re-ajusta automáticamente si `modelValue`, `min` o `max` cambian en runtime.

### Semana y locale

```vue
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
</script>

<template>
  <!-- Semana que empieza en domingo -->
  <Calendar :week-start="0" />

  <!-- Mes en inglés -->
  <Calendar locale="en" />
</template>
```

### Variantes del día seleccionado

El día seleccionado usa la variante elegida (`solid`, `outlined`, `soft`, `subtle`). **La variante `ghost` se eliminó**: su look (transparente + número en color) es el mismo que el del día de hoy y confundía.

El **día de hoy** se muestra como ghost: número en el color accent, sin fondo (si hoy coincide con la selección, gana la variante de seleccionado):

```vue
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
</script>

<template>
  <Calendar model-value="2026-08-11" variant="solid"></Calendar>
  <Calendar model-value="2026-08-11" variant="outlined"></Calendar>
  <Calendar model-value="2026-08-11" variant="soft"></Calendar>
</template>
```

### Días deshabilitados

Además de `min`/`max`, podés deshabilitar días de la semana o fechas puntuales. Se complementan entre sí:

```vue
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
</script>

<template>
  <!-- De → hasta (10 al 25) + fines de semana deshabilitados en el medio -->
  <Calendar min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6"></Calendar>

  <!-- Ventana + un feriado puntual -->
  <Calendar min="2026-08-10" max="2026-08-25" disabled-dates="2026-08-15,2026-08-16"></Calendar>

  <!-- Solo fines de semana, todo el mes -->
  <Calendar disabled-weekdays="0,6"></Calendar>
</template>
```

> Los días deshabilitados no se pueden seleccionar (ni con click ni con `setValue`) y se ven atenuados.

### Eventos (puntos)

Puntos bajo las fechas para señalar eventos (entradas a bodega, vencimientos, etc.). Cada evento es un objeto con `date` (fecha) y opcional `color` (nombre semántico: `primary`, `success`, `warning`, `danger`…).

> **Importante:** en Vue, `events` se pasa como prop (`:events="events"`).

```vue
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
import { ref } from "vue";

const events = ref([
  { date: '2026-08-03', color: 'primary' },   // entrada a bodega
  { date: '2026-08-07', color: 'success' },   // recepción
  { date: '2026-08-11', color: 'warning' },   // vencimiento
  { date: '2026-08-15', color: 'danger' },    // urgente
]);

// Múltiples puntos en un mismo día:
events.value.push({ date: '2026-08-11', color: 'primary' });
</script>

<template>
  <Calendar :events="events" />
</template>
```

- Los puntos se muestran centrados bajo el número del día.
- Si un día tiene varios eventos, se muestran varios puntos en fila.
- Si no se especifica `color`, usa el `color` del calendario (`--cal-accent`).

### Rango (resaltado de días)

Las props `rangeStart` y `rangeEnd` resaltan visualmente los días entre dos fechas. Útil para mostrar períodos seleccionados o rangos en un `<cu-date-picker-range>`.

```vue
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
import { ref } from "vue";

const rangeStart = ref('2026-09-03');
const rangeEnd = ref('2026-09-15');
</script>

<template>
  <Calendar :range-start="rangeStart" :range-end="rangeEnd" />
</template>
```

- Los días entre inicio y fin se resaltan con fondo soft.
- Los extremos (inicio y fin) se resaltan con fondo accent.
- Se pasan como props (`:range-start` / `:range-end`).

### Disabled

### Disabled

```vue
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
</script>

<template>
  <Calendar disabled />
</template>
```

## Props

| Atributo | Tipo | Default | Descripción |
|------|------|------|------|
| `modelValue` | `string \| number \| Date \| null` | `null` | Fecha seleccionada. Acepta `Date`, timestamp o `"YYYY-MM-DD"` (ver [Formato de fechas](#formato-de-fechas)) |
| `min` | `string \| number \| Date \| null` | `null` | Fecha mínima seleccionable (días anteriores quedan deshabilitados) |
| `max` | `string \| number \| Date \| null` | `null` | Fecha máxima seleccionable |
| `color` | `"neutral" \| "primary" \| "secondary" \| "success" \| "warning" \| "danger"` | `"primary"` | Color semántico: `primary`, `secondary`, `neutral`, `success`, `warning`, `danger` |
| `variant` | `"soft" \| "solid" \| "outlined" \| "subtle"` | `"soft"` | Variante del día seleccionado: `solid`, `outlined`, `soft`, `subtle` (sin `ghost`: se confunde con el día de hoy) |
| `disabled` | `boolean` | `false` | Deshabilita todo el calendario |
| `disabledWeekdays` | `string \| number[]` | `""` | Días de la semana no seleccionables (`0`=domingo … `6`=sábado). En HTML plano: `disabled-weekdays="0,6"` |
| `disabledDates` | `string \| (string \| Date)[]` | `""` | Fechas puntuales no seleccionables `"YYYY-MM-DD"`. En HTML plano: `disabled-dates="2026-08-15,2026-08-16"` |
| `locale` | `string` | `"es"` | Locale para nombres de mes y días de la semana |
| `weekStart` | `number` | `1` | Día en que arranca la semana: `0` = domingo, `1` = lunes |
| `yearNavigation` | `string \| boolean` | `false` | Muestra botones `«`/`»` para saltar de año en el header |
| `monthFormat` | `string` | `"MMMM"` | Formato del mes en el header (tokens como MonthSlider) |
| `yearFormat` | `string` | `"yyyy"` | Formato del año en el header |
| `events` | `CalendarEvent[]` | `[]` | Eventos a señalar con puntos bajo la fecha (ver [Eventos](#eventos-puntos)). Se asigna como propiedad JS |
| `rangeStart` | `string \| number \| Date \| null` | `null` | Inicio del rango (resalta los días entre inicio y fin). Se asigna como propiedad JS |
| `rangeEnd` | `string \| number \| Date \| null` | `null` | Fin del rango. Se asigna como propiedad JS |
| `grid` | `boolean` | `false` | Dibuja líneas **interiores** (cuadrícula) entre los días. En HTML plano: `<cu-calendar grid>` |
| `border` | `boolean` | `false` | Dibuja el **marco exterior** alrededor de la cuadrícula de días. Combinable con `grid` |
| `viewMonth` | `string \| number \| Date \| null` | `null` | Mes visible (primer día) controlado desde afuera. Navegar emite `update:viewMonth`. Se asigna como propiedad JS |

> **API espejo de los sliders:** las fechas aceptan `Date`, timestamp numérico o string `"YYYY-MM-DD"`. En HTML plano los atributos llegan como string; `modelValue="2026-08-11"` funciona directo.

## Eventos

| Evento | Payload (`e.detail`) | Descripción |
|------|------|------|
| `select` | `Date` | Click en un día válido |
| `change` | `Date` | Fecha seleccionada (alias de `update:modelValue`) |
| `update:modelValue` | `Date` | Cambio de la fecha seleccionada |
| `update:viewMonth` | — |  |

> Los tres emiten un objeto `Date` normalizado a medianoche local.

## Slots

Ninguno.

## Métodos expuestos

| Método | Descripción |
|------|------|
| `.nextMonth()` | Va al mes siguiente (respeta `max`) |
| `.prevMonth()` | Va al mes anterior (respeta `min`) |
| `.goToMonth(value: string \| number \| Date)` | Navega al mes de la fecha dada |
| `.getValue()` | null` con la fecha seleccionada |
| `.setValue(value: string \| number \| Date \| null)` | Selecciona una fecha (acepta string/number/Date) |

## Interfaces

### `CalendarEvent`

```ts
interface CalendarEvent {
  date: string | number | Date
  color?: string
}
```
