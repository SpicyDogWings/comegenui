// Comportamiento de Navbar según su ficha (docs/componentes/vue/navbar.md).
//
// Aserciones escritas a MANO desde la prosa de la ficha: barra vertical con
// submenús, búsqueda (filter/scroll), modo compacto y responsive.
import { describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Navbar from "./Navbar.vue";

vi.mock("vue-router", () => ({
  useRoute: () => ({ path: "/inicio" }),
}));

// jsdom no implementa matchMedia (lo usa Navbar en modo responsive).
if (!window.matchMedia) {
  // @ts-expect-error stub de test
  window.matchMedia = () => ({
    matches: false,
    addEventListener: () => {},
    removeEventListener: () => {},
  });
}

const tree = [
  { label: "Inicio", path: "/inicio" },
  {
    label: "Componentes",
    children: [
      { label: "Button", path: "/components/button" },
      { label: "Input", path: "/components/input" },
    ],
  },
  {
    label: "Configuración",
    children: [
      { label: "Perfil", path: "/perfil" },
      { label: "Seguridad", path: "/seguridad" },
    ],
  },
];

const leafLabels = (w: ReturnType<typeof mount>) =>
  w.findAll(".cu-navbar-label").map((el) => el.text().trim());

describe("Navbar — render de items", () => {
  it("renderiza los items hoja como enlaces y los padres como Collapse", () => {
    const w = mount(Navbar, { props: { items: tree } });
    // Hojas visibles (los submenús arrancan expandidos).
    expect(leafLabels(w)).toContain("Inicio");
    expect(leafLabels(w)).toContain("Button");
    // Padres como triggers de Collapse.
    const collapseLabels = w.findAll(".cu-collapse-label").map((el) => el.text().trim());
    expect(collapseLabels).toContain("Componentes");
    expect(collapseLabels).toContain("Configuración");
  });

  it("los items hoja usan `path` como href", () => {
    const w = mount(Navbar, { props: { items: tree } });
    const links = w.findAll("a.cu-button-link").map((a) => a.attributes("href"));
    expect(links).toContain("/inicio");
    expect(links).toContain("/components/button");
  });

  it("`collapsed` inicia los submenús colapsados", () => {
    const expanded = mount(Navbar, { props: { items: tree } });
    // Con submenús expandidos, las hojas del submenú están montadas.
    expect(expanded.find(".cu-collapse-content .cu-navbar").exists()).toBe(true);

    const collapsed = mount(Navbar, { props: { items: tree, collapsed: true } });
    // El contenido colapsado se oculta con v-show.
    const content = collapsed.find(".cu-collapse-content");
    expect(content.attributes("style")).toContain("display: none");
  });
});

describe("Navbar — búsqueda", () => {
  it("el buscador solo aparece con `search`", () => {
    expect(mount(Navbar, { props: { items: tree } }).find("input").exists()).toBe(false);
    expect(mount(Navbar, { props: { items: tree, search: true } }).find("input").exists()).toBe(true);
  });

  it("usa `searchPlaceholder` en el input", () => {
    const w = mount(Navbar, { props: { items: tree, search: true, searchPlaceholder: "Filtrar" } });
    expect(w.find("input").attributes("placeholder")).toBe("Filtrar");
  });

  it("filtra por label, conservando las ramas con match y descartando las ajenas", async () => {
    const w = mount(Navbar, { props: { items: tree, search: true } });
    await w.find("input").setValue("button");
    const text = w.text();
    expect(text).toContain("Button");
    expect(text).toContain("Componentes"); // ancestro conservado
    expect(text).not.toContain("Inicio");
    expect(text).not.toContain("Seguridad");
  });

  it("ignora acentos y mayúsculas", async () => {
    const w = mount(Navbar, { props: { items: tree, search: true } });
    await w.find("input").setValue("CONFIGURACION");
    expect(w.text()).toContain("Perfil");
  });

  it("sin resultados muestra 'Sin resultados'", async () => {
    const w = mount(Navbar, { props: { items: tree, search: true } });
    await w.find("input").setValue("zzz");
    expect(w.text()).toContain("Sin resultados");
  });

  it("emite `search` con el query actual", async () => {
    const w = mount(Navbar, { props: { items: tree, search: true } });
    await w.find("input").setValue("per");
    expect(w.emitted("search")).toEqual([["per"]]);
  });

  it("en modo `scroll` no filtra items y resalta el primer match", async () => {
    Element.prototype.scrollIntoView = vi.fn();
    const w = mount(Navbar, { props: { items: tree, search: true, searchMode: "scroll" } });
    await w.find("input").setValue("button");
    expect(w.text()).toContain("Inicio"); // no filtra
    expect(w.findAll("[data-navbar-match]")).toHaveLength(1);
  });
});

describe("Navbar — modo compacto", () => {
  it("`compact` aplica la clase del modo compacto", () => {
    const w = mount(Navbar, { props: { items: tree, compact: true } });
    expect(w.find(".cu-navbar").classes()).toContain("cu-navbar--compact");
  });

  it("`compactable` muestra el botón y al clickearlo alterna el modo compacto", async () => {
    const w = mount(Navbar, { props: { items: tree, compactable: true } });
    expect(w.find(".cu-navbar").classes()).not.toContain("cu-navbar--compact");
    expect(w.find(".cu-navbar-compact-toggle").exists()).toBe(true);

    // El toggle vive en NavbarList; la raíz lo escucha y cambia su modo efectivo.
    await w.find(".cu-navbar-compact-toggle").trigger("click");
    await flushPromises();
    expect(w.find(".cu-navbar").classes()).toContain("cu-navbar--compact");
  });

  it("en compact se usan flyouts (Dropdown) para los submenús", () => {
    const w = mount(Navbar, { props: { items: tree, compact: true } });
    expect(w.find(".cu-navbar-compact-trigger").exists()).toBe(true);
  });
});

describe("Navbar — item activo por ruta", () => {
  it("resalta el item cuyo path coincide con la ruta activa (vue-router)", () => {
    const w = mount(Navbar, { props: { items: tree } });
    // useRoute mockea /inicio → el item Inicio queda activo.
    const active = w.find("[data-navbar-active]");
    expect(active.exists()).toBe(true);
    expect(active.text()).toContain("Inicio");
  });

  it("`activePath` manual tiene prioridad y marca el item correspondiente", () => {
    const w = mount(Navbar, { props: { items: tree, activePath: "/perfil" } });
    const active = w.find("[data-navbar-active]");
    expect(active.exists()).toBe(true);
    expect(active.text()).toContain("Perfil");
  });
});

describe("Navbar — responsive", () => {
  it("con `responsive` muestra la hamburguesa y no la nav inline", () => {
    const w = mount(Navbar, { props: { items: tree, responsive: true } });
    expect(w.find(".cu-navbar-responsive-toggle").exists()).toBe(true);
    expect(w.find("nav.cu-navbar").exists()).toBe(false);
  });

  it("sin `responsive` no hay hamburguesa", () => {
    const w = mount(Navbar, { props: { items: tree } });
    expect(w.find(".cu-navbar-responsive-toggle").exists()).toBe(false);
  });

  it("click en la hamburguesa abre el SideOver (aria-expanded pasa a true)", async () => {
    const w = mount(Navbar, { props: { items: tree, responsive: true }, attachTo: document.body });
    const burger = w.find(".cu-navbar-responsive-toggle");
    expect(burger.attributes("aria-expanded")).toBe("false");

    await burger.trigger("click");
    await flushPromises();
    expect(w.find(".cu-navbar-responsive-toggle").attributes("aria-expanded")).toBe("true");
    expect(document.querySelector(".cu-sideover")).not.toBeNull();
  });
});
