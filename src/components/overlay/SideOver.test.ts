// Comportamiento de SideOver según su ficha (docs/componentes/vue/side-over.md).
//
// Panel overlay que desliza desde un borde, con scrim, cierre por
// backdrop/Escape, opción fullscreen y control programático. Bloquea el scroll
// del body mientras está abierto. Aserciones escritas a mano desde la prosa.
import { describe, it, expect, afterEach } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import SideOver from "./SideOver.vue";

// SideOver se teletransporta a `body`: cada montaje queda en el documento, así
// que se desmonta al terminar para no mezclar paneles entre tests.
let wrapper: VueWrapper | null = null;

function render(props: Record<string, unknown>): VueWrapper {
  wrapper = mount(SideOver, { props, attachTo: document.body });
  return wrapper;
}

const q = (selector: string) => document.body.querySelector(selector) as HTMLElement | null;

afterEach(() => {
  wrapper?.unmount();
  wrapper = null;
  document.body.innerHTML = "";
  document.body.style.overflow = "";
});

describe("SideOver — visibilidad y v-model", () => {
  it("con modelValue=false no renderiza el panel", () => {
    render({ modelValue: false });
    expect(q(".cu-sideover")).toBeNull();
  });

  it("con modelValue=true renderiza panel y backdrop", async () => {
    render({ modelValue: true });
    await flushPromises();
    expect(q(".cu-sideover-panel")).toBeTruthy();
    expect(q(".cu-sideover-backdrop")).toBeTruthy();
  });

  it("click en el backdrop emite update:modelValue(false) y close", async () => {
    const w = render({ modelValue: true });
    await flushPromises();

    q(".cu-sideover-backdrop")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();

    expect(w.emitted("update:modelValue")).toEqual([[false]]);
    expect(w.emitted("close")).toHaveLength(1);
  });
});

describe("SideOver — cierre y persistent", () => {
  it("Escape cierra el panel abierto", async () => {
    const w = render({ modelValue: true });
    await flushPromises();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();

    expect(w.emitted("update:modelValue")).toEqual([[false]]);
  });

  it("Escape no cierra si está cerrado", async () => {
    const w = render({ modelValue: false });
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });

  it("persistent no se cierra por backdrop ni Escape", async () => {
    const w = render({ modelValue: true, persistent: true });
    await flushPromises();

    q(".cu-sideover-backdrop")!.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();

    expect(w.emitted("update:modelValue")).toBeUndefined();
    expect(w.emitted("close")).toBeUndefined();
  });

  it("el botón de cerrar no existe cuando es persistent", async () => {
    render({ modelValue: true, persistent: true });
    await flushPromises();
    expect(q(".cu-sideover-close")).toBeNull();
  });

  it("click en el botón de cerrar emite close", async () => {
    const w = render({ modelValue: true, title: "Filtros" });
    await flushPromises();

    q(".cu-sideover-close")!.click();
    await flushPromises();

    expect(w.emitted("close")).toHaveLength(1);
  });
});

describe("SideOver — título, posición y fullscreen", () => {
  it("renderiza el título", async () => {
    render({ modelValue: true, title: "Filtros" });
    await flushPromises();
    expect(q(".cu-sideover-title")?.textContent).toContain("Filtros");
  });

  it("aplica la clase de posición al panel", async () => {
    render({ modelValue: true, position: "left" });
    await flushPromises();
    expect(q(".cu-sideover-panel")!.className).toContain("cu-sideover-panel--left");
  });

  it("fullscreen agrega la clase de pantalla completa", async () => {
    render({ modelValue: true, fullscreen: true });
    await flushPromises();
    expect(q(".cu-sideover-panel")!.className).toContain("cu-sideover-panel--fullscreen");
  });
});

describe("SideOver — scroll lock", () => {
  it("bloquea el overflow del body mientras está abierto y lo restaura al cerrar", async () => {
    const w = render({ modelValue: false });
    document.body.style.overflow = "auto";
    await w.setProps({ modelValue: true });
    await flushPromises();
    expect(document.body.style.overflow).toBe("hidden");

    await w.setProps({ modelValue: false });
    await flushPromises();
    expect(document.body.style.overflow).toBe("auto");
  });
});
