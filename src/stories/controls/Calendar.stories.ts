// Story de Calendar (migrada desde la página legacy + Calendar.test.ts).
// Secciones espejo de la página del playground; checks derivados del test viejo.

import { nextTick } from "vue";
import Calendar from "@/components/controls/Calendar.vue";
import type { ComponentStory, L1Context } from "@/stories/types";
import { extras } from "./Calendar.stories.extras";

const WIDTH_300 = { style: "width:300px" };
const WIDTH_280 = { style: "width:280px" };

function dayByText(wrapper: L1Context["wrapper"], text: string) {
  return wrapper.findAll(".cu-calendar-day").find((day) => day.text() === text);
}

function dayOfString(value: unknown): string {
  return String(Number(String(value).split("-")[2]));
}

const calendarEvents = [
  { date: "2026-08-03", color: "primary" },
  { date: "2026-08-11", color: "danger" },
  { date: "2026-08-11", color: "primary" },
];

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const DAY_VARIANTS = ["solid", "outlined", "soft", "subtle"] as const;

export const cuCalendarStories: ComponentStory = {
  component: "cu-calendar",
  vue: Calendar,
  tokens: [
    "--cal-accent",
    "--cal-accent-hover",
    "--cal-ghost-hover",
    "--cal-soft",
    "--cal-soft-hover",
    "--cal-subtle",
    "--cal-subtle-border",
    "--cu-border-color",
    "--cu-border-thin",
    "--cu-color-surface",
    "--cu-font-sans",
    "--cu-font-size-sm",
    "--cu-font-size-xs",
    "--cu-font-weight-medium",
    "--cu-font-weight-semibold",
    "--cu-radius-sm",
    "--cu-space-2xs",
    "--cu-space-sm",
    "--cu-space-xs",
    "--dot-color"
  ],
  classes: [
    "cu-calendar",
    "cu-calendar--border",
    "cu-calendar--grid",
    "cu-calendar--year-nav",
    "cu-calendar-day",
    "cu-calendar-day--empty",
    "cu-calendar-day--outlined",
    "cu-calendar-day--range",
    "cu-calendar-day--range-end",
    "cu-calendar-day--range-start",
    "cu-calendar-day--selected",
    "cu-calendar-day--soft",
    "cu-calendar-day--solid",
    "cu-calendar-day--subtle",
    "cu-calendar-day--today",
    "cu-calendar-dot",
    "cu-calendar-dots",
    "cu-calendar-grid",
    "cu-calendar-header",
    "cu-calendar-week",
    "cu-calendar-weekday",
    "cu-calendar-weekdays"
  ],
  api: {
    "components": [
      {
        "label": "MonthSlider",
        "path": "/playground/components/month-slider"
      }
    ],
    "props": [
      {
        "name": "min",
        "type": "[String",
        "default": "null",
        "description": "Fecha mínima"
      },
      {
        "name": "max",
        "type": "[String",
        "default": "null",
        "description": "Fecha máxima"
      },
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "primary",
        "description": "primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "variant",
        "type": "solid | outlined | soft | subtle",
        "default": "soft",
        "description": "solid, outlined, soft, subtle"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Deshabilita la selección"
      },
      {
        "name": "locale",
        "type": "string",
        "default": "es",
        "description": "Locale de los nombres"
      },
      {
        "name": "monthFormat",
        "type": "string",
        "default": "MMMM",
        "description": "Formato del mes"
      },
      {
        "name": "yearFormat",
        "type": "string",
        "default": "yyyy",
        "description": "Formato del año"
      },
      {
        "name": "rangeEnd",
        "type": "[String",
        "default": "null",
        "description": "Fin de rango resaltado"
      },
      {
        "name": "grid",
        "type": "boolean",
        "default": "false",
        "description": "Líneas interiores entre los días (cuadrícula)"
      },
      {
        "name": "border",
        "type": "boolean",
        "default": "false",
        "description": "Marco exterior alrededor de la cuadrícula de días"
      },
      {
        "name": "modelValue",
        "type": "string | number | Date | null",
        "default": "null",
        "description": "Fecha seleccionada (v-model)"
      },
      {
        "name": "disabledWeekdays",
        "type": "number[]",
        "default": "[]",
        "description": "Días de semana deshabilitados (0=domingo)"
      },
      {
        "name": "disabledDates",
        "type": "(string | number | Date)[]",
        "default": "[]",
        "description": "Fechas puntuales deshabilitadas"
      },
      {
        "name": "weekStart",
        "type": "number",
        "default": "1",
        "description": "Primer día de la semana (0=domingo, 1=lunes)"
      },
      {
        "name": "events",
        "type": "CalendarEvent[]",
        "default": "[]",
        "description": "Puntos bajo las fechas"
      },
      {
        "name": "rangeStart",
        "type": "string | number | Date | null",
        "default": "null",
        "description": "Inicio de rango resaltado"
      }
    ],
    "events": [
      {
        "name": "update:modelValue",
        "type": "() => void",
        "description": "Fecha seleccionada (v-model)"
      },
      {
        "name": "change",
        "type": "() => void",
        "description": "Cambia la selección"
      },
      {
        "name": "select",
        "type": "() => void",
        "description": "Click en un día"
      }
    ],
    "exposes": [
      {
        "name": "nextMonth()",
        "type": "() => void",
        "description": "Avanza al mes siguiente (respetando max)."
      },
      {
        "name": "prevMonth()",
        "type": "() => void",
        "description": "Retrocede al mes anterior (respetando min)."
      },
      {
        "name": "goToMonth()",
        "type": "() => void",
        "description": "Navega al mes de la fecha indicada."
      },
      {
        "name": "getValue()",
        "type": "() => void",
        "description": "Devuelve la fecha seleccionada."
      },
      {
        "name": "setValue()",
        "type": "() => void",
        "description": "Establece la fecha seleccionada y emite los eventos de cambio."
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
      description: "Muestra el mes actual. Grilla de 7 columnas que se reparten el ancho del contenedor.",
      layout: "row",
      variants: [
        { id: "today", props: {}, attrs: WIDTH_300 },
        { id: "feb-2024", props: { modelValue: "2024-02-10" }, attrs: WIDTH_300 },
      ],
      vue: `  <Calendar />`,
      vanilla: `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar></cu-calendar>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-calendar",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-calendar").exists()).toBe(true);
            },
          },
          {
            name: "renderiza 7 columnas de días de la semana",
            run({ wrapper, expect }) {
              expect(wrapper.findAll(".cu-calendar-weekday")).toHaveLength(7);
            },
          },
          {
            name: "la semana arranca en lunes por defecto",
            run({ wrapper, expect }) {
              const weekdays = wrapper.findAll(".cu-calendar-weekday");
              expect(weekdays[0]!.text()).toBe("Lun");
            },
          },
          {
            name: "renderiza un botón por cada día del mes (feb 2024 = 29)",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "feb-2024") return;
              expect(wrapper.findAll(".cu-calendar-day")).toHaveLength(29);
            },
          },
        ],
      },
    },

    {
      id: "month-controls",
      title: "Controles de mes",
      badge: "false",
      badgeTitle: "yearNavigation por defecto",
      description: "El header delega en MonthSlider: chevrons prev/next, label con drag y navegación de año opcional.",
      layout: "col",
      variants: [
        { id: "year-nav", props: { modelValue: "2026-08-11", yearNavigation: true }, attrs: WIDTH_300 },
        { id: "formatted", props: { modelValue: "2026-08-11", yearNavigation: true, monthFormat: "MMM yyyy" }, attrs: WIDTH_300 },
        { id: "plain", props: { modelValue: "2026-08-11" }, attrs: WIDTH_300 },
        { id: "bounded", props: { modelValue: "2026-08-11", min: "2026-07-01", max: "2026-09-30" }, attrs: WIDTH_300 },
      ],
      vue: `  <Calendar model-value="2026-08-11" year-navigation />
  <Calendar model-value="2026-08-11" month-format="MMM yyyy" year-navigation />
  <Calendar model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar model-value="2026-08-11" year-navigation></cu-calendar>
<cu-calendar model-value="2026-08-11" month-format="MMM yyyy" year-navigation></cu-calendar>
<cu-calendar model-value="2026-08-11"></cu-calendar>`,
      checks: {
        l1: [
          {
            name: "muestra el mes del modelValue en el header",
            run({ wrapper, expect }, variant) {
              if (variant.id === "formatted") return;
              expect(wrapper.find(".cu-month-slider-label-month").text()).toBe("agosto");
            },
          },
          {
            name: "monthFormat personaliza el label del header",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "formatted") return;
              expect(wrapper.find(".cu-month-slider-label-month").text()).toBe("ago 2026");
            },
          },
          {
            name: "yearNavigation agrega los botones de año del MonthSlider",
            run({ wrapper, expect }, variant) {
              const buttons = wrapper.findAll(".cu-month-slider .cu-button--icon-only");
              if (variant.id === "year-nav" || variant.id === "formatted") {
                expect(buttons.length).toBeGreaterThanOrEqual(4);
              } else {
                expect(buttons).toHaveLength(2);
              }
            },
          },
          {
            name: "nextMonth/prevMonth respetan los límites min/max",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "bounded") return;
              const vm = wrapper.vm as unknown as { nextMonth: () => void; prevMonth: () => void };
              const label = () => wrapper.find(".cu-month-slider-label-month").text();
              vm.nextMonth();
              await nextTick();
              expect(label()).toBe("septiembre");
              vm.nextMonth();
              await nextTick();
              expect(label()).toBe("septiembre");
              vm.prevMonth();
              await nextTick();
              expect(label()).toBe("agosto");
              vm.prevMonth();
              await nextTick();
              expect(label()).toBe("julio");
              vm.prevMonth();
              await nextTick();
              expect(label()).toBe("julio");
            },
          },
          {
            name: "goToMonth navega al mes pedido y muestra el año",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "plain") return;
              const vm = wrapper.vm as unknown as { goToMonth: (value: string) => void };
              vm.goToMonth("2030-06-15");
              await nextTick();
              expect(wrapper.find(".cu-month-slider-label-month").text()).toBe("junio");
              expect(wrapper.find(".cu-month-slider-label-year").text()).toContain("2030");
            },
          },
        ],
      },
    },

    {
      id: "event-markers",
      title: "Eventos",
      badge: "[]",
      badgeTitle: "events por defecto",
      description: "Puntos bajo las fechas para señalar eventos. Un día puede tener múltiples puntos.",
      layout: "row",
      variants: [
        { id: "marked", props: { modelValue: "2026-08-11", events: calendarEvents }, attrs: { style: "width:380px" } },
      ],
      vue: `<script setup>
import Calendar from '@/components/controls/Calendar.vue'

const events = [
  { date: '2026-08-03', color: 'primary' },
  { date: '2026-08-11', color: 'danger' },
  { date: '2026-08-11', color: 'primary' },
]
<\/script>

<template>
  <Calendar :events="events" model-value="2026-08-11" />
</template>`,
      vanilla: `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar id="cal-events" model-value="2026-08-11"></cu-calendar>

<script>
  customElements.whenDefined('cu-calendar').then(() => {
    document.getElementById('cal-events').events = [
      { date: '2026-08-03', color: 'primary' },
      { date: '2026-08-11', color: 'danger' },
      { date: '2026-08-11', color: 'primary' },
    ];
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza un punto por evento del mes",
            run({ wrapper, expect }) {
              expect(wrapper.findAll(".cu-calendar-dot")).toHaveLength(3);
            },
          },
          {
            name: "resuelve el color del evento como token CSS",
            run({ wrapper, expect }) {
              expect(wrapper.html()).toContain("var(--cu-color-danger)");
            },
          },
        ],
      },
    },

    {
      id: "selected",
      title: "Con fecha seleccionada",
      badge: "null",
      badgeTitle: "modelValue por defecto",
      description: 'model-value="2026-08-11" navega al mes y marca el día.',
      layout: "col",
      variants: [
        { id: "soft", props: { modelValue: "2026-08-11" }, attrs: WIDTH_300 },
        { id: "solid-2027", props: { modelValue: "2027-02-20", variant: "solid" }, attrs: WIDTH_300 },
      ],
      vue: `  <Calendar model-value="2026-08-11" />
  <Calendar model-value="2027-02-20" variant="solid" />`,
      vanilla: `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar model-value="2026-08-11"></cu-calendar>
<cu-calendar model-value="2027-02-20" variant="solid"></cu-calendar>`,
      checks: {
        l1: [
          {
            name: "marca el día seleccionado con la clase --selected",
            run({ wrapper, expect }, variant) {
              const selected = wrapper.findAll(".cu-calendar-day--selected");
              expect(selected).toHaveLength(1);
              expect(selected[0]!.text()).toBe(dayOfString(variant.props?.modelValue));
            },
          },
          {
            name: "aplica la variante al día seleccionado",
            run({ wrapper, expect }, variant) {
              const value = (variant.props?.variant as string) ?? "soft";
              expect(wrapper.find(".cu-calendar-day--selected").classes()).toContain(
                `cu-calendar-day--${value}`,
              );
            },
          },
          {
            name: "click en un día emite update:modelValue/change/select",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "soft") return;
              await dayByText(wrapper, "20")!.trigger("click");
              const model = wrapper.emitted("update:modelValue") as unknown[][] | undefined;
              expect(model).toBeTruthy();
              const value = model![0]![0] as Date;
              expect(value.getFullYear()).toBe(2026);
              expect(value.getMonth()).toBe(7);
              expect(value.getDate()).toBe(20);
              expect(wrapper.emitted("change")).toBeTruthy();
              expect(wrapper.emitted("select")).toBeTruthy();
            },
          },
          {
            name: "click en un día lo deja marcado (estado interno)",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "soft") return;
              await dayByText(wrapper, "20")!.trigger("click");
              const selected = wrapper.findAll(".cu-calendar-day--selected");
              expect(selected).toHaveLength(1);
              expect(selected[0]!.text()).toBe("20");
            },
          },
          {
            name: "setValue actualiza el día seleccionado (estado interno)",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "soft") return;
              (wrapper.vm as unknown as { setValue: (value: string) => void }).setValue("2026-08-25");
              await nextTick();
              const selected = wrapper.findAll(".cu-calendar-day--selected");
              expect(selected).toHaveLength(1);
              expect(selected[0]!.text()).toBe("25");
            },
          },
        ],
      },
    },

    {
      id: "min-max",
      title: "Min / Max",
      description: "Días fuera del rango deshabilitados; la navegación se recorta al mes del límite.",
      layout: "col",
      variants: [
        { id: "window", props: { modelValue: "2026-08-11", min: "2026-08-10", max: "2026-08-20" }, attrs: WIDTH_300 },
      ],
      vue: `  <Calendar min="2026-08-10" max="2026-08-20" model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar min="2026-08-10" max="2026-08-20" model-value="2026-08-11"></cu-calendar>`,
      checks: {
        l1: [
          {
            name: "deshabilita los días fuera de min/max",
            run({ wrapper, expect }) {
              expect(dayByText(wrapper, "9")!.attributes("disabled")).toBeDefined();
              expect(dayByText(wrapper, "15")!.attributes("disabled")).toBeUndefined();
            },
          },
          {
            name: "no emite al clickear un día deshabilitado",
            async run({ wrapper, expect }) {
              await dayByText(wrapper, "9")!.trigger("click");
              expect(wrapper.emitted("update:modelValue")).toBeUndefined();
            },
          },
        ],
      },
    },

    {
      id: "disabled-days",
      title: "Días deshabilitados",
      badge: "[]",
      badgeTitle: "disabledWeekdays / disabledDates por defecto",
      layout: "col",
      variants: [
        { id: "weekdays-array", props: { modelValue: "2026-08-11", disabledWeekdays: [0, 6] }, attrs: WIDTH_300 },
        { id: "weekdays-string", props: { modelValue: "2026-08-11", disabledWeekdays: "0,6" }, attrs: WIDTH_300 },
        { id: "dates", props: { modelValue: "2026-08-11", disabledDates: "2026-08-15,2026-08-16" }, attrs: WIDTH_300 },
      ],
      vue: `  <Calendar disabled-weekdays="0,6" model-value="2026-08-11" />
  <Calendar disabled-dates="2026-08-15,2026-08-16" model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar disabled-weekdays="0,6" model-value="2026-08-11"></cu-calendar>
<cu-calendar disabled-dates="2026-08-15,2026-08-16" model-value="2026-08-11"></cu-calendar>`,
      checks: {
        l1: [
          {
            name: "disabledWeekdays deshabilita esos días de la semana",
            run({ wrapper, expect }, variant) {
              if (variant.id === "dates") return;
              expect(dayByText(wrapper, "2")!.attributes("disabled")).toBeDefined(); // sábado
              expect(dayByText(wrapper, "4")!.attributes("disabled")).toBeUndefined(); // lunes
            },
          },
          {
            name: "disabledDates deshabilita fechas puntuales",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "dates") return;
              expect(dayByText(wrapper, "15")!.attributes("disabled")).toBeDefined();
              expect(dayByText(wrapper, "16")!.attributes("disabled")).toBeDefined();
              expect(dayByText(wrapper, "17")!.attributes("disabled")).toBeUndefined();
            },
          },
        ],
      },
    },

    {
      id: "week-start",
      title: "Semana domingo",
      badge: "1",
      badgeTitle: "weekStart por defecto",
      layout: "col",
      variants: [
        { id: "sunday", props: { modelValue: "2026-08-11", weekStart: 0 }, attrs: WIDTH_300 },
      ],
      vue: `  <Calendar :week-start="0" model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar week-start="0" model-value="2026-08-11"></cu-calendar>`,
      checks: {
        l1: [
          {
            name: "weekStart=0 arranca la semana en domingo",
            run({ wrapper, expect }) {
              expect(wrapper.findAll(".cu-calendar-weekday")[0]!.text()).toBe("Dom");
            },
          },
        ],
      },
    },

    {
      id: "locale",
      title: "Locale",
      badge: "es",
      badgeTitle: "locale por defecto",
      layout: "col",
      variants: [
        { id: "en", props: { modelValue: "2026-08-11", locale: "en" }, attrs: WIDTH_300 },
      ],
      vue: `  <Calendar locale="en" model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar locale="en" model-value="2026-08-11"></cu-calendar>`,
      checks: {
        l1: [
          {
            name: "locale en: mes y día de la semana en inglés",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-month-slider-label-month").text()).toBe("August");
              expect(wrapper.findAll(".cu-calendar-weekday")[0]!.text()).toBe("Mon");
            },
          },
        ],
      },
    },

    {
      id: "variants",
      title: "Variantes del día seleccionado",
      badge: "soft",
      badgeTitle: "Variante por defecto",
      layout: "row",
      variants: DAY_VARIANTS.map((variant) => ({
        id: variant,
        props: { modelValue: "2026-08-11", variant },
        attrs: { style: "width:240px" },
      })),
      vue: `  <Calendar v-for="variant in ['solid', 'outlined', 'soft', 'subtle']" :key="variant" :variant="variant" model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar variant="solid" model-value="2026-08-11"></cu-calendar>
<cu-calendar variant="outlined" model-value="2026-08-11"></cu-calendar>
<cu-calendar variant="soft" model-value="2026-08-11"></cu-calendar>
<cu-calendar variant="subtle" model-value="2026-08-11"></cu-calendar>`,
      checks: {
        l1: [
          {
            name: "aplica cu-calendar-day--{variant} al día seleccionado",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-calendar-day--selected").classes()).toContain(
                `cu-calendar-day--${variant.props?.variant}`,
              );
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colores",
      badge: "primary",
      badgeTitle: "Color por defecto",
      layout: "row",
      variants: COLORS.map((color) => ({
        id: color,
        props: { modelValue: "2026-08-11", color, variant: "solid" },
        attrs: { style: "width:240px" },
      })),
      vue: `  <Calendar color="primary" variant="solid" model-value="2026-08-11" />
  <Calendar color="secondary" variant="solid" model-value="2026-08-11" />
  <Calendar color="neutral" variant="solid" model-value="2026-08-11" />
  <Calendar color="success" variant="solid" model-value="2026-08-11" />
  <Calendar color="warning" variant="solid" model-value="2026-08-11" />
  <Calendar color="danger" variant="solid" model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar color="primary" variant="solid" model-value="2026-08-11"></cu-calendar>
<cu-calendar color="secondary" variant="solid" model-value="2026-08-11"></cu-calendar>
<cu-calendar color="neutral" variant="solid" model-value="2026-08-11"></cu-calendar>
<cu-calendar color="success" variant="solid" model-value="2026-08-11"></cu-calendar>
<cu-calendar color="warning" variant="solid" model-value="2026-08-11"></cu-calendar>
<cu-calendar color="danger" variant="solid" model-value="2026-08-11"></cu-calendar>`,
      checks: {
        l1: [
          {
            name: "resuelve --cal-accent al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              expect(wrapper.find(".cu-calendar").attributes("style")).toContain(
                `--cal-accent: var(--cu-color-${color})`,
              );
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
      description:
        'grid dibuja líneas interiores entre los días; border agrega el marco exterior. Son independientes y combinables.',
      layout: "row",
      variants: [
        { id: "grid", props: { modelValue: "2026-08-11", grid: true }, attrs: WIDTH_280 },
        { id: "border", props: { modelValue: "2026-08-11", border: true }, attrs: WIDTH_280 },
        { id: "grid-border", props: { modelValue: "2026-08-11", grid: true, border: true }, attrs: WIDTH_280 },
      ],
      vue: `  <Calendar grid model-value="2026-08-11" />
  <Calendar border model-value="2026-08-11" />
  <Calendar grid border model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar grid model-value="2026-08-11"></cu-calendar>
<cu-calendar border model-value="2026-08-11"></cu-calendar>
<cu-calendar grid border model-value="2026-08-11"></cu-calendar>`,
      checks: {
        l1: [
          {
            name: "aplica cu-calendar--grid cuando grid=true",
            run({ wrapper, expect }, variant) {
              const classes = wrapper.find(".cu-calendar").classes();
              if (variant.props?.grid) expect(classes).toContain("cu-calendar--grid");
              else expect(classes).not.toContain("cu-calendar--grid");
            },
          },
          {
            name: "aplica cu-calendar--border cuando border=true",
            run({ wrapper, expect }, variant) {
              const classes = wrapper.find(".cu-calendar").classes();
              if (variant.props?.border) expect(classes).toContain("cu-calendar--border");
              else expect(classes).not.toContain("cu-calendar--border");
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
        { id: "disabled", props: { modelValue: "2026-08-11", disabled: true }, attrs: WIDTH_300 },
      ],
      vue: `  <Calendar disabled model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuCalendar.umd.js"><\/script>

<cu-calendar disabled model-value="2026-08-11"></cu-calendar>`,
      checks: {
        l1: [
          {
            name: "aplica is-disabled y deshabilita los días",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-calendar").classes()).toContain("is-disabled");
              const first = wrapper.findAll(".cu-calendar-day")[0]!;
              expect(first.attributes("disabled")).toBeDefined();
            },
          },
          {
            name: "disabled bloquea la selección (no emite)",
            async run({ wrapper, expect }) {
              await wrapper.findAll(".cu-calendar-day")[0]!.trigger("click");
              expect(wrapper.emitted("update:modelValue")).toBeUndefined();
            },
          },
        ],
      },
    },
  ],
};
