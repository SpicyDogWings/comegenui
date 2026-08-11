<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Calendar from "@/components/controls/Calendar.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const programmaticRef = ref<InstanceType<typeof Calendar> | null>(null);
const programmaticValue = ref<Date | null>(null);
const lastEvent = ref("");

function readValue() {
  programmaticValue.value = programmaticRef.value?.getValue() ?? null;
}

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const variants = ["solid", "outlined", "soft", "subtle"] as const;

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Controles de mes', id: 'month-controls' },
  { label: 'Seleccionado', id: 'selected' },
  { label: 'Min / Max', id: 'min-max' },
  { label: 'Días deshabilitados', id: 'disabled-days' },
  { label: 'Semana domingo', id: 'week-start' },
  { label: 'Locale', id: 'locale' },
  { label: 'Variantes', id: 'variants' },
  { label: 'Colores', id: 'colors' },
  { label: 'Programático', id: 'programmatic' },
  { label: 'Eventos', id: 'events' },
  { label: 'Disabled', id: 'disabled' },
];

function onEvent(name: string, payload: any) {
  lastEvent.value = `${name}: ${payload instanceof Date ? payload.toISOString().slice(0, 10) : JSON.stringify(payload)}`;
}
</script>

<template>
  <PlaygroundLayout title="Calendar" :outlineItems="outlineItems">
    <div class="playground-calendar">

      <section id="default" class="playground-section">
        <h2>Default</h2>
        <p class="playground-desc">
          Muestra el mes actual. Grilla de 7 columnas que se reparten el ancho del contenedor.
        </p>
        <div class="playground-calendar-col">
          <Calendar style="width: 300px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="month-controls" class="playground-section">
        <h2>Controles de mes (MonthSlider)</h2>
        <p class="playground-desc">
          El header reutiliza el <code>MonthSlider</code> del repo: chevrons prev/next, <strong>drag</strong> sobre el label, año automático y navegación de año opcional.
        </p>
        <div class="playground-calendar-col">
          <p class="playground-desc"><strong>Con <code>year-navigation</code></strong> → botones « » para saltar de año (los del slider):</p>
          <Calendar model-value="2026-08-11" year-navigation style="width: 300px;" />
          <p class="playground-desc"><strong>Con <code>year-navigation</code> + <code>month-format="MMM yyyy"</code>:</strong></p>
          <Calendar model-value="2026-08-11" month-format="MMM yyyy" year-navigation style="width: 300px;" />
          <p class="playground-desc"><strong>Default</strong> (solo prev/next mes + drag, año automático):</p>
          <Calendar model-value="2026-08-11" style="width: 300px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="selected" class="playground-section">
        <h2>Con fecha seleccionada</h2>
        <p class="playground-desc">
          <code>model-value="2026-08-11"</code> navega al mes y marca el día.
        </p>
        <div class="playground-calendar-col">
          <Calendar model-value="2026-08-11" style="width: 300px;" />
          <Calendar model-value="2027-02-20" variant="solid" style="width: 300px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="min-max" class="playground-section">
        <h2>Min / Max</h2>
        <p class="playground-desc">
          Días fuera del rango deshabilitados; la navegación se recorta al mes del límite.
        </p>
        <div class="playground-calendar-col">
          <Calendar min="2026-01-10" max="2026-12-24" model-value="2026-08-11" style="width: 300px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="disabled-days" class="playground-section">
        <h2>Días deshabilitados</h2>
        <p class="playground-desc">
          Además de <code>min</code>/<code>max</code> podés deshabilitar días de la semana (<code>disabled-weekdays</code>) o fechas puntuales (<code>disabled-dates</code>).
        </p>
        <div class="playground-calendar-col">
          <p class="playground-desc"><strong>Ventana min/max:</strong> solo se puede elegir del 10 al 25.</p>
          <Calendar min="2026-08-10" max="2026-08-25" model-value="2026-08-11" style="width: 300px;" />
          <p class="playground-desc"><strong>De → hasta con días deshabilitados en el medio:</strong> ventana del 10 al 25 + <code>disabled-weekdays="0,6"</code> (fines de semana).</p>
          <Calendar min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" model-value="2026-08-11" style="width: 300px;" />
          <p class="playground-desc"><strong>Fechas puntuales (feriado):</strong> <code>disabled-dates="2026-08-15,2026-08-16"</code>.</p>
          <Calendar disabled-dates="2026-08-15,2026-08-16" model-value="2026-08-11" style="width: 300px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="week-start" class="playground-section">
        <h2>Semana que empieza en domingo</h2>
        <div class="playground-calendar-col">
          <Calendar :week-start="0" model-value="2026-08-11" style="width: 300px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="locale" class="playground-section">
        <h2>Locale</h2>
        <div class="playground-calendar-col">
          <Calendar locale="en" model-value="2026-08-11" style="width: 300px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="variants" class="playground-section">
        <h2>Variantes del día seleccionado</h2>
        <div class="playground-calendar-row">
          <Calendar v-for="variant in variants" :key="variant" model-value="2026-08-11" :variant="variant" style="width: 240px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colores</h2>
        <div class="playground-calendar-row">
          <Calendar v-for="color in colors" :key="color" model-value="2026-08-11" :color="color" variant="solid" style="width: 240px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Control programático</h2>
        <div class="playground-calendar-row">
          <Button @click="programmaticRef?.nextMonth(); readValue()" color="primary" variant="solid">nextMonth()</Button>
          <Button @click="programmaticRef?.prevMonth(); readValue()" color="neutral" variant="ghost">prevMonth()</Button>
          <Button @click="programmaticRef?.goToMonth('2030-06-01'); readValue()" color="success" variant="soft">goToMonth('2030-06-01')</Button>
          <Button @click="programmaticRef?.setValue('2026-12-24'); readValue()" color="warning" variant="soft">setValue('2026-12-24')</Button>
        </div>
        <p class="playground-state">
          getValue(): <strong>{{ programmaticValue ? programmaticValue.toISOString().slice(0, 10) : '—' }}</strong>
        </p>
        <div class="playground-calendar-col">
          <Calendar ref="programmaticRef" style="width: 300px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="events" class="playground-section">
        <h2>Eventos</h2>
        <div class="playground-calendar-col">
          <Calendar
            style="width: 300px;"
            @select="(d: Date) => onEvent('select', d)"
            @change="(d: Date) => onEvent('change', d)"
          />
          <p class="playground-state">último evento: <strong>{{ lastEvent || '—' }}</strong></p>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <h2>Disabled</h2>
        <div class="playground-calendar-col">
          <Calendar :disabled="true" model-value="2026-08-11" style="width: 300px;" />
        </div>
      </section>

    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-calendar {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.playground-desc {
  margin: 0;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

.playground-calendar-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.playground-calendar-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
}

.playground-state {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  margin: 0;
}
</style>
