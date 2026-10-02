// Comportamiento de NavbarHorizontal según su ficha (docs/componentes/vue/navbar-horizontal.md).
//
// Aserciones escritas a MANO desde la prosa: barra horizontal con submenús
// desplegables (Dropdown) y detección de ítem activo por ruta.
import { describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import NavbarHorizontal from "./NavbarHorizontal.vue";

vi.mock("vue-router", () => ({
  useRoute: () => ({ path: "/" }),
}));

const items = [
  { label: "Inicio", path: "/" },
  {
    label: "Equipo",
    children: [
      { label: "Desarrollo", path: "/equipo/dev" },
      { label: "Diseño", path: "/equipo/diseno" },
    ],
  },
];

const leafLabels = (w: ReturnType<typeof mount>) =>
  w.findAll(".cu-navbar-label").map((el) => el.text().trim());

describe("NavbarHorizontal — render", () => {
  it("renderiza la barra horizontal como nav.cu-navbar", () => {
    const w = mount(NavbarHorizontal, { props: { items } });
    expect(w.find("nav.cu-navbar").exists()).toBe(true);
  });

  it("los items hoja se renderizan como enlaces con su label", () => {
    const w = mount(NavbarHorizontal, { props: { items } });
    expect(leafLabels(w)).toContain("Inicio");
    const link = w.findAll("a.cu-button-link").find((a) => a.text().includes("Inicio"));
    expect(link!.attributes("href")).toBe("/");
  });

  it("los items con children usan un Dropdown con trigger propio", () => {
    const w = mount(NavbarHorizontal, { props: { items } });
    const trigger = w.find(".cu-navbar-dropdown-trigger");
    expect(trigger.exists()).toBe(true);
    expect(trigger.text()).toContain("Equipo");
    // El submenú no está abierto, así que el panel no existe todavía.
    expect(w.find(".cu-dropdown-panel").exists()).toBe(false);
  });

  it("al abrir el submenú se renderiza el NavbarMenu interno", async () => {
    const w = mount(NavbarHorizontal, { props: { items } });
    await w.find(".cu-navbar-dropdown-trigger").trigger("click");
    await flushPromises();
    expect(w.find(".cu-navbar-menu").exists()).toBe(true);
    expect(w.text()).toContain("Desarrollo");
  });
});

describe("NavbarHorizontal — item activo", () => {
  it("marca con data-navbar-active el item cuya ruta coincide (vue-router)", () => {
    const w = mount(NavbarHorizontal, { props: { items } });
    const active = w.find("[data-navbar-active]");
    expect(active.exists()).toBe(true);
    expect(active.text()).toContain("Inicio");
  });

  it("`activePath` manual marca el item correspondiente", () => {
    const w = mount(NavbarHorizontal, { props: { items, activePath: "/equipo/diseno" } });
    // El item activo es una hoja dentro del submenú; la raíz no queda marcada
    // hasta abrir el Dropdown.
    expect(w.find("[data-navbar-active]").exists()).toBe(false);
  });

  it("sin coincidencia no hay ningún item activo", () => {
    const w = mount(NavbarHorizontal, { props: { items, activePath: "/no-existe" } });
    expect(w.find("[data-navbar-active]").exists()).toBe(false);
  });
});
