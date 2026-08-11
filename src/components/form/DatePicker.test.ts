import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import DatePicker from "./DatePicker.vue";

describe("DatePicker — label del trigger y selección", () => {
  it("muestra la fecha formateada en el trigger", () => {
    const w = mount(DatePicker, {
      props: { modelValue: "2026-08-11", format: "dd/MM/yyyy" },
    });
    expect(w.find(".cu-date-picker-label").text()).toBe("11/08/2026");
  });

  it("muestra placeholder cuando no hay fecha", () => {
    const w = mount(DatePicker, { props: { placeholder: "Elegí..." } });
    expect(w.find(".cu-date-picker-label").text()).toBe("Elegí...");
  });

  it("al clickear un día en el panel, el trigger muestra la nueva fecha", async () => {
    const w = mount(DatePicker, { props: { modelValue: "2026-08-11" } });
    await w.find(".cu-date-picker-toggle").trigger("click");
    await flushPromises();
    const day20 = w.findAll(".cu-calendar-day").find((d) => d.text() === "20");
    expect(day20).toBeTruthy();
    await day20!.trigger("click");
    await flushPromises();
    expect(w.find(".cu-date-picker-label").text()).toBe("20/08/2026");
    expect(w.emitted("update:modelValue")).toBeTruthy();
  });

  it("setValue actualiza el label del trigger (estado interno)", async () => {
    const w = mount(DatePicker, { props: { modelValue: "2026-08-11" } });
    (w.vm as any).setValue("2026-12-24");
    await flushPromises();
    expect(w.find(".cu-date-picker-label").text()).toBe("24/12/2026");
  });

  it("clear limpia el label", async () => {
    const w = mount(DatePicker, {
      props: { modelValue: "2026-08-11", placeholder: "Sin fecha" },
    });
    (w.vm as any).clear();
    await flushPromises();
    expect(w.find(".cu-date-picker-label").text()).toBe("Sin fecha");
  });
});
