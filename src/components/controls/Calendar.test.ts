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

  it("muestra el header con el mes del modelValue", () => {
    const w = mount(Calendar, { props: { modelValue: "2026-08-11" } });
    expect(w.find(".cu-calendar-month").text()).toContain("2026");
    expect(w.find(".cu-calendar-month").text()).toContain("Agosto");
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

  it("navega con nextMonth/prevMonth y respeta los límites", async () => {
    const w = mount(Calendar, {
      props: { modelValue: "2026-08-11", min: "2026-07-01", max: "2026-09-30" },
    });
    const vm = w.vm as any;
    vm.nextMonth();
    await flushPromises();
    expect(w.find(".cu-calendar-month").text()).toContain("Septiembre");
    vm.nextMonth();
    await flushPromises();
    // Octubre está fuera de max → no navega
    expect(w.find(".cu-calendar-month").text()).toContain("Septiembre");
    vm.prevMonth();
    await flushPromises();
    expect(w.find(".cu-calendar-month").text()).toContain("Agosto");
    vm.prevMonth();
    await flushPromises();
    // Julio está dentro de min (2026-07-01) → navega
    expect(w.find(".cu-calendar-month").text()).toContain("Julio");
    vm.prevMonth();
    await flushPromises();
    // Junio está fuera de min → no navega
    expect(w.find(".cu-calendar-month").text()).toContain("Julio");
  });

  it("goToMonth navega al mes pedido", async () => {
    const w = mount(Calendar, { props: { modelValue: "2026-08-11" } });
    (w.vm as any).goToMonth("2030-06-15");
    await flushPromises();
    expect(w.find(".cu-calendar-month").text()).toContain("Junio");
    expect(w.find(".cu-calendar-month").text()).toContain("2030");
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
