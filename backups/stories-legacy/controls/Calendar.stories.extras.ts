import { defineComponent, h, ref } from "vue";
import Calendar from "@/components/controls/Calendar.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface CalendarInstance {
  nextMonth: () => void;
  prevMonth: () => void;
  goToMonth: (value: string | number | Date) => void;
  getValue: () => Date | null;
  setValue: (value: string | number | Date | null) => void;
}

function formatDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "—");
}

/**
 * Programmatic: patio de juegos de los **exposes** de Calendar
 * (nextMonth/prevMonth/goToMonth/getValue/setValue) sobre una instancia en vivo.
 */
const CalendarProgrammatic = defineComponent({
  name: "CalendarProgrammatic",
  setup() {
    const calendarRef = ref<InstanceType<typeof Calendar> | null>(null);
    const value = ref<Date | null>(null);

    const instance = () => calendarRef.value as unknown as CalendarInstance | null;

    const readValue = () => {
      value.value = instance()?.getValue() ?? null;
    };

    const run = (action: (calendar: CalendarInstance) => void) => {
      const calendar = instance();
      if (!calendar) return;
      action(calendar);
      readValue();
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: () => run((cal) => cal.nextMonth()) }, () => "nextMonth()"),
          h(Button, { color: "neutral", onClick: () => run((cal) => cal.prevMonth()) }, () => "prevMonth()"),
          h(Button, { color: "neutral", onClick: () => run((cal) => cal.goToMonth("2030-06-01")) }, () => "goToMonth('2030-06-01')"),
          h(Button, { color: "neutral", onClick: () => run((cal) => cal.setValue("2026-12-24")) }, () => "setValue('2026-12-24')"),
        ]),
        h("p", { class: "playground-state" }, [
          "getValue(): ",
          h("strong", value.value ? formatDate(value.value) : "—"),
        ]),
        h(Calendar, {
          ref: calendarRef,
          style: "width: 300px;",
          onSelect: readValue,
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Calendar from '@/components/controls/Calendar.vue'
import Button from '@/components/buttons/Button.vue'

const calendarRef = ref(null)
const value = ref(null)

function readValue() {
  value.value = calendarRef.value?.getValue() ?? null
}
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="calendarRef?.nextMonth(); readValue()">nextMonth()</Button>
      <Button color="neutral" @click="calendarRef?.prevMonth(); readValue()">prevMonth()</Button>
      <Button color="neutral" @click="calendarRef?.goToMonth('2030-06-01'); readValue()">goToMonth('2030-06-01')</Button>
      <Button color="neutral" @click="calendarRef?.setValue('2026-12-24'); readValue()">setValue('2026-12-24')</Button>
    </div>
    <p>getValue(): {{ value ? value.toISOString().slice(0, 10) : '—' }}</p>
    <Calendar ref="calendarRef" style="width: 300px;" @select="readValue" />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="cal-prog-next" color="neutral">nextMonth()</cu-button>
  <cu-button id="cal-prog-prev" color="neutral">prevMonth()</cu-button>
  <cu-button id="cal-prog-go" color="neutral">goToMonth('2030-06-01')</cu-button>
  <cu-button id="cal-prog-set" color="neutral">setValue('2026-12-24')</cu-button>
</div>

<p>getValue(): <strong id="cal-prog-state">—</strong></p>

<cu-calendar id="cal-prog" style="width: 300px;"></cu-calendar>

<script>
  customElements.whenDefined('cu-calendar').then(() => {
    const calendar = document.getElementById('cal-prog');
    const state = document.getElementById('cal-prog-state');
    const read = () => (state.textContent = calendar.getValue() ? calendar.getValue().toISOString().slice(0, 10) : '—');
    document.getElementById('cal-prog-next').addEventListener('click', () => { calendar.nextMonth(); read(); });
    document.getElementById('cal-prog-prev').addEventListener('click', () => { calendar.prevMonth(); read(); });
    document.getElementById('cal-prog-go').addEventListener('click', () => { calendar.goToMonth('2030-06-01'); read(); });
    document.getElementById('cal-prog-set').addEventListener('click', () => { calendar.setValue('2026-12-24'); read(); });
    calendar.addEventListener('select', read);
  });
<\/script>`;

/**
 * Events: patio de **eventos** de Calendar con log en vivo.
 */
const CalendarEvents = defineComponent({
  name: "CalendarEvents",
  setup() {
    const log = ref<string[]>([]);

    const push = (name: string, value: unknown) => {
      const entry = `${name}: ${formatDate(value)}`;
      log.value = [entry, ...log.value].slice(0, 5);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h(Calendar, {
          modelValue: "2026-08-11",
          style: "width: 300px;",
          onSelect: (value: Date) => push("select", value),
          onChange: (value: Date) => push("change", value),
          "onUpdate:modelValue": (value: Date) => push("update:modelValue", value),
        }),
        h("div", { class: "playground-state" }, [
          h("p", null, ["Eventos (últimos 5):"]),
          log.value.length
            ? h(
                "ul",
                { style: "margin:0;padding-left:1rem" },
                log.value.map((entry, index) => h("li", { key: index }, entry)),
              )
            : h("p", { style: "margin:0" }, "Click en un día para ver los eventos."),
        ]),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import Calendar from '@/components/controls/Calendar.vue'

const log = ref([])
const push = (name, value) => {
  log.value = [\`\${name}: \${value.toISOString().slice(0, 10)}\`, ...log.value].slice(0, 5)
}
<\/script>

<template>
  <Calendar
    model-value="2026-08-11"
    style="width:300px"
    @select="(v) => push('select', v)"
    @change="(v) => push('change', v)"
    @update:model-value="(v) => push('update:modelValue', v)"
  />
  <ul>
    <li v-for="(entry, i) in log" :key="i">{{ entry }}</li>
  </ul>
</template>`;

const eventsVanilla = `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar id="cal-events-patio" model-value="2026-08-11" style="width:300px"></cu-calendar>
<ul id="cal-events-log"></ul>

<script>
  customElements.whenDefined('cu-calendar').then(() => {
    const calendar = document.getElementById('cal-events-patio');
    const log = document.getElementById('cal-events-log');
    const push = (name, e) => {
      const value = e.detail instanceof Date ? e.detail.toISOString().slice(0, 10) : e.detail;
      const li = document.createElement('li');
      li.textContent = name + ': ' + value;
      log.prepend(li);
    };
    calendar.addEventListener('select', (e) => push('select', e));
    calendar.addEventListener('change', (e) => push('change', e));
    calendar.addEventListener('update:modelValue', (e) => push('update:modelValue', e));
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: nextMonth(), prevMonth(), goToMonth(), getValue() y setValue() sobre la instancia de abajo.",
    render: () => h(CalendarProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
  {
    id: "events",
    title: "Events",
    description: "Una instancia de Calendar y el log en vivo de select, change y update:modelValue.",
    render: () => h(CalendarEvents),
    vue: eventsVue,
    vanilla: eventsVanilla,
  },
];
