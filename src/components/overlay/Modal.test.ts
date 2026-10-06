// Comportamiento de Modal según su ficha (docs/componentes/vue/modal.md).
//
// Estas aserciones se escriben a MANO desde la prosa de la ficha, no se derivan
// del código: por eso pueden fallar por un bug real (ver scripts/mutation-check.mjs).
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Modal from "./Modal.vue";

type ModalVm = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as ModalVm;
const backdrop = (w: ReturnType<typeof mount>) => w.find(".cu-modal-backdrop");

describe("Modal — visibilidad", () => {
  it("arranca cerrado y `open()`/`close()`/`toggle()` controlan isOpen()", async () => {
    const w = mount(Modal);
    expect(vm(w).isOpen()).toBe(false);

    vm(w).open();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);

    vm(w).close();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);

    vm(w).toggle();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
  });

  it("el backdrop se oculta con v-show cuando está cerrado", async () => {
    const w = mount(Modal);
    expect(backdrop(w).attributes("style")).toContain("display: none");

    vm(w).open();
    await flushPromises();
    expect(backdrop(w).attributes("style") ?? "").not.toContain("display: none");
  });
});

describe("Modal — eventos", () => {
  it("emite `opened` al abrir y `close` + `closed` al cerrar", async () => {
    const w = mount(Modal);
    vm(w).open();
    await flushPromises();
    expect(w.emitted("opened")).toHaveLength(1);

    vm(w).close();
    await flushPromises();
    // La ficha distingue el inicio del cierre (`close`) de la animación completa (`closed`).
    expect(w.emitted("close")).toHaveLength(1);
    expect(w.emitted("closed")).toHaveLength(1);
  });

  it("no emite `opened` en el montaje (arranca cerrado)", async () => {
    const w = mount(Modal);
    await flushPromises();
    expect(w.emitted("opened")).toBeUndefined();
    expect(w.emitted("closed")).toBeUndefined();
  });
});

describe("Modal — cierre por backdrop y persistente", () => {
  it("click en el backdrop cierra un modal normal", async () => {
    const w = mount(Modal, { attachTo: document.body });
    vm(w).open();
    await flushPromises();

    await backdrop(w).trigger("click");
    await flushPromises();

    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("close")).toHaveLength(1);
  });

  it("un modal `persistent` NO se cierra por click en el backdrop ni emite close", async () => {
    const w = mount(Modal, { props: { persistent: true }, attachTo: document.body });
    vm(w).open();
    await flushPromises();

    await backdrop(w).trigger("click");
    await flushPromises();

    expect(vm(w).isOpen()).toBe(true);
    expect(w.emitted("close")).toBeUndefined();
    expect(w.emitted("closed")).toBeUndefined();
  });

  it("click dentro del contenido NO cierra el modal (solo el backdrop mismo)", async () => {
    const w = mount(Modal, { attachTo: document.body });
    vm(w).open();
    await flushPromises();

    await w.find(".cu-modal").trigger("click");
    await flushPromises();

    expect(vm(w).isOpen()).toBe(true);
    expect(w.emitted("close")).toBeUndefined();
  });
});

describe("Modal — contenido y slots", () => {
  it("renderiza title y description", () => {
    const w = mount(Modal, { props: { title: "Mi título", description: "Detalle" } });
    expect(w.find(".cu-modal-title").text()).toBe("Mi título");
    expect(w.find(".cu-modal-description").text()).toBe("Detalle");
  });

  it("el botón de cerrar del header no existe cuando es persistent", async () => {
    const normal = mount(Modal, { props: { title: "T" } });
    expect(normal.find(".cu-modal-close").exists()).toBe(true);

    const persistent = mount(Modal, { props: { title: "T", persistent: true } });
    expect(persistent.find(".cu-modal-close").exists()).toBe(false);
  });

  it("renderiza el slot footer", () => {
    const w = mount(Modal, { slots: { footer: '<span class="mi-footer">pie</span>' } });
    expect(w.find(".mi-footer").exists()).toBe(true);
  });

  it("`accept` y `cancel` cierran el modal (footer por defecto de persistent)", async () => {
    const w = mount(Modal, { props: { persistent: true } });
    vm(w).open();
    await flushPromises();

    const buttons = w.findAll(".cu-modal-footer-default button");
    expect(buttons.length).toBeGreaterThanOrEqual(2);

    await buttons[1]!.trigger("click"); // Aceptar
    await flushPromises();
    expect(w.emitted("accept")).toHaveLength(1);
    expect(vm(w).isOpen()).toBe(false);
  });
});
