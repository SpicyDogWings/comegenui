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
  it("un item con children es una fila `menuitem` que anuncia su submenú", () => {
    const w = mount(NavbarMenu, { props: { items } });
    const trigger = w.find(".cu-navbar-menu-item--submenu");
    expect(trigger.exists()).toBe(true);
    expect(trigger.text()).toContain("Más");
    expect(trigger.attributes("role")).toBe("menuitem");
    expect(trigger.attributes("aria-haspopup")).toBe("menu");
    expect(trigger.attributes("aria-expanded")).toBe("false");
    // Cerrado no hay panel: `aria-controls` no puede apuntar a un id inexistente.
    expect(trigger.attributes("aria-controls")).toBeUndefined();
  });

  it("no renderiza el panel anidado hasta abrir el Dropdown", () => {
    const w = mount(NavbarMenu, { props: { items } });
    expect(w.find(".cu-navbar-menu .cu-navbar-menu").exists()).toBe(false);
  });

  it("al abrir el Dropdown se renderiza el NavbarMenu anidado (recursión)", async () => {
    const w = mount(NavbarMenu, { props: { items } });
    await w.find(".cu-navbar-menu-item--submenu").trigger("click");
    await flushPromises();

    const nested = w.findAll(".cu-navbar-menu");
    expect(nested.length).toBe(2);
    expect(w.text()).toContain("Anidado");
    const link = w.findAll("a.cu-navbar-menu-item").find((a) => a.text().includes("Anidado"));
    expect(link!.attributes("href")).toBe("/anidado");

    // Abierto: el trigger referencia el panel que existe y las filas son menuitem.
    const trigger = w.find(".cu-navbar-menu-item--submenu");
    expect(trigger.attributes("aria-expanded")).toBe("true");
    const panel = w.find(`#${trigger.attributes("aria-controls")}`);
    expect(panel.exists()).toBe(true);
    expect(panel.attributes("role")).toBe("menu");
    expect(panel.find(`a[href="/anidado"]`).attributes("role")).toBe("menuitem");
  });
});

describe("NavbarMenu — patrón menu button", () => {
  const mountMenu = () => mount(NavbarMenu, { props: { items }, attachTo: document.body });
  const rowEls = (w: ReturnType<typeof mount>) => w.findAll("[data-navbar-row]");
  const focusedLabel = () => document.activeElement?.textContent?.trim();

  it("es una sola parada de tabulación: sólo la fila activa tiene tabindex=0", () => {
    const w = mountMenu();
    const tabbables = rowEls(w).filter((row) => row.attributes("tabindex") === "0");
    expect(tabbables).toHaveLength(1);
    expect(tabbables[0]!.text()).toContain("Desarrollo");
    // La fila sin `path` está deshabilitada y queda fuera del recorrido de tabulación.
    const disabled = w.findAll(".cu-navbar-menu-item--disabled")[0]!;
    expect(disabled.text()).toContain("Solo texto");
    expect(disabled.attributes("role")).toBe("menuitem");
    expect(disabled.attributes("aria-disabled")).toBe("true");
    expect(disabled.attributes("data-navbar-row")).toBeUndefined();
  });

  it("ArrowDown/ArrowUp recorren las filas y Home/End van a los bordes", async () => {
    const w = mountMenu();
    const rows = () => rowEls(w);
    ;(rows()[0]!.element as HTMLElement).focus();
    await rows()[0]!.trigger("keydown", { key: "ArrowDown" });
    expect(focusedLabel()).toContain("Diseño");
    await rows()[1]!.trigger("keydown", { key: "End" });
    expect(focusedLabel()).toContain("Más");
    await rows()[2]!.trigger("keydown", { key: "ArrowDown" });
    expect(focusedLabel()).toContain("Desarrollo");
    await rows()[0]!.trigger("keydown", { key: "ArrowUp" });
    expect(focusedLabel()).toContain("Más");
    await rows()[2]!.trigger("keydown", { key: "Home" });
    expect(focusedLabel()).toContain("Desarrollo");
    w.unmount();
  });

  it("las letras buscan por label (typeahead)", async () => {
    const w = mountMenu();
    ;(rowEls(w)[0]!.element as HTMLElement).focus();
    await rowEls(w)[0]!.trigger("keydown", { key: "m" });
    expect(focusedLabel()).toContain("Más");
    w.unmount();
  });

  it("ArrowRight en una fila de submenú lo abre y enfoca su primera fila", async () => {
    const w = mountMenu();
    const submenu = w.find(".cu-navbar-menu-item--submenu");
    ;(submenu.element as HTMLElement).focus();
    await submenu.trigger("keydown", { key: "ArrowRight" });
    await flushPromises();
    await flushPromises();
    expect(w.find(".cu-navbar-menu-item--submenu").attributes("aria-expanded")).toBe("true");
    expect(focusedLabel()).toContain("Anidado");
    w.unmount();
  });
});

describe("NavbarMenu — path seguro", () => {
  it("un path con esquema ejecutable no se renderiza como enlace", () => {
    const w = mount(NavbarMenu, {
      props: {
        items: [
          { label: "JS", path: "javascript:window.__pwned=1" },
          { label: "JS mayúsculas", path: " JavaScript:window.__pwned=1" },
          { label: "Tab", path: "java\tscript:window.__pwned=1" },
          { label: "VBS", path: "vbscript:msgbox(1)" },
          { label: "Data", path: "data:text/html,<script>alert(1)</script>" },
        ],
      },
    });
    expect(w.findAll("a.cu-navbar-menu-item")).toHaveLength(0);
    expect(w.findAll("span.cu-navbar-menu-item--disabled")).toHaveLength(5);
    expect(w.html()).not.toContain("javascript:");
  });

  it("un path normal (relativo, absoluto o hash) sigue siendo un enlace", () => {
    const w = mount(NavbarMenu, {
      props: {
        items: [
          { label: "Rel", path: "/rel" },
          { label: "Abs", path: "https://example.com/x" },
          { label: "Hash", path: "#ancla" },
        ],
      },
    });
    const hrefs = w.findAll("a.cu-navbar-menu-item").map((a) => a.attributes("href"));
    expect(hrefs).toEqual(["/rel", "https://example.com/x", "#ancla"]);
  });
});

describe("NavbarMenu — ícono saneado", () => {
  const EVIL = '<img src=x onerror="window.__xss=1"><script>window.__xss=2</script>';

  it("conserva un SVG válido y elimina handlers del icono", () => {
    type XssWindow = Window & { __xss?: number };
    const probe = window as XssWindow;
    delete probe.__xss;

    const w = mount(NavbarMenu, {
      props: {
        items: [
          { label: "Bueno", path: "/b", icon: '<svg class="mi-icon"></svg>' },
          { label: "Malo", path: "/m", icon: EVIL },
        ],
      },
    });
    expect(w.find(".cu-navbar-menu-icon svg.mi-icon").exists()).toBe(true);
    expect(w.html()).not.toContain("onerror");
    expect(w.html()).not.toContain("<script");
    expect(probe.__xss).toBeUndefined();
  });
});
