// Comportamiento de AuthorCard según su ficha (docs/componentes/vue/author-card.md).
//
// Tarjeta de autor con avatar (imagen o iniciales generadas del nombre), nombre
// y rol. No emite eventos ni expone métodos. Aserciones escritas a mano desde
// la prosa de la ficha.
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import AuthorCard from "./AuthorCard.vue";

const avatar = (w: ReturnType<typeof mount>) => w.find(".cu-avatar");

describe("AuthorCard — nombre y rol", () => {
  it("muestra el name", () => {
    const w = mount(AuthorCard, { props: { name: "Ana Pérez" } });
    expect(w.find(".cu-author-name").text()).toBe("Ana Pérez");
  });

  it("muestra el role cuando se define", () => {
    const w = mount(AuthorCard, { props: { name: "Ana Pérez", role: "Desarrolladora" } });
    expect(w.find(".cu-author-role").text()).toBe("Desarrolladora");
  });

  it("sin role no renderiza el rol", () => {
    const w = mount(AuthorCard, { props: { name: "Ana Pérez" } });
    expect(w.find(".cu-author-role").exists()).toBe(false);
  });
});

describe("AuthorCard — iniciales generadas", () => {
  it("genera iniciales de nombre y apellido (primera y última palabra)", () => {
    const w = mount(AuthorCard, { props: { name: "Ana María Pérez" } });
    expect(avatar(w).find(".cu-avatar-initials").text()).toBe("AP");
  });

  it("con una sola palabra usa las dos primeras letras", () => {
    const w = mount(AuthorCard, { props: { name: "Marcos" } });
    expect(avatar(w).find(".cu-avatar-initials").text()).toBe("MA");
  });
});

describe("AuthorCard — imagen y tamaño", () => {
  it("con src muestra la imagen en vez de las iniciales", () => {
    const w = mount(AuthorCard, { props: { name: "Laura Gómez", src: "https://example.com/a.jpg" } });
    expect(avatar(w).find(".cu-avatar-img").attributes("src")).toBe("https://example.com/a.jpg");
    expect(avatar(w).find(".cu-avatar-initials").exists()).toBe(false);
  });

  it("propaga size al Avatar", () => {
    const w = mount(AuthorCard, { props: { name: "Marcos Ruiz", size: "lg" } });
    expect(avatar(w).classes()).toContain("cu-avatar--lg");
  });

  it("usa size=md por default", () => {
    const w = mount(AuthorCard, { props: { name: "Marcos Ruiz" } });
    expect(avatar(w).classes()).toContain("cu-avatar--md");
  });
});
