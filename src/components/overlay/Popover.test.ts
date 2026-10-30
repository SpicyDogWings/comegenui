// Comportamiento de Popover según su ficha (docs/componentes/vue/popover.md).
//
// Aserciones escritas a MANO desde la prosa de la ficha, no derivadas del código:
// por eso pueden fallar por un bug real (ver scripts/mutation-check.mjs).
import { describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Popover from "./Popover.vue";

type PopoverVm = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as PopoverVm;
const panel = (w: ReturnType<typeof mount>) => w.find(".cu-popover-panel");

describe("Popover — visibilidad programática", () => {
  it("arranca cerrado: no renderiza el panel", () => {
    const w = mount(Popover);
    expect(vm(w).isOpen()).toBe(false);
    expect(panel(w).exists()).toBe(false);
  });

  it("`open()` muestra el panel y emite `open`", async () => {
    const w = mount(Popover);
    vm(w).open();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
    expect(panel(w).exists()).toBe(true);
    expect(w.emitted("open")).toHaveLength(1);
  });

  it("`close()` oculta el panel y emite `close`; no emite de nuevo si ya estaba cerrado", async () => {
    const w = mount(Popover);
    vm(w).open();
    await flushPromises();

    vm(w).close();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(panel(w).exists()).toBe(false);
    expect(w.emitted("close")).toHaveLength(1);

    // Ya cerrado: close() es no-op (la ficha documenta el toggle, no doble emisión).
    vm(w).close();
    await flushPromises();
    expect(w.emitted("close")).toHaveLength(1);
  });

  it("`toggle()` alterna la visibilidad", async () => {
    const w = mount(Popover);
    vm(w).toggle();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);

    vm(w).toggle();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
  });

  it("con `disabled` no abre ni por open ni por toggle", async () => {
    const w = mount(Popover, { props: { disabled: true } });
    vm(w).open();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("open")).toBeUndefined();

    vm(w).toggle();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
  });
});

describe("Popover — cierre por Escape y click afuera", () => {
  it("Escape cierra el panel abierto y emite close", async () => {
    const w = mount(Popover, { attachTo: document.body });
    vm(w).open();
    await flushPromises();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("close")).toHaveLength(1);
  });

  it("un click fuera del popover lo cierra", async () => {
    const w = mount(Popover, { attachTo: document.body });
    vm(w).open();
    await flushPromises();

    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("close")).toHaveLength(1);
  });

  it("un click dentro del popover NO lo cierra", async () => {
    const w = mount(Popover, { attachTo: document.body });
    vm(w).open();
    await flushPromises();

    await w.find(".cu-popover").trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
    expect(w.emitted("close")).toBeUndefined();
  });
});

describe("Popover — hover", () => {
  it("con `hover` (delay 0) el mouseenter abre y el mouseleave cierra", async () => {
    const w = mount(Popover, { props: { hover: true, hoverDelay: 0 } });
    await w.find(".cu-popover").trigger("mouseenter");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
    expect(w.emitted("open")).toHaveLength(1);

    await w.find(".cu-popover").trigger("mouseleave");
    await vi.waitFor(() => expect(vm(w).isOpen()).toBe(false));
  });

  it("sin `hover` el mouseenter no abre", async () => {
    const w = mount(Popover);
    await w.find(".cu-popover").trigger("mouseenter");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
  });
});

describe("Popover — panel y slots", () => {
  it("el slot toggle recibe { toggle, isOpen } y el default llena el panel", async () => {
    const w = mount(Popover, {
      slots: {
        toggle: `<template #toggle="{ toggle, isOpen }"><button class="mi-toggle" @click="toggle">{{ isOpen }}</button></template>`,
        default: '<span class="mi-contenido">hola</span>',
      },
    });
    expect(w.find(".mi-toggle").text()).toBe("false");

    await w.find(".mi-toggle").trigger("click");
    await flushPromises();
    expect(panel(w).find(".mi-contenido").exists()).toBe(true);
  });

  it("aplica `role` y `panelClass` al panel", async () => {
    const w = mount(Popover, {
      props: { role: "menu", panelClass: "mi-clase" },
      slots: { default: "x" },
    });
    vm(w).open();
    await flushPromises();
    expect(panel(w).attributes("role")).toBe("menu");
    expect(panel(w).classes()).toContain("mi-clase");
  });
});

describe("Popover — listeners de viewport", () => {
  // Un listener de scroll NO pasivo en `document` bloquea el scrolling asíncrono
  // (Firefox lo reporta como "scroll-linked positioning effect"). El nuestro sólo
  // lee geometría para reposicionar el panel: tiene que ser pasivo.
  it("escucha el scroll del documento en captura y en modo pasivo", () => {
    const spy = vi.spyOn(document, "addEventListener");
    const w = mount(Popover);
    const scroll = spy.mock.calls.find(([type]) => type === "scroll");
    expect(scroll).toBeDefined();
    expect(scroll?.[2]).toMatchObject({ capture: true, passive: true });

    w.unmount();
    spy.mockRestore();
  });
});

// ── Repro de "<cu-select> dentro de una card no despliega" ────────────────────
// Dos causas independientes, medidas en Chromium real (ver docs/notes/15-select-en-card.md):
//   1) un ancestro que re-emite `click` como CustomEvent (p. ej. `<cu-card>`) cerraba
//      el panel con el mismo gesto que lo abría;
//   2) un ancestro con `overflow` distinto de `visible` recortaba el panel.

describe("Popover — clicks que no vienen de un puntero", () => {
  it("un `CustomEvent('click')` redisparado fuera del popover no lo cierra", async () => {
    const w = mount(Popover, { attachTo: document.body });
    vm(w).open();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);

    // Lo mismo que hace el wrapper CE de `<cu-card>`: `new CustomEvent("click", { bubbles })`.
    const host = document.createElement("div");
    document.body.appendChild(host);
    host.dispatchEvent(new CustomEvent("click", { bubbles: true, composed: true }));
    await flushPromises();

    expect(vm(w).isOpen()).toBe(true);
    expect(w.emitted("close")).toBeUndefined();

    host.remove();
    w.unmount();
  });

  it("un click de puntero fuera del popover sigue cerrandolo", async () => {
    const w = mount(Popover, { attachTo: document.body });
    vm(w).open();
    await flushPromises();

    // Un PointerEvent ES un MouseEvent: el cierre por click afuera no se relaja.
    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("close")).toHaveLength(1);
    w.unmount();
  });
});

type Rect = { top: number; bottom: number; left: number; right: number; width: number; height: number };

/** Rect sintético: jsdom no hace layout, así que la geometría se stubea a mano. */
function rect(top: number, height: number, left = 0, width = 200): Rect {
  return { top, bottom: top + height, left, right: left + width, width, height };
}

/**
 * Stubea `getBoundingClientRect` por clase: panel, ancla y ancestro. Cualquier otro
 * elemento devuelve un rect vacío (no recorta ni desborda).
 */
function stubGeometry(panelRect: Rect, anchorRect: Rect, ancestorClass: string, ancestorRect: Rect) {
  return vi.spyOn(Element.prototype, "getBoundingClientRect").mockImplementation(function (this: Element) {
    if (this.classList.contains("cu-popover-panel")) return panelRect as DOMRect;
    if (this.classList.contains("cu-popover")) return anchorRect as DOMRect;
    if (this.classList.contains(ancestorClass)) return ancestorRect as DOMRect;
    return rect(0, 0, 0, 0) as DOMRect;
  });
}

function mountInsideClip(styles: Record<string, string>) {
  const fixture = document.createElement("div");
  fixture.className = "clip-ancestro";
  Object.assign(fixture.style, styles);
  document.body.appendChild(fixture);
  return fixture;
}

const panelPosition = (w: ReturnType<typeof mount>) =>
  (panel(w).element as HTMLElement).style.position;

describe("Popover — fallback automático a fixed", () => {
  it("si un ancestro con overflow:hidden recorta el panel, el panel pasa a position:fixed", async () => {
    const fixture = mountInsideClip({ overflow: "hidden" });
    // El panel (24..144) se sale por abajo del ancestro (0..50).
    const spy = stubGeometry(rect(24, 120), rect(0, 20), "clip-ancestro", rect(0, 50, 0, 240));
    const w = mount(Popover, { attachTo: fixture, slots: { default: "contenido" } });

    vm(w).open();
    await flushPromises();

    expect(vm(w).isOpen()).toBe(true);
    expect(panelPosition(w)).toBe("fixed");
    // El fallback conserva el ancho del ancla (en absoluto era `width: 100%`).
    expect((panel(w).element as HTMLElement).style.width).toBe("200px");

    w.unmount();
    spy.mockRestore();
    fixture.remove();
  });

  it("si el panel entra dentro del ancestro que recorta, sigue en position:absolute", async () => {
    const fixture = mountInsideClip({ overflow: "hidden" });
    // El panel (0..20) entra completo en el ancestro (0..50).
    const spy = stubGeometry(rect(0, 20), rect(0, 20), "clip-ancestro", rect(0, 50, 0, 240));
    const w = mount(Popover, { attachTo: fixture, slots: { default: "contenido" } });

    vm(w).open();
    await flushPromises();

    expect(panelPosition(w)).toBe("absolute");

    w.unmount();
    spy.mockRestore();
    fixture.remove();
  });

  it("con un ancestro que ancla `fixed` (transform) NO cambia a fixed: quedaría desplazado", async () => {
    const fixture = mountInsideClip({ overflow: "hidden", transform: "translateZ(0)" });
    const spy = stubGeometry(rect(24, 120), rect(0, 20), "clip-ancestro", rect(0, 50, 0, 240));
    const w = mount(Popover, { attachTo: fixture, slots: { default: "contenido" } });

    vm(w).open();
    await flushPromises();

    expect(panelPosition(w)).toBe("absolute");

    w.unmount();
    spy.mockRestore();
    fixture.remove();
  });

  it("con `fixed` explícito no se re-mide ni se pisa el ancho del ancla", async () => {
    const fixture = mountInsideClip({ overflow: "hidden" });
    const spy = stubGeometry(rect(24, 120), rect(0, 20), "clip-ancestro", rect(0, 50, 0, 240));
    const w = mount(Popover, { attachTo: fixture, props: { fixed: true }, slots: { default: "contenido" } });

    vm(w).open();
    await flushPromises();

    expect(panelPosition(w)).toBe("fixed");
    // `fixed` explícito no impone el ancho del ancla (comportamiento previo).
    expect((panel(w).element as HTMLElement).style.width).toBe("");

    w.unmount();
    spy.mockRestore();
    fixture.remove();
  });
});

describe("Popover — el foco vuelve al trigger al cerrar", () => {
  const mountWithTrigger = () =>
    mount(Popover, {
      attachTo: document.body,
      slots: {
        toggle: `<template #toggle="{ toggle }"><button class="mi-toggle" @click="toggle">abrir</button></template>`,
        default: '<button class="mi-item">item</button>',
      },
    });

  it("Escape con el foco dentro del panel lo devuelve al trigger", async () => {
    const w = mountWithTrigger();
    const trigger = w.find(".mi-toggle").element as HTMLElement;
    trigger.focus();
    vm(w).open();
    await flushPromises();
    const item = w.find(".mi-item").element as HTMLElement;
    item.focus();
    expect(document.activeElement).toBe(item);

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();
    expect(document.activeElement).toBe(trigger);
    w.unmount();
  });

  it("cerrar por código con el foco en el panel también lo devuelve al trigger", async () => {
    const w = mountWithTrigger();
    const trigger = w.find(".mi-toggle").element as HTMLElement;
    trigger.focus();
    vm(w).open();
    await flushPromises();
    (w.find(".mi-item").element as HTMLElement).focus();

    vm(w).close();
    await flushPromises();
    expect(document.activeElement).toBe(trigger);
    w.unmount();
  });

  it("un click afuera sobre algo no enfocable devuelve el foco al trigger", async () => {
    const w = mountWithTrigger();
    const trigger = w.find(".mi-toggle").element as HTMLElement;
    trigger.focus();
    vm(w).open();
    await flushPromises();
    (w.find(".mi-item").element as HTMLElement).focus();
    // El navegador mueve el foco al body antes del click.
    (document.activeElement as HTMLElement).blur();

    document.body.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    expect(document.activeElement).toBe(trigger);
    w.unmount();
  });

  it("un click afuera sobre otro control NO le roba el foco", async () => {
    const otro = document.createElement("button");
    otro.className = "otro-control";
    document.body.appendChild(otro);

    const w = mountWithTrigger();
    (w.find(".mi-toggle").element as HTMLElement).focus();
    vm(w).open();
    await flushPromises();
    (w.find(".mi-item").element as HTMLElement).focus();

    otro.focus();
    otro.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    await flushPromises();
    expect(document.activeElement).toBe(otro);
    w.unmount();
    otro.remove();
  });

  it("en modo hover (Tooltip) el cierre no mueve el foco", async () => {
    const w = mount(Popover, {
      attachTo: document.body,
      props: { hover: true, hoverDelay: 0 },
      slots: {
        toggle: `<template #toggle><button class="mi-toggle">hover</button></template>`,
        default: '<span class="mi-contenido">tip</span>',
      },
    });
    await w.find(".cu-popover").trigger("mouseenter");
    await flushPromises();
    const fuera = document.createElement("button");
    document.body.appendChild(fuera);
    fuera.focus();

    await w.find(".cu-popover").trigger("mouseleave");
    await vi.waitFor(() => expect(vm(w).isOpen()).toBe(false));
    expect(document.activeElement).toBe(fuera);
    w.unmount();
    fuera.remove();
  });
});
