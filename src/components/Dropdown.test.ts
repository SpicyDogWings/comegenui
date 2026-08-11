import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import Dropdown from "./Dropdown.vue";

type DropdownVm = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  get: () => string;
  set: (v: string) => void;
  isOpen: () => boolean;
};

function factory(props: any = {}, slots: any = {}) {
  return mount(Dropdown, { props, slots });
}

function vmOf(w: ReturnType<typeof factory>) {
  return w.vm as unknown as DropdownVm;
}

describe("Dropdown — motor genérico toggle + panel", () => {
  it("render smoke: botón toggle por defecto y panel cerrado", () => {
    const w = factory();
    expect(w.find(".cu-dropdown").exists()).toBe(true);
    const btn = w.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.text()).toContain("Dropdown");
    expect(w.find(".cu-dropdown-panel").exists()).toBe(false);
    expect(w.find('[role="menu"]').exists()).toBe(false);
    expect(vmOf(w).isOpen()).toBe(false);
  });

  it("click en el toggle abre el panel y emite open", async () => {
    const w = factory();
    await w.find("button").trigger("click");
    expect(w.find(".cu-dropdown-panel").exists()).toBe(true);
    expect(w.find('[role="menu"]').exists()).toBe(true);
    expect(vmOf(w).isOpen()).toBe(true);
    expect(w.emitted("open")).toBeTruthy();
    w.unmount();
  });

  it("segundo click cierra el panel y emite close", async () => {
    const w = factory();
    await w.find("button").trigger("click");
    await w.find("button").trigger("click");
    expect(w.find(".cu-dropdown-panel").exists()).toBe(false);
    expect(vmOf(w).isOpen()).toBe(false);
    expect(w.emitted("close")).toBeTruthy();
    w.unmount();
  });

  it("Escape cierra el panel abierto y emite close", async () => {
    const w = factory();
    await w.find("button").trigger("click");
    expect(vmOf(w).isOpen()).toBe(true);
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
    expect(vmOf(w).isOpen()).toBe(false);
    await nextTick();
    expect(w.find(".cu-dropdown-panel").exists()).toBe(false);
    expect(w.emitted("close")).toBeTruthy();
    w.unmount();
  });

  it("click dentro del panel no lo cierra y los items del slot se renderizan", async () => {
    const w = factory({}, { default: `<button class="item">Opción</button>` });
    await w.find("button").trigger("click");
    const item = w.find(".item");
    expect(item.exists()).toBe(true);
    await item.trigger("click");
    expect(vmOf(w).isOpen()).toBe(true);
    w.unmount();
  });

  it("prop label: muestra el texto del label en el toggle", () => {
    const w = factory({ label: "Acciones" });
    expect(w.find("button").text()).toContain("Acciones");
  });

  it("disabled: el click no abre el panel ni emite open", async () => {
    const w = factory({ disabled: true });
    await w.find("button").trigger("click");
    expect(vmOf(w).isOpen()).toBe(false);
    expect(w.find(".cu-dropdown-panel").exists()).toBe(false);
    expect(w.emitted("open")).toBeUndefined();
  });

  it("v-model: get/set sobre selectedValue emite update:modelValue", () => {
    const w = factory({ modelValue: "inicial" });
    expect(vmOf(w).get()).toBe("inicial");
    vmOf(w).set("nuevo");
    const em = w.emitted("update:modelValue");
    expect(em).toBeTruthy();
    expect((em as unknown[][])[0]![0] as string).toBe("nuevo");
  });

  it("slot toggle personalizado recibe la fn toggle y controla el panel", async () => {
    const w = factory({}, { toggle: `<button id="custom" @click="toggle">Custom</button>` });
    await w.find("#custom").trigger("click");
    expect(w.find(".cu-dropdown-panel").exists()).toBe(true);
    w.unmount();
  });
});
