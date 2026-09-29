---
title: DatePicker
group: Formularios
---

<script setup lang="ts">
import DatePickerBasicExample from "../../examples/date-picker/DatePickerBasicExample.vue";
import DatePickerRangeExample from "../../examples/date-picker/DatePickerRangeExample.vue";
import DatePickerDualExample from "../../examples/date-picker/DatePickerDualExample.vue";
import DatePickerRestrictionsExample from "../../examples/date-picker/DatePickerRestrictionsExample.vue";
import DatePickerAppearanceExample from "../../examples/date-picker/DatePickerAppearanceExample.vue";
import DatePickerEventsExample from "../../examples/date-picker/DatePickerEventsExample.vue";
import DatePickerPositionExample from "../../examples/date-picker/DatePickerPositionExample.vue";
import DatePickerStatesExample from "../../examples/date-picker/DatePickerStatesExample.vue";
import DatePickerImperativeExample from "../../examples/date-picker/DatePickerImperativeExample.vue";
</script>

<!--@include: ../../../componentes/vue/date-picker.md-->

## Demos en vivo

### Básico (v-model single) y eventos

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DatePickerBasicExample />
  </div>
</ClientOnly>

### Rango (startDate / endDate)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DatePickerRangeExample />
  </div>
</ClientOnly>

### Rango dual (dualCalendar)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DatePickerDualExample />
  </div>
</ClientOnly>

### Restricciones (min, max, disabledWeekdays, disabledDates)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DatePickerRestrictionsExample />
  </div>
</ClientOnly>

### Apariencia y formato

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DatePickerAppearanceExample />
  </div>
</ClientOnly>

### Eventos y grilla (events, grid, border)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DatePickerEventsExample />
  </div>
</ClientOnly>

### Posición del panel (position, align, fixed)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DatePickerPositionExample />
  </div>
</ClientOnly>

### Estados y footer (disabled, clearable, todayButton)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DatePickerStatesExample />
  </div>
</ClientOnly>

### API imperativa (ref + métodos)

<ClientOnly>
  <div class="cu-demo cu-demo--stack">
    <DatePickerImperativeExample />
  </div>
</ClientOnly>
