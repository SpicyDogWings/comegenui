<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import DatePickerRange from "@/components/form/DatePickerRange.vue";
import Button from "@/components/buttons/Button.vue";
import { ref } from "vue";

const rangeRef = ref<InstanceType<typeof DatePickerRange> | null>(null);
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const variants = ["outlined", "soft", "ghost", "subtle"] as const;

const outlineItems = [
  { label: 'Default', id: 'default' },
  { label: 'Label', id: 'label' },
  { label: 'Placeholder', id: 'placeholder' },
  { label: 'Formato', id: 'format' },
  { label: 'Min / Max', id: 'min-max' },
  { label: 'Dual Calendar', id: 'dual-calendar' },
  { label: 'Colores', id: 'colors' },
  { label: 'Programático', id: 'programmatic' },
  { label: 'Eventos', id: 'events' },
  { label: 'Disabled', id: 'disabled' },
];

const now = new Date();
const y = now.getFullYear();
const m = String(now.getMonth() + 1).padStart(2, '0');
const d = (day: number) => `${y}-${m}-${String(day).padStart(2, '0')}`;

const rangeEvents = [
  { date: d(3), color: 'primary' },
  { date: d(7), color: 'success' },
  { date: d(11), color: 'warning' },
  { date: d(15), color: 'danger' },
  { date: d(18), color: 'primary' },
  { date: d(22), color: 'success' },
  { date: d(25), color: 'warning' },
  { date: d(11), color: 'danger' },
];

function fmt(d: Date | null) {
  return d ? d.toISOString().slice(0, 10) : '—';
}
</script>

<template>
  <PlaygroundLayout title="DatePickerRange" :outlineItems="outlineItems">
    <div class="playground-date-picker-range">

      <section id="default" class="playground-section">
        <h2>Default</h2>
        <p class="playground-desc">
          Selector de rango: primer click define el inicio, segundo click define el fin. Si el segundo es anterior, se swapea automáticamente.
        </p>
        <div class="playground-dp-range-col">
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
      </section>

      <hr class="playground-separator" />

      <section id="label" class="playground-section">
        <h2>Label</h2>
        <div class="playground-dp-range-col">
          <DatePickerRange label="Período de análisis" style="max-width: 320px;" />
          <DatePickerRange label="Fecha de entrega" color="primary" style="max-width: 320px;" />
          <DatePickerRange label="Vacaciones" color="success" variant="outlined" style="max-width: 320px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="placeholder" class="playground-section">
        <h2>Placeholder</h2>
        <div class="playground-dp-range-col">
          <DatePickerRange placeholder="Elegí un rango de fechas..." style="max-width: 320px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="format" class="playground-section">
        <h2>Formato del rango en el trigger</h2>
        <p class="playground-desc">
          Tokens: <code>dd</code>, <code>MM</code>, <code>MMM</code>, <code>MMMM</code>, <code>yy</code>, <code>yyyy</code>.
        </p>
        <div class="playground-dp-range-col">
          <DatePickerRange start-date="2026-09-03" end-date="2026-09-15" format="dd/MM/yyyy" style="max-width: 320px;" />
          <DatePickerRange start-date="2026-09-03" end-date="2026-09-15" format="MMM dd" style="max-width: 320px;" />
          <DatePickerRange start-date="2026-09-03" end-date="2026-09-15" format="dd-MM-yy" style="max-width: 320px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="min-max" class="playground-section">
        <h2>Min / Max</h2>
        <div class="playground-dp-range-col">
          <DatePickerRange start-date="2026-09-05" end-date="2026-09-20" min="2026-01-01" max="2026-12-31" style="max-width: 320px;" />
          <p class="playground-desc">
            <strong>Con días deshabilitados:</strong> ventana del 10 al 25 + fines de semana (<code>disabled-weekdays="0,6"</code>).
          </p>
          <DatePickerRange min="2026-09-10" max="2026-09-25" disabled-weekdays="0,6" style="max-width: 320px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="dual-calendar" class="playground-section">
        <h2>Dual Calendar</h2>
        <p class="playground-desc">
          <code>dual-calendar</code> muestra dos meses lado a lado — ideal para rangos que cruzan meses.
        </p>
        <div class="playground-dp-range-col">
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
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colores</h2>
        <div class="playground-dp-range-row">
          <DatePickerRange v-for="color in colors" :key="color" :color="color" start-date="2026-09-03" end-date="2026-09-07" style="max-width: 240px;" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Control programático</h2>
        <div class="playground-dp-range-row">
          <Button @click="rangeRef?.setRange('2026-09-01', '2026-09-15')" color="primary" variant="solid">setRange('2026-09-01', '2026-09-15')</Button>
          <Button @click="rangeRef?.clear()" color="danger" variant="soft">clear()</Button>
          <Button @click="rangeRef?.open()" color="neutral" variant="ghost">open()</Button>
          <Button @click="rangeRef?.close()" color="neutral" variant="ghost">close()</Button>
        </div>
        <div class="playground-dp-range-col">
          <DatePickerRange
            ref="rangeRef"
            style="max-width: 320px;"
            @update:start-date="startDate = $event"
            @update:end-date="endDate = $event"
          />
          <p class="playground-state">
            getStartDate(): <strong>{{ fmt(rangeRef?.getStartDate() ?? null) }}</strong> |
            getEndDate(): <strong>{{ fmt(rangeRef?.getEndDate() ?? null) }}</strong>
          </p>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="events" class="playground-section">
        <h2>Eventos (puntos en el calendario)</h2>
        <p class="playground-desc">
          Puntos bajo las fechas para señalar eventos. Compatible con rangos.
        </p>
        <div class="playground-dp-range-col">
          <DatePickerRange
            style="max-width: 320px;"
            :events="rangeEvents"
            :start-date="startDate"
            :end-date="endDate"
            @update:start-date="startDate = $event"
            @update:end-date="endDate = $event"
          />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <h2>Disabled</h2>
        <div class="playground-dp-range-col">
          <DatePickerRange :disabled="true" start-date="2026-09-03" end-date="2026-09-15" style="max-width: 320px;" />
        </div>
      </section>

    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-date-picker-range {
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

.playground-dp-range-col {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: flex-start;
}

.playground-dp-range-row {
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
