import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import Navbar from "./Navbar.vue";

vi.mock("vue-router", () => ({
  useRoute: () => ({ path: "/inicio" }),
}));

const tree = [
  { label: "Inicio", path: "/inicio" },
  {
    label: "Componentes",
    children: [
      {
        label: "Buttons",
        children: [
          { label: "Button", path: "/components/button" },
          { label: "CopyButton", path: "/components/copy-button" },
        ],
      },
      {
        label: "Form",
        children: [
          { label: "Input", path: "/components/input" },
          { label: "Select", path: "/components/select" },
        ],
      },
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

const labels = (w: ReturnType<typeof mount>) =>
  w.findAll("button.cu-button, a.cu-button").map((b) => b.text().trim()).filter(Boolean);

describe("Navbar", () => {
  it("sin search no renderiza el input", () => {
    const w = mount(Navbar, { props: { items: tree } });
    expect(w.find("input").exists()).toBe(false);
    expect(w.text()).toContain("Button");
  });

  it("filter: un subitem matcheado muestra su árbol entero y oculta ramas ajenas", async () => {
    const w = mount(Navbar, { props: { items: tree, search: true } });
    await w.find("input").setValue("copybutton");
    const text = w.text();
    // ancestros + el match
    expect(text).toContain("Componentes");
    expect(text).toContain("Buttons");
    expect(text).toContain("CopyButton");
    // ramas sin match, fuera
    expect(text).not.toContain("Input");
    expect(text).not.toContain("Configuración");
    expect(text).not.toContain("Inicio");
  });

  it("filter: item raíz matcheado conserva todo su subárbol", async () => {
    const w = mount(Navbar, { props: { items: tree, search: true } });
    await w.find("input").setValue("form");
    const text = w.text();
    expect(text).toContain("Componentes");
    expect(text).toContain("Form");
    expect(text).toContain("Input");
    expect(text).toContain("Select");
    expect(text).not.toContain("Buttons");
  });

  it("por defecto busca en toda la interfaz (no solo el label): matchea por path", async () => {
    const w = mount(Navbar, { props: { items: tree, search: true } });
    await w.find("input").setValue("/seguridad");
    const text = w.text();
    expect(text).toContain("Seguridad");
    expect(text).toContain("Configuración");
    expect(text).not.toContain("Button");
  });

  it("searchFields limita los campos buscados", async () => {
    const w = mount(Navbar, {
      props: { items: tree, search: true, searchFields: ["label"] },
    });
    await w.find("input").setValue("/seguridad");
    expect(w.text()).toContain("Sin resultados");
  });

  it("ignora acentos y mayúsculas", async () => {
    const w = mount(Navbar, { props: { items: tree, search: true } });
    await w.find("input").setValue("configuracion");
    expect(w.text()).toContain("Perfil");
  });

  it("sin resultados muestra el estado vacío", async () => {
    const w = mount(Navbar, { props: { items: tree, search: true } });
    await w.find("input").setValue("zzz");
    expect(w.text()).toContain("Sin resultados");
  });

  it("scroll: muestra todo el árbol y resalta solo el primer match", async () => {
    Element.prototype.scrollIntoView = vi.fn();
    const w = mount(Navbar, {
      props: { items: tree, search: true, searchMode: "scroll" },
    });
    await w.find("input").setValue("copy");
    const text = w.text();
    // nada se filtra
    expect(text).toContain("Inicio");
    expect(text).toContain("Input");
    expect(text).toContain("Seguridad");
    // un solo resaltado: el primer match en DFS
    const matches = w.findAll("[data-navbar-match]");
    expect(matches).toHaveLength(1);
    expect(matches[0].text()).toContain("CopyButton");
  });

  it("emite search con el query actual", async () => {
    const w = mount(Navbar, { props: { items: tree, search: true } });
    await w.find("input").setValue("per");
    expect(w.emitted("search")).toEqual([["per"]]);
  });
});
