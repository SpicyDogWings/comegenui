<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import Table from "@/components/data/Table.vue";
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
  { label: 'Eventos', id: 'events' },
  { label: 'Seleccionado', id: 'selected' },
  { label: 'Min / Max', id: 'min-max' },
  { label: 'Días deshabilitados', id: 'disabled-days' },
  { label: 'Semana domingo', id: 'week-start' },
  { label: 'Locale', id: 'locale' },
  { label: 'Variantes', id: 'variants' },
  { label: 'Colores', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Programático', id: 'programmatic' },
  {
    label: 'API',
    id: 'api',
    children: [
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
      { label: 'Interfaces', id: 'api-interfaces' },
    ],
  },
];

function onEvent(name: string, payload: any) {
  lastEvent.value = `${name}: ${payload instanceof Date ? payload.toISOString().slice(0, 10) : JSON.stringify(payload)}`;
}

const now = new Date();
const y = now.getFullYear();
const m = String(now.getMonth() + 1).padStart(2, '0');
const d = (day: number) => `${y}-${m}-${String(day).padStart(2, '0')}`;

const calendarEvents = [
  { date: d(3), color: 'primary' },
  { date: d(7), color: 'success' },
  { date: d(11), color: 'warning' },
  { date: d(15), color: 'danger' },
  { date: d(18), color: 'primary' },
  { date: d(22), color: 'success' },
  { date: d(25), color: 'warning' },
  // Día con múltiples eventos:
  { date: d(11), color: 'danger' },
  { date: d(11), color: 'primary' },
]
const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'string | number | Date | null', default: 'null', description: 'Fecha seleccionada (v-model)' },
  { name: 'min', type: 'string | number | Date | null', default: 'null', description: 'Fecha mínima' },
  { name: 'max', type: 'string | number | Date | null', default: 'null', description: 'Fecha máxima' },
  { name: 'color', type: 'string', default: '"primary"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'solid, outlined, soft, ghost, subtle' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita la selección' },
  { name: 'disabledWeekdays', type: 'number[]', default: '[]', description: 'Días de semana deshabilitados (0=domingo)' },
  { name: 'disabledDates', type: '(string | number | Date)[]', default: '[]', description: 'Fechas puntuales deshabilitadas' },
  { name: 'locale', type: 'string', default: '"es"', description: 'Locale de los nombres' },
  { name: 'weekStart', type: 'number', default: '1', description: 'Primer día de la semana (0=domingo, 1=lunes)' },
  { name: 'monthFormat', type: 'string', default: '"MMMM"', description: 'Formato del mes' },
  { name: 'yearFormat', type: 'string', default: '"yyyy"', description: 'Formato del año' },
  { name: 'events', type: 'CalendarEvent[]', default: '[]', description: 'Puntos bajo las fechas' },
  { name: 'rangeStart', type: 'string | number | Date | null', default: 'null', description: 'Inicio de rango resaltado' },
  { name: 'rangeEnd', type: 'string | number | Date | null', default: 'null', description: 'Fin de rango resaltado' },
];

const slotsData: { name: string; description: string }[] = [];

const eventsData = [
  { name: 'update:modelValue', type: '(value: Date) => void', description: 'Fecha seleccionada (v-model)' },
  { name: 'change', type: '(value: Date) => void', description: 'Cambia la selección' },
  { name: 'select', type: '(value: Date) => void', description: 'Click en un día' },
];

const exposesData = [
  { name: 'nextMonth', type: '() => void', description: 'Avanza un mes' },
  { name: 'prevMonth', type: '() => void', description: 'Retrocede un mes' },
  { name: 'goToMonth', type: '(value: string | number | Date) => void', description: 'Va al mes indicado' },
  { name: 'getValue', type: '() => Date | null', description: 'Devuelve la fecha actual' },
  { name: 'setValue', type: '(value: string | number | Date) => void', description: 'Setea la fecha' },
];

const interfaceCode = `interface CalendarEvent {
  date: string | number | Date
  color?: string
}`;
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

      <section id="events" class="playground-section">
        <h2>Eventos</h2>
        <p class="playground-desc">
          Puntos bajo las fechas para señalar eventos. Un día puede tener múltiples puntos.
        </p>
        <Button variant="link" to="#api-interfaces">Ver interfaz CalendarEvent ↓</Button>
        <div class="playground-calendar-row">
          <Calendar
            style="width: 380px;"
            :events="calendarEvents"
            :model-value="d(11)"
            @select="(d: Date) => onEvent('select', d)"
            @change="(d: Date) => onEvent('change', d)"
          />
          <div class="playground-events-legend">
            <strong>Leyenda:</strong>
            <ul>
              <li><span class="legend-dot" style="background: #3b82f6;"></span> Entrada a bodega (3, 18)</li>
              <li><span class="legend-dot" style="background: #22c55e;"></span> Recepción (7, 22)</li>
              <li><span class="legend-dot" style="background: #f59e0b;"></span> Vencimiento (11, 25)</li>
              <li><span class="legend-dot" style="background: #ef4444;"></span> Urgente (15)</li>
              <li><span class="legend-dot" style="background: #f59e0b;"></span><span class="legend-dot" style="background: #ef4444;"></span><span class="legend-dot" style="background: #3b82f6;"></span> Múltiple (11)</li>
            </ul>
          </div>
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

      <section id="disabled" class="playground-section">
        <h2>Disabled</h2>
        <div class="playground-calendar-col">
          <Calendar :disabled="true" model-value="2026-08-11" style="width: 300px;" />
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
          <Calendar ref="programmaticRef" style="width: 300px;" @select="readValue" />
        </div>
      </section>

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" empty="No tiene slots" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" variant="ghost" compact />

        <h3 id="api-interfaces">Interfaces</h3>
        <CodeBlock :code="interfaceCode" language="ts" variant="solid" />
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

.playground-events-legend {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

.playground-events-legend ul {
  list-style: none;
  padding: 0;
  margin: 0.5rem 0 0;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.playground-events-legend li {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.legend-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
  flex-shrink: 0;
}
</style>
