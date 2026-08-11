import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import ColorPicker from "./ColorPicker.vue";

function factory(props: Record<string, unknown> = {}) {
  return mount(ColorPicker, { props });
}

describe("ColorPicker", () => {
  it("renderiza el swatch, el input nativo y el input de texto", () => {
    const w = factory({});
    expect(w.find(".cu-color-picker-swatch").exists()).toBe(true);
    expect(w.find("input[type='color']").exists()).toBe(true);
    expect(w.find("input.cu-color-picker-input").exists()).toBe(true);
  });

  it("disabled agrega la clase y deshabilita los inputs", () => {
    const w = factory({ disabled: true });
    expect(w.find(".cu-color-picker").classes()).toContain("cu-color-picker--disabled");
    expect(w.find("input[type='color']").attributes("disabled")).toBeDefined();
    expect(w.find("input.cu-color-picker-input").attributes("disabled")).toBeDefined();
  });

  it("muestra el valor inicial en el input de texto", () => {
    const w = factory({ modelValue: "#123456" });
    const inputEl = w.find("input.cu-color-picker-input").element as HTMLInputElement | undefined;
    expect(inputEl?.value).toBe("#123456");
  });

  it("al tipear un hex válido emite change y update:modelValue", async () => {
    const w = factory({});
    await w.find("input.cu-color-picker-input").setValue("#ff0000");

    const changeEm = w.emitted("change");
    expect(changeEm).toBeTruthy();
    const hex = (changeEm as unknown[][])[0]![0] as string;
    expect(hex).toBe("#ff0000");

    const modelEm = w.emitted("update:modelValue");
    expect(modelEm).toBeTruthy();
    const modelValue = (modelEm as unknown[][])[0]![0] as string;
    expect(modelValue).toBe("#ff0000");
  });

  it("no emite change con un hex inválido", async () => {
    const w = factory({});
    await w.find("input.cu-color-picker-input").setValue("#zzz");
    expect(w.emitted("change")).toBeFalsy();
  });
});
