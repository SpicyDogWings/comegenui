import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Calendar from "./Calendar.vue";

describe("Calendar — grilla, límites y selección", () => {
  it("renderiza la grilla con 7 columnas de días de la semana", () => {
    const w = mount(Calendar, { props: { modelValue: "2026-08-11" } });
    const weekdays = w.findAll(".cu-calendar-weekday");
    expect(weekdays).toHaveLength(7);
    expect(weekdays[0]!.text()).toBe("Lun"); // weekStart default = 1 (lunes)
  });

  it("muestra el mes del modelValue en el header (MonthSlider)", () => {
    const w = mount(Calendar, { props: { modelValue: "2026-08-11" } });
    expect(w.find(".cu-month-slider-label-month").text()).toBe("agosto");
  });

  it("renderiza un día por cada día del mes", () => {
    // Febrero 2024 (bisiesto) = 29 días
    const w = mount(Calendar, { props: { modelValue: "2024-02-10" } });
    const days = w.findAll(".cu-calendar-day");
    expect(days).toHaveLength(29);
  });

  it("marca el día seleccionado con la clase --selected", () => {
    const w = mount(Calendar, { props: { modelValue: "2026-08-11" } });
    const selected = w.findAll(".cu-calendar-day--selected");
    expect(selected).toHaveLength(1);
    expect(selected[0]!.text()).toBe("11");
  });

  it("deshabilita los días fuera de min/max", () => {
    const w = mount(Calendar, {
      props: { modelValue: "2026-08-11", min: "2026-08-10", max: "2026-08-20" },
    });
    const disabled = w.findAll(".cu-calendar-day:disabled");
    expect(disabled.length).toBeGreaterThan(0);
    // El día 9 queda fuera del rango y deshabilitado
    const day9 = w.findAll(".cu-calendar-day").find((d) => d.text() === "9");
    expect(day9?.attributes("disabled")).toBeDefined();
  });

  it("emite update:modelValue/change/select al clickear un día", async () => {
    const w = mount(Calendar, { props: { modelValue: "2026-08-11" } });
    const day20 = w.findAll(".cu-calendar-day").find((d) => d.text() === "20");
    await day20!.trigger("click");
    const emitted = w.emitted("update:modelValue");
    expect(emitted).toBeTruthy();
    const value = (emitted as unknown[][])[0]![0] as Date;
    expect(value.getFullYear()).toBe(2026);
    expect(value.getMonth()).toBe(7); // agosto
    expect(value.getDate()).toBe(20);
    expect(w.emitted("change")).toBeTruthy();
    expect(w.emitted("select")).toBeTruthy();
  });

  it("no emite nada al clickear un día deshabilitado", async () => {
    const w = mount(Calendar, {
      props: { modelValue: "2026-08-11", min: "2026-08-10" },
    });
    const day5 = w.findAll(".cu-calendar-day").find((d) => d.text() === "5");
    await day5!.trigger("click");
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });

  it("al clickear un día queda marcado como seleccionado (estado interno)", async () => {
    const w = mount(Calendar, { props: { modelValue: "2026-08-11" } });
    const day20 = w.findAll(".cu-calendar-day").find((d) => d.text() === "20");
    await day20!.trigger("click");
    const selected = w.findAll(".cu-calendar-day--selected");
    expect(selected).toHaveLength(1);
    expect(selected[0]!.text()).toBe("20");
  });

  it("setValue actualiza el día seleccionado (estado interno)", async () => {
    const w = mount(Calendar, { props: { modelValue: "2026-08-11" } });
    (w.vm as any).setValue("2026-08-25");
    await flushPromises();
    const selected = w.findAll(".cu-calendar-day--selected");
    expect(selected).toHaveLength(1);
    expect(selected[0]!.text()).toBe("25");
  });

  it("disabledWeekdays deshabilita esos días de la semana", () => {
    // Agosto 2026: 1/8 = viernes → sábado 2 y domingo 3 deshabilitados con [0,6]
    const w = mount(Calendar, {
      props: { modelValue: "2026-08-11", disabledWeekdays: [0, 6] },
    });
    const days = w.findAll(".cu-calendar-day");
    const day2 = days.find((d) => d.text() === "2");
    const day4 = days.find((d) => d.text() === "4");
    expect(day2!.attributes("disabled")).toBeDefined(); // sábado
    expect(day4!.attributes("disabled")).toBeUndefined(); // lunes
  });

  it("disabledWeekdays acepta string separado por comas (CE)", () => {
    const w = mount(Calendar, {
      props: { modelValue: "2026-08-11", disabledWeekdays: "0,6" },
    });
    const day2 = w.findAll(".cu-calendar-day").find((d) => d.text() === "2");
    expect(day2!.attributes("disabled")).toBeDefined();
  });

  it("disabledDates deshabilita fechas puntuales", () => {
    const w = mount(Calendar, {
      props: { modelValue: "2026-08-11", disabledDates: "2026-08-15,2026-08-16" },
    });
    const day15 = w.findAll(".cu-calendar-day").find((d) => d.text() === "15");
    const day16 = w.findAll(".cu-calendar-day").find((d) => d.text() === "16");
    const day17 = w.findAll(".cu-calendar-day").find((d) => d.text() === "17");
    expect(day15!.attributes("disabled")).toBeDefined();
    expect(day16!.attributes("disabled")).toBeDefined();
    expect(day17!.attributes("disabled")).toBeUndefined();
  });

  it("navega con nextMonth/prevMonth y respeta los límites", async () => {
    const w = mount(Calendar, {
      props: { modelValue: "2026-08-11", min: "2026-07-01", max: "2026-09-30" },
    });
    const vm = w.vm as any;
    const label = () => w.find(".cu-month-slider-label-month").text();
    vm.nextMonth();
    await flushPromises();
    expect(label()).toBe("septiembre");
    vm.nextMonth();
    await flushPromises();
    // Octubre está fuera de max → no navega
    expect(label()).toBe("septiembre");
    vm.prevMonth();
    await flushPromises();
    expect(label()).toBe("agosto");
    vm.prevMonth();
    await flushPromises();
    // Julio está dentro de min (2026-07-01) → navega
    expect(label()).toBe("julio");
    vm.prevMonth();
    await flushPromises();
    // Junio está fuera de min → no navega
    expect(label()).toBe("julio");
  });

  it("goToMonth navega al mes pedido y muestra el año auto", async () => {
    const w = mount(Calendar, { props: { modelValue: "2026-08-11" } });
    (w.vm as any).goToMonth("2030-06-15");
    await flushPromises();
    expect(w.find(".cu-month-slider-label-month").text()).toBe("junio");
    expect(w.find(".cu-month-slider-label-year").text()).toContain("2030");
  });

  it("yearNavigation agrega los botones de año del MonthSlider", () => {
    const w = mount(Calendar, { props: { modelValue: "2026-08-11" } });
    // default (false): solo prev/next month
    expect(w.findAll(".cu-month-slider .cu-button--icon-only")).toHaveLength(2);
    const w2 = mount(Calendar, { props: { modelValue: "2026-08-11", yearNavigation: true } });
    expect(w2.findAll(".cu-month-slider .cu-button--icon-only").length).toBeGreaterThanOrEqual(4);
  });

  it("monthFormat personaliza el label del header", () => {
    const w = mount(Calendar, { props: { modelValue: "2026-08-11", monthFormat: "MMM" } });
    expect(w.find(".cu-month-slider-label-month").text()).toBe("ago");
  });

  it("disabled bloquea la selección", async () => {
    const w = mount(Calendar, { props: { modelValue: "2026-08-11", disabled: true } });
    const days = w.findAll(".cu-calendar-day");
    expect(days.length).toBeGreaterThan(0);
    expect(days[0]!.attributes("disabled")).toBeDefined();
    await days[0]!.trigger("click");
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });

  it("weekStart=0 arranca la semana en domingo", () => {
    const w = mount(Calendar, { props: { modelValue: "2026-08-11", weekStart: 0 } });
    expect(w.findAll(".cu-calendar-weekday")[0]!.text()).toBe("Dom");
  });
});
