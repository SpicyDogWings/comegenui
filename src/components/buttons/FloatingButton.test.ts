import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FloatingButton from "./FloatingButton.vue";

describe("FloatingButton", () => {
  it("renderiza el botón flotante con su slot", () => {
    const w = mount(FloatingButton, { slots: { default: "+" } });
    const btn = w.find("button.cu-floating-button");
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toBe("+");
  });

  it("color por defecto primary aplica --fab-bg en el style", () => {
    const w = mount(FloatingButton);
    const style = w.find("button.cu-floating-button").attributes("style") ?? "";
    expect(style).toContain("var(--cu-color-primary)");
  });

  it("emite click al hacer clic", async () => {
    const w = mount(FloatingButton);
    await w.find("button.cu-floating-button").trigger("click");
    const em = w.emitted("click");
    expect(em).toBeTruthy();
    expect((em as unknown[][]).length).toBeGreaterThan(0);
  });

  it("disabled: aplica atributo/class y NO emite click", async () => {
    const w = mount(FloatingButton, { props: { disabled: true } });
    const btn = w.find("button.cu-floating-button");
    expect(btn.attributes("disabled")).toBeDefined();
    expect(btn.classes()).toContain("cu-floating-button--disabled");
    await btn.trigger("click");
    expect(w.emitted("click")).toBeUndefined();
  });
});
