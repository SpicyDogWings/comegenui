import { defineComponent, h, ref } from "vue";
import DatePickerRange from "@/components/form/DatePickerRange.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

const fmtIso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "—");

/**
 * Programmatic: patio de los exposes de DatePickerRange
 * (open/close/toggle/setRange/clear + getStartDate/getEndDate) sobre una
 * instancia en vivo con v-model:start-date / v-model:end-date.
 */
const DatePickerRangeProgrammatic = defineComponent({
  name: "DatePickerRangeProgrammatic",
  setup() {
    const rangeRef = ref<InstanceType<typeof DatePickerRange> | null>(null);
    const getStart = ref<Date | null>(null);
    const getEnd = ref<Date | null>(null);
    const isOpen = ref(false);

    const read = () => {
      getStart.value = rangeRef.value?.getStartDate() ?? null;
      getEnd.value = rangeRef.value?.getEndDate() ?? null;
    };

    const run = (action: (instance: NonNullable<typeof rangeRef.value>) => void) => {
      if (rangeRef.value) action(rangeRef.value);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: () => run((r) => r.open()) }, () => "open()"),
          h(Button, { color: "neutral", onClick: () => run((r) => r.close()) }, () => "close()"),
          h(Button, { color: "neutral", onClick: () => run((r) => r.toggle()) }, () => "toggle()"),
          h(
            Button,
            { color: "neutral", onClick: () => run((r) => r.setRange("2026-09-03", "2026-09-15")) },
            () => "setRange()",
          ),
          h(Button, { color: "neutral", onClick: () => run((r) => r.clear()) }, () => "clear()"),
        ]),
        h(
          "p",
          { class: "playground-state" },
          `getStartDate(): ${fmtIso(getStart.value)} · getEndDate(): ${fmtIso(getEnd.value)} · isOpen(): ${
            isOpen.value ? "true" : "false"
          }`,
        ),
        h(DatePickerRange, {
          ref: rangeRef,
          style: "max-width: 320px;",
          "onUpdate:startDate": (value: Date | null) => {
            getStart.value = value;
          },
          "onUpdate:endDate": (value: Date | null) => {
            getEnd.value = value;
          },
          onChange: read,
          onOpen: () => {
            isOpen.value = true;
          },
          onClose: () => {
            isOpen.value = false;
          },
        }),
      ]);
  },
});

/**
 * Events: una instancia + log en vivo de los eventos propios del rango.
 */
const DatePickerRangeEvents = defineComponent({
  name: "DatePickerRangeEvents",
  setup() {
    const log = ref<string[]>([]);
    const push = (event: string, payload?: unknown) => {
      const detail =
        payload && typeof payload === "object" && "start" in (payload as Record<string, unknown>)
          ? (() => {
              const range = payload as { start: Date | null; end: Date | null };
              return `${fmtIso(range.start)} → ${fmtIso(range.end)}`;
            })()
          : fmtIso((payload as Date | null | undefined) ?? null);
      log.value = [`${event} (${detail})`, ...log.value].slice(0, 10);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("p", { class: "playground-state" }, log.value.length ? log.value.join(" · ") : "Sin eventos todavía"),
        h(DatePickerRange, {
          style: "max-width: 320px;",
          onOpen: () => push("open"),
          onClose: () => push("close"),
          "onUpdate:startDate": (value: Date | null) => push("update:startDate", value),
          "onUpdate:endDate": (value: Date | null) => push("update:endDate", value),
          onChange: (value: { start: Date | null; end: Date | null }) => push("change", value),
          onSelect: (value: { start: Date | null; end: Date | null }) => push("select", value),
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import DatePickerRange from '@/components/form/DatePickerRange.vue'
import Button from '@/components/buttons/Button.vue'

const rangeRef = ref(null)
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="rangeRef?.open()">open()</Button>
      <Button color="neutral" @click="rangeRef?.close()">close()</Button>
      <Button color="neutral" @click="rangeRef?.toggle()">toggle()</Button>
      <Button color="neutral" @click="rangeRef?.setRange('2026-09-03', '2026-09-15')">setRange()</Button>
      <Button color="neutral" @click="rangeRef?.clear()">clear()</Button>
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

const eventsVue = `<script setup>
import DatePickerRange from '@/components/form/DatePickerRange.vue'

const onChange = (range) => console.log('change', range)
<\/script>

<template>
  <DatePickerRange @change="onChange" @open="console.log('open')" @close="console.log('close')" />
</template>`;

const eventsVanilla = `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range id="range-events-extra"></cu-date-picker-range>

<script>
  customElements.whenDefined('cu-date-picker-range').then(() => {
    const range = document.getElementById('range-events-extra');
    ['open', 'close', 'change', 'select'].forEach((name) =>
      range.addEventListener(name, (e) => console.log(name, e.detail)),
    );
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de los exposes: open(), close(), toggle(), setRange() y clear(), con getStartDate()/getEndDate() en vivo.",
    render: () => h(DatePickerRangeProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
  {
    id: "events",
    title: "Events",
    description: "Una instancia y el log en vivo de los eventos: open, close, update:startDate, update:endDate, select y change.",
    render: () => h(DatePickerRangeEvents),
    vue: eventsVue,
    vanilla: eventsVanilla,
  },
];
