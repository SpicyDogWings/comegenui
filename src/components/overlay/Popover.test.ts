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
