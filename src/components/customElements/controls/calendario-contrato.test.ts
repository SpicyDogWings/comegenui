// Contrato vanilla de los CE de calendario: el custom element refleja su estado
// (UI + getValue/getRange) sin que el host tenga que reasignar `modelValue`.
// Cubre la clase de bug de #40 (wrapper que pasa modelValue + updater a un
// `defineModel`): si mañana Calendar/DatePicker migran a `defineModel`, estos
// tests fallan y frenan la regresión.
import { describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";

import CalendarCe from "@/components/customElements/controls/Calendar.ce.vue";
import DatePickerCe from "@/components/customElements/form/DatePicker.ce.vue";

// Mes fijo (mismo que Calendar.test.ts) para que los días no dependan del reloj.
const FIXED = "2026-08-01";
const NEXT = "2026-09-01";

const dayButton = (w: ReturnType<typeof mount>, n: number) =>
  w.findAll(".cu-calendar-day").find((d) => d.text() === String(n));

describe("Calendar.ce — contrato vanilla", () => {
  it("click en un día actualiza la selección interna y `getValue()` sin reasignar la prop", async () => {
    const w = mount(CalendarCe, { props: { modelValue: FIXED } });
    const updates: Date[] = [];
    w.element.addEventListener("update:modelValue", (e) =>
      updates.push((e as CustomEvent).detail),
    );

    await dayButton(w, 15)!.trigger("click");
    await flushPromises();

    expect(w.vm.getValue()?.getDate()).toBe(15);
    expect(updates.at(-1)?.getDate()).toBe(15);
    expect(w.findAll(".cu-calendar-day--selected")).toHaveLength(1);
  });

  it("`setValue()` refleja la fecha en la UI y `getValue()`", async () => {
    const w = mount(CalendarCe, { props: { modelValue: FIXED } });
    w.vm.setValue("2026-08-20");
    await flushPromises();

    expect(w.vm.getValue()?.getDate()).toBe(20);
    expect(w.findAll(".cu-calendar-day--selected")).toHaveLength(1);
  });

  it("navegar con `nextMonth()`/`prevMonth()` mueve el mes visible", async () => {
    const w = mount(CalendarCe, { props: { modelValue: FIXED } });
    const header = () => w.find(".cu-calendar-header").text();

    const initial = header();
    w.vm.nextMonth();
    await flushPromises();
    expect(header()).not.toBe(initial);

    w.vm.prevMonth();
    await flushPromises();
    expect(header()).toBe(initial);
  });

  it("en modo rango, dos clicks fijan `getRange()` y emiten update:rangeStart/rangeEnd", async () => {
    const w = mount(CalendarCe, { props: { mode: "range", modelValue: FIXED } });
    const starts: Date[] = [];
    const ends: Date[] = [];
    w.element.addEventListener("update:rangeStart", (e) =>
      starts.push((e as CustomEvent).detail),
    );
    w.element.addEventListener("update:rangeEnd", (e) =>
      ends.push((e as CustomEvent).detail),
    );

    await dayButton(w, 10)!.trigger("click");
    await flushPromises();
    await dayButton(w, 20)!.trigger("click");
    await flushPromises();

    expect(starts.at(-1)?.getDate()).toBe(10);
    expect(ends.at(-1)?.getDate()).toBe(20);
    const range = w.vm.getRange();
    expect(range.start?.getDate()).toBe(10);
    expect(range.end?.getDate()).toBe(20);
  });

  it("`setRange()` pinta el rango y `getRange()` lo devuelve", async () => {
    const w = mount(CalendarCe, { props: { mode: "range", modelValue: FIXED } });
    w.vm.setRange("2026-08-10", "2026-08-20");
    await flushPromises();

    expect(w.vm.getRange().start?.getDate()).toBe(10);
    expect(w.vm.getRange().end?.getDate()).toBe(20);
    expect(w.findAll(".cu-calendar-day--range-start")).toHaveLength(1);
    expect(w.findAll(".cu-calendar-day--range-end")).toHaveLength(1);
  });
});

describe("DatePicker.ce — contrato vanilla", () => {
  it("`setValue()` refleja la fecha en el panel y `getValue()` la devuelve", async () => {
    const w = mount(DatePickerCe, { props: { modelValue: FIXED } });
    (w.vm as unknown as { open(): void }).open();
    await flushPromises();

    w.vm.setValue("2026-08-20");
    await flushPromises();

    expect(w.vm.getValue()?.getDate()).toBe(20);
    // El calendario interno (v-if !isRange) queda sincronizado con el valor.
    expect(w.findAll(".cu-calendar-day--selected")).toHaveLength(1);
  });

  it("click en un día propaga `update:modelValue` y `getValue()` sin reasignar la prop", async () => {
    const w = mount(DatePickerCe, { props: { modelValue: FIXED } });
    // El panel se monta con el dropdown; lo abrimos para que el calendario esté.
    (w.vm as unknown as { open(): void }).open();
    await flushPromises();

    const updates: Date[] = [];
    w.element.addEventListener("update:modelValue", (e) =>
      updates.push((e as CustomEvent).detail),
    );

    await dayButton(w, 15)!.trigger("click");
    await flushPromises();

    expect(w.vm.getValue()?.getDate()).toBe(15);
    expect(updates.at(-1)?.getDate()).toBe(15);
  });

  it("en modo rango dual, `setRange()` y `getStartDate()`/`getEndDate()` son coherentes", async () => {
    const w = mount(DatePickerCe, {
      props: { mode: "range", dualCalendar: true, startDate: FIXED },
    });
    w.vm.setRange("2026-08-10", "2026-08-20");
    await flushPromises();

    expect(w.vm.getStartDate()?.getDate()).toBe(10);
    expect(w.vm.getEndDate()?.getDate()).toBe(20);
  });

  it("`setValue()` acepta otra fecha y el trigger muestra la formateada", async () => {
    const w = mount(DatePickerCe, { props: { modelValue: FIXED, format: "dd/MM/yyyy" } });
    w.vm.setValue(NEXT);
    await flushPromises();

    expect(w.vm.getValue()?.getMonth()).toBe(8); // septiembre (0-index)
    expect(w.find(".cu-date-picker-label").text()).toBe("01/09/2026");
  });
});
