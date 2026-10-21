// Comportamiento de Label según su ficha (docs/componentes/vue/label.md).
//
// Label con color semántico. Al hacer clic, enfoca el input hijo o, si se define
// `for`, el elemento con ese id. Emite `click`. Aserciones escritas a mano desde
// la prosa de la ficha.
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Label from "./Label.vue";
import Checkbox from "./Checkbox.vue";
import Switch from "./Switch.vue";

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

  it("sin `for` enfoca el primer control del slot (no solo el texto)", async () => {
    const w = mount(Label, {
      props: { label: "Correo" },
      slots: { default: '<input class="hijo" />' },
      attachTo: document.body,
    });
    await w.find(".cu-label").trigger("click");
    expect(document.activeElement).toBe(w.find(".hijo").element);
    w.unmount();
  });

  it("si el control del slot es un custom element, enfoca el control de su shadow root", async () => {
    // Un host no labelable (como <cu-input>): el <label> nativo no puede
    // enfocarlo, y el host tampoco es focuseable; hay que entrar al shadow root.
    const host = document.createElement("div");
    const inner = document.createElement("input");
    host.attachShadow({ mode: "open" }).appendChild(inner);

    const w = mount(Label, { props: { label: "Correo" }, attachTo: document.body });
    w.element.appendChild(host);

    await w.find(".cu-label").trigger("click");
    // document.activeElement es el host (así se reporta el foco dentro de un
    // shadow root); el control enfocado se ve en shadowRoot.activeElement.
    expect(host.shadowRoot?.activeElement).toBe(inner);
    expect(document.activeElement).toBe(host);
    w.unmount();
  });

  it("expone `for` como atributo del <label> (asociación nativa)", () => {
    const w = mount(Label, { props: { for: "miInput", label: "Nombre" } });
    expect(w.attributes("for")).toBe("miInput");
  });

  it("en Vue enfoca el input interno de un Checkbox del slot", async () => {
    const w = mount(Label, {
      props: { label: "Acepto los términos" },
      slots: { default: Checkbox },
      attachTo: document.body,
    });
    await w.find(".cu-label").trigger("click");
    expect(document.activeElement).toBe(w.find('input[type="checkbox"]').element);
    w.unmount();
  });

  it("en Vue enfoca el input interno de un Switch del slot", async () => {
    const w = mount(Label, {
      props: { label: "Suscripción" },
      slots: { default: Switch },
      attachTo: document.body,
    });
    await w.find(".cu-label").trigger("click");
    const input = w.findComponent(Switch).find('input[type="checkbox"]');
    expect(document.activeElement).toBe(input.element);
    w.unmount();
  });

  it("el click en el label enfoca pero NO activa el control", async () => {
    const w = mount(Label, {
      props: { label: "Acepto los términos" },
      slots: { default: Checkbox },
      attachTo: document.body,
    });
    const input = w.find('input[type="checkbox"]').element as HTMLInputElement;

    await w.find(".cu-label-text").trigger("click");

    expect(document.activeElement).toBe(input);
    expect(input.checked).toBe(false);
    w.unmount();
  });

  it("el click en el control sí lo activa", async () => {
    const w = mount(Label, {
      props: { label: "Acepto los términos" },
      slots: { default: Checkbox },
      attachTo: document.body,
    });
    const input = w.find('input[type="checkbox"]');

    await input.trigger("click");

    expect((input.element as HTMLInputElement).checked).toBe(true);
    w.unmount();
  });
});
