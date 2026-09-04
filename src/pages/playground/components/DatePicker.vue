<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import DatePicker from "@/components/form/DatePicker.vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";

const lastEvent = ref("");

function onEvent(name: string, payload: any) {
  lastEvent.value = `${name}: ${payload instanceof Date ? payload.toISOString().slice(0, 10) : JSON.stringify(payload)}`;
}

const pickerRef = ref<InstanceType<typeof DatePicker> | null>(null);
const progValue = ref<Date | null>(null);
const progIsOpen = ref(false);

function readProgState() {
  progValue.value = pickerRef.value?.getValue() ?? null;
}

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const variants = ["outlined", "soft", "ghost", "subtle"] as const;

const now = new Date();
const y = now.getFullYear();
const m = String(now.getMonth() + 1).padStart(2, '0');
const d = (day: number) => `${y}-${m}-${String(day).padStart(2, '0')}`;

const pickerEvents = [
  { date: d(3), color: 'primary' },
  { date: d(7), color: 'success' },
  { date: d(11), color: 'warning' },
  { date: d(15), color: 'danger' },
  { date: d(18), color: 'primary' },
  { date: d(22), color: 'success' },
  { date: d(25), color: 'warning' },
  { date: d(11), color: 'danger' },
]

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Label', id: 'label' },
  { label: 'Placeholder', id: 'placeholder' },
  { label: 'Formato', id: 'format' },
  { label: 'Min / Max', id: 'min-max' },
  { label: 'Controles de mes', id: 'month-controls' },
  { label: 'Eventos', id: 'events' },
  { label: 'Sin footer', id: 'no-footer' },
  { label: 'Variantes', id: 'variants' },
  { label: 'Colores', id: 'colors' },
  { label: 'Posiciones', id: 'positions' },
  { label: 'Disabled', id: 'disabled' },
  {
    label: 'Programmatic',
    id: 'programmatic',
    children: [
      { label: 'open()', id: 'prog-open' },
      { label: 'close()', id: 'prog-close' },
      { label: 'toggle()', id: 'prog-toggle' },
      { label: 'getValue()', id: 'prog-getvalue' },
      { label: 'setValue()', id: 'prog-setvalue' },
      { label: 'clear()', id: 'prog-clear' },
      { label: 'isOpen()', id: 'prog-isopen' },
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
import DatePicker from '@/components/form/DatePicker.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const defaultVue = vueSnippet(`  <DatePicker />`);

const labelVue = vueSnippet(`  <DatePicker label="Fecha de nacimiento" />
  <DatePicker label="Fecha de inicio" model-value="2026-08-11" />
  <DatePicker label="Fecha límite" color="danger" model-value="2026-12-31" />`);

const placeholderVue = vueSnippet(`  <DatePicker placeholder="Elegí una fecha..." />`);

const formatVue = vueSnippet(`  <DatePicker model-value="2026-08-11" format="dd/MM/yyyy" />
  <DatePicker model-value="2026-08-11" format="MMMM yyyy" />
  <DatePicker model-value="2026-08-11" format="dd-MM-yy" />`);

const minMaxVue = vueSnippet(`  <DatePicker model-value="2026-08-11" min="2026-01-01" max="2026-12-31" />
  <DatePicker model-value="2026-08-11" min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" />
  <DatePicker model-value="2026-08-11" min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" disabled-dates="2026-08-15" />`);

const monthControlsVue = vueSnippet(`  <DatePicker model-value="2026-08-11" year-navigation />
  <DatePicker model-value="2026-08-11" year-navigation month-format="MMM yyyy" />`);

const eventsVue = `<script setup>
import { ref } from 'vue'
import DatePicker from '@/components/form/DatePicker.vue'

const events = [
  { date: '2026-08-03', color: 'primary' },
  { date: '2026-08-07', color: 'success' },
  { date: '2026-08-11', color: 'warning' },
  { date: '2026-08-15', color: 'danger' },
]
<\/script>

<template>
  <DatePicker
    :events="events"
    @select="(d) => console.log('select', d)"
    @change="(d) => console.log('change', d)"
    @open="console.log('open')"
    @close="console.log('close')"
  />
</template>`;

const noFooterVue = vueSnippet(`  <DatePicker model-value="2026-08-11" :today-button="false" :clearable="false" />`);

const variantsVue = vueSnippet(`  <DatePicker v-for="variant in ['outlined', 'soft', 'ghost', 'subtle']" :variant="variant" model-value="2026-08-11" />`);

const colorsVue = vueSnippet(`  <DatePicker color="primary" model-value="2026-08-11" />
  <DatePicker color="secondary" model-value="2026-08-11" />
  <DatePicker color="neutral" model-value="2026-08-11" />
  <DatePicker color="success" model-value="2026-08-11" />
  <DatePicker color="warning" model-value="2026-08-11" />
  <DatePicker color="danger" model-value="2026-08-11" />`);

const positionsVue = vueSnippet(`  <DatePicker model-value="2026-08-11" />
  <DatePicker model-value="2026-08-11" position="bottom" align="start" />
  <DatePicker model-value="2026-08-11" position="bottom" align="center" />
  <DatePicker model-value="2026-08-11" position="bottom" align="end" />
  <DatePicker model-value="2026-08-11" position="top" align="start" />
  <DatePicker model-value="2026-08-11" position="top" align="center" />
  <DatePicker model-value="2026-08-11" position="top" align="end" />
  <DatePicker model-value="2026-08-11" position="right" align="start" />
  <DatePicker model-value="2026-08-11" position="right" align="center" />
  <DatePicker model-value="2026-08-11" position="right" align="end" />
  <DatePicker model-value="2026-08-11" position="left" align="start" />
  <DatePicker model-value="2026-08-11" position="left" align="center" />
  <DatePicker model-value="2026-08-11" position="left" align="end" />`);

const disabledVue = vueSnippet(`  <DatePicker disabled model-value="2026-08-11" />`);

const defaultVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker></cu-date-picker>`;

const labelVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker label="Fecha de nacimiento"></cu-date-picker>
<cu-date-picker label="Fecha de inicio" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker label="Fecha límite" color="danger" model-value="2026-12-31"></cu-date-picker>`;

const placeholderVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker placeholder="Elegí una fecha..."></cu-date-picker>`;

const formatVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker model-value="2026-08-11" format="dd/MM/yyyy"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" format="MMMM yyyy"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" format="dd-MM-yy"></cu-date-picker>`;

const minMaxVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker model-value="2026-08-11" min="2026-01-01" max="2026-12-31"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" disabled-dates="2026-08-15"></cu-date-picker>`;

const monthControlsVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker model-value="2026-08-11" year-navigation></cu-date-picker>
<cu-date-picker model-value="2026-08-11" year-navigation month-format="MMM yyyy"></cu-date-picker>`;

const eventsVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker id="picker-events"></cu-date-picker>

<script>
  customElements.whenDefined('cu-date-picker').then(() => {
    const picker = document.getElementById('picker-events');
    // Los arrays se asignan por JS (los atributos HTML no aceptan arrays):
    // picker.events = [{ date, color? }, ...]
    picker.events = [
      { date: '2026-08-03', color: 'primary' },
      { date: '2026-08-07', color: 'success' },
      { date: '2026-08-11', color: 'warning' },
      { date: '2026-08-15', color: 'danger' },
    ];
  });
<\/script>`;

const noFooterVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker id="picker-nof" model-value="2026-08-11"></cu-date-picker>

<script>
  customElements.whenDefined('cu-date-picker').then(() => {
    const picker = document.getElementById('picker-nof');
    picker.todayButton = false;
    picker.clearable = false;
  });
<\/script>`;

const variantsVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker variant="outlined" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker variant="soft" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker variant="ghost" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker variant="subtle" model-value="2026-08-11"></cu-date-picker>`;

const colorsVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker color="primary" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="secondary" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="neutral" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="success" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="warning" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="danger" model-value="2026-08-11"></cu-date-picker>`;

const positionsVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker model-value="2026-08-11"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" position="bottom" align="start"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" position="bottom" align="center"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" position="bottom" align="end"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" position="top" align="start"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" position="top" align="center"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" position="top" align="end"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" position="right" align="start"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" position="right" align="center"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" position="right" align="end"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" position="left" align="start"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" position="left" align="center"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" position="left" align="end"></cu-date-picker>`;

const disabledVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker disabled model-value="2026-08-11"></cu-date-picker>`;

const programmaticVue = `<script setup>
import { ref, onMounted } from 'vue'
import DatePicker from '@/components/form/DatePicker.vue'

const pickerRef = ref(null)

onMounted(() => {
  pickerRef.value?.setValue('2026-08-11')
  console.log('getValue():', pickerRef.value?.getValue()) // Date
  pickerRef.value?.open()
  console.log('isOpen():', pickerRef.value?.isOpen()) // true
  // pickerRef.value?.close()
  // pickerRef.value?.toggle()
  // pickerRef.value?.clear()
})
<\/script>

<template>
  <DatePicker ref="pickerRef" />
</template>`;

const programmaticVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker id="picker-prog"></cu-date-picker>

<script>
  customElements.whenDefined('cu-date-picker').then(() => {
    const picker = document.getElementById('picker-prog');
    picker.setValue('2026-08-11');
    console.log('getValue():', picker.getValue()); // Date
    picker.open();
    console.log('isOpen():', picker.isOpen()); // true
    // picker.close();
    // picker.toggle();
    // picker.clear();
  });
<\/script>`;

const interfaceCode = `interface CalendarEvent {
  date: string | number | Date
  color?: string
}`;

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'string | number | Date | null', default: 'null', description: 'Fecha seleccionada (v-model). Acepta Date, timestamp o "YYYY-MM-DD"' },
  { name: 'min', type: 'string | number | Date | null', default: 'null', description: 'Fecha mínima seleccionable' },
  { name: 'max', type: 'string | number | Date | null', default: 'null', description: 'Fecha máxima seleccionable' },
  { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'Variante del trigger: outlined, soft, ghost, subtle' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita trigger y calendario' },
  { name: 'placeholder', type: 'string', default: '""', description: 'Texto del trigger cuando no hay fecha' },
  { name: 'locale', type: 'string', default: '"es"', description: 'Locale para nombres de mes/día (Intl)' },
  { name: 'weekStart', type: 'number', default: '1', description: 'Día de inicio de semana: 0=domingo … 6=sábado' },
  { name: 'format', type: 'string', default: '"dd/MM/yyyy"', description: 'Formato de la fecha en el trigger. Tokens: dd, MM, MMM, MMMM, yy, yyyy' },
  { name: 'yearNavigation', type: 'boolean | string', default: 'false', description: 'Botones « » para saltar de año en el calendario interno' },
  { name: 'monthFormat', type: 'string', default: '"MMMM"', description: 'Formato del mes en el header del calendario' },
  { name: 'yearFormat', type: 'string', default: '"yyyy"', description: 'Formato del año en el header del calendario' },
  { name: 'disabledWeekdays', type: 'number[] | string', default: '""', description: 'Días de semana deshabilitados (0=domingo). Acepta array o "0,6"' },
  { name: 'disabledDates', type: '(string | Date)[] | string', default: '""', description: 'Fechas puntuales deshabilitadas. Acepta array o "2026-08-15,2026-08-16"' },
  { name: 'events', type: 'CalendarEvent[]', default: '[]', description: 'Puntos bajo las fechas: { date, color? }' },
  { name: 'position', type: 'string', default: '"bottom"', description: 'Posición del panel: bottom, top, left, right' },
  { name: 'align', type: 'string', default: '"start"', description: 'Alineación del panel: start, center, end' },
  { name: 'fixed', type: 'boolean', default: 'false', description: 'Fija el panel al viewport' },
  { name: 'clearable', type: 'boolean', default: 'true', description: 'Botón Limpiar en el footer del panel' },
  { name: 'todayButton', type: 'boolean', default: 'true', description: 'Botón Hoy en el footer del panel' },
  { name: 'label', type: 'string', default: '""', description: 'Label sobre el trigger (click abre el panel)' },
];

const slotsData = [];

const eventsData = [
  { name: 'update:modelValue', type: 'custom', description: 'v-model: se emite al seleccionar o limpiar; payload Date | null' },
  { name: 'change', type: 'custom', description: 'Fecha seleccionada o null al limpiar' },
  { name: 'select', type: 'custom', description: 'Día seleccionado en el calendario' },
  { name: 'open', type: 'custom', description: 'El panel se abrió' },
  { name: 'close', type: 'custom', description: 'El panel se cerró' },
];

const exposesData = [
  { name: 'open', type: '() => void', default: '—', description: 'Abre el panel' },
  { name: 'close', type: '() => void', default: '—', description: 'Cierra el panel' },
  { name: 'toggle', type: '() => void', default: '—', description: 'Abre/cierra el panel' },
  { name: 'getValue', type: '() => Date | null', default: '—', description: 'Devuelve la fecha seleccionada' },
  { name: 'setValue', type: '(value: string | number | Date) => void', default: '—', description: 'Setea la fecha programáticamente' },
  { name: 'clear', type: '() => void', default: '—', description: 'Limpia la selección' },
  { name: 'isOpen', type: '() => boolean', default: '—', description: 'Indica si el panel está abierto' },
];
</script>

<template>
  <PlaygroundLayout title="DatePicker" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="default" class="playground-section">
        <div class="playground-heading">
          <h2>Default</h2>
        </div>
        <p class="playground-desc">
          Botón-trigger que abre un dropdown con el calendario adentro (no es una lista de items: es un box con el calendario).
        </p>
        <SectionDemo :vue-code="defaultVue" :vanilla-code="defaultVanilla">
          <div class="playground-col">
            <DatePicker style="max-width: 280px;" />
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
            <DatePicker label="Fecha de nacimiento" style="max-width: 280px;" />
            <DatePicker label="Fecha de inicio" model-value="2026-08-11" style="max-width: 280px;" />
            <DatePicker label="Fecha límite" color="danger" model-value="2026-12-31" style="max-width: 280px;" />
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
            <DatePicker placeholder="Elegí una fecha..." style="max-width: 280px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="format" class="playground-section">
        <div class="playground-heading">
          <h2>Formato de la fecha en el trigger</h2>
          <Badge color="neutral" title="Formato por defecto">dd/MM/yyyy</Badge>
        </div>
        <p class="playground-desc">
          Tokens: <code>dd</code>, <code>MM</code>, <code>MMM</code>, <code>MMMM</code>, <code>yy</code>, <code>yyyy</code>.
        </p>
        <SectionDemo :vue-code="formatVue" :vanilla-code="formatVanilla">
          <div class="playground-col">
            <DatePicker model-value="2026-08-11" format="dd/MM/yyyy" style="max-width: 280px;" />
            <DatePicker model-value="2026-08-11" format="MMMM yyyy" style="max-width: 280px;" />
            <DatePicker model-value="2026-08-11" format="dd-MM-yy" style="max-width: 280px;" />
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
            <DatePicker model-value="2026-08-11" min="2026-01-01" max="2026-12-31" style="max-width: 280px;" />
            <p class="playground-desc">
              <strong>De → hasta + días deshabilitados en el medio:</strong> ventana 10-25 + fines de semana (<code>disabled-weekdays="0,6"</code>) y un feriado puntual (<code>disabled-dates</code>).
            </p>
            <DatePicker model-value="2026-08-11" min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" style="max-width: 280px;" />
            <DatePicker model-value="2026-08-11" min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" disabled-dates="2026-08-15" style="max-width: 280px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="month-controls" class="playground-section">
        <div class="playground-heading">
          <h2>Controles de mes (año)</h2>
          <Badge color="neutral" title="yearNavigation por defecto">false</Badge>
        </div>
        <p class="playground-desc">
          El calendario interno hereda <code>year-navigation</code> (botones « » para saltar de año, del MonthSlider) y <code>month-format</code>.
        </p>
        <SectionDemo :vue-code="monthControlsVue" :vanilla-code="monthControlsVanilla">
          <div class="playground-col">
            <DatePicker model-value="2026-08-11" year-navigation style="max-width: 280px;" />
            <DatePicker model-value="2026-08-11" year-navigation month-format="MMM yyyy" style="max-width: 280px;" />
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
          Puntos bajo las fechas para señalar eventos. Cada evento tiene <code>date</code> y opcional <code>color</code> (semántico: <code>primary</code>, <code>success</code>, <code>warning</code>, <code>danger</code>…).
        </p>
        <SectionDemo :vue-code="eventsVue" :vanilla-code="eventsVanilla">
          <div class="playground-col">
            <DatePicker
              style="max-width: 280px;"
              :events="pickerEvents"
              @select="(d: Date) => onEvent('select', d)"
              @change="(d: Date | null) => onEvent('change', d)"
              @open="lastEvent = 'open'"
              @close="lastEvent = 'close'"
            />
            <p class="playground-state">
              Último evento: <strong>{{ lastEvent || '—' }}</strong>
            </p>
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="no-footer" class="playground-section">
        <div class="playground-heading">
          <h2>Sin footer (Hoy / Limpiar)</h2>
          <Badge color="neutral" title="todayButton / clearable por defecto">true</Badge>
        </div>
        <SectionDemo :vue-code="noFooterVue" :vanilla-code="noFooterVanilla">
          <div class="playground-col">
            <DatePicker model-value="2026-08-11" :today-button="false" :clearable="false" style="max-width: 280px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variantes del trigger</h2>
          <Badge color="neutral" title="Variante por defecto">soft</Badge>
        </div>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="playground-row">
            <DatePicker v-for="variant in variants" :key="variant" :variant="variant" model-value="2026-08-11" style="max-width: 260px;" />
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
            <DatePicker v-for="color in colors" :key="color" :color="color" model-value="2026-08-11" style="max-width: 240px;" />
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
                <DatePicker model-value="2026-08-11" style="max-width: 280px;" />
              </div>
            </div>
            <div class="playground-row">
              <div class="playground-position-demo"><strong>bottom + start</strong><DatePicker model-value="2026-08-11" position="bottom" align="start" style="max-width: 280px;" /></div>
              <div class="playground-position-demo"><strong>bottom + center</strong><DatePicker model-value="2026-08-11" position="bottom" align="center" style="max-width: 280px;" /></div>
              <div class="playground-position-demo"><strong>bottom + end</strong><DatePicker model-value="2026-08-11" position="bottom" align="end" style="max-width: 280px;" /></div>
            </div>
            <div class="playground-row">
              <div class="playground-position-demo playground-position-demo--top"><strong>top + start</strong><DatePicker model-value="2026-08-11" position="top" align="start" style="max-width: 280px;" /></div>
              <div class="playground-position-demo playground-position-demo--top"><strong>top + center</strong><DatePicker model-value="2026-08-11" position="top" align="center" style="max-width: 280px;" /></div>
              <div class="playground-position-demo playground-position-demo--top"><strong>top + end</strong><DatePicker model-value="2026-08-11" position="top" align="end" style="max-width: 280px;" /></div>
            </div>
            <div class="playground-row">
              <div class="playground-position-demo"><strong>right + start</strong><DatePicker model-value="2026-08-11" position="right" align="start" style="max-width: 280px;" /></div>
              <div class="playground-position-demo"><strong>right + center</strong><DatePicker model-value="2026-08-11" position="right" align="center" style="max-width: 280px;" /></div>
              <div class="playground-position-demo"><strong>right + end</strong><DatePicker model-value="2026-08-11" position="right" align="end" style="max-width: 280px;" /></div>
            </div>
            <div class="playground-row">
              <div class="playground-position-demo playground-position-demo--left"><strong>left + start</strong><DatePicker model-value="2026-08-11" position="left" align="start" style="max-width: 280px;" /></div>
              <div class="playground-position-demo playground-position-demo--left"><strong>left + center</strong><DatePicker model-value="2026-08-11" position="left" align="center" style="max-width: 280px;" /></div>
              <div class="playground-position-demo playground-position-demo--left"><strong>left + end</strong><DatePicker model-value="2026-08-11" position="left" align="end" style="max-width: 280px;" /></div>
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
            <DatePicker :disabled="true" model-value="2026-08-11" style="max-width: 280px;" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Métodos expuestos por el componente. Los botones operan sobre la instancia de abajo y el estado se lee en vivo.
        </p>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-col">
            <DatePicker
              ref="pickerRef"
              style="max-width: 280px;"
              @change="readProgState"
              @open="progIsOpen = true"
              @close="progIsOpen = false"
            />
            <p class="playground-state">
              getValue(): <strong>{{ progValue ? progValue.toISOString().slice(0, 10) : '—' }}</strong>
              · isOpen(): <strong>{{ progIsOpen ? 'true' : 'false' }}</strong>
            </p>
          </div>
        </SectionDemo>

        <h3 id="prog-open">open()</h3>
        <div class="playground-row">
          <Button color="neutral" @click="pickerRef?.open(); readProgState()">open()</Button>
        </div>

        <h3 id="prog-close">close()</h3>
        <div class="playground-row">
          <Button color="neutral" @click="pickerRef?.close(); readProgState()">close()</Button>
        </div>

        <h3 id="prog-toggle">toggle()</h3>
        <div class="playground-row">
          <Button color="neutral" @click="pickerRef?.toggle(); readProgState()">toggle()</Button>
        </div>

        <h3 id="prog-getvalue">getValue()</h3>
        <div class="playground-row">
          <Button color="neutral" @click="readProgState()">getValue()</Button>
        </div>

        <h3 id="prog-setvalue">setValue()</h3>
        <div class="playground-row">
          <Button color="neutral" @click="pickerRef?.setValue('2026-08-11'); readProgState()">setValue('2026-08-11')</Button>
        </div>

        <h3 id="prog-clear">clear()</h3>
        <div class="playground-row">
          <Button color="neutral" @click="pickerRef?.clear(); readProgState()">clear()</Button>
        </div>

        <h3 id="prog-isopen">isOpen()</h3>
        <div class="playground-row">
          <Button color="neutral" @click="readProgState()">isOpen()</Button>
        </div>
      </section>

      <hr class="playground-separator" />

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
