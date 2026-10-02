// Comportamiento de Label según su ficha (docs/componentes/vue/label.md).
//
// Label con color semántico. Al hacer clic, enfoca el input hijo o, si se define
// `for`, el elemento con ese id. Emite `click`. Aserciones escritas a mano desde
// la prosa de la ficha.
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Label from "./Label.vue";

describe("Label — texto y color", () => {
  it("renderiza la prop label", () => {
    const w = mount(Label, { props: { label: "Correo electrónico" } });
    expect(w.find(".cu-label-text").text()).toBe("Correo electrónico");
  });

  it("sin label no renderiza el texto", () => {
    const w = mount(Label);
    expect(w.find(".cu-label-text").exists()).toBe(false);
  });

  it("expone el color semántico en las CSS custom properties", () => {
    const w = mount(Label, { props: { label: "Nombre", color: "primary" } });
    expect(w.attributes("style") ?? "").toContain("--label-fg: var(--cu-color-primary)");
  });

  it("renderiza el slot default (el control hijo)", () => {
    const w = mount(Label, { props: { label: "Acepto" }, slots: { default: '<input class="hijo" />' } });
    expect(w.find(".hijo").exists()).toBe(true);
  });
});

describe("Label — click y foco", () => {
  it("click en el label emite el evento click", async () => {
    const w = mount(Label, { props: { label: "Nombre" } });
    await w.find(".cu-label-text").trigger("click");
    expect(w.emitted("click")).toHaveLength(1);
  });

  it("con `for` enfoca el elemento con ese id", async () => {
    const input = document.createElement("input");
    input.id = "miInput";
    document.body.appendChild(input);

    const w = mount(Label, { props: { for: "miInput", label: "Nombre" } });
    await w.find(".cu-label-text").trigger("click");

    expect(document.activeElement).toBe(input);
    w.unmount();
    input.remove();
  });

  it("sin `for` no intenta enfocar un externo (no rompe) y emite click", async () => {
    const w = mount(Label, { props: { label: "Nombre" } });
    await w.find(".cu-label-text").trigger("click");
    expect(w.emitted("click")).toHaveLength(1);
  });
});
