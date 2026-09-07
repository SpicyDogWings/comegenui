<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import Table from "@/components/data/Table.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import Button from "@/components/buttons/Button.vue";
import Calendar from "@/components/controls/Calendar.vue";

const programmaticRef = ref<InstanceType<typeof Calendar> | null>(null);
const programmaticValue = ref<Date | null>(null);

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
  { label: 'Programmatic', id: 'programmatic' },
  {
    label: 'Style',
    id: 'style',
    children: [
      { label: 'CSS Variables', id: 'style-variables' },
    ],
  },
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

// ── Snippets Vue ──

const vueImport = `<script setup>
import Calendar from '@/components/controls/Calendar.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = vueSnippet(`  <Calendar />`);

const monthControlsVue = vueSnippet(`  <Calendar model-value="2026-08-11" year-navigation />
  <Calendar model-value="2026-08-11" month-format="MMM yyyy" year-navigation />
  <Calendar model-value="2026-08-11" />`);

const eventsVue = `<script setup>
import Calendar from '@/components/controls/Calendar.vue'

const events = [
  { date: '2026-08-03', color: 'primary' },
  { date: '2026-08-07', color: 'success' },
  { date: '2026-08-11', color: 'warning' },
  { date: '2026-08-11', color: 'danger' },
  { date: '2026-08-15', color: 'danger' },
]
<\/script>

<template>
  <Calendar :events="events" model-value="2026-08-11" @select="d => console.log('select', d)" />
</template>`;

const selectedVue = vueSnippet(`  <Calendar model-value="2026-08-11" />
  <Calendar model-value="2027-02-20" variant="solid" />`);

const minMaxVue = vueSnippet(`  <Calendar min="2026-01-10" max="2026-12-24" model-value="2026-08-11" />`);

const disabledDaysVue = vueSnippet(`  <Calendar min="2026-08-10" max="2026-08-25" model-value="2026-08-11" />
  <Calendar min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" model-value="2026-08-11" />
  <Calendar disabled-dates="2026-08-15,2026-08-16" model-value="2026-08-11" />`);

const weekStartVue = vueSnippet(`  <Calendar :week-start="0" model-value="2026-08-11" />`);

const localeVue = vueSnippet(`  <Calendar locale="en" model-value="2026-08-11" />`);

const variantsVue = vueSnippet(`  <Calendar v-for="variant in ['solid', 'outlined', 'soft', 'subtle']" :key="variant" :variant="variant" model-value="2026-08-11" />`);

const colorsVue = vueSnippet(`  <Calendar color="primary" variant="solid" model-value="2026-08-11" />
  <Calendar color="secondary" variant="solid" model-value="2026-08-11" />
  <Calendar color="neutral" variant="solid" model-value="2026-08-11" />
  <Calendar color="success" variant="solid" model-value="2026-08-11" />
  <Calendar color="warning" variant="solid" model-value="2026-08-11" />
  <Calendar color="danger" variant="solid" model-value="2026-08-11" />`);

const disabledVue = vueSnippet(`  <Calendar disabled model-value="2026-08-11" />`);

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Calendar from '@/components/controls/Calendar.vue'
import Button from '@/components/buttons/Button.vue'

const calendarRef = ref(null)
const value = ref(null)

function readValue() {
  value.value = calendarRef.value?.getValue() ?? null
}
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="calendarRef?.nextMonth(); readValue()">nextMonth()</Button>
      <Button color="neutral" @click="calendarRef?.prevMonth(); readValue()">prevMonth()</Button>
      <Button color="neutral" @click="calendarRef?.goToMonth('2030-06-01'); readValue()">goToMonth('2030-06-01')</Button>
      <Button color="neutral" @click="calendarRef?.setValue('2026-12-24'); readValue()">setValue('2026-12-24')</Button>
    </div>
    <Calendar ref="calendarRef" style="width: 300px;" @select="readValue" />
  </div>
</template>`;

// ── Snippets Vanilla ──

const defaultVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar></cu-calendar>`;

const monthControlsVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar model-value="2026-08-11" year-navigation></cu-calendar>
<cu-calendar model-value="2026-08-11" month-format="MMM yyyy" year-navigation></cu-calendar>
<cu-calendar model-value="2026-08-11"></cu-calendar>`;

const eventsVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar id="cal-events" model-value="2026-08-11"></cu-calendar>

<script>
  customElements.whenDefined('cu-calendar').then(() => {
    document.getElementById('cal-events').events = [
      { date: '2026-08-03', color: 'primary' },
      { date: '2026-08-07', color: 'success' },
      { date: '2026-08-11', color: 'warning' },
      { date: '2026-08-11', color: 'danger' },
      { date: '2026-08-15', color: 'danger' },
    ];
  });
<\/script>`;

const selectedVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar model-value="2026-08-11"></cu-calendar>
<cu-calendar model-value="2027-02-20" variant="solid"></cu-calendar>`;

const minMaxVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar min="2026-01-10" max="2026-12-24" model-value="2026-08-11"></cu-calendar>`;

const disabledDaysVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar min="2026-08-10" max="2026-08-25" model-value="2026-08-11"></cu-calendar>
<cu-calendar min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" model-value="2026-08-11"></cu-calendar>
<cu-calendar disabled-dates="2026-08-15,2026-08-16" model-value="2026-08-11"></cu-calendar>`;

const weekStartVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar week-start="0" model-value="2026-08-11"></cu-calendar>`;

const localeVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar locale="en" model-value="2026-08-11"></cu-calendar>`;

const variantsVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar variant="solid" model-value="2026-08-11"></cu-calendar>
<cu-calendar variant="outlined" model-value="2026-08-11"></cu-calendar>
<cu-calendar variant="soft" model-value="2026-08-11"></cu-calendar>
<cu-calendar variant="subtle" model-value="2026-08-11"></cu-calendar>`;

const colorsVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar color="primary" variant="solid" model-value="2026-08-11"></cu-calendar>
<cu-calendar color="secondary" variant="solid" model-value="2026-08-11"></cu-calendar>
<cu-calendar color="neutral" variant="solid" model-value="2026-08-11"></cu-calendar>
<cu-calendar color="success" variant="solid" model-value="2026-08-11"></cu-calendar>
<cu-calendar color="warning" variant="solid" model-value="2026-08-11"></cu-calendar>
<cu-calendar color="danger" variant="solid" model-value="2026-08-11"></cu-calendar>`;

const disabledVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar disabled model-value="2026-08-11"></cu-calendar>`;

const programmaticVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="cal-prog-next">nextMonth()</cu-button>
  <cu-button id="cal-prog-prev">prevMonth()</cu-button>
  <cu-button id="cal-prog-go">goToMonth('2030-06-01')</cu-button>
  <cu-button id="cal-prog-set">setValue('2026-12-24')</cu-button>
</div>

<cu-calendar id="cal-prog" style="width: 300px;"></cu-calendar>

<script>
  customElements.whenDefined('cu-calendar').then(() => {
    const calendar = document.getElementById('cal-prog');
    document.getElementById('cal-prog-next').addEventListener('click', () => calendar.nextMonth());
    document.getElementById('cal-prog-prev').addEventListener('click', () => calendar.prevMonth());
    document.getElementById('cal-prog-go').addEventListener('click', () => calendar.goToMonth('2030-06-01'));
    document.getElementById('cal-prog-set').addEventListener('click', () => calendar.setValue('2026-12-24'));
    calendar.addEventListener('select', () => console.log('getValue():', calendar.getValue()));
  });
<\/script>`;

const componentTokens = [
  '--cal-accent',
  '--cal-accent-hover',
  '--cal-soft',
  '--cal-soft-hover',
  '--cal-subtle',
  '--cal-subtle-border',
  '--cal-ghost-hover',
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-font-size-xs',
  '--cu-font-weight-medium',
  '--cu-font-weight-semibold',
  '--cu-radius-sm',
  '--cu-space-2xs',
  '--cu-space-xs',
  '--cu-space-sm',
  '--cu-border-thin',
  '--cu-color-surface',
];

const componentDeps = [
  { label: 'MonthSlider', path: '/playground/components/month-slider' },
];

const styleSubComponents = [
  { label: 'MonthSlider', path: '/playground/components/month-slider#style' },
];

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
  { name: 'variant', type: 'string', default: '"soft"', description: 'solid, outlined, soft, subtle' },
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
    <div class="playground-content">

      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
        </div>
        <p class="playground-desc">
          Muestra el mes actual. Grilla de 7 columnas que se reparten el ancho del contenedor.
        </p>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="playground-col">
            <Calendar style="width: 300px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="month-controls" class="playground-section">
        <div class="playground-heading">
          <h2>Controles de mes (MonthSlider)</h2>
          <Badge color="neutral" title="yearNavigation por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="monthControlsVue" :vanilla-code="monthControlsVanilla">
          <div class="playground-col">
            <p class="playground-desc"><strong>Con <code>year-navigation</code></strong> → botones « » para saltar de año (los del slider):</p>
            <Calendar model-value="2026-08-11" year-navigation style="width: 300px;" />
            <p class="playground-desc"><strong>Con <code>year-navigation</code> + <code>month-format="MMM yyyy"</code>:</strong></p>
            <Calendar model-value="2026-08-11" month-format="MMM yyyy" year-navigation style="width: 300px;" />
            <p class="playground-desc"><strong>Default</strong> (solo prev/next mes + drag, año automático):</p>
            <Calendar model-value="2026-08-11" style="width: 300px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="events" class="playground-section">
        <div class="playground-heading">
          <h2>Eventos</h2>
          <Badge color="neutral" title="events por defecto">[]</Badge>
        </div>
        <p class="playground-desc">
          Puntos bajo las fechas para señalar eventos. Un día puede tener múltiples puntos.
        </p>
        <Button variant="link" to="#api-interfaces">Ver interfaz CalendarEvent ↓</Button>
        <SectionDemo :vue-code="eventsVue" :vanilla-code="eventsVanilla">
          <div class="playground-row">
            <Calendar
              style="width: 380px;"
              :events="calendarEvents"
              :model-value="d(11)"
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
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="selected" class="playground-section">
        <div class="playground-heading">
          <h2>Con fecha seleccionada</h2>
          <Badge color="neutral" title="modelValue por defecto">null</Badge>
        </div>
        <p class="playground-desc">
          <code>model-value="2026-08-11"</code> navega al mes y marca el día.
        </p>
        <SectionDemo :vue-code="selectedVue" :vanilla-code="selectedVanilla">
          <div class="playground-col">
            <Calendar model-value="2026-08-11" style="width: 300px;" />
            <Calendar model-value="2027-02-20" variant="solid" style="width: 300px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="min-max" class="playground-section">
        <div class="playground-heading">
          <h2>Min / Max</h2>
        </div>
        <p class="playground-desc">
          Días fuera del rango deshabilitados; la navegación se recorta al mes del límite.
        </p>
        <SectionDemo :vue-code="minMaxVue" :vanilla-code="minMaxVanilla">
          <div class="playground-col">
            <Calendar min="2026-01-10" max="2026-12-24" model-value="2026-08-11" style="width: 300px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="disabled-days" class="playground-section">
        <div class="playground-heading">
          <h2>Días deshabilitados</h2>
          <Badge color="neutral" title="disabledWeekdays / disabledDates por defecto">[]</Badge>
        </div>
        <SectionDemo :vue-code="disabledDaysVue" :vanilla-code="disabledDaysVanilla">
          <div class="playground-col">
            <p class="playground-desc"><strong>Ventana min/max:</strong> solo se puede elegir del 10 al 25.</p>
            <Calendar min="2026-08-10" max="2026-08-25" model-value="2026-08-11" style="width: 300px;" />
            <p class="playground-desc"><strong>De → hasta con días deshabilitados en el medio:</strong> ventana del 10 al 25 + <code>disabled-weekdays="0,6"</code> (fines de semana).</p>
            <Calendar min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" model-value="2026-08-11" style="width: 300px;" />
            <p class="playground-desc"><strong>Fechas puntuales (feriado):</strong> <code>disabled-dates="2026-08-15,2026-08-16"</code>.</p>
            <Calendar disabled-dates="2026-08-15,2026-08-16" model-value="2026-08-11" style="width: 300px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="week-start" class="playground-section">
        <div class="playground-heading">
          <h2>Semana que empieza en domingo</h2>
          <Badge color="neutral" title="weekStart por defecto">1</Badge>
        </div>
        <SectionDemo :vue-code="weekStartVue" :vanilla-code="weekStartVanilla">
          <div class="playground-col">
            <Calendar :week-start="0" model-value="2026-08-11" style="width: 300px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="locale" class="playground-section">
        <div class="playground-heading">
          <h2>Locale</h2>
          <Badge color="neutral" title="locale por defecto">es</Badge>
        </div>
        <SectionDemo :vue-code="localeVue" :vanilla-code="localeVanilla">
          <div class="playground-col">
            <Calendar locale="en" model-value="2026-08-11" style="width: 300px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variantes del día seleccionado</h2>
          <Badge color="neutral" title="Variante por defecto">soft</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="playground-row">
            <Calendar v-for="variant in variants" :key="variant" model-value="2026-08-11" :variant="variant" style="width: 240px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colores</h2>
          <Badge color="neutral" title="Color por defecto">primary</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-row">
            <Calendar v-for="color in colors" :key="color" model-value="2026-08-11" :color="color" variant="solid" style="width: 240px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <div class="playground-heading">
          <h2>Disabled</h2>
          <Badge color="neutral" title="Valor por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="disabledVue" :vanilla-code="disabledVanilla">
          <div class="playground-col">
            <Calendar :disabled="true" model-value="2026-08-11" style="width: 300px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo.
        </p>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="programmaticRef?.nextMonth(); readValue()">nextMonth()</Button>
              <Button color="neutral" @click="programmaticRef?.prevMonth(); readValue()">prevMonth()</Button>
              <Button color="neutral" @click="programmaticRef?.goToMonth('2030-06-01'); readValue()">goToMonth('2030-06-01')</Button>
              <Button color="neutral" @click="programmaticRef?.setValue('2026-12-24'); readValue()">setValue('2026-12-24')</Button>
            </div>
            <p class="playground-state">
              getValue(): <strong>{{ programmaticValue ? programmaticValue.toISOString().slice(0, 10) : '—' }}</strong>
            </p>
            <Calendar ref="programmaticRef" style="width: 300px;" @select="readValue" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      

      <hr class="playground-separator" />

      <PlaygroundStyle :tokens="componentTokens" :sub-components="styleSubComponents" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <PlaygroundApiComponents :deps="componentDeps" />

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
.playground-desc {
  margin: 0;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
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
