// Comportamiento de SideOver según su ficha (docs/componentes/vue/side-over.md).
//
// Panel overlay que desliza desde un borde, con scrim, cierre por
// backdrop/Escape, opción fullscreen y control programático. Bloquea el scroll
// del body mientras está abierto. Aserciones escritas a mano desde la prosa.
import { describe, it, expect, afterEach } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { defineComponent, h } from "vue";
import SideOver from "./SideOver.vue";

// SideOver se teletransporta a `body`: cada montaje queda en el documento, así
// que se desmonta al terminar para no mezclar paneles entre tests.
let wrappers: VueWrapper[] = [];

function render(
  props: Record<string, unknown>,
  slots: Record<string, string> = {},
): VueWrapper {
  const w = mount(SideOver, { props, slots, attachTo: document.body });
  wrappers.push(w);
  return w;
}

const q = (selector: string) => document.body.querySelector(selector) as HTMLElement | null;

afterEach(() => {
  for (const w of wrappers) w.unmount();
  wrappers = [];
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

  it("bloquea el scroll si el panel se monta ya abierto", async () => {
    document.body.style.overflow = "auto";
    render({ modelValue: true });
    await flushPromises();
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("no libera el scroll mientras quede otro panel abierto", async () => {
    document.body.style.overflow = "auto";
    const first = render({ modelValue: true });
    const second = render({ modelValue: true });
    await flushPromises();
    expect(document.body.style.overflow).toBe("hidden");

    await first.setProps({ modelValue: false });
    await flushPromises();
    expect(document.body.style.overflow).toBe("hidden");

    await second.setProps({ modelValue: false });
    await flushPromises();
    expect(document.body.style.overflow).toBe("auto");
  });
});

describe("SideOver — foco y accesibilidad", () => {
  it("nombra el diálogo con el título vía aria-labelledby", async () => {
    render({ modelValue: true, title: "Filtros" });
    await flushPromises();

    const dialog = q(".cu-sideover")!;
    const title = q(".cu-sideover-title")!;
    expect(dialog.getAttribute("aria-labelledby")).toBe(title.id);
  });

  it("sin título el diálogo tiene un nombre accesible de respaldo", async () => {
    render({ modelValue: true });
    await flushPromises();
    expect(q(".cu-sideover")!.getAttribute("aria-label")).toBe("Panel");
  });

  it("dos paneles abiertos no comparten el id del título", async () => {
    const Pair = defineComponent({
      render() {
        return h("div", [
          h(SideOver, { modelValue: true, title: "Primero" }),
          h(SideOver, { modelValue: true, title: "Segundo" }),
        ]);
      },
    });
    wrappers.push(mount(Pair, { attachTo: document.body }));
    await flushPromises();

    const titles = [...document.body.querySelectorAll(".cu-sideover-title")] as HTMLElement[];
    const dialogs = [...document.body.querySelectorAll(".cu-sideover")] as HTMLElement[];
    expect(titles).toHaveLength(2);
    expect(titles[0]!.id).not.toBe(titles[1]!.id);
    expect(dialogs[0]!.getAttribute("aria-labelledby")).toBe(titles[0]!.id);
    expect(dialogs[1]!.getAttribute("aria-labelledby")).toBe(titles[1]!.id);
  });

  it("mueve el foco dentro del panel al abrir y lo devuelve al trigger al cerrar", async () => {
    const trigger = document.createElement("button");
    document.body.appendChild(trigger);
    trigger.focus();

    const w = render({ modelValue: false, title: "Filtros" });
    await w.setProps({ modelValue: true });
    await flushPromises();
    expect(document.activeElement).toBe(q(".cu-sideover-close"));

    await w.setProps({ modelValue: false });
    await flushPromises();
    expect(document.activeElement).toBe(trigger);
  });

  it("Tab en el último focusable vuelve al primero y Shift+Tab hace lo inverso", async () => {
    render(
      { modelValue: true, title: "Filtros" },
      { default: '<button id="slot-btn">Acción</button>' },
    );
    await flushPromises();

    const closeBtn = q(".cu-sideover-close")!;
    const slotBtn = document.querySelector("#slot-btn") as HTMLButtonElement;
    expect(slotBtn).toBeTruthy();

    slotBtn.focus();
    const tab = new KeyboardEvent("keydown", { key: "Tab", bubbles: true, cancelable: true });
    slotBtn.dispatchEvent(tab);
    expect(tab.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(closeBtn);

    const back = new KeyboardEvent("keydown", {
      key: "Tab",
      shiftKey: true,
      bubbles: true,
      cancelable: true,
    });
    closeBtn.dispatchEvent(back);
    expect(back.defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(slotBtn);
  });

  it("Escape sólo cierra el panel que está arriba", async () => {
    const first = render({ modelValue: true, title: "Primero" });
    const second = render({ modelValue: true, title: "Segundo" });
    await flushPromises();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();

    expect(second.emitted("update:modelValue")).toEqual([[false]]);
    expect(first.emitted("update:modelValue")).toBeUndefined();
  });
});
