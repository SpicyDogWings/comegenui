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

  it("pinta el texto con el token de texto del color (no el color base)", () => {
    // El color base queda por debajo de 4.5:1 en casi todos los temas
    // (success/warning ≈ 1.9:1 en light); el texto usa la variante `-text`.
    const w = mount(Label, { props: { label: "Nombre", color: "primary" } });
    expect(w.attributes("style") ?? "").toContain("--label-fg: var(--cu-color-primary-text)");
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

  it("el click en el label enfoca y activa el control", async () => {
    const w = mount(Label, {
      props: { label: "Acepto los términos" },
      slots: { default: Checkbox },
      attachTo: document.body,
    });
    const input = w.find('input[type="checkbox"]').element as HTMLInputElement;

    await w.find(".cu-label-text").trigger("click");

    expect(document.activeElement).toBe(input);
    expect(input.checked).toBe(true);
    w.unmount();
  });

  it("el click en el label también activa un Switch", async () => {
    const w = mount(Label, {
      props: { label: "Suscripción" },
      slots: { default: Switch },
      attachTo: document.body,
    });
    const input = w.findComponent(Switch).find('input[type="checkbox"]').element as HTMLInputElement;

    await w.find(".cu-label-text").trigger("click");

    expect(input.checked).toBe(true);
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

describe("Label — otros interactivos del slot", () => {
  // El label sólo maneja el click del PRIMER control: un link/botón/campo que
  // también viva en el slot conserva su comportamiento nativo (navegar,
  // enviar, enfocarse), sin que el label le cancele el default ni le robe foco.
  const clickCancelable = (el: Element) => {
    const ev = new MouseEvent("click", { bubbles: true, cancelable: true, composed: true });
    el.dispatchEvent(ev);
    return ev;
  };

  it("un link que no es el control conserva su default y no se lleva el foco", () => {
    const w = mount(Label, {
      props: { label: "Con link" },
      slots: { default: '<input class="primero" /><a class="link" href="#destino">ir</a>' },
      attachTo: document.body,
    });

    const ev = clickCancelable(w.find("a.link").element);

    expect(ev.defaultPrevented).toBe(false);
    expect(document.activeElement).not.toBe(w.find("input.primero").element);
    // El click sigue siendo un click dentro del label.
    expect(w.emitted("click")).toHaveLength(1);
    w.unmount();
  });

  it("un botón que no es el control conserva su default (puede enviar el form)", () => {
    const w = mount(Label, {
      props: { label: "Con botón" },
      slots: { default: '<input class="primero" /><button class="enviar" type="submit">Enviar</button>' },
      attachTo: document.body,
    });
    const boton = w.find("button.enviar").element as HTMLButtonElement;
    let clicks = 0;
    boton.addEventListener("click", () => clicks++);

    const ev = clickCancelable(boton);

    expect(ev.defaultPrevented).toBe(false);
    expect(clicks).toBe(1);
    w.unmount();
  });

  it("un segundo campo no pierde su click por el primero", () => {
    const w = mount(Label, {
      props: { label: "Dos campos" },
      slots: { default: '<input class="primero" /><input class="segundo" />' },
      attachTo: document.body,
    });

    const ev = clickCancelable(w.find("input.segundo").element);

    expect(ev.defaultPrevented).toBe(false);
    // No se fuerza el foco al primer control.
    expect(document.activeElement).not.toBe(w.find("input.primero").element);
    w.unmount();
  });
});
