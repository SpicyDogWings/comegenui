import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Select from "./Select.vue";

const options = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
];

function factory(props: Record<string, unknown> = {}) {
  return mount(Select, { props: { options, ...props } });
}

describe("Select", () => {
  it("renderiza el toggle con el placeholder por defecto", () => {
    const w = factory({});
    expect(w.find(".cu-select").exists()).toBe(true);
    expect(w.find("button.cu-select-toggle").exists()).toBe(true);
    expect(w.find("button.cu-select-toggle").text()).toContain("Seleccionar...");
  });

  it("muestra el label de la opción seleccionada vía modelValue", () => {
    const w = factory({ modelValue: "br" });
    expect(w.find("button.cu-select-toggle").text()).toContain("Brasil");
  });

  it("variant cambia la clase del toggle", () => {
    const w = factory({ variant: "outlined" });
    expect(w.find("button.cu-select-toggle").classes()).toContain("cu-button--outlined");
  });

  it("disabled deshabilita el toggle", () => {
    const w = factory({ disabled: true });
    expect(w.find("button.cu-select-toggle").attributes("disabled")).toBeDefined();
  });

  it("abre el panel y al elegir emite update:modelValue + select", async () => {
    const w = factory({});
    await w.find("button.cu-select-toggle").trigger("click");
    expect(w.find(".cu-dropdown-panel").exists()).toBe(true);
    expect(w.findAll("button.cu-select-option")).toHaveLength(3);

    await w.findAll("button.cu-select-option")[1]!.trigger("click");

    const modelEm = w.emitted("update:modelValue");
    expect(modelEm).toBeTruthy();
    const value = (modelEm as unknown[][])[0]![0] as string;
    expect(value).toBe("br");

    const selectEm = w.emitted("select");
    expect(selectEm).toBeTruthy();
    const option = (selectEm as unknown[][])[0]![0] as { value: string; label: string };
    expect(option).toMatchObject({ value: "br", label: "Brasil" });
  });

  it("muestra 'Sin opciones' cuando no hay options", async () => {
    const w = factory({ options: [] });
    await w.find("button.cu-select-toggle").trigger("click");
    expect(w.find(".cu-select-empty").exists()).toBe(true);
  });
});
