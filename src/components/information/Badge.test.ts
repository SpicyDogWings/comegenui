// Comportamiento de Badge según su ficha (docs/componentes/vue/badge.md).
//
// Etiqueta/badge de presentación pura: no emite eventos ni expone métodos.
// Aserciones escritas a mano desde la prosa y los ejemplos de la ficha.
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Badge from "./Badge.vue";

const root = (w: ReturnType<typeof mount>) => w.find(".cu-badge");

describe("Badge — variantes y color", () => {
  it("default es variant=soft", () => {
    const w = mount(Badge);
    expect(root(w).classes()).toContain("cu-badge--soft");
  });

  it("aplica la clase de cada variante visual", () => {
    for (const variant of ["solid", "outlined", "soft", "ghost", "subtle"] as const) {
      const w = mount(Badge, { props: { variant } });
      expect(root(w).classes()).toContain(`cu-badge--${variant}`);
    }
  });

  it("traduce el color semántico a las CSS custom properties", () => {
    const w = mount(Badge, { props: { color: "danger", variant: "subtle" } });
    const style = root(w).attributes("style") ?? "";
    expect(style).toContain("--badge-bg: var(--cu-color-danger)");
    expect(style).toContain("--badge-subtle: var(--cu-color-danger-subtle)");
    expect(style).toContain("--badge-subtle-border: var(--cu-color-danger-subtle-border)");
  });

  it("default color es neutral", () => {
    const w = mount(Badge);
    expect(root(w).attributes("style") ?? "").toContain("var(--cu-color-neutral)");
  });
});

describe("Badge — contenido", () => {
  it("renderiza el slot default", () => {
    const w = mount(Badge, { slots: { default: "Nuevo" } });
    expect(root(w).text()).toContain("Nuevo");
  });

  it("renderiza contenido con ícono SVG y texto", () => {
    const w = mount(Badge, {
      slots: { default: '<svg class="mi-icono"></svg> Verificado' },
    });
    expect(w.find(".mi-icono").exists()).toBe(true);
    expect(root(w).text()).toContain("Verificado");
  });
});
