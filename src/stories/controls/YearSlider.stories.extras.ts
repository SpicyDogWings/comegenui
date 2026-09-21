import { defineComponent, h, ref } from "vue";
import YearSlider from "@/components/controls/YearSlider.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface YearSliderInstance {
  nextYear: () => void;
  prevYear: () => void;
  goToYear: (value: number | string) => void;
  getValue: () => number;
  setValue: (value: number | string | null) => void;
}

const YearSliderProgrammatic = defineComponent({
  name: "YearSliderProgrammatic",
  setup() {
    const sliderRef = ref<InstanceType<typeof YearSlider> | null>(null);
    const value = ref(2025);
    const state = ref<string>("—");

    const instance = () => sliderRef.value as unknown as YearSliderInstance | null;

    const read = () => {
      const slider = instance();
      if (slider) state.value = String(slider.getValue());
    };

    const run = (action: (slider: YearSliderInstance) => void) => {
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
          h(Button, { color: "neutral", onClick: () => run((s) => s.prevYear()) }, () => "prevYear()"),
          h(Button, { color: "neutral", onClick: () => run((s) => s.nextYear()) }, () => "nextYear()"),
          h(Button, { color: "neutral", onClick: () => run((s) => s.goToYear(2030)) }, () => "goToYear(2030)"),
          h(Button, { color: "neutral", onClick: () => run((s) => s.setValue("2020-06-01")) }, () => "setValue('2020-06-01')"),
        ]),
        h("p", { class: "playground-state" }, ["getValue(): ", h("strong", state.value)]),
        h(YearSlider, {
          ref: sliderRef,
          modelValue: value.value,
          min: 2015,
          max: 2035,
          "onUpdate:modelValue": (next: number) => {
            value.value = next;
            state.value = String(next);
          },
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import YearSlider from '@/components/controls/YearSlider.vue'
import Button from '@/components/buttons/Button.vue'

const sliderRef = ref(null)
const value = ref(2025)
const state = ref('—')

const read = () => (state.value = String(sliderRef.value.getValue()))
const run = (action) => { action(sliderRef.value); read() }
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="read()">getValue()</Button>
      <Button color="neutral" @click="run((s) => s.prevYear())">prevYear()</Button>
      <Button color="neutral" @click="run((s) => s.nextYear())">nextYear()</Button>
      <Button color="neutral" @click="run((s) => s.goToYear(2030))">goToYear(2030)</Button>
      <Button color="neutral" @click="run((s) => s.setValue('2020-06-01'))">setValue('2020-06-01')</Button>
    </div>
    <p class="playground-state">getValue(): <strong>{{ state }}</strong></p>
    <YearSlider ref="sliderRef" v-model="value" :min="2015" :max="2035" @update:model-value="state = String($event)" />
  </div>
</template>`;

const YearSliderEvents = defineComponent({
  name: "YearSliderEvents",
  setup() {
    const log = ref<string[]>([]);
    const push = (label: string, value: number) => {
      log.value = [`${label}: ${value}`, ...log.value].slice(0, 6);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("p", { class: "playground-state" }, log.value.length ? log.value.join(" · ") : "Sin eventos todavía"),
        h(YearSlider, {
          modelValue: 2025,
          "onUpdate:modelValue": (value: number) => push("update:modelValue", value),
          onChange: (value: number) => push("change", value),
        }),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import YearSlider from '@/components/controls/YearSlider.vue'

const log = ref([])
const push = (label, value) => log.value.unshift(label + ': ' + value)
<\/script>

<template>
  <p class="playground-state">{{ log.join(' · ') || 'Sin eventos todavía' }}</p>
  <YearSlider :model-value="2025" @update:model-value="push('update:modelValue', $event)" @change="push('change', $event)" />
</template>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: getValue(), setValue(), prevYear(), nextYear() y goToYear() sobre la instancia de abajo.",
    render: () => h(YearSliderProgrammatic),
    vue: programmaticVue,
  },
  {
    id: "events",
    title: "Events",
    description: "Log en vivo de update:modelValue y change.",
    render: () => h(YearSliderEvents),
    vue: eventsVue,
  },
];
