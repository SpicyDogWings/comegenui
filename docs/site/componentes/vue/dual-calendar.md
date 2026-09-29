---
title: DualCalendar
group: Controles
---

<script setup lang="ts">
import DualCalendarAppearanceExample from "../../examples/dual-calendar/DualCalendarAppearanceExample.vue";
import DualCalendarRangeExample from "../../examples/dual-calendar/DualCalendarRangeExample.vue";
import DualCalendarEventsExample from "../../examples/dual-calendar/DualCalendarEventsExample.vue";
import DualCalendarStatesExample from "../../examples/dual-calendar/DualCalendarStatesExample.vue";
import DualCalendarApiExample from "../../examples/dual-calendar/DualCalendarApiExample.vue";
</script>

<!--@include: ../../../componentes/vue/dual-calendar.md-->

## Demos en vivo

### Apariencia

<ClientOnly>
  <div class="cu-demo">
    <DualCalendarAppearanceExample />
  </div>
</ClientOnly>

### Datos (v-model:start-date / v-model:end-date)

<ClientOnly>
  <div class="cu-demo">
    <DualCalendarRangeExample />
  </div>
</ClientOnly>

### Eventos

<ClientOnly>
  <div class="cu-demo">
    <DualCalendarEventsExample />
  </div>
</ClientOnly>

### Estados y límites

<ClientOnly>
  <div class="cu-demo">
    <DualCalendarStatesExample />
  </div>
</ClientOnly>

### API imperativa

<ClientOnly>
  <div class="cu-demo">
    <DualCalendarApiExample />
  </div>
</ClientOnly>
