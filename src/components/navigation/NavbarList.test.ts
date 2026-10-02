// Comportamiento de NavbarList según su ficha (docs/componentes/vue/navbar-list.md).
//
// Aserciones escritas a MANO desde la prosa: lista interna de la nav (header +
// items) con búsqueda, modo compacto y submenús.
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import NavbarList from "./NavbarList.vue";

const items = [
  { label: "Inicio", path: "/inicio" },
  {
    label: "Componentes",
    children: [
      { label: "Button", path: "/components/button" },
      { label: "Input", path: "/components/input" },
    ],
  },
];

const leafLabels = (w: ReturnType<typeof mount>) =>
  w.findAll(".cu-navbar-label").map((el) => el.text().trim());

describe("NavbarList — items", () => {
  it("renderiza los items hoja como enlaces y los padres como Collapse", () => {
    const w = mount(NavbarList, { props: { items } });
    expect(leafLabels(w)).toContain("Inicio");
    expect(leafLabels(w)).toContain("Button");
    expect(w.find(".cu-collapse-label").text()).toBe("Componentes");
  });

  it("los items hoja usan `path` como href", () => {
    const w = mount(NavbarList, { props: { items } });
    const links = w.findAll("a.cu-button-link").map((a) => a.attributes("href"));
    expect(links).toContain("/inicio");
    expect(links).toContain("/components/button");
  });

  it("`collapsed` inicia los Collapse cerrados", () => {
    const w = mount(NavbarList, { props: { items, collapsed: true } });
    expect(w.find(".cu-collapse-content").attributes("style")).toContain("display: none");
  });

  it("renderiza el icono del item (HTML) cuando lo define", () => {
    const w = mount(NavbarList, {
      props: { items: [{ label: "Inicio", path: "/", icon: '<svg class="mi-icon"></svg>' }] },
    });
    expect(w.find(".cu-navbar-icon svg.mi-icon").exists()).toBe(true);
  });
});

describe("NavbarList — buscador", () => {
  it("el header con input solo aparece con `search`", () => {
    expect(mount(NavbarList, { props: { items } }).find("input").exists()).toBe(false);
    expect(mount(NavbarList, { props: { items, search: true } }).find("input").exists()).toBe(true);
  });

  it("usa `searchPlaceholder`", () => {
    const w = mount(NavbarList, { props: { items, search: true, searchPlaceholder: "Filtrar" } });
    expect(w.find("input").attributes("placeholder")).toBe("Filtrar");
  });

  it("tipear emite update:query con el valor (v-model:query)", async () => {
    const w = mount(NavbarList, { props: { items, search: true } });
    await w.find("input").setValue("per");
    expect(w.emitted("update:query")).toEqual([["per"]]);
  });

  it("con query y sin items muestra 'Sin resultados' (modo filter)", () => {
    const w = mount(NavbarList, { props: { items: [], search: true, query: "zzz" } });
    expect(w.find(".cu-navbar-empty").text()).toBe("Sin resultados");
  });

  it("en modo `scroll` no muestra el estado vacío", () => {
    const w = mount(NavbarList, {
      props: { items: [], search: true, searchMode: "scroll", query: "zzz" },
    });
    expect(w.find(".cu-navbar-empty").exists()).toBe(false);
  });
});

describe("NavbarList — modo compacto y compactable", () => {
  it("`compact` aplica la clase y usa flyouts (Dropdown) para los submenús", () => {
    const w = mount(NavbarList, { props: { items, compact: true } });
    expect(w.find(".cu-navbar").classes()).toContain("cu-navbar--compact");
    expect(w.find(".cu-navbar-compact-trigger").exists()).toBe(true);
    expect(w.find(".cu-collapse").exists()).toBe(false);
  });

  it("en compact, sin icono usa la inicial del label", () => {
    const w = mount(NavbarList, { props: { items: [{ label: "Inicio", path: "/" }], compact: true } });
    expect(w.find(".cu-navbar-icon").text()).toBe("I");
  });

  it("`compactable` muestra el botón de compactar con el título correcto y emite toggle-compact", async () => {
    const w = mount(NavbarList, { props: { items, compactable: true } });
    const btn = w.find(".cu-navbar-compact-toggle");
    expect(btn.exists()).toBe(true);
    expect(btn.attributes("title")).toBe("Compactar");

    await btn.trigger("click");
    expect(w.emitted("toggle-compact")).toHaveLength(1);
  });

  it("con `compact` el botón de compactar invita a Expandir", () => {
    const w = mount(NavbarList, { props: { items, compactable: true, compact: true } });
    expect(w.find(".cu-navbar-compact-toggle").attributes("title")).toBe("Expandir");
  });
});

describe("NavbarList — item activo y resaltado", () => {
  it("marca con data-navbar-active el item equivalente a `activeItem`", () => {
    const w = mount(NavbarList, { props: { items, activeItem: items[0] } });
    const active = w.find("[data-navbar-active]");
    expect(active.exists()).toBe(true);
    expect(active.text()).toContain("Inicio");
  });

  it("marca con data-navbar-match el item equivalente a `highlightTarget`", () => {
    const w = mount(NavbarList, { props: { items, highlightTarget: items[1] } });
    const match = w.find("[data-navbar-match]");
    expect(match.exists()).toBe(true);
    expect(match.classes()).toContain("cu-navbar-item--match");
  });
});
