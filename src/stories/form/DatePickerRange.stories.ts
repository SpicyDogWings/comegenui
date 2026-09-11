import { defineComponent, h, onMounted, ref } from "vue";
import type { VueWrapper } from "@vue/test-utils";
import DatePickerRange from "@/components/form/DatePickerRange.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./DatePickerRange.stories.extras";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const CALENDAR_EVENTS = [
  { date: "2026-09-03", color: "primary" },
  { date: "2026-09-07", color: "success" },
  { date: "2026-09-11", color: "warning" },
  { date: "2026-09-11", color: "danger" },
  { date: "2026-09-11", color: "primary" },
  { date: "2026-09-18", color: "primary" },
];

interface RangeInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
  getStartDate: () => Date | null;
  getEndDate: () => Date | null;
  setRange: (start: string | number | Date | null, end: string | number | Date | null) => void;
  clear: () => void;
}

async function openPanel(wrapper: VueWrapper): Promise<void> {
  await wrapper.find("button.cu-date-picker-range-toggle").trigger("click");
}

function dayButton(wrapper: VueWrapper, day: number) {
  return wrapper.findAll(".cu-calendar-day").find((btn) => btn.text().trim() === String(day));
}

const fmtIso = (d: Date | null) => (d ? d.toISOString().slice(0, 10) : "—");

const DatePickerRangeDefaultPreview = defineComponent({
  name: "DatePickerRangeDefaultPreview",
  setup() {
    const start = ref<Date | null>(null);
    const end = ref<Date | null>(null);
    return () =>
      h("div", { class: "playground-col" }, [
        h(DatePickerRange, {
          startDate: start.value,
          endDate: end.value,
          style: "max-width: 320px;",
          "onUpdate:startDate": (value: Date | null) => (start.value = value),
          "onUpdate:endDate": (value: Date | null) => (end.value = value),
        }),
        h("p", { class: "playground-state" }, `Rango: ${fmtIso(start.value)} → ${fmtIso(end.value)}`),
      ]);
  },
});

const DatePickerRangeEventsPreview = defineComponent({
  name: "DatePickerRangeEventsPreview",
  setup() {
    const rangeRef = ref<InstanceType<typeof DatePickerRange> | null>(null);
    onMounted(() => (rangeRef.value as unknown as RangeInstance | null)?.open());
    return () =>
      h(DatePickerRange, {
        ref: rangeRef,
        startDate: "2026-09-03",
        endDate: "2026-09-15",
        events: CALENDAR_EVENTS,
        style: "max-width: 300px;",
      });
  },
});

export const cuDatePickerRangeStories: ComponentStory = {
  component: "cu-date-picker-range",
  vue: DatePickerRange,
  tokens: [
    "--cu-border-color",
    "--cu-border-thin",
    "--cu-space-md",
    "--cu-space-sm"
  ],
  classes: [
    "cu-calendar",
    "cu-date-picker-chevron",
    "cu-date-picker-range",
    "cu-date-picker-range-calendars",
    "cu-date-picker-range-calendars--dual",
    "cu-date-picker-range-footer",
    "cu-date-picker-range-label",
    "cu-date-picker-range-panel",
    "cu-date-picker-range-toggle",
    "cu-dropdown"
  ],
  subComponents: [
    {
      "label": "Dropdown",
      "path": "/playground/components/dropdown#style"
    },
    {
      "label": "Button",
      "path": "/playground/components/button#style"
    },
    {
      "label": "Calendar",
      "path": "/playground/components/calendar#style"
    },
    {
      "label": "Label",
      "path": "/playground/components/label#style"
    }
  ],
  api: {
    "components": [
      {
        "label": "Dropdown",
        "path": "/playground/components/dropdown"
      },
      {
        "label": "Button",
        "path": "/playground/components/button"
      },
      {
        "label": "Calendar",
        "path": "/playground/components/calendar"
      },
      {
        "label": "Label",
        "path": "/playground/components/label"
      }
    ],
    "props": [
      {
        "name": "startDate",
        "type": "[String",
        "default": "null",
        "description": "Inicio del rango (v-model:start-date). Acepta Date, timestamp o \"YYYY-MM-DD\""
      },
      {
        "name": "endDate",
        "type": "[String",
        "default": "null",
        "description": "Fin del rango (v-model:end-date)"
      },
      {
        "name": "min",
        "type": "[String",
        "default": "null",
        "description": "Fecha mínima seleccionable"
      },
      {
        "name": "max",
        "type": "[String",
        "default": "null",
        "description": "Fecha máxima seleccionable"
      },
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "neutral",
        "description": "Color semántico: primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "variant",
        "type": "outlined | soft | ghost | subtle",
        "default": "soft",
        "description": "Variante del trigger: outlined, soft, ghost, subtle"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Deshabilita trigger y calendarios"
      },
      {
        "name": "placeholder",
        "type": "string",
        "default": "",
        "description": "Texto del trigger cuando no hay rango"
      },
      {
        "name": "locale",
        "type": "string",
        "default": "es",
        "description": "Locale para nombres de mes/día (Intl)"
      },
      {
        "name": "weekStart",
        "type": "number",
        "default": "1",
        "description": "Día de inicio de semana: 0=domingo … 6=sábado"
      },
      {
        "name": "format",
        "type": "string",
        "default": "dd/MM/yyyy",
        "description": "Formato del rango en el trigger. Tokens: dd, MM, MMM, MMMM, yy, yyyy"
      },
      {
        "name": "yearNavigation",
        "type": "[Boolean",
        "default": "false",
        "description": "Botones « » para saltar de año en los calendarios"
      },
      {
        "name": "monthFormat",
        "type": "string",
        "default": "MMMM",
        "description": "Formato del mes en el header de los calendarios"
      },
      {
        "name": "yearFormat",
        "type": "string",
        "default": "yyyy",
        "description": "Formato del año en el header de los calendarios"
      },
      {
        "name": "disabledWeekdays",
        "type": "[Array",
        "default": "",
        "description": "Días de semana deshabilitados (0=domingo). Acepta array o \"0,6\""
      },
      {
        "name": "disabledDates",
        "type": "[Array",
        "default": "",
        "description": "Fechas puntuales deshabilitadas. Acepta array o \"2026-09-15,2026-09-16\""
      },
      {
        "name": "events",
        "type": "Array as PropType<CalendarEvent[]>",
        "description": "Puntos bajo las fechas: { date, color? }. Compatible con rangos"
      },
      {
        "name": "grid",
        "type": "boolean",
        "default": "false",
        "description": "Líneas interiores entre los días de los calendarios internos"
      },
      {
        "name": "border",
        "type": "boolean",
        "default": "false",
        "description": "Marco exterior alrededor de la cuadrícula de días"
      },
      {
        "name": "dualCalendar",
        "type": "boolean",
        "default": "false",
        "description": "Dos meses lado a lado (ideal para rangos que cruzan meses)"
      },
      {
        "name": "position",
        "type": "string",
        "default": "bottom",
        "description": "Posición del panel: bottom, top, left, right"
      },
      {
        "name": "align",
        "type": "string",
        "default": "start",
        "description": "Alineación del panel: start, center, end"
      },
      {
        "name": "fixed",
        "type": "boolean",
        "default": "false",
        "description": "Fija el panel al viewport"
      },
      {
        "name": "clearable",
        "type": "boolean",
        "default": "true",
        "description": "Botón Limpiar en el footer del panel"
      },
      {
        "name": "todayButton",
        "type": "boolean",
        "default": "false",
        "description": "Reservado: hoy no agrega botón en el footer"
      },
      {
        "name": "label",
        "type": "string",
        "default": "",
        "description": "Label sobre el trigger (click abre el panel)"
      }
    ],
    "slots": [
      {
        "name": "toggle"
      },
      {
        "name": "default"
      }
    ],
    "events": [
      {
        "name": "update:startDate",
        "type": "() => void",
        "description": "v-model:start-date: se emite al elegir el inicio (Date | null)"
      },
      {
        "name": "update:endDate",
        "type": "() => void",
        "description": "v-model:end-date: se emite al elegir el fin (Date | null)"
      },
      {
        "name": "change",
        "type": "() => void",
        "description": "Rango completo al cerrar la selección: { start, end }"
      },
      {
        "name": "select",
        "type": "() => void",
        "description": "Rango al completar los dos clicks: { start, end }"
      },
      {
        "name": "open",
        "type": "() => void",
        "description": "El panel se abrió"
      },
      {
        "name": "close",
        "type": "() => void",
        "description": "El panel se cerró"
      }
    ],
    "exposes": [
      {
        "name": "open()",
        "type": "() => void"
      },
      {
        "name": "close()",
        "type": "() => void"
      },
      {
        "name": "toggle()",
        "type": "() => void"
      },
      {
        "name": "getStartDate()",
        "type": "() => void"
      },
      {
        "name": "getEndDate()",
        "type": "() => void"
      },
      {
        "name": "setRange()",
        "type": "() => void"
      },
      {
        "name": "clear()",
        "type": "() => void"
      },
      {
        "name": "isOpen()",
        "type": "() => void"
      },
      {
        "name": "open",
        "type": "() => void",
        "default": "—",
        "description": "Abre el panel"
      },
      {
        "name": "close",
        "type": "() => void",
        "default": "—",
        "description": "Cierra el panel"
      },
      {
        "name": "toggle",
        "type": "() => void",
        "default": "—",
        "description": "Abre/cierra el panel"
      },
      {
        "name": "getStartDate",
        "type": "() => Date | null",
        "default": "—",
        "description": "Devuelve el inicio del rango"
      },
      {
        "name": "getEndDate",
        "type": "() => Date | null",
        "default": "—",
        "description": "Devuelve el fin del rango"
      },
      {
        "name": "setRange",
        "type": "(start, end: string | number | Date | null) => void",
        "default": "—",
        "description": "Setea el rango programáticamente"
      },
      {
        "name": "clear",
        "type": "() => void",
        "default": "—",
        "description": "Limpia el rango"
      },
      {
        "name": "isOpen",
        "type": "() => boolean",
        "default": "—",
        "description": "Indica si el panel está abierto"
      }
    ],
    "interfaceCode": `interface CalendarEvent {
    date: string | number | Date
    color?: string
  }`
  },
  extras,
  sections: [
    {
      id: "default",
      title: "Default",
      layout: "col",
      description:
        "Selector de rango: el primer click define el inicio, el segundo el fin. Si el fin es anterior, se swapea.",
      preview: DatePickerRangeDefaultPreview,
      variants: [
        { id: "default", props: {} },
        { id: "range", props: { startDate: "2026-09-05" } },
        { id: "swap", props: { startDate: "2026-09-05" } },
      ],
      vue: `<script setup>
import { ref } from 'vue'
import DatePickerRange from '@/components/form/DatePickerRange.vue'

const startDate = ref(null)
const endDate = ref(null)
<\/script>

<template>
  <DatePickerRange v-model:start-date="startDate" v-model:end-date="endDate" />
</template>`,
      vanilla: `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range id="range-default"></cu-date-picker-range>

<script>
  customElements.whenDefined('cu-date-picker-range').then(() => {
    const range = document.getElementById('range-default');
    range.addEventListener('change', (e) => console.log('change', e.detail)); // { start, end }
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-date-picker-range y el trigger",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-date-picker-range").exists()).toBe(true);
              expect(wrapper.find("button.cu-date-picker-range-toggle").exists()).toBe(true);
            },
          },
          {
            name: "sin fechas muestra el placeholder por defecto",
            run({ wrapper, expect }, variant) {
              if (variant.props?.startDate || variant.props?.endDate) return;
              expect(wrapper.find(".cu-date-picker-range-label").text()).toBe("Seleccionar rango...");
            },
          },
          {
            name: "muestra el inicio formateado en el trigger",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "range") return;
              expect(wrapper.find(".cu-date-picker-range-label").text()).toBe("05/09/2026 - ...");
            },
          },
          {
            name: "el primer click emite update:startDate",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "range") return;
              await openPanel(wrapper);
              const day = dayButton(wrapper, 10);
              expect(day).toBeTruthy();
              await day!.trigger("click");
              const emitted = wrapper.emitted("update:startDate");
              expect(emitted).toBeTruthy();
              expect((emitted![0]![0] as Date).getDate()).toBe(10);
            },
          },
          {
            name: "el segundo click completa el rango (update:endDate, select, change)",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "range") return;
              await openPanel(wrapper);
              await dayButton(wrapper, 10)!.trigger("click");
              await dayButton(wrapper, 15)!.trigger("click");
              const end = wrapper.emitted("update:endDate");
              expect(end).toBeTruthy();
              expect((end![0]![0] as Date).getDate()).toBe(15);
              expect(wrapper.emitted("select")).toBeTruthy();
              const change = wrapper.emitted("change");
              const payload = change![0]![0] as { start: Date; end: Date };
              expect(payload.start.getDate()).toBe(10);
              expect(payload.end.getDate()).toBe(15);
            },
          },
          {
            name: "swapea cuando el fin es anterior al inicio",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "swap") return;
              await openPanel(wrapper);
              await dayButton(wrapper, 20)!.trigger("click");
              await dayButton(wrapper, 10)!.trigger("click");
              const change = wrapper.emitted("change");
              const payload = change![0]![0] as { start: Date; end: Date };
              expect(payload.start.getDate()).toBe(10);
              expect(payload.end.getDate()).toBe(20);
            },
          },
          {
            name: "Limpiar emite null en start y end",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "range") return;
              await openPanel(wrapper);
              await dayButton(wrapper, 10)!.trigger("click");
              await dayButton(wrapper, 15)!.trigger("click");
              const clearBtn = wrapper.find(".cu-date-picker-range-footer button");
              expect(clearBtn.exists()).toBe(true);
              await clearBtn.trigger("click");
              const starts = wrapper.emitted("update:startDate")!;
              const ends = wrapper.emitted("update:endDate")!;
              expect(starts[starts.length - 1]![0]).toBeNull();
              expect(ends[ends.length - 1]![0]).toBeNull();
            },
          },
        ],
      },
    },

    {
      id: "label",
      title: "Label",
      layout: "col",
      variants: [
        { id: "with-value", props: { label: "Período de análisis" } },
        { id: "empty", props: {} },
      ],
      vue: `  <DatePickerRange label="Período de análisis" color="primary" />
  <DatePickerRange label="Vacaciones" color="success" variant="outlined" />`,
      vanilla: `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range label="Período de análisis" color="primary"></cu-date-picker-range>
<cu-date-picker-range label="Vacaciones" color="success" variant="outlined"></cu-date-picker-range>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-date-picker-range",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-date-picker-range").exists()).toBe(true);
            },
          },
          {
            name: "muestra el label solo cuando se pasa",
            run({ wrapper, expect }, variant) {
              const label = variant.props?.label as string | undefined;
              if (label) {
                expect(wrapper.find(".cu-label-text").text()).toBe(label);
              } else {
                expect(wrapper.find(".cu-label-text").exists()).toBe(false);
              }
            },
          },
        ],
      },
    },

    {
      id: "placeholder",
      title: "Placeholder",
      layout: "col",
      variants: [
        { id: "with-value", props: { placeholder: "Elegí un rango de fechas..." } },
        { id: "empty", props: {} },
      ],
      vue: `  <DatePickerRange placeholder="Elegí un rango de fechas..." />`,
      vanilla: `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range placeholder="Elegí un rango de fechas..."></cu-date-picker-range>`,
      checks: {
        l1: [
          {
            name: "usa el placeholder (o el default) cuando no hay rango",
            run({ wrapper, expect }, variant) {
              const placeholder = variant.props?.placeholder as string | undefined;
              expect(wrapper.find(".cu-date-picker-range-label").text()).toBe(
                placeholder || "Seleccionar rango...",
              );
            },
          },
        ],
      },
    },

    {
      id: "format",
      title: "Formato del rango en el trigger",
      badge: "dd/MM/yyyy",
      badgeTitle: "Formato por defecto",
      layout: "col",
      variants: [
        { id: "dd-mm-yyyy", props: { startDate: "2026-09-03", endDate: "2026-09-15", format: "dd/MM/yyyy" } },
        { id: "dd-mm-yy", props: { startDate: "2026-09-03", endDate: "2026-09-15", format: "dd-MM-yy" } },
        { id: "mmm-dd", props: { startDate: "2026-09-03", endDate: "2026-09-15", format: "MMM dd" } },
      ],
      vue: `  <DatePickerRange start-date="2026-09-03" end-date="2026-09-15" format="dd/MM/yyyy" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-15" format="MMM dd" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-15" format="dd-MM-yy" />`,
      vanilla: `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-15" format="dd/MM/yyyy"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-15" format="MMM dd"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-15" format="dd-MM-yy"></cu-date-picker-range>`,
      checks: {
        l1: [
          {
            name: "formatea el rango con los tokens del prop format",
            run({ wrapper, expect }, variant) {
              const format = variant.props?.format as string;
              const label = wrapper.find(".cu-date-picker-range-label").text();
              if (format === "dd/MM/yyyy") {
                expect(label).toBe("03/09/2026 - 15/09/2026");
              } else if (format === "dd-MM-yy") {
                expect(label).toBe("03-09-26 - 15-09-26");
              } else {
                expect(label).toMatch(/^\S+\s03\s-\s\S+\s15$/);
              }
            },
          },
        ],
      },
    },

    {
      id: "min-max",
      title: "Min / Max",
      layout: "col",
      variants: [
        {
          id: "window",
          props: { startDate: "2026-09-05", endDate: "2026-09-20", min: "2026-01-01", max: "2026-12-31" },
        },
        {
          id: "disabled-days",
          props: {
            startDate: "2026-09-10",
            min: "2026-09-10",
            max: "2026-09-25",
            disabledWeekdays: "0,6",
          },
        },
      ],
      vue: `  <DatePickerRange start-date="2026-09-05" end-date="2026-09-20" min="2026-01-01" max="2026-12-31" />
  <DatePickerRange start-date="2026-09-10" min="2026-09-10" max="2026-09-25" disabled-weekdays="0,6" />`,
      vanilla: `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range start-date="2026-09-05" end-date="2026-09-20" min="2026-01-01" max="2026-12-31"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-10" min="2026-09-10" max="2026-09-25" disabled-weekdays="0,6"></cu-date-picker-range>`,
      checks: {
        l1: [
          {
            name: "deshabilita los días fuera de min/max y weekdays",
            async run({ wrapper, expect }, variant) {
              await openPanel(wrapper);
              const disabled = wrapper.findAll(".cu-calendar-day:disabled");
              if (variant.id === "disabled-days") {
                const labels = disabled.map((btn) => btn.text().trim());
                expect(labels).toContain("5");
                expect(labels).not.toContain("15");
                expect(disabled.length).toBeGreaterThan(0);
              } else {
                expect(disabled.length).toBe(0);
              }
            },
          },
        ],
      },
    },

    {
      id: "dual-calendar",
      title: "Dual Calendar",
      badge: "false",
      badgeTitle: "dualCalendar por defecto",
      layout: "col",
      variants: [
        { id: "single", props: { startDate: "2026-09-20", endDate: "2026-10-05" } },
        { id: "dual", props: { startDate: "2026-09-20", endDate: "2026-10-05", dualCalendar: true } },
      ],
      vue: `  <DatePickerRange start-date="2026-09-20" end-date="2026-10-05" dual-calendar />`,
      vanilla: `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range start-date="2026-09-20" end-date="2026-10-05" dual-calendar></cu-date-picker-range>`,
      checks: {
        l1: [
          {
            name: "dual-calendar renderiza dos calendarios",
            async run({ wrapper, expect }, variant) {
              await openPanel(wrapper);
              const expected = variant.props?.dualCalendar ? 2 : 1;
              expect(wrapper.findAll(".cu-calendar").length).toBe(expected);
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colores",
      badge: "neutral",
      badgeTitle: "Color por defecto",
      variants: COLORS.map((color) => ({
        id: color,
        props: { color, startDate: "2026-09-03", endDate: "2026-09-07" },
      })),
      vue: `  <DatePickerRange color="primary" start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange color="secondary" start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange color="neutral" start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange color="success" start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange color="warning" start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange color="danger" start-date="2026-09-03" end-date="2026-09-07" />`,
      vanilla: `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range color="primary" start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range color="secondary" start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range color="neutral" start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range color="success" start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range color="warning" start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range color="danger" start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>`,
      checks: {
        l1: [
          {
            name: "resuelve el color al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              expect(wrapper.html()).toContain(`var(--cu-color-${color}`);
            },
          },
        ],
      },
    },

    {
      id: "events",
      title: "Eventos",
      badge: "[]",
      badgeTitle: "events por defecto",
      layout: "col",
      description: "Puntos bajo las fechas del calendario interno; un día puede tener varios.",
      preview: DatePickerRangeEventsPreview,
      variants: [
        { id: "with-events", props: { startDate: "2026-09-03", endDate: "2026-09-15", events: CALENDAR_EVENTS } },
        { id: "empty", props: { startDate: "2026-09-03", endDate: "2026-09-15", events: [] } },
      ],
      vue: `<script setup>
import { onMounted, ref } from 'vue'
import DatePickerRange from '@/components/form/DatePickerRange.vue'

const calendarEvents = [
  { date: '2026-09-03', color: 'primary' },
  { date: '2026-09-11', color: 'warning' },
  { date: '2026-09-11', color: 'danger' },
]

const rangeRef = ref(null)
onMounted(() => rangeRef.value?.open())
<\/script>

<template>
  <DatePickerRange ref="rangeRef" start-date="2026-09-03" end-date="2026-09-15" :events="calendarEvents" />
</template>`,
      vanilla: `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range id="range-events" start-date="2026-09-03" end-date="2026-09-15"></cu-date-picker-range>

<script>
  customElements.whenDefined('cu-date-picker-range').then(() => {
    const range = document.getElementById('range-events');
    range.events = [
      { date: '2026-09-03', color: 'primary' },
      { date: '2026-09-11', color: 'warning' },
      { date: '2026-09-11', color: 'danger' },
    ];
    range.open();
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza un punto por evento visible",
            async run({ wrapper, expect }, variant) {
              await openPanel(wrapper);
              const events = variant.props?.events as unknown[] | undefined;
              expect(wrapper.findAll(".cu-calendar-dot").length).toBe(events?.length ?? 0);
            },
          },
        ],
      },
    },

    {
      id: "grid",
      title: "Cuadrícula",
      badge: "false",
      badgeTitle: "grid / border por defecto",
      layout: "row",
      description:
        "`grid` dibuja líneas interiores entre los días del calendario; `border` agrega el marco exterior.",
      variants: [
        { id: "none", props: { startDate: "2026-09-03", endDate: "2026-09-07" } },
        { id: "grid", props: { startDate: "2026-09-03", endDate: "2026-09-07", grid: true } },
        { id: "border", props: { startDate: "2026-09-03", endDate: "2026-09-07", border: true } },
        { id: "both", props: { startDate: "2026-09-03", endDate: "2026-09-07", grid: true, border: true } },
      ],
      vue: `  <DatePickerRange grid start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange border start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange grid border start-date="2026-09-03" end-date="2026-09-07" />`,
      vanilla: `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range grid start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range border start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range grid border start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>`,
      checks: {
        l1: [
          {
            name: "aplica grid/border al calendario interno",
            async run({ wrapper, expect }, variant) {
              await openPanel(wrapper);
              const calendar = wrapper.find(".cu-calendar");
              expect(calendar.classes().includes("cu-calendar--grid")).toBe(Boolean(variant.props?.grid));
              expect(calendar.classes().includes("cu-calendar--border")).toBe(Boolean(variant.props?.border));
            },
          },
        ],
      },
    },

    {
      id: "positions",
      title: "Posición del panel",
      badge: "bottom + start",
      badgeTitle: "position + align por defecto",
      layout: "col",
      description:
        "`position` (bottom/top/left/right) + `align` (start/center/end). `fixed` fija el panel al viewport.",
      variants: [
        { id: "default", props: { startDate: "2026-09-03", endDate: "2026-09-07" } },
        { id: "bottom-start", props: { startDate: "2026-09-03", endDate: "2026-09-07", position: "bottom", align: "start" } },
        { id: "top-center", props: { startDate: "2026-09-03", endDate: "2026-09-07", position: "top", align: "center" } },
        { id: "right-end", props: { startDate: "2026-09-03", endDate: "2026-09-07", position: "right", align: "end" } },
        { id: "left-start", props: { startDate: "2026-09-03", endDate: "2026-09-07", position: "left", align: "start" } },
        { id: "fixed-bottom", props: { startDate: "2026-09-03", endDate: "2026-09-07", fixed: true } },
      ],
      vue: `  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="bottom" align="start" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="top" align="center" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="right" align="end" />
  <DatePickerRange start-date="2026-09-03" end-date="2026-09-07" position="left" align="start" />`,
      vanilla: `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="top" align="center"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="right" align="end"></cu-date-picker-range>
<cu-date-picker-range start-date="2026-09-03" end-date="2026-09-07" position="left" align="start"></cu-date-picker-range>`,
      checks: {
        l1: [
          {
            name: "ubica el panel según position/fixed",
            async run({ wrapper, expect }, variant) {
              await openPanel(wrapper);
              const style = wrapper.find(".cu-popover-panel").attributes("style") ?? "";
              if (variant.props?.fixed) {
                expect(style).toContain("position: fixed");
                return;
              }
              const position = (variant.props?.position as string) ?? "bottom";
              if (position === "bottom") expect(style).toContain("top: 100%");
              else if (position === "top") expect(style).toContain("bottom: 100%");
              else if (position === "right") expect(style).toContain("left: 100%");
              else if (position === "left") expect(style).toContain("right: 100%");
            },
          },
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      badgeTitle: "Valor por defecto",
      layout: "col",
      variants: [
        { id: "enabled", props: { startDate: "2026-09-03", endDate: "2026-09-15" } },
        { id: "disabled", props: { startDate: "2026-09-03", endDate: "2026-09-15", disabled: true } },
      ],
      vue: `  <DatePickerRange disabled start-date="2026-09-03" end-date="2026-09-15" />`,
      vanilla: `<script src="dist/CuDatePickerRange.umd.js"><\/script>

<cu-date-picker-range disabled start-date="2026-09-03" end-date="2026-09-15"></cu-date-picker-range>`,
      checks: {
        l1: [
          {
            name: "el trigger refleja disabled",
            run({ wrapper, expect }, variant) {
              const toggle = wrapper.find("button.cu-date-picker-range-toggle");
              if (variant.props?.disabled) expect(toggle.attributes("disabled")).toBeDefined();
              else expect(toggle.attributes("disabled")).toBeUndefined();
            },
          },
          {
            name: "no abre el panel cuando está disabled",
            async run({ wrapper, expect }, variant) {
              if (!variant.props?.disabled) return;
              await openPanel(wrapper);
              expect(wrapper.find(".cu-popover-panel").exists()).toBe(false);
            },
          },
        ],
      },
    },
  ],
};
