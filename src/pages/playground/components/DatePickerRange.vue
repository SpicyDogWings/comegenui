<script setup lang="ts">
import { ref } from "vue";
import { getTokenDescription } from '@/config/css-tokens';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import DatePickerRange from "@/components/form/DatePickerRange.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";

const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);

const rangeRef = ref<InstanceType<typeof DatePickerRange> | null>(null);
const progStart = ref<Date | null>(null);
const progEnd = ref<Date | null>(null);
const progIsOpen = ref(false);

function readProgState() {
  progStart.value = rangeRef.value?.getStartDate() ?? null;
  progEnd.value = rangeRef.value?.getEndDate() ?? null;
}

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const now = new Date();
const y = now.getFullYear();
const m = String(now.getMonth() + 1).padStart(2, '0');
const d = (day: number) => `${y}-${m}-${String(day).padStart(2, '0')}`;

function fmt(d: Date | null) {
  return d ? d.toISOString().slice(0, 10) : '—';
}

const tokenColumns = [
  { key: 'token', label: 'Token' },
  { key: 'ejemplo', label: 'Con 2026-09-15' },
  { key: 'que', label: 'Qué es' },
];

const formatTokens = [
  { token: 'dd', ejemplo: '15', que: 'Día con dos dígitos' },
  { token: 'MM', ejemplo: '09', que: 'Mes con dos dígitos' },
  { token: 'MMM', ejemplo: 'sep', que: 'Mes corto (locale)' },
  { token: 'MMMM', ejemplo: 'septiembre', que: 'Mes completo (locale)' },
  { token: 'yy', ejemplo: '26', que: 'Año corto' },
  { token: 'yyyy', ejemplo: '2026', que: 'Año completo' },
];

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Label', id: 'label' },
  { label: 'Placeholder', id: 'placeholder' },
  { label: 'Formato', id: 'format' },
  { label: 'Min / Max', id: 'min-max' },
  { label: 'Dual Calendar', id: 'dual-calendar' },
  { label: 'Colores', id: 'colors' },
  { label: 'Posiciones', id: 'positions' },
  { label: 'Disabled', id: 'disabled' },
  {
    label: 'Programmatic',
    id: 'programmatic',
  },
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

const vueImport = `<script setup>
import DatePickerRange from '@/components/form/DatePickerRange.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = `<script setup>
import { ref } from 'vue'
import DatePickerRange from '@/components/form/DatePickerRange.vue'

const startDate = ref(null)
const endDate = ref(null)
<\/script>

<template>
  <DatePickerRange v-model:start-date="startDate" v-model:end-date="endDate" />
</template>`;

const labelVue = vueSnippet(`  <DatePickerRange label="Período de análisis" />
  <DatePickerRange label="Fecha de entrega" color="primary" />
  <DatePickerRange label="Vacaciones" color="success" variant="outlined" />`);

const placeholderVue = vueSnippet(`  <DatePickerRange placeholder="Elegí un rango de fechas..." />`);

const formatVue = vueSnippet(`  <DatePickerRange start-date="2026-09-03" end-date="2026-09-15" format="dd/MM/yyyy" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-15" format="MMM dd" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-15" format="dd-MM-yy" />`);

const minMaxVue = vueSnippet(`  <DatePickerRange start-date="2026-09-05" end-date="2026-09-20" min="2026-01-01" max="2026-12-31" />
  <DatePickerRange min="2026-09-10" max="2026-09-25" disabled-weekdays="0,6" />`);

const dualCalendarVue = vueSnippet(`  <DatePickerRange start-date="2026-09-20" end-date="2026-10-05" dual-calendar />`);

const colorsVue = vueSnippet(`  <DatePickerRange color="primary" start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange color="secondary" start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange color="neutral" start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange color="success" start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange color="warning" start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange color="danger" start-date="2026-09-03" end-date="2026-09-07" />`);

const positionsVue = vueSnippet(`  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="bottom" align="start" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="bottom" align="center" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="bottom" align="end" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="top" align="start" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="top" align="center" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="top" align="end" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="right" align="start" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="right" align="center" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="right" align="end" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="left" align="start" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="left" align="center" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="left" align="end" />
  <DatePickerRange dual-calendar position="right" align="start" start-date="2026-09-03" end-date="2026-10-07" />
  <DatePickerRange dual-calendar position="left" align="end" start-date="2026-09-03" end-date="2026-10-07" />`);

const disabledVue = vueSnippet(`  <DatePickerRange disabled start-date="2026-09-03" end-date="2026-09-15" />`);

const defaultVanilla = `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range id="range-default"></cu-date-picker-range>

<script>
  customElements.whenDefined('cu-date-picker-range').then(() => {
    const range = document.getElementById('range-default');
    range.addEventListener('change', (e) => {
      console.log('change', e.detail); // { start, end }
    });
  });
<\/script>`;

const labelVanilla = `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range label="Período de análisis"></cu-date-picker-range>
<cu-date-picker-range label="Fecha de entrega" color="primary"></cu-date-picker-range>
<cu-date-picker-range label="Vacaciones" color="success" variant="outlined"></cu-date-picker-range>`;

const placeholderVanilla = `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range placeholder="Elegí un rango de fechas..."></cu-date-picker-range>`;

const formatVanilla = `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-15" format="dd/MM/yyyy"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-15" format="MMM dd"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-15" format="dd-MM-yy"></cu-date-picker-range>`;

const minMaxVanilla = `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range start-date="2026-09-05" end-date="2026-09-20" min="2026-01-01" max="2026-12-31"></cu-date-picker-range>
<cu-date-picker-range min="2026-09-10" max="2026-09-25" disabled-weekdays="0,6"></cu-date-picker-range>`;

const dualCalendarVanilla = `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range start-date="2026-09-20" end-date="2026-10-05" dual-calendar></cu-date-picker-range>`;

const colorsVanilla = `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range color="primary" start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range color="secondary" start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range color="neutral" start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range color="success" start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range color="warning" start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range color="danger" start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>`;

const positionsVanilla = `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="bottom" align="start"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="bottom" align="center"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="bottom" align="end"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="top" align="start"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="top" align="center"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="top" align="end"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="right" align="start"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="right" align="center"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="right" align="end"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="left" align="start"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="left" align="center"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="left" align="end"></cu-date-picker-range>
<cu-date-picker-range dual-calendar position="right" align="start" start-date="2026-09-03" end-date="2026-10-07"></cu-date-picker-range>
<cu-date-picker-range dual-calendar position="left" align="end" start-date="2026-09-03" end-date="2026-10-07"></cu-date-picker-range>`;

const disabledVanilla = `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range disabled start-date="2026-09-03" end-date="2026-09-15"></cu-date-picker-range>`;

const programmaticVue = `<script setup>
import { ref } from 'vue'
import DatePickerRange from '@/components/form/DatePickerRange.vue'
import Button from '@/components/buttons/Button.vue'

const rangeRef = ref(null)
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button @click="rangeRef?.open()">open()</Button>
      <Button @click="rangeRef?.close()">close()</Button>
      <Button @click="rangeRef?.toggle()">toggle()</Button>
      <Button @click="rangeRef?.setRange('2026-09-03', '2026-09-15')">setRange()</Button>
      <Button @click="rangeRef?.clear()">clear()</Button>
    </div>
    <DatePickerRange ref="rangeRef" />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuDatePickerRange.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="range-prog-open">open()</cu-button>
  <cu-button id="range-prog-close">close()</cu-button>
  <cu-button id="range-prog-toggle">toggle()</cu-button>
  <cu-button id="range-prog-setrange">setRange()</cu-button>
  <cu-button id="range-prog-clear">clear()</cu-button>
</div>

<cu-date-picker-range id="range-prog"></cu-date-picker-range>

<script>
  customElements.whenDefined('cu-date-picker-range').then(() => {
    const range = document.getElementById('range-prog');
    document.getElementById('range-prog-open').addEventListener('click', () => range.open());
    document.getElementById('range-prog-close').addEventListener('click', () => range.close());
    document.getElementById('range-prog-toggle').addEventListener('click', () => range.toggle());
    document.getElementById('range-prog-setrange').addEventListener('click', () => range.setRange('2026-09-03', '2026-09-15'));
    document.getElementById('range-prog-clear').addEventListener('click', () => range.clear());
  });
<\/script>`;

const interfaceCode = `interface CalendarEvent {
  date: string | number | Date
  color?: string
}`;

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const datepickerrange_tokens = [
  '--cu-border-color',
  '--cu-border-thin',
  '--cu-space-md',
  '--cu-space-sm',
];

const styleData = datepickerrange_tokens.map(name => ({ name, description: getTokenDescription(name) }));

const componentDeps = [
      { label: 'Dropdown', path: '/playground/components/dropdown' },
      { label: 'Button', path: '/playground/components/button' },
      { label: 'Calendar', path: '/playground/components/calendar' },
      { label: 'Label', path: '/playground/components/label' },
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'startDate', type: 'string | number | Date | null', default: 'null', description: 'Inicio del rango (v-model:start-date). Acepta Date, timestamp o "YYYY-MM-DD"' },
  { name: 'endDate', type: 'string | number | Date | null', default: 'null', description: 'Fin del rango (v-model:end-date)' },
  { name: 'min', type: 'string | number | Date | null', default: 'null', description: 'Fecha mínima seleccionable' },
  { name: 'max', type: 'string | number | Date | null', default: 'null', description: 'Fecha máxima seleccionable' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'Variante del trigger: outlined, soft, ghost, subtle' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita trigger y calendarios' },
  { name: 'placeholder', type: 'string', default: '""', description: 'Texto del trigger cuando no hay rango' },
  { name: 'locale', type: 'string', default: '"es"', description: 'Locale para nombres de mes/día (Intl)' },
  { name: 'weekStart', type: 'number', default: '1', description: 'Día de inicio de semana: 0=domingo … 6=sábado' },
  { name: 'format', type: 'string', default: '"dd/MM/yyyy"', description: 'Formato del rango en el trigger. Tokens: dd, MM, MMM, MMMM, yy, yyyy' },
  { name: 'yearNavigation', type: 'boolean | string', default: 'false', description: 'Botones « » para saltar de año en los calendarios' },
  { name: 'monthFormat', type: 'string', default: '"MMMM"', description: 'Formato del mes en el header de los calendarios' },
  { name: 'yearFormat', type: 'string', default: '"yyyy"', description: 'Formato del año en el header de los calendarios' },
  { name: 'disabledWeekdays', type: 'number[] | string', default: '""', description: 'Días de semana deshabilitados (0=domingo). Acepta array o "0,6"' },
  { name: 'disabledDates', type: '(string | Date)[] | string', default: '""', description: 'Fechas puntuales deshabilitadas. Acepta array o "2026-09-15,2026-09-16"' },
  { name: 'events', type: 'CalendarEvent[]', default: '[]', description: 'Puntos bajo las fechas: { date, color? }. Compatible con rangos' },
  { name: 'dualCalendar', type: 'boolean', default: 'false', description: 'Dos meses lado a lado (ideal para rangos que cruzan meses)' },
  { name: 'position', type: 'string', default: '"bottom"', description: 'Posición del panel: bottom, top, left, right' },
  { name: 'align', type: 'string', default: '"start"', description: 'Alineación del panel: start, center, end' },
  { name: 'fixed', type: 'boolean', default: 'false', description: 'Fija el panel al viewport' },
  { name: 'clearable', type: 'boolean', default: 'true', description: 'Botón Limpiar en el footer del panel' },
  { name: 'todayButton', type: 'boolean', default: 'false', description: 'Reservado: hoy no agrega botón en el footer' },
  { name: 'label', type: 'string', default: '""', description: 'Label sobre el trigger (click abre el panel)' },
];

const slotsData = [];

const eventsData = [
  { name: 'update:startDate', type: 'custom', description: 'v-model:start-date: se emite al elegir el inicio (Date | null)' },
  { name: 'update:endDate', type: 'custom', description: 'v-model:end-date: se emite al elegir el fin (Date | null)' },
  { name: 'change', type: 'custom', description: 'Rango completo al cerrar la selección: { start, end }' },
  { name: 'select', type: 'custom', description: 'Rango al completar los dos clicks: { start, end }' },
  { name: 'open', type: 'custom', description: 'El panel se abrió' },
  { name: 'close', type: 'custom', description: 'El panel se cerró' },
];

const exposesData = [
  { name: 'open', type: '() => void', default: '—', description: 'Abre el panel' },
  { name: 'close', type: '() => void', default: '—', description: 'Cierra el panel' },
  { name: 'toggle', type: '() => void', default: '—', description: 'Abre/cierra el panel' },
  { name: 'getStartDate', type: '() => Date | null', default: '—', description: 'Devuelve el inicio del rango' },
  { name: 'getEndDate', type: '() => Date | null', default: '—', description: 'Devuelve el fin del rango' },
  { name: 'setRange', type: '(start, end: string | number | Date | null) => void', default: '—', description: 'Setea el rango programáticamente' },
  { name: 'clear', type: '() => void', default: '—', description: 'Limpia el rango' },
  { name: 'isOpen', type: '() => boolean', default: '—', description: 'Indica si el panel está abierto' },
];
</script>

<template>
  <PlaygroundLayout title="DatePickerRange" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
        </div>
        <p class="playground-desc">
          Selector de rango: primer click define el inicio, segundo click define el fin. Si el segundo es anterior, se swapea automáticamente.
        </p>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="playground-col">
            <DatePickerRange
              :start-date="startDate"
              :end-date="endDate"
              @update:start-date="startDate = $event"
              @update:end-date="endDate = $event"
              style="max-width: 320px;"
            />
            <p class="playground-state">
              Rango: <strong>{{ fmt(startDate) }} → {{ fmt(endDate) }}</strong>
            </p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="label" class="playground-section">
        <div class="playground-heading">
          <h2>Label</h2>
        </div>
        <SectionDemo :vue-code="labelVue" :vanilla-code="labelVanilla">
          <div class="playground-col">
            <DatePickerRange label="Período de análisis" style="max-width: 320px;" />
            <DatePickerRange label="Fecha de entrega" color="primary" style="max-width: 320px;" />
            <DatePickerRange label="Vacaciones" color="success" variant="outlined" style="max-width: 320px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="placeholder" class="playground-section">
        <div class="playground-heading">
          <h2>Placeholder</h2>
        </div>
        <SectionDemo :vue-code="placeholderVue" :vanilla-code="placeholderVanilla">
          <div class="playground-col">
            <DatePickerRange placeholder="Elegí un rango de fechas..." style="max-width: 320px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="format" class="playground-section">
        <div class="playground-heading">
          <h2>Formato del rango en el trigger</h2>
          <Badge color="neutral" title="Formato por defecto">dd/MM/yyyy</Badge>
        </div>
        <Table :columns="tokenColumns" :data="formatTokens" variant="ghost" compact />
        <SectionDemo :vue-code="formatVue" :vanilla-code="formatVanilla">
          <div class="playground-col">
            <DatePickerRange start-date="2026-09-03" end-date="2026-09-15" format="dd/MM/yyyy" style="max-width: 320px;" />
            <DatePickerRange start-date="2026-09-03" end-date="2026-09-15" format="MMM dd" style="max-width: 320px;" />
            <DatePickerRange start-date="2026-09-03" end-date="2026-09-15" format="dd-MM-yy" style="max-width: 320px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="min-max" class="playground-section">
        <div class="playground-heading">
          <h2>Min / Max</h2>
        </div>
        <SectionDemo :vue-code="minMaxVue" :vanilla-code="minMaxVanilla">
          <div class="playground-col">
            <DatePickerRange start-date="2026-09-05" end-date="2026-09-20" min="2026-01-01" max="2026-12-31" style="max-width: 320px;" />
            <p class="playground-desc">
              <strong>Con días deshabilitados:</strong> ventana del 10 al 25 + fines de semana (<code>disabled-weekdays="0,6"</code>).
            </p>
            <DatePickerRange min="2026-09-10" max="2026-09-25" disabled-weekdays="0,6" style="max-width: 320px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="dual-calendar" class="playground-section">
        <div class="playground-heading">
          <h2>Dual Calendar</h2>
          <Badge color="neutral" title="dualCalendar por defecto">false</Badge>
        </div>
        <p class="playground-desc">
          <code>dual-calendar</code> muestra dos meses lado a lado — ideal para rangos que cruzan meses.
        </p>
        <SectionDemo :vue-code="dualCalendarVue" :vanilla-code="dualCalendarVanilla">
          <div class="playground-col">
            <DatePickerRange
              :start-date="startDate"
              :end-date="endDate"
              dual-calendar
              @update:start-date="startDate = $event"
              @update:end-date="endDate = $event"
              style="max-width: 600px;"
            />
            <p class="playground-state">
              Rango: <strong>{{ fmt(startDate) }} → {{ fmt(endDate) }}</strong>
            </p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colores</h2>
          <Badge color="neutral" title="Color por defecto">neutral</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-row">
            <DatePickerRange v-for="color in colors" :key="color" :color="color" start-date="2026-09-03" end-date="2026-09-07" style="max-width: 240px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="positions" class="playground-section">
        <div class="playground-heading">
          <h2>Posición del panel — todas las combinaciones</h2>
          <Badge color="neutral" title="position + align por defecto">bottom + start</Badge>
        </div>
        <p class="playground-desc">
          API: <code>position</code> (<code>bottom</code>/<code>top</code>/<code>left</code>/<code>right</code>) + <code>align</code> (<code>start</code>/<code>center</code>/<code>end</code>).
          Sin props → default (<code>bottom</code> + <code>start</code>). <code>fixed</code> fija el panel al viewport.
        </p>
        <SectionDemo :vue-code="positionsVue" :vanilla-code="positionsVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <div class="playground-position-demo">
                <strong>default</strong>
                <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" style="max-width: 280px;" />
              </div>
            </div>
            <div class="playground-row">
              <div class="playground-position-demo"><strong>bottom + start</strong><DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="bottom" align="start" style="max-width: 280px;" /></div>
              <div class="playground-position-demo"><strong>bottom + center</strong><DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="bottom" align="center" style="max-width: 280px;" /></div>
              <div class="playground-position-demo"><strong>bottom + end</strong><DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="bottom" align="end" style="max-width: 280px;" /></div>
            </div>
            <div class="playground-row">
              <div class="playground-position-demo playground-position-demo--top"><strong>top + start</strong><DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="top" align="start" style="max-width: 280px;" /></div>
              <div class="playground-position-demo playground-position-demo--top"><strong>top + center</strong><DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="top" align="center" style="max-width: 280px;" /></div>
              <div class="playground-position-demo playground-position-demo--top"><strong>top + end</strong><DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="top" align="end" style="max-width: 280px;" /></div>
            </div>
            <div class="playground-row">
              <div class="playground-position-demo"><strong>right + start</strong><DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="right" align="start" style="max-width: 280px;" /></div>
              <div class="playground-position-demo"><strong>right + center</strong><DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="right" align="center" style="max-width: 280px;" /></div>
              <div class="playground-position-demo"><strong>right + end</strong><DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="right" align="end" style="max-width: 280px;" /></div>
            </div>
            <div class="playground-row">
              <div class="playground-position-demo playground-position-demo--left"><strong>left + start</strong><DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="left" align="start" style="max-width: 280px;" /></div>
              <div class="playground-position-demo playground-position-demo--left"><strong>left + center</strong><DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="left" align="center" style="max-width: 280px;" /></div>
              <div class="playground-position-demo playground-position-demo--left"><strong>left + end</strong><DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="left" align="end" style="max-width: 280px;" /></div>
            </div>
            <p class="playground-desc">
              <strong>Dual calendar + posición:</strong> se combinan sin problemas.
            </p>
            <div class="playground-row">
              <div class="playground-position-demo"><strong>dual + right</strong><DatePickerRange dual-calendar position="right" align="start" start-date="2026-09-03" end-date="2026-10-07" style="max-width: 600px;" /></div>
            </div>
            <div class="playground-row">
              <div class="playground-position-demo playground-position-demo--left"><strong>dual + left</strong><DatePickerRange dual-calendar position="left" align="end" start-date="2026-09-03" end-date="2026-10-07" style="max-width: 600px;" /></div>
            </div>
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
            <DatePickerRange :disabled="true" start-date="2026-09-03" end-date="2026-09-15" style="max-width: 320px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de arriba — el calendario abre acá al lado.
        </p>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="rangeRef?.open()">open()</Button>
              <Button color="neutral" @click="rangeRef?.close()">close()</Button>
              <Button color="neutral" @click="rangeRef?.toggle()">toggle()</Button>
              <Button color="neutral" @click="rangeRef?.setRange('2026-09-03', '2026-09-15')">setRange()</Button>
              <Button color="neutral" @click="rangeRef?.clear()">clear()</Button>
            </div>
            <p class="playground-state">
              getStartDate(): <strong>{{ fmt(progStart) }}</strong>
              · getEndDate(): <strong>{{ fmt(progEnd) }}</strong>
              · isOpen(): <strong>{{ progIsOpen ? 'true' : 'false' }}</strong>
            </p>
            <DatePickerRange
              ref="rangeRef"
              style="max-width: 320px;"
              @change="readProgState"
              @open="progIsOpen = true"
              @close="progIsOpen = false"
            />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <hr class="playground-separator" />

      <section id="style" class="playground-section">
        <h2>Style</h2>

        <h3 id="style-variables">CSS Variables</h3>
        <Table :columns="styleColumns" :data="styleData" variant="ghost" compact />

        <h4>Sub-componentes con estilos propios</h4>
        <ul class="playground-component-links">
          <li><a href="/playground/components/dropdown" class="playground-component-link">Dropdown</a> — revisá sus variables CSS en su propia sección Style</li>
          <li><a href="/playground/components/button" class="playground-component-link">Button</a> — revisá sus variables CSS en su propia sección Style</li>
          <li><a href="/playground/components/calendar" class="playground-component-link">Calendar</a> — revisá sus variables CSS en su propia sección Style</li>
          <li><a href="/playground/components/label" class="playground-component-link">Label</a> — revisá sus variables CSS en su propia sección Style</li>
        </ul>
      </section>

      <hr class="playground-separator" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-components">Components</h3>
        <Table :columns="componentColumns" :data="componentDeps" variant="ghost" compact>
          <template #cell-path="{ row }">
            <Button :to="row.path" variant="link" size="sm">{{ row.label }}</Button>
          </template>
        </Table>
        <p class="playground-desc">
          Hacé clic en el componente para ir a su playground.
        </p>
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

.playground-position-demo {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-width: 220px;
}

.playground-position-demo strong {
  font-size: var(--cu-font-size-xs);
  color: var(--cu-color-neutral);
  font-family: var(--cu-font-mono);
  font-weight: 600;
}

/* Espacio arriba para que el panel en position="top" no se recorte contra el header */
.playground-position-demo--top {
  margin-top: 180px;
}

/* Espacio a la izquierda para que el panel en position="left" no se recorte contra el borde */
.playground-position-demo--left {
  margin-left: 220px;
}
</style>
