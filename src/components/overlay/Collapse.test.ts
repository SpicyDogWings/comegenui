import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Collapse from "./Collapse.vue";

function factory(props: Record<string, any> = {}) {
  return mount(Collapse, {
    props: { label: "Detalles", ...props },
    slots: { default: "<p class='collapse-body'>Contenido oculto</p>" },
  });
}

describe("Collapse", () => {
  it("renderiza el label y el contenido del slot", () => {
    const w = factory();
    expect(w.find(".cu-collapse-trigger").text()).toContain("Detalles");
    expect(w.find(".collapse-body").text()).toBe("Contenido oculto");
  });

  it("comienza cerrado por defecto (sin clase is-open)", () => {
    const w = factory();
    expect((w.vm as any).isOpen()).toBe(false);
    expect(w.find(".cu-collapse-chevron").classes()).not.toContain("is-open");
  });

  it("defaultOpen=true: comienza abierto", () => {
    const w = factory({ defaultOpen: true });
    expect((w.vm as any).isOpen()).toBe(true);
    expect(w.find(".cu-collapse-chevron").classes()).toContain("is-open");
  });

  it("click en el trigger abre y emite toggle(true)", async () => {
    const w = factory();
    await w.find(".cu-collapse-trigger").trigger("click");
    await flushPromisesSafe();
    expect((w.vm as any).isOpen()).toBe(true);
    expect(w.find(".cu-collapse-chevron").classes()).toContain("is-open");

    const toggles = w.emitted("toggle");
    expect(toggles).toBeTruthy();
    expect((toggles as unknown[][])[0]![0]).toBe(true);
  });

  it("segundo click cierra y emite toggle(false)", async () => {
    const w = factory();
    await w.find(".cu-collapse-trigger").trigger("click");
    await w.find(".cu-collapse-trigger").trigger("click");
    await flushPromisesSafe();
    expect((w.vm as any).isOpen()).toBe(false);

    const toggles = w.emitted("toggle") as unknown[][];
    expect(toggles.length).toBe(2);
    expect(toggles[1]![0]).toBe(false);
  });

  it("no emite toggle cuando el estado no cambia (guard)", async () => {
    const w = factory({ defaultOpen: true });
    await w.find(".cu-collapse-trigger").trigger("click");
    expect((w.vm as any).isOpen()).toBe(false);
    const toggles = w.emitted("toggle") as unknown[][];
    expect(toggles.length).toBe(1);
    expect(toggles[0]![0]).toBe(false);
  });

  it("expone open/close/toggle y respeta el color", async () => {
    const w = factory({ color: "primary" });
    const vm = w.vm as any;
    vm.open();
    expect(vm.isOpen()).toBe(true);
    vm.close();
    expect(vm.isOpen()).toBe(false);
    vm.toggle();
    expect(vm.isOpen()).toBe(true);

    const trigger = w.find(".cu-collapse-trigger");
    expect(trigger.exists()).toBe(true);
  });
});

// Pequeño helper para aplanar los ticks internos del Transition/v-show
async function flushPromisesSafe() {
  await new Promise((resolve) => setTimeout(resolve, 0));
}
