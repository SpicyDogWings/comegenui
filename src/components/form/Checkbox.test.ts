import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Checkbox from "./Checkbox.vue";

function factory(props: Record<string, unknown> = {}) {
  return mount(Checkbox, { props });
}

describe("Checkbox", () => {
  it("renderiza el input y el label", () => {
    const w = factory({ label: "Aceptar términos" });
    expect(w.find("input[type='checkbox']").exists()).toBe(true);
    expect(w.find(".cu-checkbox-label").text()).toBe("Aceptar términos");
  });

  it("size cambia la clase raíz", () => {
    const w = factory({ size: "sm" });
    expect(w.find(".cu-checkbox").classes()).toContain("cu-checkbox--sm");
  });

  it("disabled marca el atributo y la clase", () => {
    const w = factory({ disabled: true });
    expect(w.find(".cu-checkbox").classes()).toContain("cu-checkbox--disabled");
    expect(w.find("input[type='checkbox']").attributes("disabled")).toBeDefined();
  });

  it("al tildar emite change y update:modelValue", async () => {
    const w = factory({});
    await w.find("input[type='checkbox']").setValue(true);

    const changeEm = w.emitted("change");
    expect(changeEm).toBeTruthy();
    const payload = (changeEm as unknown[][])[0]![0] as { target: { checked: boolean } };
    expect(payload.target.checked).toBe(true);

    const modelEm = w.emitted("update:modelValue");
    expect(modelEm).toBeTruthy();
    const checked = (modelEm as unknown[][])[0]![0] as boolean;
    expect(checked).toBe(true);

    expect(w.find(".cu-checkbox-box").classes()).toContain("cu-checkbox-box--checked");
  });

  it("arranca tildado si modelValue es true", () => {
    const w = factory({ modelValue: true });
    expect(w.find(".cu-checkbox-box").classes()).toContain("cu-checkbox-box--checked");
    expect(w.find("svg.cu-checkbox-icon").exists()).toBe(true);
  });
});
