// Story de DatePicker — secciones espejo de la página legacy + checks L1
// migrados de src/components/form/DatePicker.test.ts.
import type { VueWrapper } from "@vue/test-utils";
import DatePicker from "@/components/form/DatePicker.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./DatePicker.stories.extras";

const CALENDAR_EVENTS = [
  { date: "2026-08-03", color: "primary" },
  { date: "2026-08-11", color: "warning" },
  { date: "2026-08-11", color: "danger" },
  { date: "2026-08-18", color: "primary" },
];

/** Texto esperado del trigger por variante del formato (mismo dato 2026-08-11). */
const FORMAT_EXPECTED: Record<string, string> = {
  default: "11/08/2026",
  long: "Agosto 2026",
  short: "11-08-26",
};

async function openPanel(wrapper: VueWrapper): Promise<void> {
  await wrapper.find(".cu-date-picker-toggle").trigger("click");
  await wrapper.vm.$nextTick();
}

function findDay(wrapper: VueWrapper, day: number) {
  return wrapper.findAll(".cu-calendar-day").find((d) => d.text() === String(day));
}

export const cuDatePickerStories: ComponentStory = {
  component: "cu-date-picker",
  vue: DatePicker,
  tokens: [
    "--cu-border-color",
    "--cu-border-thin",
    "--cu-font-size-xs",
    "--cu-space-md",
    "--cu-space-sm"
  ],
  classes: [
    "cu-date-picker",
    "cu-date-picker-chevron",
    "cu-date-picker-chevron--open",
    "cu-date-picker-footer",
    "cu-date-picker-footer-btn",
    "cu-date-picker-icon",
    "cu-date-picker-label",
    "cu-date-picker-panel",
    "cu-date-picker-toggle",
    "cu-dropdown"
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
        "name": "min",
        "type": "string | number | Date | null",
        "default": "null",
        "description": "Fecha mínima seleccionable"
      },
      {
        "name": "max",
        "type": "string | number | Date | null",
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
        "description": "Deshabilita trigger y calendario"
      },
      {
        "name": "placeholder",
        "type": "string",
        "default": "",
        "description": "Texto del trigger cuando no hay fecha"
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
        "name": "monthFormat",
        "type": "string",
        "default": "MMMM",
        "description": "Formato del mes en el header del calendario"
      },
      {
        "name": "yearFormat",
        "type": "string",
        "default": "yyyy",
        "description": "Formato del año en el header del calendario"
      },
      {
        "name": "disabledDates",
        "type": "(string | Date)[] | string",
        "default": "",
        "description": "Fechas puntuales deshabilitadas. Acepta array o \\\\\\\\\\\\\\\"2026-08-15,2026-08-16\\\\\\\\\\\\\\\""
      },
      {
        "name": "events",
        "type": "CalendarEvent[]",
        "default": "[]",
        "description": "Puntos bajo las fechas: { date, color? }"
      },
      {
        "name": "grid",
        "type": "boolean",
        "default": "false",
        "description": "Líneas interiores entre los días del calendario interno"
      },
      {
        "name": "border",
        "type": "boolean",
        "default": "false",
        "description": "Marco exterior alrededor de la cuadrícula de días"
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
        "default": "true",
        "description": "Botón Hoy en el footer del panel"
      },
      {
        "name": "label",
        "type": "string",
        "default": "",
        "description": "Label sobre el trigger (click abre el panel)"
      },
      {
        "name": "modelValue",
        "type": "string | number | Date | null",
        "default": "null",
        "description": "Fecha seleccionada (v-model). Acepta Date, timestamp o \\\\\\\\\\\\\\\"YYYY-MM-DD\\\\\\\\\\\\\\\""
      },
      {
        "name": "format",
        "type": "string",
        "default": "\\\\\\\\\\\\\\\"dd/MM/yyyy\\\\\\\\\\\\\\\"",
        "description": "Formato de la fecha en el trigger. Tokens: dd, MM, MMM, MMMM, yy, yyyy"
      },
      {
        "name": "yearNavigation",
        "type": "boolean | string",
        "default": "false",
        "description": "Botones « » para saltar de año en el calendario interno"
      },
      {
        "name": "disabledWeekdays",
        "type": "number[] | string",
        "default": "\\\\\\\\\\\\\\\"\\\\\\\\\\\\\\\"",
        "description": "Días de semana deshabilitados (0=domingo). Acepta array o \\\\\\\\\\\\\\\"0,6\\\\\\\\\\\\\\\""
      }
    ],
    "events": [
      {
        "name": "update:modelValue",
        "type": "() => void",
        "description": "v-model: se emite al seleccionar o limpiar; payload Date | null"
      },
      {
        "name": "change",
        "type": "() => void",
        "description": "Fecha seleccionada o null al limpiar"
      },
      {
        "name": "select",
        "type": "() => void",
        "description": "Día seleccionado en el calendario"
      },
      {
        "name": "open",
        "type": "() => void",
        "description": "Abre el panel del calendario."
      },
      {
        "name": "close",
        "type": "() => void",
        "description": "Cierra el panel del calendario."
      }
    ],
    "exposes": [
      {
        "name": "open()",
        "type": "() => void",
        "description": "Abre el panel del calendario."
      },
      {
        "name": "close()",
        "type": "() => void",
        "description": "Cierra el panel del calendario."
      },
      {
        "name": "toggle()",
        "type": "() => void",
        "description": "Alterna el panel del calendario."
      },
      {
        "name": "getValue()",
        "type": "() => void",
        "description": "Devuelve la fecha seleccionada."
      },
      {
        "name": "setValue()",
        "type": "() => void",
        "description": "Setea la fecha seleccionada y emite change."
      },
      {
        "name": "clear()",
        "type": "() => void",
        "description": "Limpia la fecha seleccionada."
      },
      {
        "name": "isOpen()",
        "type": "() => void",
        "description": "Indica si el panel está abierto."
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
      variants: [
        { id: "empty", props: {} },
        { id: "selected", props: { modelValue: "2026-08-11" } },
      ],
      vue: `  <DatePicker />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker></cu-date-picker>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-date-picker",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-date-picker").exists()).toBe(true);
            },
          },
          {
            name: "renderiza el trigger .cu-date-picker-toggle",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-date-picker-toggle").exists()).toBe(true);
            },
          },
          {
            name: "el trigger muestra la fecha formateada o el placeholder por defecto",
            run({ wrapper, expect }, variant) {
              const label = wrapper.find(".cu-date-picker-label");
              if (variant.props?.modelValue) {
                expect(label.text()).toBe("11/08/2026");
              } else {
                expect(label.text()).toBe("Seleccionar fecha...");
              }
            },
          },
        ],
      },
    },

    {
      id: "label",
      title: "Label",
      variants: [
        { id: "sin-fecha", props: { label: "Fecha de nacimiento" } },
        { id: "con-fecha", props: { label: "Fecha de inicio", modelValue: "2026-08-11" } },
        { id: "danger", props: { label: "Fecha límite", color: "danger", modelValue: "2026-12-31" } },
      ],
      vue: `  <DatePicker label="Fecha de nacimiento" />
  <DatePicker label="Fecha de inicio" model-value="2026-08-11" />
  <DatePicker label="Fecha límite" color="danger" model-value="2026-12-31" />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker label="Fecha de nacimiento"></cu-date-picker>
<cu-date-picker label="Fecha de inicio" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker label="Fecha límite" color="danger" model-value="2026-12-31"></cu-date-picker>`,
      checks: {
        l1: [
          {
            name: "renderiza el label con el texto del prop",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-label-text").text()).toBe(String(variant.props?.label));
            },
          },
        ],
      },
    },

    {
      id: "placeholder",
      title: "Placeholder",
      variants: [
        { id: "custom", props: { placeholder: "Elegí una fecha..." } },
        { id: "default", props: {} },
      ],
      vue: `  <DatePicker placeholder="Elegí una fecha..." />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker placeholder="Elegí una fecha..."></cu-date-picker>`,
      checks: {
        l1: [
          {
            name: "sin fecha muestra el placeholder del prop o el default",
            run({ wrapper, expect }, variant) {
              const expected = (variant.props?.placeholder as string) || "Seleccionar fecha...";
              expect(wrapper.find(".cu-date-picker-label").text()).toBe(expected);
            },
          },
        ],
      },
    },

    {
      id: "format",
      title: "Formato de la fecha",
      badge: "dd/MM/yyyy",
      badgeTitle: "Formato por defecto",
      variants: [
        { id: "default", props: { modelValue: "2026-08-11", format: "dd/MM/yyyy" } },
        { id: "long", props: { modelValue: "2026-08-11", format: "MMMM yyyy" } },
        { id: "short", props: { modelValue: "2026-08-11", format: "dd-MM-yy" } },
      ],
      vue: `  <DatePicker model-value="2026-08-11" format="dd/MM/yyyy" />
  <DatePicker model-value="2026-08-11" format="MMMM yyyy" />
  <DatePicker model-value="2026-08-11" format="dd-MM-yy" />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker model-value="2026-08-11" format="dd/MM/yyyy"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" format="MMMM yyyy"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" format="dd-MM-yy"></cu-date-picker>`,
      checks: {
        l1: [
          {
            name: "el trigger aplica el formato del prop",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-date-picker-label").text()).toBe(FORMAT_EXPECTED[variant.id]);
            },
          },
        ],
      },
    },

    {
      id: "min-max",
      title: "Min / Max",
      variants: [
        { id: "rango", props: { modelValue: "2026-08-11", min: "2026-01-01", max: "2026-12-31" } },
        { id: "ventana", props: { modelValue: "2026-08-11", min: "2026-08-10", max: "2026-08-25", disabledWeekdays: "0,6" } },
        { id: "feriado", props: { modelValue: "2026-08-11", min: "2026-08-10", max: "2026-08-25", disabledWeekdays: "0,6", disabledDates: "2026-08-15" } },
      ],
      vue: `  <DatePicker model-value="2026-08-11" min="2026-01-01" max="2026-12-31" />
  <DatePicker model-value="2026-08-11" min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" />
  <DatePicker model-value="2026-08-11" min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" disabled-dates="2026-08-15" />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker model-value="2026-08-11" min="2026-01-01" max="2026-12-31"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6"></cu-date-picker>
<cu-date-picker model-value="2026-08-11" min="2026-08-10" max="2026-08-25" disabled-weekdays="0,6" disabled-dates="2026-08-15"></cu-date-picker>`,
      checks: {
        l1: [
          {
            name: "min/max/disabledDates deshabilitan los días correspondientes",
            async run({ wrapper, expect }, variant) {
              await openPanel(wrapper);
              const min = variant.props?.min as string | undefined;
              const max = variant.props?.max as string | undefined;
              const day9 = findDay(wrapper, 9);
              const day15 = findDay(wrapper, 15);
              const day26 = findDay(wrapper, 26);
              expect(day9).toBeTruthy();
              expect(day15).toBeTruthy();
              expect(day26).toBeTruthy();
              expect(day9!.attributes("disabled") !== undefined).toBe(min === "2026-08-10");
              expect(day15!.attributes("disabled") !== undefined).toBe(variant.id !== "rango");
              expect(day26!.attributes("disabled") !== undefined).toBe(max === "2026-08-25");
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
      variants: [
        { id: "year-nav", props: { modelValue: "2026-08-11", yearNavigation: true } },
        { id: "month-format", props: { modelValue: "2026-08-11", yearNavigation: true, monthFormat: "MMM yyyy" } },
      ],
      vue: `  <DatePicker model-value="2026-08-11" year-navigation />
  <DatePicker model-value="2026-08-11" year-navigation month-format="MMM yyyy" />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker model-value="2026-08-11" year-navigation></cu-date-picker>
<cu-date-picker model-value="2026-08-11" year-navigation month-format="MMM yyyy"></cu-date-picker>`,
      checks: {
        l1: [
          {
            name: "year-navigation aplica la clase y ensancha el panel",
            async run({ wrapper, expect }) {
              await openPanel(wrapper);
              expect(wrapper.find(".cu-calendar").classes()).toContain("cu-calendar--year-nav");
              const style = wrapper.find(".cu-dropdown-panel").attributes("style") ?? "";
              expect(style).toContain("330px");
            },
          },
        ],
      },
    },

    {
      id: "no-footer",
      title: "Sin footer",
      badge: "true",
      badgeTitle: "todayButton / clearable por defecto",
      variants: [
        { id: "footer", props: { modelValue: "2026-08-11" } },
        { id: "sin-footer", props: { modelValue: "2026-08-11", todayButton: false, clearable: false } },
        { id: "solo-hoy", props: { modelValue: "2026-08-11", clearable: false } },
        { id: "solo-limpiar", props: { modelValue: "2026-08-11", todayButton: false } },
      ],
      vue: `  <DatePicker model-value="2026-08-11" :today-button="false" :clearable="false" />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker id="picker-nof" model-value="2026-08-11"></cu-date-picker>

<script>
  customElements.whenDefined('cu-date-picker').then(() => {
    const picker = document.getElementById('picker-nof');
    picker.todayButton = false;
    picker.clearable = false;
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "el footer (Hoy / Limpiar) respeta todayButton y clearable",
            async run({ wrapper, expect }, variant) {
              await openPanel(wrapper);
              const hasToday = variant.props?.todayButton !== false;
              const hasClear = variant.props?.clearable !== false;
              expect(wrapper.find(".cu-date-picker-footer").exists()).toBe(hasToday || hasClear);
              const texts = wrapper.findAll(".cu-date-picker-footer-btn").map((b) => b.text());
              expect(texts.includes("Hoy")).toBe(hasToday);
              expect(texts.includes("Limpiar")).toBe(hasClear);
            },
          },
        ],
      },
    },

    {
      id: "variants",
      title: "Variantes del trigger",
      badge: "soft",
      badgeTitle: "Variante por defecto",
      variants: [
        { id: "outlined", props: { variant: "outlined", modelValue: "2026-08-11" } },
        { id: "soft", props: { variant: "soft", modelValue: "2026-08-11" } },
        { id: "ghost", props: { variant: "ghost", modelValue: "2026-08-11" } },
        { id: "subtle", props: { variant: "subtle", modelValue: "2026-08-11" } },
      ],
      vue: `  <DatePicker v-for="variant in ['outlined', 'soft', 'ghost', 'subtle']" :variant="variant" model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker variant="outlined" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker variant="soft" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker variant="ghost" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker variant="subtle" model-value="2026-08-11"></cu-date-picker>`,
      checks: {
        l1: [
          {
            name: "el trigger usa la variante cu-button--{variant}",
            run({ wrapper, expect }, variant) {
              const value = (variant.props?.variant as string) ?? "soft";
              expect(wrapper.find(".cu-date-picker-toggle").classes()).toContain(`cu-button--${value}`);
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
      layout: "row",
      variants: [
        { id: "primary", props: { color: "primary", modelValue: "2026-08-11" } },
        { id: "secondary", props: { color: "secondary", modelValue: "2026-08-11" } },
        { id: "neutral", props: { color: "neutral", modelValue: "2026-08-11" } },
        { id: "success", props: { color: "success", modelValue: "2026-08-11" } },
        { id: "warning", props: { color: "warning", modelValue: "2026-08-11" } },
        { id: "danger", props: { color: "danger", modelValue: "2026-08-11" } },
      ],
      vue: `  <DatePicker color="primary" model-value="2026-08-11" />
  <DatePicker color="secondary" model-value="2026-08-11" />
  <DatePicker color="neutral" model-value="2026-08-11" />
  <DatePicker color="success" model-value="2026-08-11" />
  <DatePicker color="warning" model-value="2026-08-11" />
  <DatePicker color="danger" model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker color="primary" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="secondary" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="neutral" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="success" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="warning" model-value="2026-08-11"></cu-date-picker>
<cu-date-picker color="danger" model-value="2026-08-11"></cu-date-picker>`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
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
      variants: [
        { id: "con-eventos", props: { modelValue: "2026-08-11", events: CALENDAR_EVENTS } },
        { id: "sin-eventos", props: { modelValue: "2026-08-11" } },
      ],
      vue: `  <DatePicker model-value="2026-08-11" :events="calendarEvents" />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker id="picker-events" model-value="2026-08-11"></cu-date-picker>

<script>
  customElements.whenDefined('cu-date-picker').then(() => {
    const picker = document.getElementById('picker-events');
    picker.events = [
      { date: '2026-08-03', color: 'primary' },
      { date: '2026-08-11', color: 'warning' },
      { date: '2026-08-11', color: 'danger' },
      { date: '2026-08-18', color: 'primary' },
    ];
    picker.open();
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "events dibuja los puntos en el calendario interno",
            async run({ wrapper, expect }, variant) {
              await openPanel(wrapper);
              const events = Array.isArray(variant.props?.events) ? (variant.props?.events as unknown[]) : [];
              expect(wrapper.findAll(".cu-calendar-dot")).toHaveLength(events.length);
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
      variants: [
        { id: "grid", props: { modelValue: "2026-08-11", grid: true } },
        { id: "border", props: { modelValue: "2026-08-11", border: true } },
        { id: "grid-border", props: { modelValue: "2026-08-11", grid: true, border: true } },
        { id: "none", props: { modelValue: "2026-08-11" } },
      ],
      vue: `  <DatePicker grid model-value="2026-08-11" />
  <DatePicker border model-value="2026-08-11" />
  <DatePicker grid border model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker grid model-value="2026-08-11"></cu-date-picker>
<cu-date-picker border model-value="2026-08-11"></cu-date-picker>
<cu-date-picker grid border model-value="2026-08-11"></cu-date-picker>`,
      checks: {
        l1: [
          {
            name: "grid/border se aplican al calendario interno",
            async run({ wrapper, expect }, variant) {
              await openPanel(wrapper);
              const classes = wrapper.find(".cu-calendar").classes();
              expect(classes.includes("cu-calendar--grid")).toBe(Boolean(variant.props?.grid));
              expect(classes.includes("cu-calendar--border")).toBe(Boolean(variant.props?.border));
            },
          },
        ],
      },
    },

    {
      id: "positions",
      title: "Posiciones",
      badge: "bottom + start",
      badgeTitle: "position + align por defecto",
      variants: [
        { id: "bottom-start", props: { modelValue: "2026-08-11" } },
        { id: "top-start", props: { modelValue: "2026-08-11", position: "top", align: "start" } },
        { id: "top", props: { modelValue: "2026-08-11", position: "top" } },
        { id: "left", props: { modelValue: "2026-08-11", position: "left" } },
        { id: "right-start", props: { modelValue: "2026-08-11", position: "right", align: "start" } },
        { id: "right-center", props: { modelValue: "2026-08-11", position: "right", align: "center" } },
        { id: "top-center", props: { modelValue: "2026-08-11", position: "top", align: "center" } },
      ],
      vue: `  <DatePicker model-value="2026-08-11" position="top" align="center" />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker model-value="2026-08-11" position="top" align="center"></cu-date-picker>`,
      checks: {
        l1: [
          {
            name: "abre el panel en la posición y alineación configuradas",
            async run({ wrapper, expect }, variant) {
              await openPanel(wrapper);
              const position = (variant.props?.position as string) ?? "bottom";
              const align = (variant.props?.align as string) ?? "start";
              const style = wrapper.find(".cu-dropdown-panel").attributes("style") ?? "";
              if (position === "bottom") {
                expect(style).toContain("top: 100%");
                expect(style).not.toContain("bottom: 100%");
              }
              if (position === "top") {
                expect(style).toContain("bottom: 100%");
                expect(style).not.toContain("top: 100%");
              }
              if (position === "right") {
                expect(style).toContain("left: 100%");
                expect(style).not.toContain("right: 100%");
              }
              if (position === "left") {
                expect(style).toContain("right: 100%");
                expect(style).not.toContain("left: 100%");
              }
              if (align === "center" && (position === "bottom" || position === "top")) {
                expect(style).toContain("left: 50%");
                expect(style).toContain("translateX(-50%)");
              }
              if (align === "center" && (position === "left" || position === "right")) {
                expect(style).toContain("translateY(-50%)");
              }
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
      variants: [
        { id: "enabled", props: { modelValue: "2026-08-11" } },
        { id: "disabled", props: { modelValue: "2026-08-11", disabled: true } },
      ],
      vue: `  <DatePicker disabled model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker disabled model-value="2026-08-11"></cu-date-picker>`,
      checks: {
        l1: [
          {
            name: "disabled se refleja en el trigger",
            run({ wrapper, expect }, variant) {
              const trigger = wrapper.find(".cu-date-picker-toggle");
              if (variant.props?.disabled) {
                expect(trigger.attributes("disabled")).toBeDefined();
                expect(trigger.classes()).toContain("cu-button--disabled");
              } else {
                expect(trigger.attributes("disabled")).toBeUndefined();
                expect(trigger.classes()).not.toContain("cu-button--disabled");
              }
            },
          },
          {
            name: "disabled: el trigger no abre el panel",
            async run({ wrapper, expect }, variant) {
              await openPanel(wrapper);
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(!variant.props?.disabled);
            },
          },
        ],
      },
    },

    {
      id: "interaction",
      title: "Interacción",
      variants: [
        { id: "estado-interno", props: { modelValue: "2026-08-11" } },
        { id: "con-placeholder", props: { modelValue: "2026-08-11", placeholder: "Sin fecha" } },
      ],
      vue: `  <DatePicker model-value="2026-08-11" />`,
      vanilla: `<script src="dist/CuDatePicker.umd.js"><\/script>

<cu-date-picker id="picker-estado" model-value="2026-08-11"></cu-date-picker>`,
      checks: {
        l1: [
          {
            name: "al clickear un día el trigger muestra la fecha y emite update:modelValue",
            async run({ wrapper, expect }) {
              await openPanel(wrapper);
              const day20 = findDay(wrapper, 20);
              expect(day20).toBeTruthy();
              await day20!.trigger("click");
              await wrapper.vm.$nextTick();
              expect(wrapper.find(".cu-date-picker-label").text()).toBe("20/08/2026");
              expect(wrapper.emitted("update:modelValue")).toBeTruthy();
            },
          },
          {
            name: "setValue actualiza el label del trigger",
            async run({ wrapper, expect }) {
              (wrapper.vm as unknown as { setValue: (v: string) => void }).setValue("2026-12-24");
              await wrapper.vm.$nextTick();
              expect(wrapper.find(".cu-date-picker-label").text()).toBe("24/12/2026");
            },
          },
          {
            name: "clear limpia el label del trigger",
            async run({ wrapper, expect }, variant) {
              (wrapper.vm as unknown as { clear: () => void }).clear();
              await wrapper.vm.$nextTick();
              const expected = (variant.props?.placeholder as string) || "Seleccionar fecha...";
              expect(wrapper.find(".cu-date-picker-label").text()).toBe(expected);
            },
          },
          {
            name: "al reabrir el panel, el día elegido sigue seleccionado",
            async run({ wrapper, expect }) {
              await openPanel(wrapper);
              const day14 = findDay(wrapper, 14);
              expect(day14).toBeTruthy();
              await day14!.trigger("click");
              await wrapper.vm.$nextTick();
              await openPanel(wrapper);
              const selected = wrapper.findAll(".cu-calendar-day--selected");
              expect(selected).toHaveLength(1);
              expect(selected[0]!.text()).toBe("14");
            },
          },
          {
            name: "toggle() alterna el panel (abre, cierra, abre)",
            async run({ wrapper, expect }) {
              const vm = wrapper.vm as unknown as { toggle: () => void };
              const panel = () => wrapper.find(".cu-dropdown-panel").exists();
              vm.toggle();
              await wrapper.vm.$nextTick();
              expect(panel()).toBe(true);
              vm.toggle();
              await wrapper.vm.$nextTick();
              expect(panel()).toBe(false);
              vm.toggle();
              await wrapper.vm.$nextTick();
              expect(panel()).toBe(true);
            },
          },
        ],
      },
    },
  ],
};
