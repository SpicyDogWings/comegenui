import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Autocomplete from "./Autocomplete.vue";

const items = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Cherry", value: "cherry" },
];

function factory(props: Record<string, unknown> = {}) {
  return mount(Autocomplete, {
    props: { items, ...props },
  });
}

describe("Autocomplete", () => {
  it("renderiza el input con placeholder y propaga props", () => {
    const w = factory({ placeholder: "Buscar fruta..." });
    const input = w.find("input.cu-input");
    expect(input.exists()).toBe(true);
    expect(input.attributes("placeholder")).toBe("Buscar fruta...");
  });

  it("variant cambia la clase del input", () => {
    const w = factory({ variant: "outlined" });
    expect(w.find("input.cu-input").classes()).toContain("cu-input--outlined");
  });

  it("disabled deshabilita el input", () => {
    const w = factory({ disabled: true });
    expect(w.find("input.cu-input").attributes("disabled")).toBeDefined();
  });

  it("abre el dropdown al enfocar y emite select + update:modelValue al elegir una opción", async () => {
    const w = factory({});
    await w.find("input.cu-input").trigger("focus");
    expect(w.find(".cu-dropdown-panel").exists()).toBe(true);
    expect(w.findAll("button.cu-autocomplete-option")).toHaveLength(3);

    await w.findAll("button.cu-autocomplete-option")[0]!.trigger("click");

    const selectEm = w.emitted("select");
    expect(selectEm).toBeTruthy();
    const payload = (selectEm as unknown[][])[0]![0] as { label: string; value: string };
    expect(payload.label).toBe("Apple");

    const modelEm = w.emitted("update:modelValue");
    expect(modelEm).toBeTruthy();
    const modelValue = (modelEm as unknown[][])[0]![0] as string;
    expect(modelValue).toBe("Apple");
  });

  it("filtra las opciones según el texto ingresado", async () => {
    const w = factory({});
    await w.find("input.cu-input").setValue("Ban");
    expect(w.findAll("button.cu-autocomplete-option")).toHaveLength(1);
    expect(w.find("button.cu-autocomplete-option").text()).toContain("Banana");
  });

  it("emite blur al salir del foco", async () => {
    const w = factory({});
    await w.find("div[tabindex='-1']").trigger("focusout", { relatedTarget: null });
    expect(w.emitted("blur")).toBeTruthy();
  });

  it("filtra items que llegan después del mount (prop reactiva)", async () => {
    const w = factory({ items: [] });
    await w.setProps({ items });
    await w.find("input.cu-input").setValue("Ban");
    expect(w.findAll("button.cu-autocomplete-option")).toHaveLength(1);
    expect(w.find("button.cu-autocomplete-option").text()).toContain("Banana");
  });
});
