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

  it("al reabrir el panel, el día elegido sigue seleccionado (estado interno, no la prop)", async () => {
    // modelValue se queda en el 11 (prop estática); al elegir el 14 el estado
    // interno avanza. Reabrir debe marcar el 14, NO la prop (11).
    const w = mount(DatePicker, { props: { modelValue: "2026-08-11" } });
    await w.find(".cu-date-picker-toggle").trigger("click");
    await flushPromises();
    const day14 = w.findAll(".cu-calendar-day").find((d) => d.text() === "14");
    expect(day14).toBeTruthy();
    await day14!.trigger("click");
    await flushPromises();
    // panel cerrado → reabrir
    await w.find(".cu-date-picker-toggle").trigger("click");
    await flushPromises();
    const selected = w.findAll(".cu-calendar-day--selected");
    expect(selected).toHaveLength(1);
    expect(selected[0]!.text()).toBe("14");
  });

  it("position top + align start abre el panel arriba", async () => {
    const w = mount(DatePicker, { props: { position: "top", align: "start", modelValue: "2026-08-11" } });
    await w.find(".cu-date-picker-toggle").trigger("click");
    await flushPromises();
    const style = w.find(".cu-dropdown-panel").attributes("style") || "";
    expect(style).toContain("bottom: 100%"); // panel arriba
    expect(style).not.toContain("top: 100%");
  });

  it("position top abre el panel arriba", async () => {
    const w = mount(DatePicker, { props: { position: "top", modelValue: "2026-08-11" } });
    await w.find(".cu-date-picker-toggle").trigger("click");
    await flushPromises();
    const style = w.find(".cu-dropdown-panel").attributes("style") || "";
    expect(style).toContain("bottom: 100%");
  });

  it("position left abre el panel a la izquierda", async () => {
    const w = mount(DatePicker, { props: { position: "left", modelValue: "2026-08-11" } });
    await w.find(".cu-date-picker-toggle").trigger("click");
    await flushPromises();
    const style = w.find(".cu-dropdown-panel").attributes("style") || "";
    expect(style).toContain("right: 100%"); // panel a la izquierda
    expect(style).not.toContain("left: 100%");
  });

  it("position right + align start abre el panel a la derecha, alineado arriba", async () => {
    const w = mount(DatePicker, { props: { position: "right", align: "start", modelValue: "2026-08-11" } });
    await w.find(".cu-date-picker-toggle").trigger("click");
    await flushPromises();
    const style = w.find(".cu-dropdown-panel").attributes("style") || "";
    expect(style).toContain("left: 100%"); // panel a la derecha
    expect(style).toContain("top: 0");     // alineado arriba (start)
    expect(style).not.toContain("bottom: 0");
  });

  it("position right align center centra verticalmente el panel", async () => {
    const w = mount(DatePicker, { props: { position: "right", align: "center", modelValue: "2026-08-11" } });
    await w.find(".cu-date-picker-toggle").trigger("click");
    await flushPromises();
    const style = w.find(".cu-dropdown-panel").attributes("style") || "";
    expect(style).toContain("left: 100%");
    expect(style).toContain("translateY(-50%)");
  });

  it("position top align center centra horizontalmente el panel", async () => {
    const w = mount(DatePicker, { props: { position: "top", align: "center", modelValue: "2026-08-11" } });
    await w.find(".cu-date-picker-toggle").trigger("click");
    await flushPromises();
    const style = w.find(".cu-dropdown-panel").attributes("style") || "";
    expect(style).toContain("bottom: 100%"); // panel arriba del trigger
    expect(style).toContain("left: 50%");    // centrado horizontal
    expect(style).toContain("translateX(-50%)");
  });
});

describe("DatePicker — programático externo (toggle)", () => {
  it("toggle() desde botón externo alterna: abre, cierra, abre", async () => {
    const w = mount(DatePicker);
    await flushPromises();

    const external = document.createElement("button");
    external.addEventListener("click", () => (w.vm as any).toggle());
    document.body.appendChild(external);

    const panel = () => w.find(".cu-dropdown-panel").exists();

    external.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    expect(panel()).toBe(true);

    external.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    expect(panel()).toBe(false);

    external.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    expect(panel()).toBe(true);

    external.remove();
    w.unmount();
  });
});
