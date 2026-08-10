<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
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
  { label: 'Programático', id: 'programmatic' },
  { label: 'Disabled', id: 'disabled' },
];
</script>

<template>
  <PlaygroundLayout title="YearSlider" :outlineItems="outlineItems">
    <div class="playground-year-slider">

      <!-- Default -->
      <section id="default" class="playground-year-slider-section">
        <h2>Default</h2>
        <p class="playground-year-slider-desc">
          Muestra el año actual y navega de 1 en 1 con <code>&lt;</code> / <code>&gt;</code>.
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
          Con <code>min</code> y <code>max</code> la navegación queda limitada y los botones se deshabilitan en el borde.
        </p>
        <div class="playground-year-slider-col">
          <YearSlider :min="2020" :max="2030" />
          <YearSlider :min="2024" :max="2028" variant="outlined" />
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
      <section id="programmatic" class="playground-year-slider-section">
        <h2>Control programático</h2>
        <div class="playground-year-slider-row">
          <Button @click="programmaticRef?.nextYear(); readValue()" color="primary" variant="solid">nextYear()</Button>
          <Button @click="programmaticRef?.prevYear(); readValue()" color="neutral" variant="ghost">prevYear()</Button>
          <Button @click="programmaticRef?.goToYear(2035); readValue()" color="success" variant="soft">goToYear(2035)</Button>
        </div>
        <p class="playground-year-slider-state">
          getValue(): <strong>{{ programmaticValue ?? '—' }}</strong>
        </p>
        <div class="playground-year-slider-col">
          <YearSlider ref="programmaticRef" @change="readValue" />
        </div>
      </section>

      <hr class="playground-separator" />

      <!-- Disabled -->
      <section id="disabled" class="playground-year-slider-section">
        <h2>Disabled</h2>
        <div class="playground-year-slider-col">
          <YearSlider :disabled="true" />
        </div>
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
