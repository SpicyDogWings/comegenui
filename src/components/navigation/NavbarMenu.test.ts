// Comportamiento de NavbarMenu según su ficha (docs/componentes/vue/navbar-menu.md).
//
// Aserciones escritas a MANO desde la prosa: menú recursivo interno que
// renderiza un nivel del árbol de navegación como columna de items.
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import NavbarMenu from "./NavbarMenu.vue";

const items = [
  { label: "Desarrollo", path: "/equipo/dev" },
  { label: "Diseño", path: "/equipo/diseno", icon: '<svg class="mi-icon"></svg>' },
  { label: "Solo texto" },
  {
    label: "Más",
    children: [{ label: "Anidado", path: "/anidado" }],
  },
];

describe("NavbarMenu — items hoja", () => {
  it("un item con `path` se renderiza como enlace con su href y label", () => {
    const w = mount(NavbarMenu, { props: { items } });
    const link = w.findAll("a.cu-navbar-menu-item").find((a) => a.text().includes("Desarrollo"));
    expect(link!.attributes("href")).toBe("/equipo/dev");
  });

  it("un item sin `path` se renderiza como texto deshabilitado", () => {
    const w = mount(NavbarMenu, { props: { items } });
    const span = w.findAll("span.cu-navbar-menu-item").find((s) => s.text().includes("Solo texto"));
    expect(span!.classes()).toContain("cu-navbar-menu-item--disabled");
  });

  it("renderiza el icono del item como HTML", () => {
    const w = mount(NavbarMenu, { props: { items } });
    expect(w.find(".cu-navbar-menu-icon svg.mi-icon").exists()).toBe(true);
  });
});

describe("NavbarMenu — submenús anidados", () => {
  it("un item con children usa un Dropdown con su label", () => {
    const w = mount(NavbarMenu, { props: { items } });
    const trigger = w.find(".cu-dropdown .cu-button");
    expect(trigger.exists()).toBe(true);
    expect(trigger.text()).toContain("Más");
  });

  it("no renderiza el panel anidado hasta abrir el Dropdown", () => {
    const w = mount(NavbarMenu, { props: { items } });
    expect(w.find(".cu-navbar-menu .cu-navbar-menu").exists()).toBe(false);
  });

  it("al abrir el Dropdown se renderiza el NavbarMenu anidado (recursión)", async () => {
    const w = mount(NavbarMenu, { props: { items } });
    await w.find(".cu-dropdown .cu-button").trigger("click");
    await flushPromises();

    const nested = w.findAll(".cu-navbar-menu");
    expect(nested.length).toBe(2);
    expect(w.text()).toContain("Anidado");
    const link = w.findAll("a.cu-navbar-menu-item").find((a) => a.text().includes("Anidado"));
    expect(link!.attributes("href")).toBe("/anidado");
  });
});
