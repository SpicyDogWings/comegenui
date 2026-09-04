<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import MonthSlider from "@/components/controls/MonthSlider.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const programmaticRef = ref<InstanceType<typeof MonthSlider> | null>(null);
const programmaticValue = ref<Date | null>(null);

function readValue() {
  programmaticValue.value = programmaticRef.value?.getValue() ?? null;
}

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Sin año', id: 'no-year-nav' },
  { label: 'Formatos', id: 'formats' },
  { label: 'Año distinto', id: 'other-year' },
  { label: 'Variantes', id: 'variants' },
  { label: 'Min / Max', id: 'min-max' },
  { label: 'Colores', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Programmatic', id: 'programmatic' },
  {
    label: 'API',
    id: 'api',
    children: [
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
    ],
  },
];

const programmaticVue = `<script setup>
import { ref } from 'vue'
import MonthSlider from '@/components/controls/MonthSlider.vue'
import Button from '@/components/buttons/Button.vue'

const programmaticRef = ref(null)
const value = ref(null)

function readValue() {
  value.value = programmaticRef.value?.getValue() ?? null
}
\/script>

<template>
  <Button color="neutral" @click="programmaticRef.nextMonth(); readValue()">nextMonth()</Button>
  <Button color="neutral" @click="programmaticRef.prevMonth(); readValue()">prevMonth()</Button>
  <Button color="neutral" @click="programmaticRef.nextYear(); readValue()">nextYear()</Button>
  <Button color="neutral" @click="programmaticRef.prevYear(); readValue()">prevYear()</Button>
  <Button color="neutral" @click="programmaticRef.goToMonth('2030-06-01'); readValue()">goToMonth('2030-06-01')</Button>
  <MonthSlider ref="programmaticRef" @change="readValue" />
</template>`;

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'string | number | Date | null', default: 'null', description: 'Valor (v-model)' },
  { name: 'monthFormat', type: 'string', default: '"MMMM"', description: 'Formato del mes (tokens MM MMM MMMM)' },
  { name: 'yearFormat', type: 'string', default: '"yyyy"', description: 'Formato del año (tokens yy yyyy)' },
  { name: 'locale', type: 'string', default: '"es"', description: 'Locale de los nombres' },
  { name: 'yearNavigation', type: 'boolean', default: 'true', description: 'Habilita navegación de años (‹ ‹‹)' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'solid, outlined, soft, ghost, subtle' },
  { name: 'min', type: 'string | number | Date | null', default: 'null', description: 'Mes mínimo' },
  { name: 'max', type: 'string | number | Date | null', default: 'null', description: 'Mes máximo' },
  { name: 'color', type: 'string', default: '"primary"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el control' },
];

const slotsData: { name: string; description: string }[] = [];

const eventsData = [
  { name: 'update:modelValue', type: '(value: Date) => void', description: 'Al cambiar el mes (v-model)' },
  { name: 'change', type: '(value: Date) => void', description: 'Al cambiar el mes' },
];

const exposesData = [
  { name: 'nextMonth', type: '() => void', description: 'Avanza un mes' },
  { name: 'prevMonth', type: '() => void', description: 'Retrocede un mes' },
  { name: 'nextYear', type: '() => void', description: 'Avanza un año' },
  { name: 'prevYear', type: '() => void', description: 'Retrocede un año' },
  { name: 'goToMonth', type: '(value: string | number | Date) => void', description: 'Va al mes indicado' },
  { name: 'getValue', type: '() => Date | null', description: 'Devuelve el valor actual' },
  { name: 'setValue', type: '(value: string | number | Date) => void', description: 'Setea el valor' },
];
</script>

<template>
  <PlaygroundLayout title="MonthSlider" :outlineItems="outlineItems">
    <div class="playground-month-slider">

      <!-- Default -->
      <section id="default" class="playground-month-slider-section">
        <h2>Default</h2>
        <p class="playground-month-slider-desc">
          Muestra el mes actual. Si el año es el actual, el año se oculta; si navegás a otro año, aparece al lado del mes.
        </p>
        <div class="playground-month-slider-col">
          <MonthSlider />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Sin navegación de año -->
      <section id="no-year-nav" class="playground-month-slider-section">
        <h2>Sin navegación de año</h2>
        <p class="playground-month-slider-desc">
          Con <code>year-navigation="false"</code> se ocultan los botones <code>&lt;&lt;</code> / <code>&gt;&gt;</code>.
        </p>
        <div class="playground-month-slider-col">
          <MonthSlider :year-navigation="false" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Formatos -->
      <section id="formats" class="playground-month-slider-section">
        <h2>Formatos</h2>
        <p class="playground-month-slider-desc">
          Tokens: <code>MMMM</code> (largo), <code>MMM</code> (corto), <code>MM</code>/<code>M</code> (número), <code>yyyy</code>/<code>yy</code> (año).
          Si el formato incluye año, se respeta tal cual.
        </p>
        <div class="playground-month-slider-col">
          <MonthSlider month-format="MMMM" />
          <MonthSlider month-format="MMM" />
          <MonthSlider month-format="MMMM yyyy" />
          <MonthSlider month-format="MM/yyyy" />
          <MonthSlider month-format="MMM yy" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Año distinto al actual -->
      <section id="other-year" class="playground-month-slider-section">
        <h2>Año distinto al actual</h2>
        <p class="playground-month-slider-desc">
          Con <code>model-value="2025-03-01"</code> el año aparece automáticamente porque no es el año en curso.
        </p>
        <div class="playground-month-slider-col">
          <MonthSlider model-value="2025-03-01" />
          <MonthSlider model-value="2027-11-15" month-format="MMM" />
          <MonthSlider model-value="2025-03-01" variant="solid" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Variantes -->
      <section id="variants" class="playground-month-slider-section">
        <h2>Variantes</h2>
        <p class="playground-month-slider-desc">
          El label acepta <code>solid</code>, <code>outlined</code>, <code>soft</code> (default), <code>ghost</code> y <code>subtle</code>.
        </p>
        <div class="playground-month-slider-col">
          <MonthSlider v-for="variant in variants" :key="variant" :variant="variant" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Min / Max -->
      <section id="min-max" class="playground-month-slider-section">
        <h2>Fechas mínima y máxima</h2>
        <p class="playground-month-slider-desc">
          Con <code>min</code> y <code>max</code> la navegación queda limitada: los botones se deshabilitan al llegar al borde y el drag se recorta.
        </p>
        <div class="playground-month-slider-col">
          <MonthSlider min="2026-01-01" max="2026-12-01" />
          <MonthSlider min="2024-06-01" max="2028-06-01" month-format="MMM yyyy" variant="outlined" />
          <MonthSlider min="2026-05-01" model-value="2025-01-01" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Colores -->
      <section id="colors" class="playground-month-slider-section">
        <h2>Colores</h2>
        <div class="playground-month-slider-col">
          <MonthSlider v-for="color in colors" :key="color" :color="color" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Disabled -->
      <section id="disabled" class="playground-month-slider-section">
        <h2>Disabled</h2>
        <div class="playground-month-slider-col">
          <MonthSlider :disabled="true" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Programático -->
      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo.
        </p>
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="programmaticRef?.nextMonth(); readValue()">nextMonth()</Button>
              <Button color="neutral" @click="programmaticRef?.prevMonth(); readValue()">prevMonth()</Button>
              <Button color="neutral" @click="programmaticRef?.nextYear(); readValue()">nextYear()</Button>
              <Button color="neutral" @click="programmaticRef?.prevYear(); readValue()">prevYear()</Button>
              <Button color="neutral" @click="programmaticRef?.goToMonth('2030-06-01'); readValue()">goToMonth('2030-06-01')</Button>
            </div>
            <p class="playground-state">
              getValue(): <strong>{{ programmaticValue ? programmaticValue.toISOString().slice(0, 10) : '—' }}</strong>
            </p>
            <MonthSlider ref="programmaticRef" @change="readValue" />
          </div>
        </SectionDemo>
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
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-month-slider {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.playground-month-slider h2 {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  margin: 0;
  color: var(--cu-color-neutral);
}

.playground-month-slider-desc {
  margin: 0;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

.playground-month-slider-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.playground-month-slider-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}

.playground-month-slider-row {
  display: flex;
  gap: var(--cu-space-sm);
  flex-wrap: wrap;
}

.playground-month-slider-state {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  margin: 0;
}
</style>
