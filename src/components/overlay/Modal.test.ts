// Comportamiento de Modal según su ficha (docs/componentes/vue/modal.md).
//
// Estas aserciones se escriben a MANO desde la prosa de la ficha, no se derivan
// del código: por eso pueden fallar por un bug real (ver scripts/mutation-check.mjs).
import { afterEach, describe, it, expect } from "vitest";
import { enableAutoUnmount, flushPromises, mount } from "@vue/test-utils";
import Modal from "./Modal.vue";

// Cada test parte de cero: un modal abierto que quede montado conserva su
// listener de teclado en `document` y contamina el trap del test siguiente.
enableAutoUnmount(afterEach);

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

/** `Tab` real sobre el elemento indicado (burbujea y es cancelable, como el del navegador). */
function pressTab(target: EventTarget, shiftKey = false): KeyboardEvent {
  const event = new KeyboardEvent("keydown", {
    key: "Tab",
    shiftKey,
    bubbles: true,
    cancelable: true,
    composed: true,
  });
  target.dispatchEvent(event);
  return event;
}

const focusable = (w: ReturnType<typeof mount>) =>
  Array.from(
    w.find(".cu-modal-backdrop").element.querySelectorAll<HTMLElement>(
      'button:not([disabled]), [href], input:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  );

describe("Modal — foco", () => {
  it("al abrir el foco entra al diálogo (primer control) y no queda en el body", async () => {
    const w = mount(Modal, {
      attachTo: document.body,
      slots: { default: '<button class="dentro">Dentro</button>' },
    });
    vm(w).open();
    await flushPromises();

    expect(document.activeElement).not.toBe(document.body);
    expect(w.find(".cu-modal-backdrop").element.contains(document.activeElement)).toBe(true);
    expect(document.activeElement).toBe(w.find(".cu-modal-close").element);
  });

  it("Tab en el último control vuelve al primero y Shift+Tab en el primero va al último", async () => {
    const w = mount(Modal, {
      attachTo: document.body,
      slots: { default: '<button class="dentro">Dentro</button>' },
    });
    vm(w).open();
    await flushPromises();

    const items = focusable(w);
    const first = items[0]!;
    const last = items[items.length - 1]!;
    expect(items.length).toBeGreaterThan(1);

    last.focus();
    expect(pressTab(last).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(first);

    first.focus();
    expect(pressTab(first, true).defaultPrevented).toBe(true);
    expect(document.activeElement).toBe(last);

    // En el medio no se intercepta: el navegador mueve el foco normalmente.
    const middle = items[1]!;
    middle.focus();
    expect(pressTab(middle).defaultPrevented).toBe(false);
  });

  it("si el foco quedó fuera (body), Tab lo devuelve al diálogo", async () => {
    const w = mount(Modal, { attachTo: document.body });
    vm(w).open();
    await flushPromises();

    (document.activeElement as HTMLElement | null)?.blur();
    expect(document.activeElement).toBe(document.body);

    expect(pressTab(document.body).defaultPrevented).toBe(true);
    expect(w.find(".cu-modal-backdrop").element.contains(document.activeElement)).toBe(true);
  });

  it("al cerrar devuelve el foco al trigger", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Abrir modal";
    document.body.appendChild(trigger);
    trigger.focus();
    expect(document.activeElement).toBe(trigger);

    const w = mount(Modal, { attachTo: document.body });
    vm(w).open();
    await flushPromises();
    expect(document.activeElement).not.toBe(trigger);

    vm(w).close();
    await flushPromises();
    expect(document.activeElement).toBe(trigger);

    trigger.remove();
  });

  it("no pisa un foco que ya está dentro del diálogo (el consumidor manda)", async () => {
    const w = mount(Modal, {
      attachTo: document.body,
      slots: { default: '<button class="autofoco">Buscar</button>' },
    });
    const inside = w.find(".autofoco").element as HTMLButtonElement;
    vm(w).open();
    // El consumidor enfoca su control en el mismo tick que abre.
    inside.focus();
    await flushPromises();

    expect(document.activeElement).toBe(inside);
  });

  it("con `persistent` (sin cruz) el trap usa el contenido sloteado", async () => {
    const w = mount(Modal, {
      attachTo: document.body,
      props: { persistent: true },
      slots: { default: '<button class="dentro">Dentro</button>' },
    });
    vm(w).open();
    await flushPromises();

    const items = focusable(w);
    expect(items.map((el) => el.textContent?.trim())).toContain("Dentro");
    expect(document.activeElement).toBe(items[0]);
  });
});

describe("Modal — nombre accesible", () => {
  it("con `title` usa `aria-labelledby` al título y no inventa `aria-label`", () => {
    const w = mount(Modal, { props: { title: "Confirmar" } });
    const dialog = w.find("[role=dialog]");
    expect(dialog.attributes("aria-labelledby")).toBe("modal-title");
    expect(dialog.attributes("aria-label")).toBeUndefined();
  });

  it("sin `title` el diálogo conserva un nombre accesible (fallback)", () => {
    const w = mount(Modal);
    const dialog = w.find("[role=dialog]");
    expect(dialog.attributes("aria-labelledby")).toBeUndefined();
    expect(dialog.attributes("aria-label")).toBe("Diálogo");
  });

  it("un `aria-label` del autor reemplaza al fallback", () => {
    const w = mount(Modal, { attrs: { "aria-label": "Paleta de comandos" } });
    expect(w.find("[role=dialog]").attributes("aria-label")).toBe("Paleta de comandos");
  });
});
