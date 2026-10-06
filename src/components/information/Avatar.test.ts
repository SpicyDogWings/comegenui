// Comportamiento de Avatar según su ficha (docs/componentes/vue/avatar.md).
//
// Avatar circular (imagen o iniciales) con color semántico y tres tamaños.
// Si no se pasa color, elige un color determinístico a partir de las iniciales.
// Aserciones escritas a mano desde la prosa de la ficha.
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Avatar from "./Avatar.vue";

const root = (w: ReturnType<typeof mount>) => w.find(".cu-avatar");

describe("Avatar — tamaños", () => {
  it("default es size=md", () => {
    const w = mount(Avatar);
    expect(root(w).classes()).toContain("cu-avatar--md");
  });

  it("aplica la clase del tamaño sm/lg", () => {
    expect(root(mount(Avatar, { props: { size: "sm" } })).classes()).toContain("cu-avatar--sm");
    expect(root(mount(Avatar, { props: { size: "lg" } })).classes()).toContain("cu-avatar--lg");
  });
});

describe("Avatar — iniciales, imagen y slot", () => {
  it("muestra las iniciales", () => {
    const w = mount(Avatar, { props: { initials: "JP" } });
    expect(w.find(".cu-avatar-initials").text()).toBe("JP");
  });

  it("con src muestra la imagen y no las iniciales", () => {
    const w = mount(Avatar, { props: { initials: "JP", src: "https://example.com/a.jpg" } });
    expect(w.find(".cu-avatar-img").attributes("src")).toBe("https://example.com/a.jpg");
    expect(w.find(".cu-avatar-initials").exists()).toBe(false);
  });

  it("sin initials ni src, el slot default es el contenido", () => {
    const w = mount(Avatar, { slots: { default: "AB" } });
    expect(root(w).text()).toContain("AB");
  });
});

describe("Avatar — color", () => {
  it("usa el color explícito en el estilo del fondo", () => {
    const w = mount(Avatar, { props: { initials: "JP", color: "success" } });
    expect(root(w).attributes("style") ?? "").toContain("--cu-color-success");
  });

  it("sin color elige un color determinístico (mismo resultado para las mismas iniciales)", () => {
    const a = mount(Avatar, { props: { initials: "CD" } });
    const b = mount(Avatar, { props: { initials: "CD" } });
    expect(root(a).attributes("style")).toBe(root(b).attributes("style"));
  });
});
