import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Input from "./Input.vue";

function factory(props: Record<string, unknown> = {}) {
  return mount(Input, { props });
}

describe("Input", () => {
  it("renderiza un input con clase cu-input", () => {
    const w = factory({});
    expect(w.find("input.cu-input").exists()).toBe(true);
  });

  it("aplica placeholder, type y variant", () => {
    const w = factory({
      placeholder: "Nombre",
      type: "email",
      variant: "outlined",
    });
    const input = w.find("input.cu-input");
    expect(input.attributes("placeholder")).toBe("Nombre");
    expect(input.attributes("type")).toBe("email");
    expect(input.classes()).toContain("cu-input--outlined");
  });

  it("disabled y readOnly se reflejan en el input", () => {
    const w = factory({ disabled: true, readOnly: true });
    const input = w.find("input.cu-input");
    expect(input.attributes("disabled")).toBeDefined();
    expect(input.attributes("readonly")).toBeDefined();
    expect(input.classes()).toContain("cu-input--disabled");
  });

  it("muestra el valor inicial del v-model", () => {
    const w = factory({ modelValue: "hola" });
    const inputEl = w.find("input.cu-input").element as HTMLInputElement | undefined;
    expect(inputEl?.value).toBe("hola");
  });

  it("al escribir emite update:modelValue", async () => {
    const w = factory({});
    await w.find("input.cu-input").setValue("nuevo texto");
    const modelEm = w.emitted("update:modelValue");
    expect(modelEm).toBeTruthy();
    const value = (modelEm as unknown[][])[0]![0] as string;
    expect(value).toBe("nuevo texto");
  });
});
