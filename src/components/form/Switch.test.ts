import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Switch from "./Switch.vue";

function factory(props: Record<string, unknown> = {}) {
  return mount(Switch, { props });
}

describe("Switch", () => {
  it("renderiza el switch con rol y aria-checked", () => {
    const w = factory({});
    expect(w.find(".cu-switch").exists()).toBe(true);
    expect(w.find(".cu-switch-track").attributes("role")).toBe("switch");
    expect(w.find(".cu-switch-track").attributes("aria-checked")).toBe("false");
  });

  it("size cambia la clase raíz", () => {
    const w = factory({ size: "sm" });
    expect(w.find(".cu-switch").classes()).toContain("cu-switch--sm");
  });

  it("disabled agrega la clase y no alterna al hacer click", async () => {
    const w = factory({ disabled: true });
    expect(w.find(".cu-switch").classes()).toContain("cu-switch--disabled");
    await w.find(".cu-switch").trigger("click");
    expect(w.emitted("update:modelValue")).toBeFalsy();
    expect(w.emitted("change")).toBeFalsy();
  });

  it("al alternar (change del input interno) emite change + update:modelValue", async () => {
    const w = factory({});
    await w.find("input[type='checkbox']").setValue(true);

    const changeEm = w.emitted("change");
    expect(changeEm).toBeTruthy();
    const checked = (changeEm as unknown[][])[0]![0] as boolean;
    expect(checked).toBe(true);

    const modelEm = w.emitted("update:modelValue");
    expect(modelEm).toBeTruthy();
    const modelValue = (modelEm as unknown[][])[0]![0] as boolean;
    expect(modelValue).toBe(true);

    expect(w.find(".cu-switch-track").classes()).toContain("cu-switch--checked");
    expect(w.find(".cu-switch-track").attributes("aria-checked")).toBe("true");
  });

  it("arranca encendido si modelValue es true y se apaga al alternar", async () => {
    const w = factory({ modelValue: true });
    expect(w.find(".cu-switch-track").classes()).toContain("cu-switch--checked");

    await w.find("input[type='checkbox']").setValue(false);
    const modelEm = w.emitted("update:modelValue");
    const modelValue = (modelEm as unknown[][])[0]![0] as boolean;
    expect(modelValue).toBe(false);
  });
});
