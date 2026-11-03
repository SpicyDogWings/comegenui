// Comportamiento de Modal según su ficha (docs/componentes/vue/modal.md).
//
// Estas aserciones se escriben a MANO desde la prosa de la ficha, no se derivan
// del código: por eso pueden fallar por un bug real (ver scripts/mutation-check.mjs).
import { afterEach, describe, it, expect } from "vitest";
import { defineComponent, h } from "vue";
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

/** Click real en el backdrop: el navegador manda `mousedown` antes del `click`. */
async function clickBackdrop(w: ReturnType<typeof mount>) {
  await backdrop(w).trigger("mousedown");
  await backdrop(w).trigger("click");
}

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

    await clickBackdrop(w);
    await flushPromises();

    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("close")).toHaveLength(1);
  });

  it("un modal `persistent` NO se cierra por click en el backdrop ni emite close", async () => {
    const w = mount(Modal, { props: { persistent: true }, attachTo: document.body });
    vm(w).open();
    await flushPromises();

    await clickBackdrop(w);
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

  it("un click que empieza dentro del panel (arrastrar texto) no cierra al soltar en el backdrop", async () => {
    const w = mount(Modal, { attachTo: document.body, slots: { default: "<p>texto seleccionable</p>" } });
    vm(w).open();
    await flushPromises();

    // Se presiona dentro del panel y se suelta en el backdrop: el `click` cae en el
    // ancestro común (el backdrop), pero la presión no empezó ahí.
    await w.find(".cu-modal").trigger("mousedown");
    await backdrop(w).trigger("click");
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
    const title = w.find(".cu-modal-title").element as HTMLElement;
    expect(dialog.attributes("aria-labelledby")).toBe(title.id);
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

describe("Modal — cierre por Escape", () => {
  const pressEscape = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));

  it("Escape cierra el modal abierto y emite close + closed", async () => {
    const w = mount(Modal, { attachTo: document.body });
    vm(w).open();
    await flushPromises();

    pressEscape();
    await flushPromises();

    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("close")).toHaveLength(1);
    expect(w.emitted("closed")).toHaveLength(1);
  });

  it("un modal `persistent` no se cierra por Escape", async () => {
    const w = mount(Modal, { attachTo: document.body, props: { persistent: true } });
    vm(w).open();
    await flushPromises();

    pressEscape();
    await flushPromises();

    expect(vm(w).isOpen()).toBe(true);
    expect(w.emitted("close")).toBeUndefined();
  });

  it("Escape con el modal cerrado no emite nada", async () => {
    const w = mount(Modal, { attachTo: document.body });
    pressEscape();
    await flushPromises();
    expect(w.emitted("close")).toBeUndefined();
  });
});

describe("Modal — scroll de la página", () => {
  it("bloquea el scroll del body mientras está abierto y lo devuelve al cerrar", async () => {
    const previous = document.body.style.overflow;
    const w = mount(Modal, { attachTo: document.body });

    vm(w).open();
    await flushPromises();
    // El modal tapa la página: la rueda sobre el backdrop no debe mover el body.
    expect(document.body.style.overflow).toBe("hidden");

    vm(w).close();
    await flushPromises();
    expect(document.body.style.overflow).toBe(previous);
  });

  it("cerrar el modal de arriba no libera el scroll si queda otro abierto", async () => {
    const previous = document.body.style.overflow;
    const lower = mount(Modal, { attachTo: document.body });
    const top = mount(Modal, { attachTo: document.body });

    vm(lower).open();
    vm(top).open();
    await flushPromises();
    expect(document.body.style.overflow).toBe("hidden");

    vm(top).close();
    await flushPromises();
    expect(document.body.style.overflow).toBe("hidden");

    vm(lower).close();
    await flushPromises();
    expect(document.body.style.overflow).toBe(previous);
  });
});

describe("Modal — ids únicos", () => {
  it("dos modales no comparten los ids del título ni de la descripción", async () => {
    const Pair = defineComponent({
      render() {
        return h("div", [
          h(Modal, { title: "Primero", description: "uno" }),
          h(Modal, { title: "Segundo", description: "dos" }),
        ]);
      },
    });
    const w = mount(Pair, { attachTo: document.body });
    await flushPromises();

    const titles = [...document.body.querySelectorAll(".cu-modal-title")] as HTMLElement[];
    const descriptions = [
      ...document.body.querySelectorAll(".cu-modal-description"),
    ] as HTMLElement[];
    const dialogs = [...document.body.querySelectorAll("[role=dialog]")] as HTMLElement[];

    expect(titles).toHaveLength(2);
    expect(titles[0]!.id).not.toBe(titles[1]!.id);
    expect(descriptions[0]!.id).not.toBe(descriptions[1]!.id);
    // Cada diálogo se nombra con SU título: un id fijo apuntaría al del otro modal.
    expect(dialogs[0]!.getAttribute("aria-labelledby")).toBe(titles[0]!.id);
    expect(dialogs[1]!.getAttribute("aria-labelledby")).toBe(titles[1]!.id);
    expect(document.querySelectorAll(`[id="${titles[0]!.id}"]`)).toHaveLength(1);
  });
});

describe("Modal — stacking", () => {
  it("con dos modales abiertos, Tab en el de arriba no cae en el de abajo", async () => {
    const lower = mount(Modal, {
      attachTo: document.body,
      props: { title: "Abajo" },
      slots: { default: '<button class="abajo">abajo</button>' },
    });
    const top = mount(Modal, {
      attachTo: document.body,
      props: { title: "Arriba" },
      slots: { default: '<button id="t1">t1</button><button id="t2">t2</button>' },
    });
    vm(lower).open();
    await flushPromises();
    vm(top).open();
    await flushPromises();

    const t1 = top.find("#t1").element as HTMLElement;
    t1.focus();
    expect(document.activeElement).toBe(t1);

    // Sólo el overlay de arriba atiende Tab: en el medio de su lista el evento pasa
    // (el navegador va al siguiente control) y el modal de abajo no lo intercepta.
    expect(pressTab(t1).defaultPrevented).toBe(false);
    expect(document.activeElement).toBe(t1);
    expect(top.find(".cu-modal-backdrop").element.contains(document.activeElement)).toBe(true);
    expect(lower.find(".cu-modal-backdrop").element.contains(document.activeElement)).toBe(false);
  });

  it("Escape con dos modales abiertos cierra sólo el de arriba", async () => {
    const lower = mount(Modal, { attachTo: document.body });
    const top = mount(Modal, { attachTo: document.body });
    vm(lower).open();
    vm(top).open();
    await flushPromises();

    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    await flushPromises();

    expect(vm(top).isOpen()).toBe(false);
    expect(vm(lower).isOpen()).toBe(true);
  });
});

describe("Modal — desmontaje", () => {
  it("desmontar el modal abierto devuelve el foco al trigger", async () => {
    const trigger = document.createElement("button");
    trigger.textContent = "Abrir";
    document.body.appendChild(trigger);
    trigger.focus();

    // Un consumidor con `v-if` saca el modal del DOM estando abierto: el foco del
    // panel muere con el nodo, así que se devuelve igual que en un cierre normal.
    const w = mount(Modal, { attachTo: document.body });
    vm(w).open();
    await flushPromises();
    expect(document.activeElement).not.toBe(trigger);

    w.unmount();
    await flushPromises();

    expect(document.activeElement).toBe(trigger);
    trigger.remove();
  });
});
