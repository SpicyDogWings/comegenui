// Comportamiento de Blockquote según su ficha (docs/componentes/vue/blockquote.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Blockquote from "./Blockquote.vue";

describe("Blockquote — contenido", () => {
  it("renderiza el slot cuando no hay `html`", () => {
    const w = mount(Blockquote, { slots: { default: "Cita por slot" } });
    expect(w.text()).toContain("Cita por slot");
    expect(w.find(".cu-blockquote-content").exists()).toBe(false);
  });

  it("renderiza el HTML de la prop cuando se especifica", () => {
    const w = mount(Blockquote, { props: { html: "<p>Cita <strong>rica</strong></p>" } });
    const content = w.find(".cu-blockquote-content");
    expect(content.exists()).toBe(true);
    expect(content.text()).toContain("Cita rica");
    expect(content.html()).toContain("<strong>");
  });

  it("el `html` tiene prioridad sobre el slot", () => {
    const w = mount(Blockquote, {
      props: { html: "<p>De la prop</p>" },
      slots: { default: "Del slot" },
    });
    expect(w.find(".cu-blockquote-content").text()).toContain("De la prop");
    expect(w.text()).not.toContain("Del slot");
  });
});

describe("Blockquote — color", () => {
  it("usa `primary` por defecto", () => {
    const w = mount(Blockquote);
    expect(w.find(".cu-blockquote").classes()).toContain("cu-blockquote--primary");
  });

  it("aplica la clase del color semántico pedido", () => {
    const w = mount(Blockquote, { props: { color: "success" } });
    expect(w.find(".cu-blockquote").classes()).toContain("cu-blockquote--success");
  });
});
