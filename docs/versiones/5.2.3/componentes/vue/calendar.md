[← Volver](../README.md)

# `Calendar`

Calendario de mes: muestra el mes actual y/o seleccionado con sus días distribuidos en **7 columnas** que se reparten todo el ancho disponible del contenedor. Navegación por meses, día de hoy, límites `min`/`max` y dos modos de selección: `single` (una fecha) o `range` (inicio + fin con FSM propia).

## Formato de fechas

Igual que `MonthSlider` / `YearSlider`: `""`, valores inválidos (`NaN`) y entradas vacías se tratan como **sin fecha**. El string `"YYYY-MM-DD"` se parsea como **fecha local** (evita el desfase UTC).

```js
// Válidos
'2026-08-11'   // fecha completa
'2026-08'      // mes (se normaliza al día 1)
2026           // ⚠️ número = timestamp (Date(2026) ≈ 1970), NO es un año
```

> A diferencia de los sliders (que ignoran el día), el calendario **conserva el día** de `modelValue`.

## Uso en Vue

```vue
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
import { ref } from "vue";

const fecha = ref("2026-08-11");

function onSelect(date: Date) {
  console.log("Seleccionado:", date.toISOString().slice(0, 10));
}
</script>

<template>
  <Calendar v-model="fecha" color="primary" @select="onSelect" />
</template>
```

En HTML plano, cargá el bundle `CuCalendar` (ver [ficha vanilla](/componentes/cu-calendar)).

## Ancho (7 columnas)

Los días se distribuyen en `grid-template-columns: repeat(7, 1fr)`: **7 columnas iguales que se reparten el ancho que mida el contenedor**. Si el contenedor es de 280px cada columna mide 40px; si es de 500px, ~71px. Cada día usa `aspect-ratio: 1` para mantenerse cuadrado.

```vue
<template>
  <!-- Ocupa todo el ancho disponible -->
  <Calendar style="width: 100%; max-width: 420px;" />

  <!-- Ancho fijo -->
  <Calendar style="width: 280px;" />
</template>
```

## Colores

`color` define el color del día seleccionado y el acento del header: `primary` (**default**), `secondary`, `neutral`, `success`, `warning`, `danger`.

```vue
<template>
  <Calendar color="primary" model-value="2026-08-11" />
  <Calendar color="secondary" model-value="2026-08-11" />
  <Calendar color="neutral" model-value="2026-08-11" />
  <Calendar color="success" model-value="2026-08-11" />
  <Calendar color="warning" model-value="2026-08-11" />
  <Calendar color="danger" model-value="2026-08-11" />
</template>
```

## Variantes del día seleccionado

El día seleccionado usa la variante elegida: `solid`, `outlined`, `soft` (**default**) o `subtle`. **La variante `ghost` no existe**: su look (transparente + número en color) es el mismo que el del día de hoy y confundía.

El **día de hoy** se muestra como ghost: número en el color accent, sin fondo (si hoy coincide con la selección, gana la variante de seleccionado):

```vue
<template>
  <Calendar model-value="2026-08-11" variant="solid" />
  <Calendar model-value="2026-08-11" variant="outlined" />
  <Calendar model-value="2026-08-11" variant="soft" />
  <Calendar model-value="2026-08-11" variant="subtle" />
</template>
```

## Controles de mes (reutiliza `MonthSlider`)

El header del calendario **reutiliza el componente `MonthSlider` del repo**: chevrons prev/next mes, label con **drag** para navegar meses, año automático cuando navegás a otro año, y navegación de año opcional. Las props `monthFormat`, `yearFormat` y `locale` se delegan tal cual al slider.

```vue
<template>
  <!-- Con saltos de año (botones « ») y mes abreviado -->
  <Calendar year-navigation month-format="MMM" year-format="yy" />

  <!-- Solo mes: drag sobre el label para navegar -->
  <Calendar />
</template>
```

- **`year-navigation`** (default `false`): agrega los botones `«` / `»` para saltar de año.
- **Drag** sobre el label del mes navega meses (misma lógica que el slider).
- **Formato cerrado:** `month-format` acepta `MMMM`, `MMM`, `MM` o `M`; `year-format` acepta `yyyy` o `yy`. Un valor no soportado cae al default (`MMMM` / `yyyy`).
- **Año automático:** cuando el mes no es del año en curso, el año aparece al lado del mes con `year-format`; con `MMMM` y el año actual, se oculta.
- La navegación respeta `min`/`max` (los botones se deshabilitan en el borde).
- El label del header usa la misma `variant` y `color` del calendario.

> **`viewMonth`:** si lo pasás (`:view-month="…"`), el mes visible queda controlado desde afuera y la navegación emite `update:viewMonth`. Lo usa el `DualCalendar` interno.

## Límites min / max

Los días fuera del rango se renderizan deshabilitados (opacidad reducida, sin click) y la navegación se recorta al mes del límite (los chevrons se deshabilitan en el borde, como en los sliders):

```vue
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
import { ref } from "vue";

const min = ref("2026-01-10");
const max = ref("2026-12-24");
</script>

<template>
  <Calendar :min="min" :max="max" />
</template>
```

> El mes visible se re-ajusta automáticamente si `modelValue`, `min` o `max` cambian en runtime. Con `viewMonth` controlado desde afuera, el mes también se recorta al límite: el header y la grilla nunca muestran meses distintos.

## Teclado y accesibilidad

La grilla sigue el patrón **WAI-ARIA grid**: un solo día está en el orden de tabulación (el seleccionado, o el primero habilitado del mes) y el resto se alcanza con las flechas.

| Tecla | Acción |
|-------|--------|
| `←` / `→` | Día anterior / siguiente |
| `↑` / `↓` | Una semana antes / después |
| `Home` / `End` | Primer / último día de la semana visible (según `weekStart`) |
| `PageUp` / `PageDown` | Mes anterior / siguiente conservando el día (31 → 28/29 si el mes es más corto) |
| `Enter` / `Espacio` | Selecciona el día enfocado |
| `Escape` | Cierra el panel (dentro de `DatePicker`) y devuelve el foco al trigger |

- El foco se ve con un anillo del color accent; al cambiar de mes con el teclado, el calendario navega solo.
- El teclado **no** sale de `min`/`max` y **saltea** los días deshabilitados por `disabledWeekdays`/`disabledDates`: no son enfocables, así que el foco cae en el día habilitado siguiente (o anterior) en esa dirección; `PageUp`/`PageDown` caen en el día habilitado más cercano del mes.
- Cada día se anuncia con la fecha completa (`"Sábado, 15 de agosto de 2026"`), el estado de selección (`aria-selected`) y `aria-disabled` cuando no es elegible. El día de hoy lleva `aria-current="date"`.
- Los encabezados de la semana son `columnheader` con el nombre completo del día, y las celdas vacías completan la fila para que las columnas coincidan.

## Semana y locale

`week-start` decide el primer día de la semana (`1` = lunes, default; `0` = domingo) y `locale` los nombres de meses y días (`es` default).

```vue
<template>
  <!-- Semana que empieza en domingo -->
  <Calendar :week-start="0" />

  <!-- Mes en inglés -->
  <Calendar locale="en" />
</template>
```

## Días deshabilitados

Además de `min`/`max`, podés deshabilitar días de la semana (`disabledWeekdays`) o fechas puntuales (`disabledDates`). Se complementan entre sí:

```vue
<template>
  <!-- De → hasta (10 al 25) + fines de semana deshabilitados en el medio -->
  <Calendar min="2026-08-10" max="2026-08-25" :disabled-weekdays="[0, 6]" />

  <!-- Ventana + un feriado puntual -->
  <Calendar min="2026-08-10" max="2026-08-25" :disabled-dates="['2026-08-15', '2026-08-16']" />

  <!-- Solo fines de semana, todo el mes -->
  <Calendar :disabled-weekdays="[0, 6]" />
</template>
```

> Los días deshabilitados no se pueden seleccionar (ni con click, ni con el teclado, ni con `setValue`) y se ven atenuados. Son `<button disabled>`: el teclado los **saltea** (no son enfocables) y se anuncian como no disponibles.

## Grilla y borde

`grid` dibuja las líneas **interiores** entre los días y `border` el **marco exterior**; son combinables.

```vue
<template>
  <Calendar grid />
  <Calendar border />
  <Calendar grid border />
</template>
```

## Eventos (puntos)

Puntos bajo las fechas para señalar eventos (entradas a bodega, vencimientos, etc.). Cada evento es un objeto con `date` (fecha) y opcional `color` (nombre semántico: `primary`, `success`, `warning`, `danger`…).

```vue
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
import { ref } from "vue";

const events = ref([
  { date: "2026-08-03", color: "primary" },   // entrada a bodega
  { date: "2026-08-07", color: "success" },   // recepción
  { date: "2026-08-11", color: "warning" },   // vencimiento
  { date: "2026-08-15", color: "danger" },    // urgente
]);

// Múltiples puntos en un mismo día:
events.value.push({ date: "2026-08-11", color: "primary" });
</script>

<template>
  <Calendar :events="events" />
</template>
```

- Los puntos se muestran centrados bajo el número del día.
- Si un día tiene varios eventos, se muestran varios puntos en fila.
- Si no se especifica `color`, usa el `color` del calendario (`--cal-accent`).

## Rango (modo `range`)

El rango es un **modo** (`mode="range"`). Ahí `rangeStart`/`rangeEnd` son el **valor**: el primer click define el inicio, el segundo el fin (con swap si el fin es anterior) y la FSM vive en el propio calendar. **En `mode="single"` `rangeStart`/`rangeEnd` se ignoran por completo**: la única selección es el click simple.

```vue
<script setup lang="ts">
import Calendar from "@/components/controls/Calendar.vue";
import { ref } from "vue";

const rangeStart = ref("2026-09-03");
const rangeEnd = ref("2026-09-15");
</script>

<template>
  <Calendar
    mode="range"
    v-model:range-start="rangeStart"
    v-model:range-end="rangeEnd"
  />
</template>
```

- Clickear/navegar emite `update:rangeStart`/`update:rangeEnd`; `change`/`select` emiten `{ start, end }` al completar el rango.
- Al montar en modo rango, el mes visible es el de `rangeStart` (o el de `rangeEnd` si no hay inicio), no el mes actual: el rango ya elegido se ve de entrada.
- `getRange()` / `setRange()` / `clear()` manejan el rango por código. `clear()` es solo de rango: en `single` no hace nada (para limpiar la fecha usá `modelValue = null`).
- En `single`, para una fecha puntual usá `modelValue` (con `rangeStart`/`rangeEnd` presentes, se ignoran).

## Disabled

```vue
<template>
  <Calendar disabled />
</template>
```

## Props

<!--@include: ../../partials/calendar/props-vue.md-->

## Emits

<!--@include: ../../partials/calendar/eventos-vue.md-->

> En modo `single` los eventos emiten un `Date` normalizado a medianoche local; en `range`, un objeto `{ start, end }`.

## Slots

<!--@include: ../../partials/calendar/slots.md-->

## Expose

<!--@include: ../../partials/calendar/metodos-vue.md-->

## Interfaces

### `CalendarEvent`

```ts
interface CalendarEvent {
  date: string | number | Date
  color?: string
}
```
