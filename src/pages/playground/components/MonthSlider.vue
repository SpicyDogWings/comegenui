<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import MonthSlider from "@/components/form/MonthSlider.vue";
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
  { label: 'Sensibilidad', id: 'sensitivity' },
  { label: 'Programático', id: 'programmatic' },
  { label: 'Colores', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
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

      <!-- Sensibilidad -->
      <section id="sensitivity" class="playground-month-slider-section">
        <h2>Sensibilidad del drag</h2>
        <p class="playground-month-slider-desc">
          Por defecto <strong>una deslizada = un mes</strong> (sin importar la velocidad). Con <code>drag-steps</code> podés
          avanzar varios meses por gesto, y con <code>drag-threshold</code> ajustás los píxeles necesarios (menor = más sensible).
        </p>
        <div class="playground-month-slider-col">
          <MonthSlider />
          <MonthSlider :drag-steps="3" />
          <MonthSlider :drag-threshold="16" />
          <MonthSlider :drag-threshold="96" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Programático -->
      <section id="programmatic" class="playground-month-slider-section">
        <h2>Control programático</h2>
        <div class="playground-month-slider-row">
          <Button @click="programmaticRef?.nextMonth(); readValue()" color="primary" variant="solid">nextMonth()</Button>
          <Button @click="programmaticRef?.prevMonth(); readValue()" color="neutral" variant="ghost">prevMonth()</Button>
          <Button @click="programmaticRef?.nextYear(); readValue()" color="primary" variant="outlined">nextYear()</Button>
          <Button @click="programmaticRef?.prevYear(); readValue()" color="neutral" variant="ghost">prevYear()</Button>
          <Button @click="programmaticRef?.goToMonth('2030-06-01'); readValue()" color="success" variant="soft">goToMonth('2030-06-01')</Button>
        </div>
        <p class="playground-month-slider-state">
          getValue(): <strong>{{ programmaticValue ? programmaticValue.toISOString().slice(0, 10) : '—' }}</strong>
        </p>
        <div class="playground-month-slider-col">
          <MonthSlider ref="programmaticRef" @change="readValue" />
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
