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

describe("Avatar — imagen que no carga", () => {
  it("vuelve a las iniciales si la imagen falla", async () => {
    const w = mount(Avatar, {
      props: { initials: "JP", src: "https://example.com/rota.jpg" },
    });
    expect(w.find(".cu-avatar-initials").exists()).toBe(false);

    await w.find(".cu-avatar-img").trigger("error");

    expect(w.find(".cu-avatar-img").exists()).toBe(false);
    expect(w.find(".cu-avatar-initials").text()).toBe("JP");
  });

  it("sin iniciales, al fallar la imagen muestra el contenido del slot", async () => {
    const w = mount(Avatar, {
      props: { src: "https://example.com/rota.jpg" },
      slots: { default: '<svg data-test="icon"></svg>' },
    });

    await w.find(".cu-avatar-img").trigger("error");

    expect(w.find(".cu-avatar-img").exists()).toBe(false);
    expect(w.find('[data-test="icon"]').exists()).toBe(true);
  });

  it("un src nuevo vuelve a intentar la imagen", async () => {
    const w = mount(Avatar, {
      props: { initials: "JP", src: "https://example.com/rota.jpg" },
    });
    await w.find(".cu-avatar-img").trigger("error");
    expect(w.find(".cu-avatar-img").exists()).toBe(false);

    await w.setProps({ src: "https://example.com/otra.jpg" });

    expect(w.find(".cu-avatar-img").attributes("src")).toBe("https://example.com/otra.jpg");
    expect(w.find(".cu-avatar-initials").exists()).toBe(false);
  });
});

describe("Avatar — un solo contenido", () => {
  it("con iniciales el slot no se renderiza (no se superponen)", () => {
    const w = mount(Avatar, {
      props: { initials: "JP" },
      slots: { default: '<svg data-test="icon"></svg>' },
    });
    expect(w.find(".cu-avatar-initials").text()).toBe("JP");
    expect(w.find('[data-test="icon"]').exists()).toBe(false);
  });

  it("con src el slot no se renderiza", () => {
    const w = mount(Avatar, {
      props: { src: "https://example.com/a.jpg", initials: "JP" },
      slots: { default: "AB" },
    });
    expect(w.find(".cu-avatar-img").exists()).toBe(true);
    expect(root(w).text()).toBe("");
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

  it("el fondo sale del token `-solid` y el texto de `-solid-text`", () => {
    const w = mount(Avatar, { props: { initials: "JP", color: "success" } });
    const style = root(w).attributes("style") ?? "";

    // El par fondo/texto lo resuelve el tema activo, no un blanco fijo.
    expect(style).toContain("--avatar-bg: var(--cu-color-success-solid");
    expect(style).toContain("--avatar-fg: var(--cu-color-success-solid-text");
  });

  it("un color fuera del set cae al color por hash (con token), no a un valor crudo", () => {
    const w = mount(Avatar, { props: { initials: "JP", color: "chartreuse" as never } });
    const style = root(w).attributes("style") ?? "";

    expect(style).not.toContain("chartreuse");
    expect(style).toMatch(/--avatar-bg: var\(--cu-color-(primary|secondary|success|neutral)-solid/);
  });
});
