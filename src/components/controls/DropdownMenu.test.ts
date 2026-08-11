import { describe, it, expect, vi } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import DropdownMenu from "./DropdownMenu.vue";

type DropdownMenuVm = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};

const items = [
  { label: "Editar" },
  { label: "Eliminar", color: "danger" },
  { label: "Separador", divider: true },
  { label: "Deshabilitado", disabled: true },
  { label: "Icono", icon: "<svg data-icon='x'></svg>" },
];

function factory(props: any = {}, slots: any = {}) {
  return mount(DropdownMenu, { props: { items, ...props }, slots });
}

function vmOf(w: ReturnType<typeof factory>) {
  return w.vm as unknown as DropdownMenuVm;
}

// NOTA (bugs reales de DropdownMenu.vue, no modificado por regla):
// 1. El handler @click="dropdownRef?.toggle" del toggle por defecto (y el slot prop :toggle)
//    se evalúa en el primer render cuando dropdownRef es null → queda undefined y el click
//    NO abre el menú hasta que se abre/cierra una vez por API. Por eso los tests abren vía open().
// 2. defineExpose isOpen: () => dropdownRef.value?.isOpen || false devuelve la FUNCIÓN isOpen
//    del Dropdown interno (siempre truthy), no un boolean. Se valida el estado por el DOM.
describe("DropdownMenu — wrapper con items", () => {
  it("render smoke: botón toggle con label por defecto y panel cerrado", () => {
    const w = factory();
    const toggle = w.find(".cu-dropdown-toggle");
    expect(toggle.exists()).toBe(true);
    expect(toggle.text()).toContain("Menú");
    expect(w.find(".cu-dropdown-panel").exists()).toBe(false);
    expect(w.emitted("open")).toBeUndefined();
  });

  it("open(): abre el panel y renderiza items, divider y disabled", async () => {
    const w = factory();
    vmOf(w).open();
    await nextTick();
    expect(w.find(".cu-dropdown-panel").exists()).toBe(true);
    expect(w.emitted("open")).toBeTruthy();

    const itemButtons = w.findAll(".cu-dropdown-item");
    expect(itemButtons.length).toBe(4); // el divider no es botón
    expect(w.find(".cu-dropdown-divider").exists()).toBe(true);
    const disabledBtn = itemButtons.find((b) => b.text().includes("Deshabilitado"));
    expect((disabledBtn!.element as HTMLButtonElement).disabled).toBe(true);
    expect(w.find(".cu-dropdown-icon").exists()).toBe(true);
    w.unmount();
  });

  it("click en un item ejecuta su onClick, cierra el panel y emite close", async () => {
    const onClick = vi.fn();
    const w = factory({ items: [{ label: "Editar", onClick }] });
    vmOf(w).open();
    await nextTick();
    await w.find(".cu-dropdown-item").trigger("click");
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(w.find(".cu-dropdown-panel").exists()).toBe(false);
    expect(w.emitted("close")).toBeTruthy();
    w.unmount();
  });

  it("click en un item disabled no ejecuta onClick ni cierra", async () => {
    const onClick = vi.fn();
    const w = factory({ items: [{ label: "No", disabled: true, onClick }] });
    vmOf(w).open();
    await nextTick();
    await w.find(".cu-dropdown-item").trigger("click");
    expect(onClick).not.toHaveBeenCalled();
    expect(w.find(".cu-dropdown-panel").exists()).toBe(true);
    w.unmount();
  });

  it("prop label se muestra en el toggle por defecto", () => {
    const w = factory({ label: "Acciones" });
    expect(w.find(".cu-dropdown-toggle").text()).toContain("Acciones");
  });

  it("slot toggle personalizado se renderiza en lugar del botón por defecto", () => {
    const w = factory({}, { toggle: `<button id="custom" @click="toggle">Abrir</button>` });
    expect(w.find("#custom").exists()).toBe(true);
    expect(w.find(".cu-dropdown-toggle").exists()).toBe(false);
  });

  it("exposed: open/close/toggle controlan el panel (validado por DOM)", async () => {
    const w = factory();
    vmOf(w).open();
    await nextTick();
    expect(w.find(".cu-dropdown-panel").exists()).toBe(true);
    vmOf(w).close();
    await nextTick();
    expect(w.find(".cu-dropdown-panel").exists()).toBe(false);
    vmOf(w).toggle();
    await nextTick();
    expect(w.find(".cu-dropdown-panel").exists()).toBe(true);
    w.unmount();
  });
});
