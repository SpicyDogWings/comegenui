import { defineComponent, h, ref } from "vue";
import DatePicker from "@/components/form/DatePicker.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface DatePickerInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
  getValue: () => Date | null;
  setValue: (value: string | number | Date | null) => void;
  clear: () => void;
  isOpen: () => boolean;
}

function formatDate(value: unknown): string {
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  return String(value ?? "—");
}

/**
 * Programmatic: patio de juegos de los **exposes** de DatePicker
 * (open/close/toggle/getValue/setValue/clear/isOpen) sobre una instancia en vivo.
 */
const DatePickerProgrammatic = defineComponent({
  name: "DatePickerProgrammatic",
  setup() {
    const pickerRef = ref<InstanceType<typeof DatePicker> | null>(null);
    const value = ref<Date | null>(null);
    const isOpen = ref(false);

    const instance = () => pickerRef.value as unknown as DatePickerInstance | null;

    const read = () => {
      value.value = instance()?.getValue() ?? null;
      isOpen.value = instance()?.isOpen() ?? false;
    };

    const run = (action: (picker: DatePickerInstance) => void) => {
      const picker = instance();
      if (!picker) return;
      action(picker);
      read();
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: () => run((picker) => picker.open()) }, () => "open()"),
          h(Button, { color: "neutral", onClick: () => run((picker) => picker.close()) }, () => "close()"),
          h(Button, { color: "neutral", onClick: () => run((picker) => picker.toggle()) }, () => "toggle()"),
          h(Button, { color: "neutral", onClick: () => run((picker) => picker.setValue("2026-08-11")) }, () => "setValue()"),
          h(Button, { color: "neutral", onClick: () => run((picker) => picker.clear()) }, () => "clear()"),
        ]),
        h("p", { class: "playground-state" }, [
          "getValue(): ",
          h("strong", value.value ? formatDate(value.value) : "—"),
          " · isOpen(): ",
          h("strong", String(isOpen.value)),
        ]),
        h(DatePicker, {
          ref: pickerRef,
          style: "max-width:280px",
          onChange: read,
          onSelect: read,
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

const programmaticVue = `<script setup>
import { ref } from 'vue'
import DatePicker from '@/components/form/DatePicker.vue'
import Button from '@/components/buttons/Button.vue'

const pickerRef = ref(null)
const value = ref(null)
const isOpen = ref(false)

function read() {
  value.value = pickerRef.value?.getValue() ?? null
  isOpen.value = pickerRef.value?.isOpen() ?? false
}
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="pickerRef?.open(); read()">open()</Button>
      <Button color="neutral" @click="pickerRef?.close(); read()">close()</Button>
      <Button color="neutral" @click="pickerRef?.toggle(); read()">toggle()</Button>
      <Button color="neutral" @click="pickerRef?.setValue('2026-08-11'); read()">setValue()</Button>
      <Button color="neutral" @click="pickerRef?.clear(); read()">clear()</Button>
    </div>
    <p class="playground-state">
      getValue(): <strong>{{ value ? value.toISOString().slice(0, 10) : '—' }}</strong>
      · isOpen(): <strong>{{ isOpen ? 'true' : 'false' }}</strong>
    </p>
    <DatePicker ref="pickerRef" style="max-width:280px" @change="read" @open="isOpen = true" @close="isOpen = false" />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="picker-prog-open" color="neutral">open()</cu-button>
  <cu-button id="picker-prog-close" color="neutral">close()</cu-button>
  <cu-button id="picker-prog-toggle" color="neutral">toggle()</cu-button>
  <cu-button id="picker-prog-set" color="neutral">setValue()</cu-button>
  <cu-button id="picker-prog-clear" color="neutral">clear()</cu-button>
</div>

<p class="playground-state">getValue(): <strong id="picker-prog-state">—</strong></p>

<cu-date-picker id="picker-prog" style="max-width:280px"></cu-date-picker>

<script>
  customElements.whenDefined('cu-date-picker').then(() => {
    const picker = document.getElementById('picker-prog');
    const state = document.getElementById('picker-prog-state');
    const read = () => {
      const value = picker.getValue();
      state.textContent = value ? value.toISOString().slice(0, 10) : '—';
    };
    document.getElementById('picker-prog-open').addEventListener('click', () => { picker.open(); read(); });
    document.getElementById('picker-prog-close').addEventListener('click', () => { picker.close(); read(); });
    document.getElementById('picker-prog-toggle').addEventListener('click', () => { picker.toggle(); read(); });
    document.getElementById('picker-prog-set').addEventListener('click', () => { picker.setValue('2026-08-11'); read(); });
    document.getElementById('picker-prog-clear').addEventListener('click', () => { picker.clear(); read(); });
    picker.addEventListener('change', read);
  });
<\/script>`;

/**
 * Events: patio de **eventos** de DatePicker con log en vivo.
 */
const DatePickerEvents = defineComponent({
  name: "DatePickerEvents",
  setup() {
    const log = ref<string[]>([]);

    const push = (name: string, value: unknown) => {
      const entry = value === undefined ? `${name}` : `${name}: ${formatDate(value)}`;
      log.value = [entry, ...log.value].slice(0, 6);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h(DatePicker, {
          modelValue: "2026-08-11",
          style: "max-width:280px",
          onOpen: () => push("open", undefined),
          onClose: () => push("close", undefined),
          onSelect: (value: Date) => push("select", value),
          onChange: (value: Date | null) => push("change", value),
          "onUpdate:modelValue": (value: Date | null) => push("update:modelValue", value),
        }),
        h("div", { class: "playground-state" }, [
          h("p", null, ["Eventos (últimos 6):"]),
          log.value.length
            ? h(
                "ul",
                { style: "margin:0;padding-left:1rem" },
                log.value.map((entry, index) => h("li", { key: index }, entry)),
              )
            : h("p", { style: "margin:0" }, "Abrí el panel y elegí un día para ver los eventos."),
        ]),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import DatePicker from '@/components/form/DatePicker.vue'

const log = ref([])
const push = (name, value) => {
  const text = value instanceof Date ? value.toISOString().slice(0, 10) : ''
  log.value = [\`\${name}\${text ? ': ' + text : ''}\`, ...log.value].slice(0, 6)
}
<\/script>

<template>
  <DatePicker
    model-value="2026-08-11"
    style="max-width:280px"
    @open="push('open')"
    @close="push('close')"
    @select="(v) => push('select', v)"
    @change="(v) => push('change', v)"
    @update:model-value="(v) => push('update:modelValue', v)"
  />
  <ul>
    <li v-for="(entry, i) in log" :key="i">{{ entry }}</li>
  </ul>
</template>`;

const eventsVanilla = `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker id="picker-events-patio" model-value="2026-08-11" style="max-width:280px"></cu-date-picker>
<ul id="picker-events-log"></ul>

<script>
  customElements.whenDefined('cu-date-picker').then(() => {
    const picker = document.getElementById('picker-events-patio');
    const log = document.getElementById('picker-events-log');
    const push = (name, e) => {
      const value = e && e.detail instanceof Date ? e.detail.toISOString().slice(0, 10) : (e && e.detail);
      const li = document.createElement('li');
      li.textContent = name + (value ? ': ' + value : '');
      log.prepend(li);
    };
    picker.addEventListener('open', () => push('open'));
    picker.addEventListener('close', () => push('close'));
    picker.addEventListener('select', (e) => push('select', e));
    picker.addEventListener('change', (e) => push('change', e));
    picker.addEventListener('update:modelValue', (e) => push('update:modelValue', e));
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: open(), close(), toggle(), setValue(), clear(), getValue() e isOpen() sobre la instancia de abajo.",
    render: () => h(DatePickerProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
  {
    id: "events",
    title: "Events",
    description: "Una instancia de DatePicker y el log en vivo de open, close, select, change y update:modelValue.",
    render: () => h(DatePickerEvents),
    vue: eventsVue,
    vanilla: eventsVanilla,
  },
];
