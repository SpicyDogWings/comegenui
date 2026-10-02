// Comportamiento de Card según su ficha (docs/componentes/vue/card.md).
//
// La ficha describe una tarjeta de presentación (media, header, contenido y
// footer) que no emite eventos ni expone métodos. Las aserciones se escriben a
// mano desde esa prosa, no se derivan del código.
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Card from "./Card.vue";

const root = (w: ReturnType<typeof mount>) => w.find(".cu-card");

describe("Card — variantes y color", () => {
  it("default es variant=ghost y layout=vertical", () => {
    const w = mount(Card);
    expect(root(w).classes()).toContain("cu-card--ghost");
    expect(root(w).classes()).toContain("cu-card--vertical");
  });

  it("aplica la clase de variante elegida", () => {
    const w = mount(Card, { props: { variant: "outlined" } });
    expect(root(w).classes()).toContain("cu-card--outlined");
  });

  it("expone el color semántico en las CSS custom properties", () => {
    const w = mount(Card, { props: { color: "success" } });
    const style = root(w).attributes("style") ?? "";
    expect(style).toContain("--card-bg: var(--cu-color-success)");
  });
});

describe("Card — header, contenido y media", () => {
  it("renderiza title y subtitle en el header", () => {
    const w = mount(Card, { props: { title: "Resumen", subtitle: "Último corte" } });
    expect(w.find(".cu-card-title").text()).toBe("Resumen");
    expect(w.find(".cu-card-subtitle").text()).toBe("Último corte");
  });

  it("sin title/subtitle ni header no renderiza el header", () => {
    const w = mount(Card);
    expect(w.find(".cu-card-header").exists()).toBe(false);
  });

  it("la prop image arma la media con un <img>", () => {
    const w = mount(Card, { props: { image: "https://example.com/cover.jpg" } });
    const img = w.find(".cu-card-image");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("https://example.com/cover.jpg");
  });

  it("sin image ni slot media no renderiza el contenedor de media", () => {
    const w = mount(Card);
    expect(w.find(".cu-card-media").exists()).toBe(false);
  });

  it("renderiza el slot default como contenido", () => {
    const w = mount(Card, { slots: { default: "Contenido principal" } });
    expect(w.find(".cu-card-content").text()).toContain("Contenido principal");
  });
});

describe("Card — footer y layout", () => {
  it("renderiza el slot footer", () => {
    const w = mount(Card, { slots: { footer: '<span class="mi-footer">Ver más</span>' } });
    expect(w.find(".cu-card-footer").exists()).toBe(true);
    expect(w.find(".mi-footer").text()).toBe("Ver más");
  });

  it("sin slot footer no renderiza el footer", () => {
    const w = mount(Card);
    expect(w.find(".cu-card-footer").exists()).toBe(false);
  });

  it("layout=horizontal cambia la clase del contenedor", () => {
    const w = mount(Card, { props: { layout: "horizontal" } });
    expect(root(w).classes()).toContain("cu-card--horizontal");
  });

  it("el slot media tiene prioridad sobre la prop image", () => {
    const w = mount(Card, {
      props: { image: "https://example.com/cover.jpg" },
      slots: { media: '<span class="mi-media">banner</span>' },
    });
    expect(w.find(".mi-media").exists()).toBe(true);
    expect(w.find(".cu-card-image").exists()).toBe(false);
  });
});
