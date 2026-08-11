import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Card from "./Card.vue";

describe("Card", () => {
  it("renderiza article.cu-card con clases por defecto (ghost/vertical)", () => {
    const w = mount(Card);
    const card = w.find("article.cu-card");
    expect(card.exists()).toBe(true);
    expect(card.classes()).toContain("cu-card--ghost");
    expect(card.classes()).toContain("cu-card--vertical");
  });

  it("renderiza el slot como contenido de la card", () => {
    const w = mount(Card, { slots: { default: "Contenido de la card" } });
    expect(w.find(".cu-card-content").text()).toContain("Contenido de la card");
  });

  it("title y subtitle: renderiza el encabezado", () => {
    const w = mount(Card, {
      props: { title: "Título", subtitle: "Subtítulo" },
    });
    expect(w.find("h3.cu-card-title").text()).toBe("Título");
    expect(w.find("p.cu-card-subtitle").text()).toBe("Subtítulo");
  });

  it("image: renderiza la imagen dentro de .cu-card-media", () => {
    const w = mount(Card, { props: { image: "/img.png" } });
    const img = w.find("img.cu-card-image");
    expect(img.exists()).toBe(true);
    expect(img.attributes("src")).toBe("/img.png");
    expect(w.find(".cu-card-media").exists()).toBe(true);
  });

  it("layout horizontal: aplica cu-card--horizontal", () => {
    const w = mount(Card, { props: { layout: "horizontal" } });
    expect(w.find("article.cu-card").classes()).toContain("cu-card--horizontal");
  });

  it("slots media/header/footer se renderizan cuando tienen contenido", () => {
    const w = mount(Card, {
      slots: {
        media: '<div class="media-test">IMG</div>',
        header: '<div class="header-test">HEAD</div>',
        footer: '<div class="footer-test">FOOT</div>',
        default: "Body",
      },
    });
    expect(w.find(".cu-card-media .media-test").exists()).toBe(true);
    expect(w.find(".cu-card-header .header-test").exists()).toBe(true);
    expect(w.find(".cu-card-footer .footer-test").exists()).toBe(true);
  });

  it("color: aplica las custom properties en el style", () => {
    const w = mount(Card, { props: { color: "primary" } });
    const style = w.find("article.cu-card").attributes("style") ?? "";
    expect(style).toContain("var(--cu-color-primary)");
  });
});
