<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import DatePicker from "@/components/form/DatePicker.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const pickerRef = ref<InstanceType<typeof DatePicker> | null>(null);
const programmaticValue = ref<Date | null>(null);
const lastEvent = ref("");

function readValue() {
  programmaticValue.value = pickerRef.value?.getValue() ?? null;
}

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const variants = ["outlined", "soft", "ghost", "subtle"] as const;

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Placeholder', id: 'placeholder' },
  { label: 'Formato', id: 'format' },
  { label: 'Min / Max', id: 'min-max' },
  { label: 'Controles de mes', id: 'month-controls' },
  { label: 'Sin footer', id: 'no-footer' },
  { label: 'Variantes', id: 'variants' },
  { label: 'Colores', id: 'colors' },
  { label: 'Posiciones', id: 'positions' },
  { label: 'Programático', id: 'programmatic' },
  { label: 'Eventos', id: 'events' },
  { label: 'Disabled', id: 'disabled' },
];

function onEvent(name: string, payload: any) {
  lastEvent.value = `${name}: ${payload instanceof Date ? payload.toISOString().slice(0, 10) : JSON.stringify(payload)}`;
}
</script>

<template>
  <PlaygroundLayout title="DatePicker" :outlineItems="outlineItems">
    <div class="playground-date-picker">

      <section id="default" class="playground-section">
        <h2>Default</h2>
        <p class="playground-desc">
          Botón-trigger que abre un dropdown con el calendario adentro (no es una lista de items: es un box con el calendario).
        </p>
        <div class="playground-date-picker-col">
          <DatePicker style="max-width: 280px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="placeholder" class="playground-section">
        <h2>Placeholder</h2>
        <div class="playground-date-picker-col">
          <DatePicker placeholder="Elegí una fecha..." style="max-width: 280px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="format" class="playground-section">
        <h2>Formato de la fecha en el trigger</h2>
        <p class="playground-desc">
          Tokens: <code>dd</code>, <code>MM</code>, <code>MMM</code>, <code>MMMM</code>, <code>yy</code>, <code>yyyy</code>.
        </p>
        <div class="playground-date-picker-col">
          <DatePicker model-value="2026-08-11" format="dd/MM/yyyy" style="max-width: 280px;" />
          <DatePicker model-value="2026-08-11" format="MMMM yyyy" style="max-width: 280px;" />
          <DatePicker model-value="2026-08-11" format="dd-MM-yy" style="max-width: 280px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="min-max" class="playground-section">
        <h2>Min / Max</h2>
        <div class="playground-date-picker-col">
          <DatePicker model-value="2026-08-11" min="2026-01-01" max="2026-12-31" style="max-width: 280px;" />
          <p class="playground-desc">
            <strong>De → hasta + días deshabilitados en el medio:</strong> ventana 10-25 + fines de semana (<code>disabled-weekdays="0,6"</code>) y un feriado puntual (<code>disabled-dates</code>).
          </p>
          <DatePicker model-value="2026-08-11" min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" style="max-width: 280px;" />
          <DatePicker model-value="2026-08-11" min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" disabled-dates="2026-08-15" style="max-width: 280px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="month-controls" class="playground-section">
        <h2>Controles de mes (año)</h2>
        <p class="playground-desc">
          El calendario interno hereda <code>year-navigation</code> (botones « » para saltar de año, del MonthSlider) y <code>month-format</code>.
        </p>
        <div class="playground-date-picker-col">
          <DatePicker model-value="2026-08-11" year-navigation style="max-width: 280px;" />
          <DatePicker model-value="2026-08-11" year-navigation month-format="MMM yyyy" style="max-width: 280px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="no-footer" class="playground-section">
        <h2>Sin footer (Hoy / Limpiar)</h2>
        <div class="playground-date-picker-col">
          <DatePicker model-value="2026-08-11" :today-button="false" :clearable="false" style="max-width: 280px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="variants" class="playground-section">
        <h2>Variantes del trigger</h2>
        <div class="playground-date-picker-row">
          <DatePicker v-for="variant in variants" :key="variant" :variant="variant" model-value="2026-08-11" style="max-width: 260px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colores</h2>
        <div class="playground-date-picker-row">
          <DatePicker v-for="color in colors" :key="color" :color="color" model-value="2026-08-11" style="max-width: 240px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="positions" class="playground-section">
        <h2>Posición del panel</h2>
        <p class="playground-desc">
          El panel del calendario se posiciona con <code>position</code> (<code>bottom</code>/<code>top</code>),
          <code>align</code> (<code>start</code>/<code>center</code>/<code>end</code>) o <code>placement</code>
          (combinación tipo <code>top-start</code> que anula a los dos). <code>fixed</code> fija el panel al viewport
          (útil en contenedores con overflow).
        </p>
        <div class="playground-date-picker-row">
          <div class="playground-position-demo">
            <strong>default</strong>
            <DatePicker model-value="2026-08-11" style="max-width: 280px;" />
          </div>
          <div class="playground-position-demo playground-position-demo--top">
            <strong>position="top"</strong>
            <DatePicker model-value="2026-08-11" position="top" style="max-width: 280px;" />
          </div>
          <div class="playground-position-demo playground-position-demo--top">
            <strong>placement="top-start"</strong>
            <DatePicker model-value="2026-08-11" placement="top-start" style="max-width: 280px;" />
          </div>
          <div class="playground-position-demo playground-position-demo--top">
            <strong>placement="top-end"</strong>
            <DatePicker model-value="2026-08-11" placement="top-end" style="max-width: 280px;" />
          </div>
        </div>
        <div class="playground-date-picker-row">
          <div class="playground-position-demo">
            <strong>position="bottom" align="center"</strong>
            <DatePicker model-value="2026-08-11" position="bottom" align="center" style="max-width: 280px;" />
          </div>
          <div class="playground-position-demo">
            <strong>placement="bottom-end"</strong>
            <DatePicker model-value="2026-08-11" placement="bottom-end" style="max-width: 280px;" />
          </div>
          <div class="playground-position-demo playground-position-demo--top">
            <strong>position="top" align="end"</strong>
            <DatePicker model-value="2026-08-11" position="top" align="end" style="max-width: 280px;" />
          </div>
          <div class="playground-position-demo playground-position-demo--top">
            <strong>position="top" fixed</strong>
            <DatePicker model-value="2026-08-11" position="top" fixed style="max-width: 280px;" />
          </div>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Control programático</h2>
        <div class="playground-date-picker-row">
          <Button @click="pickerRef?.open(); readValue()" color="primary" variant="solid">open()</Button>
          <Button @click="pickerRef?.close(); readValue()" color="neutral" variant="ghost">close()</Button>
          <Button @click="pickerRef?.setValue('2026-12-24'); readValue()" color="success" variant="soft">setValue('2026-12-24')</Button>
          <Button @click="pickerRef?.clear(); readValue()" color="danger" variant="soft">clear()</Button>
        </div>
        <p class="playground-state">
          getValue(): <strong>{{ programmaticValue ? programmaticValue.toISOString().slice(0, 10) : '—' }}</strong>
        </p>
        <div class="playground-date-picker-col">
          <DatePicker ref="pickerRef" style="max-width: 280px;" @select="readValue" @change="readValue" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="events" class="playground-section">
        <h2>Eventos</h2>
        <div class="playground-date-picker-col">
          <DatePicker
            style="max-width: 280px;"
            @select="(d: Date) => onEvent('select', d)"
            @change="(d: Date | null) => onEvent('change', d)"
            @open="lastEvent = 'open'"
            @close="lastEvent = 'close'"
          />
          <p class="playground-state">último evento: <strong>{{ lastEvent || '—' }}</strong></p>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <h2>Disabled</h2>
        <div class="playground-date-picker-col">
          <DatePicker :disabled="true" model-value="2026-08-11" style="max-width: 280px;" />
        </div>
      </section>

    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-date-picker {
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

.playground-date-picker-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.playground-date-picker-row {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: flex-start;
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

.playground-state {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  margin: 0;
}
</style>
