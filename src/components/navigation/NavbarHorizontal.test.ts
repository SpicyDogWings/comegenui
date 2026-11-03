// Comportamiento de NavbarHorizontal según su ficha (docs/componentes/vue/navbar-horizontal.md).
//
// Aserciones escritas a MANO desde la prosa: barra horizontal con submenús
// desplegables (Dropdown) y detección de ítem activo por ruta.
import { afterAll, beforeAll, describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { nextTick } from "vue";
import NavbarHorizontal from "./NavbarHorizontal.vue";
import NavbarHorizontalCe from "../customElements/navigation/NavbarHorizontal.ce.vue";
import { defineComegenElement } from "@/utils/comegen-element";

vi.mock("vue-router", () => ({
  useRoute: () => ({ path: "/" }),
}));

// jsdom no implementa `scrollIntoView` y el composable lo usa para centrar el item
// activo: sin esto cada montaje con activo deja un unhandled rejection. El spy
// global permite además afirmar sobre qué elemento se desplaza.
const scrolled: Element[] = [];
Element.prototype.scrollIntoView = function scrollIntoView(this: Element) {
  scrolled.push(this);
} as typeof Element.prototype.scrollIntoView;

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

  it("`activePath` manual marca el item de nivel raíz", () => {
    const w = mount(NavbarHorizontal, { props: { items, activePath: "/" } });
    const active = w.find("[data-navbar-active]");
    expect(active.exists()).toBe(true);
    expect(active.text()).toContain("Inicio");
  });

  it("si el activo está dentro de un submenú, resalta al padre", () => {
    const w = mount(NavbarHorizontal, { props: { items, activePath: "/equipo/diseno" } });
    const active = w.find("[data-navbar-active]");
    expect(active.exists()).toBe(true);
    expect(active.text()).toContain("Equipo");
    expect(active.classes()).toContain("cu-navbar-item--active");
  });

  it("el enlace activo expone aria-current=page", () => {
    const w = mount(NavbarHorizontal, { props: { items, activePath: "/" } });
    const link = w.find("[aria-current]");
    expect(link.attributes("aria-current")).toBe("page");
    expect(link.text()).toContain("Inicio");
    // Un item dentro de un submenú no es la página actual: no se marca como tal.
    const parent = mount(NavbarHorizontal, { props: { items, activePath: "/equipo/dev" } });
    expect(parent.find("[aria-current]").exists()).toBe(false);
  });

  it("sin coincidencia no hay ningún item activo", () => {
    const w = mount(NavbarHorizontal, { props: { items, activePath: "/no-existe" } });
    expect(w.find("[data-navbar-active]").exists()).toBe(false);
    expect(w.find("[aria-current]").exists()).toBe(false);
  });
});

describe("NavbarHorizontal — trigger del submenú", () => {
  it("es un button type=button con aria-expanded (no envía un form)", async () => {
    const w = mount(NavbarHorizontal, { props: { items } });
    const trigger = w.find(".cu-navbar-dropdown-trigger");
    expect(trigger.attributes("type")).toBe("button");
    expect(trigger.attributes("aria-expanded")).toBe("false");
  });

  it("aria-expanded refleja el estado del panel", async () => {
    const w = mount(NavbarHorizontal, { props: { items } });
    await w.find(".cu-navbar-dropdown-trigger").trigger("click");
    await flushPromises();
    expect(w.find(".cu-navbar-dropdown-trigger").attributes("aria-expanded")).toBe("true");
    await w.find(".cu-navbar-dropdown-trigger").trigger("click");
    await flushPromises();
    expect(w.find(".cu-navbar-dropdown-trigger").attributes("aria-expanded")).toBe("false");
  });
});

describe("NavbarHorizontal — Custom Element", () => {
  const CE_TAG = "cu-navbar-horizontal-audit";
  type CeEl = HTMLElement & { items: typeof items };

  beforeAll(() => {
    if (!customElements.get(CE_TAG)) defineComegenElement(CE_TAG, NavbarHorizontalCe);
  });

  it("`active-path` en el HTML y `items` después (patrón de la ficha vanilla) renderiza", async () => {
    const el = document.createElement(CE_TAG) as CeEl;
    el.setAttribute("active-path", "/equipo/dev");
    document.body.appendChild(el);
    await nextTick();
    el.items = [
      { label: "Inicio", path: "/inicio" },
      { label: "Equipo", children: [{ label: "Desarrollo", path: "/equipo/dev" }] },
    ];
    await flushPromises();
    await nextTick();

    const root = el.shadowRoot!;
    expect(root.querySelector("nav.cu-navbar")).not.toBeNull();
    expect(root.querySelector(".cu-navbar-dropdown-trigger")).not.toBeNull();
    expect(root.querySelector("[data-navbar-active]")!.textContent).toContain("Equipo");
    el.remove();
  });
});

describe("NavbarHorizontal — scroll del item activo", () => {
  it("no desplaza el item activo de otra instancia", async () => {
    scrolled.length = 0;
    const other = mount(NavbarHorizontal, { props: { items, activePath: "/" } });
    const own = mount(NavbarHorizontal, { props: { items, activePath: "/equipo/dev" } });
    await flushPromises();
    await nextTick();

    const last = scrolled.at(-1);
    expect(last).toBeTruthy();
    expect(last!.textContent).toContain("Equipo");
    expect(own.element.contains(last!)).toBe(true);
    expect(other.element.contains(last!)).toBe(false);
  });
});

describe("NavbarHorizontal — ícono saneado", () => {
  const EVIL = '<img src=x onerror="window.__xss=1"><script>window.__xss=2</script>';

  it("conserva un SVG válido y elimina handlers del icono", () => {
    type XssWindow = Window & { __xss?: number };
    const probe = window as XssWindow;
    delete probe.__xss;

    const w = mount(NavbarHorizontal, {
      props: {
        items: [
          { label: "Inicio", path: "/", icon: '<svg class="mi-icon"></svg>' },
          { label: "Malo", path: "/malo", icon: EVIL },
        ],
      },
    });
    expect(w.find(".cu-navbar-icon svg.mi-icon").exists()).toBe(true);
    expect(w.html()).not.toContain("onerror");
    expect(w.html()).not.toContain("<script");
    expect(probe.__xss).toBeUndefined();
  });
});
