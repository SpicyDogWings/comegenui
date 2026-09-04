<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import YearSlider from "@/components/controls/YearSlider.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const programmaticRef = ref<InstanceType<typeof YearSlider> | null>(null);
const programmaticValue = ref<number | null>(null);

function readValue() {
  programmaticValue.value = programmaticRef.value?.getValue() ?? null;
}

const variants = ["solid", "outlined", "soft", "ghost", "subtle"] as const;
const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Min / Max', id: 'min-max' },
  { label: 'Variantes', id: 'variants' },
  { label: 'Colores', id: 'colors' },
  { label: 'Programmatic', id: 'programmatic' },
  { label: 'Disabled', id: 'disabled' },
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
import YearSlider from '@/components/controls/YearSlider.vue'
import Button from '@/components/buttons/Button.vue'

const programmaticRef = ref(null)
const value = ref(null)

function readValue() {
  value.value = programmaticRef.value?.getValue() ?? null
}
\/script>

<template>
  <Button color="neutral" @click="programmaticRef.nextYear(); readValue()">nextYear()</Button>
  <Button color="neutral" @click="programmaticRef.prevYear(); readValue()">prevYear()</Button>
  <Button color="neutral" @click="programmaticRef.goToYear(2035); readValue()">goToYear(2035)</Button>
  <YearSlider ref="programmaticRef" @change="readValue" />
</template>`;

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'modelValue', type: 'number | string | null', default: 'null', description: 'Año (v-model)' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'solid, outlined, soft, ghost, subtle' },
  { name: 'min', type: 'number | string | null', default: 'null', description: 'Año mínimo' },
  { name: 'max', type: 'number | string | null', default: 'null', description: 'Año máximo' },
  { name: 'color', type: 'string', default: '"primary"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el control' },
];

const slotsData: { name: string; description: string }[] = [];

const eventsData = [
  { name: 'update:modelValue', type: '(value: number) => void', description: 'Al cambiar el año (v-model)' },
  { name: 'change', type: '(value: number) => void', description: 'Al cambiar el año' },
];

const exposesData = [
  { name: 'nextYear', type: '() => void', description: 'Avanza un año' },
  { name: 'prevYear', type: '() => void', description: 'Retrocede un año' },
  { name: 'goToYear', type: '(value: number | string) => void', description: 'Va al año indicado' },
  { name: 'getValue', type: '() => number | null', description: 'Devuelve el año actual' },
  { name: 'setValue', type: '(value: number | string) => void', description: 'Setea el año' },
];
</script>

<template>
  <PlaygroundLayout title="YearSlider" :outlineItems="outlineItems">
    <div class="playground-year-slider">

      <!-- Default -->
      <section id="default" class="playground-year-slider-section">
        <h2>Default</h2>
        <p class="playground-year-slider-desc">
          Muestra el año actual y navega de 1 en 1 con <code>&lt;</code> / <code>&gt;</code> o arrastrando el label (swipe: izquierda = año siguiente).
        </p>
        <div class="playground-year-slider-col">
          <YearSlider />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Min / Max -->
      <section id="min-max" class="playground-year-slider-section">
        <h2>Límites</h2>
        <p class="playground-year-slider-desc">
          Con <code>min</code> y <code>max</code> la navegación queda limitada: los botones se deshabilitan en el borde y el drag "choca" contra la pared (podés arrastrar el label).
          Acepta años (<code>2020</code>) o fechas estilo MonthSlider (<code>"2020-01-01"</code>).
        </p>
        <div class="playground-year-slider-col">
          <YearSlider :min="2020" :max="2030" />
          <YearSlider :min="2024" :max="2028" variant="outlined" />
          <YearSlider min="2020-01-01" max="2030-01-01" variant="soft" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Variantes -->
      <section id="variants" class="playground-year-slider-section">
        <h2>Variantes</h2>
        <div class="playground-year-slider-col">
          <YearSlider v-for="variant in variants" :key="variant" :variant="variant" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Colores -->
      <section id="colors" class="playground-year-slider-section">
        <h2>Colores</h2>
        <div class="playground-year-slider-col">
          <YearSlider v-for="color in colors" :key="color" :color="color" />
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
              <Button color="neutral" @click="programmaticRef?.nextYear(); readValue()">nextYear()</Button>
              <Button color="neutral" @click="programmaticRef?.prevYear(); readValue()">prevYear()</Button>
              <Button color="neutral" @click="programmaticRef?.goToYear(2035); readValue()">goToYear(2035)</Button>
            </div>
            <p class="playground-state">
              getValue(): <strong>{{ programmaticValue ?? '—' }}</strong>
            </p>
            <YearSlider ref="programmaticRef" @change="readValue" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <!-- Disabled -->
      <section id="disabled" class="playground-year-slider-section">
        <h2>Disabled</h2>
        <div class="playground-year-slider-col">
          <YearSlider :disabled="true" />
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
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-year-slider {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

.playground-year-slider h2 {
  font-size: var(--cu-font-size-lg);
  font-weight: var(--cu-font-weight-semibold);
  margin: 0;
  color: var(--cu-color-neutral);
}

.playground-year-slider-desc {
  margin: 0;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

.playground-year-slider-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.playground-year-slider-col {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  align-items: flex-start;
}

.playground-year-slider-row {
  display: flex;
  gap: var(--cu-space-sm);
  flex-wrap: wrap;
}

.playground-year-slider-state {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  margin: 0;
}
</style>
