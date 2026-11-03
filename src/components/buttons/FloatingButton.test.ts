// Comportamiento de FloatingButton según su ficha (docs/componentes/vue/floating-button.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect } from "vitest";
import { defineCustomElement, nextTick } from "vue";
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
    expect(btn.attributes("style")).toContain("--btn-solid: var(--cu-color-primary-solid)");
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
    expect(w.find("button").attributes("style")).toContain("--btn-solid: var(--cu-color-success-solid)");
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

// La posición no es una prop: se ajusta con `--cu-fab-bottom` / `--cu-fab-right`
// en el host (o en `:root`), con el spacing del tema como default y la zona
// segura de iOS sumada. Va en el estilo del botón para que funcione igual en Vue
// y en el custom element (donde el `<button>` vive en el shadow).
describe("FloatingButton — posición configurable", () => {
  const bottom = (el: Element) => (el as HTMLElement).style.getPropertyValue("bottom");
  const right = (el: Element) => (el as HTMLElement).style.getPropertyValue("right");

  it("usa `--cu-fab-bottom` y `--cu-fab-right` con el spacing del tema como default", () => {
    const btn = mount(FloatingButton).find("button").element;

    expect(bottom(btn)).toContain("var(--cu-fab-bottom");
    expect(right(btn)).toContain("var(--cu-fab-right");
    expect(bottom(btn)).toContain("var(--cu-space-lg)");
    expect(right(btn)).toContain("var(--cu-space-lg)");
  });

  it("suma la zona segura de iOS (env) a los dos márgenes", () => {
    const btn = mount(FloatingButton).find("button").element;

    expect(bottom(btn)).toContain("env(safe-area-inset-bottom");
    expect(right(btn)).toContain("env(safe-area-inset-right");
  });
});

describe("FloatingButton — custom element", () => {
  const CuFloatingButtonTest = defineCustomElement(FloatingButton);
  if (!customElements.get("cu-floating-button-test")) {
    customElements.define("cu-floating-button-test", CuFloatingButtonTest);
  }

  it("el botón del shadow lleva la misma posición configurable", async () => {
    document.body.innerHTML = '<cu-floating-button-test aria-label="Agregar"></cu-floating-button-test>';
    const host = document.body.firstElementChild as HTMLElement;
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 0));

    const btn = host.shadowRoot?.querySelector("button");
    expect(btn).toBeTruthy();
    expect((btn as HTMLElement).style.getPropertyValue("bottom")).toContain("var(--cu-fab-bottom");
    expect((btn as HTMLElement).style.getPropertyValue("right")).toContain("var(--cu-fab-right");
  });
});
