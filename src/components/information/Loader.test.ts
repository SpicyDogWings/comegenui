// Comportamiento de Loader según su ficha (docs/componentes/vue/loader.md).
//
// Barra de carga: no emite eventos ni expone métodos. `color` pinta la barra,
// `animation` elige loading (barrido infinito) o cooldown (se consume en delay ms).
// Aserciones escritas a mano desde la prosa de la ficha.
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Loader from "./Loader.vue";

const bar = (w: ReturnType<typeof mount>) => w.find(".cu-loader-bar");

describe("Loader — estructura", () => {
  it("renderiza el contenedor y la barra", () => {
    const w = mount(Loader);
    expect(w.find(".cu-loader").exists()).toBe(true);
    expect(bar(w).exists()).toBe(true);
  });
});

describe("Loader — color", () => {
  it("default color es primary", () => {
    const w = mount(Loader);
    expect(bar(w).attributes("style") ?? "").toContain("--cu-loader-color: var(--cu-color-primary)");
  });

  it("aplica el color semántico elegido", () => {
    const w = mount(Loader, { props: { color: "danger" } });
    expect(bar(w).attributes("style") ?? "").toContain("var(--cu-color-danger)");
  });
});

describe("Loader — animación y delay", () => {
  it("default es animation=loading", () => {
    const w = mount(Loader);
    expect(bar(w).classes()).toContain("cu-loader-bar--loading");
  });

  it("animation=cooldown cambia la clase de la barra", () => {
    const w = mount(Loader, { props: { animation: "cooldown" } });
    expect(bar(w).classes()).toContain("cu-loader-bar--cooldown");
    expect(bar(w).classes()).not.toContain("cu-loader-bar--loading");
  });

  it("default delay es 2000ms", () => {
    const w = mount(Loader);
    expect(bar(w).attributes("style") ?? "").toContain("--cu-loader-delay: 2000ms");
  });

  it("propaga delay en ms a la CSS var", () => {
    const w = mount(Loader, { props: { delay: 500 } });
    expect(bar(w).attributes("style") ?? "").toContain("--cu-loader-delay: 500ms");
  });
});
