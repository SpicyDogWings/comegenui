import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Tabs from "./Tabs.vue";

const tabs = [
  { key: "a", label: "Tab A" },
  { key: "b", label: "Tab B" },
  { key: "c", label: "Tab C", disabled: true },
];

type TabsVm = {
  getActive: () => string;
  setActive: (key: string) => void;
  next: () => void;
  prev: () => void;
};

function factory(props: any = {}, slots: any = {}) {
  return mount(Tabs, { props: { tabs, ...props }, slots });
}

function vmOf(w: ReturnType<typeof factory>) {
  return w.vm as unknown as TabsVm;
}

describe("Tabs — pestañas", () => {
  it("render smoke: tabs renderizadas, primera activa y panel con slot", () => {
    const w = factory({}, { a: "<p>Contenido A</p>" });
    const btns = w.findAll(".cu-tabs-tab");
    expect(btns.length).toBe(3);
    expect(btns[0]!.classes()).toContain("cu-tabs-tab--active");
    expect(btns[0]!.attributes("aria-selected")).toBe("true");
    expect((btns[2]!.element as HTMLButtonElement).disabled).toBe(true);
    expect(w.find("#cu-tabs-panel-a").exists()).toBe(true);
    expect(w.find(".cu-tabs-panel").text()).toContain("Contenido A");
  });

  it("click en otra tab la activa y emite update:modelValue + change", async () => {
    const w = factory();
    const btns = w.findAll(".cu-tabs-tab");
    await btns[1]!.trigger("click");
    expect(btns[1]!.classes()).toContain("cu-tabs-tab--active");
    const mv = w.emitted("update:modelValue");
    expect(mv).toBeTruthy();
    expect((mv as unknown[][])[0]![0] as string).toBe("b");
    const ch = w.emitted("change");
    expect(ch).toBeTruthy();
    expect((ch as unknown[][])[0]![0] as string).toBe("b");
  });

  it("click en la tab activa no emite nada", async () => {
    const w = factory();
    await w.findAll(".cu-tabs-tab")[0]!.trigger("click");
    expect(w.emitted("change")).toBeUndefined();
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });

  it("click en tab disabled no cambia la activa ni emite", async () => {
    const w = factory();
    const btns = w.findAll(".cu-tabs-tab");
    await btns[2]!.trigger("click");
    expect(btns[0]!.classes()).toContain("cu-tabs-tab--active");
    expect(w.emitted("change")).toBeUndefined();
  });

  it("modelValue inicial define la tab activa", () => {
    const w = factory({ modelValue: "b" });
    const btns = w.findAll(".cu-tabs-tab");
    expect(btns[1]!.classes()).toContain("cu-tabs-tab--active");
    expect(vmOf(w).getActive()).toBe("b");
  });

  it("teclado: ArrowRight mueve a la siguiente tab no disabled", async () => {
    const w = factory();
    await w.find(".cu-tabs-header").trigger("keydown", { key: "ArrowRight" });
    const btns = w.findAll(".cu-tabs-tab");
    expect(btns[1]!.classes()).toContain("cu-tabs-tab--active");
    const ch = w.emitted("change");
    expect(ch).toBeTruthy();
    expect((ch as unknown[][])[0]![0] as string).toBe("b");
  });

  it("teclado: ArrowLeft desde la segunda vuelve a la primera", async () => {
    const w = factory({ modelValue: "b" });
    await w.find(".cu-tabs-header").trigger("keydown", { key: "ArrowLeft" });
    expect(vmOf(w).getActive()).toBe("a");
  });

  it("disabled global: no permite cambiar de tab ni emite", async () => {
    const w = factory({ disabled: true });
    await w.findAll(".cu-tabs-tab")[1]!.trigger("click");
    expect(vmOf(w).getActive()).toBe("a");
    expect(w.emitted("change")).toBeUndefined();
  });

  it("exposed: setActive cambia la tab activa y emite change", () => {
    const w = factory();
    vmOf(w).setActive("b");
    expect(vmOf(w).getActive()).toBe("b");
    const ch = w.emitted("change");
    expect(ch).toBeTruthy();
    expect((ch as unknown[][])[0]![0] as string).toBe("b");
  });

  it("keepAlive: el panel se mantiene montado (v-show) y conserva su contenido al volver", async () => {
    const w = mount(Tabs, {
      props: {
        tabs: [
          { key: "a", label: "Tab A" },
          { key: "b", label: "Tab B", keepAlive: true },
        ],
      },
      slots: { a: "<p>Contenido A</p>", b: "<p class='state-b'>Estado B</p>" },
    });
    // Nota: se aserta el style inline (no getComputedStyle/isVisible) porque
    // jsdom cachea el computed style del elemento y no refleja las mutaciones
    // de v-show después de la primera lectura.
    // keepAlive monta su panel desde el inicio, oculto si no está activo
    const panelBInicial = w.find("#cu-tabs-panel-b");
    expect(panelBInicial.exists()).toBe(true);
    expect(panelBInicial.attributes("style")).toContain("display: none");

    // activar b y volver a a
    await w.findAll(".cu-tabs-tab")[1]!.trigger("click");
    const panelBVisible = w.find("#cu-tabs-panel-b");
    expect(panelBVisible.attributes("style") ?? "").not.toContain("display: none");
    await w.findAll(".cu-tabs-tab")[0]!.trigger("click");

    // el panel b sigue montado, solo oculto → estado preservado
    const panelB = w.find("#cu-tabs-panel-b");
    expect(panelB.exists()).toBe(true);
    expect(panelB.attributes("style")).toContain("display: none");
    expect(panelB.text()).toContain("Estado B");
    const panelA = w.find("#cu-tabs-panel-a");
    expect(panelA.attributes("style") ?? "").not.toContain("display: none");
  });

  it("default (sin keepAlive): el panel se destruye al cambiar de tab", async () => {
    const w = factory({}, { a: "<p>A</p>", b: "<p>B</p>" });
    await w.findAll(".cu-tabs-tab")[1]!.trigger("click");
    expect(w.find("#cu-tabs-panel-b").exists()).toBe(true);
    await w.findAll(".cu-tabs-tab")[0]!.trigger("click");
    expect(w.find("#cu-tabs-panel-b").exists()).toBe(false);
  });

  it("icon: la prop icon se renderiza y tiene precedencia sobre el slot", () => {
    const w = mount(Tabs, {
      props: { tabs: [{ key: "a", label: "Tab A", icon: "<b class='icon-prop'>I</b>" }] },
      slots: { "tab-icon-a": "<i class='icon-slot'>SLOT</i>" },
    });
    expect(w.find(".cu-tabs-tab-icon").exists()).toBe(true);
    expect(w.find(".icon-prop").exists()).toBe(true);
    expect(w.find(".icon-slot").exists()).toBe(false);
    expect(w.find(".cu-tabs-tab").text()).toContain("Tab A");
  });

  it("icon: sin prop, el slot tab-icon-{key} sigue funcionando (fallback)", () => {
    const w = mount(Tabs, {
      props: { tabs: [{ key: "a", label: "Tab A" }] },
      slots: { "tab-icon-a": "<i class='icon-slot'>SLOT</i>" },
    });
    expect(w.find(".cu-tabs-tab-icon").exists()).toBe(false);
    expect(w.find(".icon-slot").exists()).toBe(true);
  });
});
