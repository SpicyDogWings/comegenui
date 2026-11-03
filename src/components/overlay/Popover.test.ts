// Comportamiento de Popover según su ficha (docs/componentes/vue/popover.md).
//
// Aserciones escritas a MANO desde la prosa de la ficha, no derivadas del código:
// por eso pueden fallar por un bug real (ver scripts/mutation-check.mjs).
import { afterEach, describe, it, expect, vi } from "vitest";
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

// ── Nombre accesible del panel ────────────────────────────────────────────────
// `menu`/`dialog` exigen nombre accesible y el panel no tiene un título propio: sin
// esto el lector de pantalla anunciaba "menú"/"diálogo" a secas.

describe("Popover — nombre accesible del panel", () => {
  const mountWithToggle = (props: Record<string, unknown>, toggle: string) =>
    mount(Popover, {
      props,
      slots: { toggle: `<template #toggle="{ toggle }">${toggle}</template>`, default: "<span>x</span>" },
    });

  it("un panel `menu` toma el nombre del texto del trigger", async () => {
    const w = mountWithToggle({ role: "menu" }, `<button class="mi-toggle" @click="toggle">Acciones</button>`);
    vm(w).open();
    await flushPromises();
    expect(panel(w).attributes("role")).toBe("menu");
    expect(panel(w).attributes("aria-label")).toBe("Acciones");
  });

  it("el `aria-label` del trigger manda sobre su texto", async () => {
    const w = mountWithToggle(
      { role: "dialog" },
      `<button class="mi-toggle" @click="toggle" aria-label="Elegir fecha">15/02</button>`,
    );
    vm(w).open();
    await flushPromises();
    expect(panel(w).attributes("aria-label")).toBe("Elegir fecha");
  });

  it("sin `role` el panel no inventa nombre", async () => {
    const w = mountWithToggle({}, `<button class="mi-toggle" @click="toggle">Abrir</button>`);
    vm(w).open();
    await flushPromises();
    expect(panel(w).attributes("aria-label")).toBeUndefined();
  });

  it("el `listbox` de un combobox no se renombra desde el trigger", async () => {
    const w = mountWithToggle({ role: "listbox" }, `<button class="mi-toggle" @click="toggle">Valor</button>`);
    vm(w).open();
    await flushPromises();
    expect(panel(w).attributes("aria-label")).toBeUndefined();
  });
});

// ── Flip y clamp contra el viewport ───────────────────────────────────────────
// `position="right"` en el borde derecho generaba scroll horizontal (scrollWidth
// 1201 > 900) y `left` daba x=-308: el panel se sale del viewport y nada lo corrige.

describe("Popover — flip y clamp contra el viewport", () => {
  const original = { width: window.innerWidth, height: window.innerHeight };
  const setViewport = (width: number, height: number) => {
    Object.defineProperty(window, "innerWidth", { value: width, configurable: true, writable: true });
    Object.defineProperty(window, "innerHeight", { value: height, configurable: true, writable: true });
  };
  afterEach(() => setViewport(original.width, original.height));

  it("`right` sin espacio a la derecha se voltea a la izquierda y no desborda", async () => {
    setViewport(900, 600);
    // Ancla pegada al borde derecho; el panel (150px) no entra a la derecha.
    const spy = stubGeometry(rect(100, 200, 805, 150), rect(100, 20, 700, 100), "sin-ancestro", rect(0, 0));
    const w = mount(Popover, { attachTo: document.body, props: { position: "right" }, slots: { default: "x" } });

    vm(w).open();
    await flushPromises();

    const el = panel(w).element as HTMLElement;
    expect(el.style.position).toBe("fixed");
    // 700 (left del ancla) - 4 (offset) - 150 (panel)
    expect(el.style.left).toBe("546px");
    expect(parseInt(el.style.left, 10) + 150).toBeLessThanOrEqual(900);

    w.unmount();
    spy.mockRestore();
  });

  it("`left` sin espacio a la izquierda se voltea a la derecha", async () => {
    setViewport(900, 600);
    const spy = stubGeometry(rect(100, 200, -160, 150), rect(100, 20, 50, 100), "sin-ancestro", rect(0, 0));
    const w = mount(Popover, { attachTo: document.body, props: { position: "left" }, slots: { default: "x" } });

    vm(w).open();
    await flushPromises();

    const el = panel(w).element as HTMLElement;
    expect(el.style.position).toBe("fixed");
    // 150 (right del ancla) + 4 (offset)
    expect(el.style.left).toBe("154px");

    w.unmount();
    spy.mockRestore();
  });

  it("abajo sin espacio se voltea arriba y se clampea al borde derecho", async () => {
    setViewport(900, 600);
    // Ancla abajo a la derecha; el panel (200x100) no entra abajo ni a la derecha.
    const spy = stubGeometry(rect(584, 100, 820, 200), rect(560, 20, 820, 70), "sin-ancestro", rect(0, 0));
    const w = mount(Popover, { attachTo: document.body, slots: { default: "x" } });

    vm(w).open();
    await flushPromises();

    const el = panel(w).element as HTMLElement;
    expect(el.style.position).toBe("fixed");
    // 560 (top del ancla) - 4 (offset) - 100 (alto) y 900 - 8 - 200 de clamp
    expect(el.style.top).toBe("456px");
    expect(el.style.left).toBe("692px");

    w.unmount();
    spy.mockRestore();
  });

  it("un panel que entra completo se queda en `absolute` con los estilos relativos", async () => {
    setViewport(900, 600);
    const spy = stubGeometry(rect(24, 100, 0, 200), rect(0, 20, 0, 200), "sin-ancestro", rect(0, 0));
    const w = mount(Popover, { attachTo: document.body, props: { position: "right" }, slots: { default: "x" } });

    vm(w).open();
    await flushPromises();

    expect(panelPosition(w)).toBe("absolute");
    expect((panel(w).element as HTMLElement).style.left).toBe("100%");

    w.unmount();
    spy.mockRestore();
  });
});

// ── Timers de hover ──────────────────────────────────────────────────────────
// Desmontar dentro del delay dejaba correr un `open()` sobre un nodo desconectado, que
// además contaminaba el registry global de hover.

const HOVER_REGISTRY_KEY = "__cu_hover_registry__";
const OVERLAY_STACK_KEY = "__cu_overlay_stack__";

function hoverRegistrySize(): number {
  if (!(HOVER_REGISTRY_KEY in globalThis)) return 0;
  const value = Reflect.get(globalThis, HOVER_REGISTRY_KEY);
  return Array.isArray(value) ? value.length : 0;
}

/** Overlays abiertos en la pila global (un desmontaje no puede dejar basura). */
function overlayStackSize(): number {
  if (!(OVERLAY_STACK_KEY in globalThis)) return 0;
  const stack = Reflect.get(globalThis, OVERLAY_STACK_KEY);
  if (!stack || typeof stack !== "object") return 0;
  const entries = Reflect.get(stack, "entries");
  return Array.isArray(entries) ? entries.length : 0;
}

const hoverSlots = {
  toggle: `<template #toggle><button class="mi-toggle">hover</button></template>`,
  default: '<span class="mi-contenido">tip</span>',
};

describe("Popover — timers de hover", () => {
  it("el delay abre y suma el popover al registry mientras está abierto", async () => {
    vi.useFakeTimers();
    try {
      const before = hoverRegistrySize();
      const w = mount(Popover, { props: { hover: true, hoverDelay: 300 }, slots: hoverSlots });
      await w.find(".cu-popover").trigger("mouseenter");
      await vi.advanceTimersByTimeAsync(300);
      await flushPromises();

      expect(vm(w).isOpen()).toBe(true);
      expect(hoverRegistrySize()).toBe(before + 1);

      w.unmount();
      expect(hoverRegistrySize()).toBe(before);
    } finally {
      vi.useRealTimers();
    }
  });

  it("desmontar dentro del delay no abre ni deja el registry ni la pila sucios", async () => {
    vi.useFakeTimers();
    try {
      const hoverBefore = hoverRegistrySize();
      const stackBefore = overlayStackSize();
      const w = mount(Popover, { props: { hover: true, hoverDelay: 300 }, slots: hoverSlots });
      await w.find(".cu-popover").trigger("mouseenter");
      w.unmount();

      await vi.advanceTimersByTimeAsync(500);
      await flushPromises();

      // El timer pendiente no puede abrir un overlay de un componente desmontado.
      expect(hoverRegistrySize()).toBe(hoverBefore);
      expect(overlayStackSize()).toBe(stackBefore);
    } finally {
      vi.useRealTimers();
    }
  });

  it("desmontar con un hover pendiente no toca el registry de otros popovers", async () => {
    vi.useFakeTimers();
    try {
      const before = hoverRegistrySize();
      const other = mount(Popover, { props: { hover: true, hoverDelay: 0 }, slots: hoverSlots });
      await other.find(".cu-popover").trigger("mouseenter");
      await flushPromises();
      expect(hoverRegistrySize()).toBe(before + 1);

      // Segundo popover con la apertura todavía pendiente: al desmontarlo no puede
      // cerrar a `other` ni vaciar su entrada del registry.
      const w = mount(Popover, { props: { hover: true, hoverDelay: 300 }, slots: hoverSlots });
      await w.find(".cu-popover").trigger("mouseenter");
      w.unmount();
      await vi.advanceTimersByTimeAsync(500);
      await flushPromises();

      expect(hoverRegistrySize()).toBe(before + 1);
      expect(vm(other).isOpen()).toBe(true);

      other.unmount();
      expect(hoverRegistrySize()).toBe(before);
    } finally {
      vi.useRealTimers();
    }
  });
});
