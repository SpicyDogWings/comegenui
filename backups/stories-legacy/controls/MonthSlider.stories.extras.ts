import { defineComponent, h, ref } from "vue";
import MonthSlider from "@/components/controls/MonthSlider.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface MonthSliderInstance {
  nextMonth: () => void;
  prevMonth: () => void;
  nextYear: () => void;
  prevYear: () => void;
  goToMonth: (value: string | number | Date) => void;
  getValue: () => Date;
  setValue: (value: string | number | Date | null) => void;
}

const MonthSliderProgrammatic = defineComponent({
  name: "MonthSliderProgrammatic",
  setup() {
    const sliderRef = ref<InstanceType<typeof MonthSlider> | null>(null);
    const value = ref<string>("2025-03-01");
    const state = ref<string>("—");

    const instance = () => sliderRef.value as unknown as MonthSliderInstance | null;

    const read = () => {
      const slider = instance();
      if (slider) state.value = slider.getValue().toISOString().slice(0, 10);
    };

    const run = (action: (slider: MonthSliderInstance) => void) => {
      const slider = instance();
      if (slider) {
        action(slider);
        read();
      }
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: read }, () => "getValue()"),
          h(Button, { color: "neutral", onClick: () => run((s) => s.prevMonth()) }, () => "prevMonth()"),
          h(Button, { color: "neutral", onClick: () => run((s) => s.nextMonth()) }, () => "nextMonth()"),
          h(Button, { color: "neutral", onClick: () => run((s) => s.prevYear()) }, () => "prevYear()"),
          h(Button, { color: "neutral", onClick: () => run((s) => s.nextYear()) }, () => "nextYear()"),
          h(Button, { color: "neutral", onClick: () => run((s) => s.goToMonth("2030-06-01")) }, () => "goToMonth('2030-06-01')"),
        ]),
        h("p", { class: "playground-state" }, ["getValue(): ", h("strong", state.value)]),
        h(MonthSlider, {
          ref: sliderRef,
          modelValue: value.value,
          "onUpdate:modelValue": (next: Date) => {
            value.value = next.toISOString().slice(0, 10);
            state.value = next.toISOString().slice(0, 10);
          },
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import MonthSlider from '@/components/controls/MonthSlider.vue'
import Button from '@/components/buttons/Button.vue'

const sliderRef = ref(null)
const value = ref('2025-03-01')
const state = ref('—')

const read = () => (state.value = sliderRef.value.getValue().toISOString().slice(0, 10))
const run = (action) => { action(sliderRef.value); read() }
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="read()">getValue()</Button>
      <Button color="neutral" @click="run((s) => s.prevMonth())">prevMonth()</Button>
      <Button color="neutral" @click="run((s) => s.nextMonth())">nextMonth()</Button>
      <Button color="neutral" @click="run((s) => s.prevYear())">prevYear()</Button>
      <Button color="neutral" @click="run((s) => s.nextYear())">nextYear()</Button>
      <Button color="neutral" @click="run((s) => s.goToMonth('2030-06-01'))">goToMonth('2030-06-01')</Button>
    </div>
    <p class="playground-state">getValue(): <strong>{{ state }}</strong></p>
    <MonthSlider ref="sliderRef" v-model="value" @update:model-value="state = $event.toISOString().slice(0, 10)" />
  </div>
</template>`;

const MonthSliderEvents = defineComponent({
  name: "MonthSliderEvents",
  setup() {
    const log = ref<string[]>([]);
    const push = (label: string, value: Date) => {
      log.value = [`${label}: ${value.toISOString().slice(0, 10)}`, ...log.value].slice(0, 6);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("p", { class: "playground-state" }, log.value.length ? log.value.join(" · ") : "Sin eventos todavía"),
        h(MonthSlider, {
          modelValue: "2025-03-01",
          "onUpdate:modelValue": (value: Date) => push("update:modelValue", value),
          onChange: (value: Date) => push("change", value),
        }),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import MonthSlider from '@/components/controls/MonthSlider.vue'

const log = ref([])
const push = (label, value) => log.value.unshift(label + ': ' + value.toISOString().slice(0, 10))
<\/script>

<template>
  <p class="playground-state">{{ log.join(' · ') || 'Sin eventos todavía' }}</p>
  <MonthSlider model-value="2025-03-01" @update:model-value="push('update:modelValue', $event)" @change="push('change', $event)" />
</template>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: getValue(), setValue(), prevMonth(), nextMonth(), prevYear(), nextYear() y goToMonth() sobre la instancia de abajo.",
    render: () => h(MonthSliderProgrammatic),
    vue: programmaticVue,
  },
  {
    id: "events",
    title: "Events",
    description: "Log en vivo de update:modelValue y change (Date).",
    render: () => h(MonthSliderEvents),
    vue: eventsVue,
  },
];
