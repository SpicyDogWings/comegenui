// Comportamiento de FloatingButton según su ficha (docs/componentes/vue/floating-button.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FloatingButton from "./FloatingButton.vue";

describe("FloatingButton — render y slot", () => {
  it("renderiza el slot (normalmente un SVG)", () => {
    const w = mount(FloatingButton, {
      slots: { default: '<svg data-test="icon"></svg>' },
    });
    expect(w.find('[data-test="icon"]').exists()).toBe(true);
  });

  it("siempre lleva la clase de posicionamiento flotante", () => {
    const w = mount(FloatingButton);
    expect(w.find("button").classes()).toContain("cu-floating-button");
  });
});

describe("FloatingButton — props heredadas de Button", () => {
  it("usa color primary, variant solid y size lg por defecto", () => {
    const w = mount(FloatingButton);
    const btn = w.find("button");
    expect(btn.classes()).toContain("cu-button--solid");
    expect(btn.classes()).toContain("cu-button--lg");
    expect(btn.attributes("style")).toContain("--btn-bg: var(--cu-color-primary)");
  });

  it("pasa la variante pedida al Button", () => {
    const w = mount(FloatingButton, { props: { variant: "soft" } });
    expect(w.find("button").classes()).toContain("cu-button--soft");
  });

  it("pasa el tamaño pedido al Button", () => {
    const w = mount(FloatingButton, { props: { size: "sm" } });
    expect(w.find("button").classes()).toContain("cu-button--sm");
  });

  it("pasa el color semántico al Button", () => {
    const w = mount(FloatingButton, { props: { color: "success" } });
    expect(w.find("button").attributes("style")).toContain("--btn-bg: var(--cu-color-success)");
  });

  it("`disabled` deshabilita el botón", () => {
    const w = mount(FloatingButton, { props: { disabled: true } });
    expect(w.find("button").attributes("disabled")).toBeDefined();
  });

  it("`loading` muestra spinner y deshabilita el botón", () => {
    const w = mount(FloatingButton, { props: { loading: true } });
    expect(w.find(".cu-button-spinner").exists()).toBe(true);
    expect(w.find("button").attributes("disabled")).toBeDefined();
  });
});
