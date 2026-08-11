import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import Modal from "./Modal.vue";

function factory(props: Record<string, any> = {}) {
  return mount(Modal, {
    props: { title: "Confirmar", ...props },
    slots: { default: "<p class='modal-body-content'>Cuerpo del modal</p>" },
    global: { stubs: { teleport: true } },
  });
}

const isOpen = (w: ReturnType<typeof factory>) => (w.vm as any).isOpen() as boolean;

describe("Modal", () => {
  it("cerrado: isOpen=false y el backdrop no es visible", () => {
    const w = factory();
    expect(isOpen(w)).toBe(false);
    expect(w.find(".cu-modal-backdrop").isVisible()).toBe(false);
  });

  it("open(): muestra el contenido y emite opened", async () => {
    const w = factory();
    (w.vm as any).open();
    await flushPromises();

    expect(isOpen(w)).toBe(true);
    expect(w.find(".cu-modal-backdrop").isVisible()).toBe(true);
    expect(w.find(".modal-body-content").text()).toBe("Cuerpo del modal");
    expect(w.emitted("opened")).toBeTruthy();
  });

  it("el botón X (close) cierra y emite closed + close", async () => {
    const w = factory();
    (w.vm as any).open();
    await flushPromises();

    await w.find(".cu-modal-close").trigger("click");
    await flushPromises();

    expect(isOpen(w)).toBe(false);
    expect(w.find(".cu-modal-backdrop").isVisible()).toBe(false);
    expect(w.emitted("closed")).toBeTruthy();
    expect(w.emitted("close")).toBeTruthy();
  });

  it("footer por defecto (no persistent): Cerrar emite close", async () => {
    const w = factory();
    (w.vm as any).open();
    await flushPromises();

    const cerrar = w.findAll("button.cu-button").find((b) => b.text() === "Cerrar");
    expect(cerrar).toBeTruthy();
    await cerrar!.trigger("click");
    await flushPromises();

    expect(isOpen(w)).toBe(false);
    expect(w.emitted("close")).toBeTruthy();
  });

  it("persistent: no hay X, footer Aceptar/Cancelar emiten accept/cancel", async () => {
    const w = factory({ persistent: true });
    (w.vm as any).open();
    await flushPromises();

    expect(w.find(".cu-modal-close").exists()).toBe(false);

    const buttons = w.findAll("button.cu-button");
    const aceptar = buttons.find((b) => b.text() === "Aceptar");
    const cancelar = buttons.find((b) => b.text() === "Cancelar");
    expect(aceptar).toBeTruthy();
    expect(cancelar).toBeTruthy();

    await aceptar!.trigger("click");
    await flushPromises();
    expect(w.emitted("accept")).toBeTruthy();
    expect(isOpen(w)).toBe(false);

    (w.vm as any).open();
    await flushPromises();
    await cancelar!.trigger("click");
    await flushPromises();
    expect(w.emitted("cancel")).toBeTruthy();
    expect(isOpen(w)).toBe(false);
  });

  it("renderiza title y description", () => {
    const w = factory({ title: "Título del modal", description: "Descripción del modal" });
    expect(w.find(".cu-modal-title").text()).toBe("Título del modal");
    expect(w.find(".cu-modal-description").text()).toBe("Descripción del modal");
    expect(w.find(".cu-modal").attributes("data-size")).toBe("auto");
  });
});
