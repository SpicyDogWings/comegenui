// Comportamiento de Tabs según su ficha (docs/componentes/vue/tabs.md).
//
// Aserciones escritas a MANO desde la prosa de la ficha (variantes, iconos,
// tabs deshabilitadas individuales y control programático).
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Tabs from "./Tabs.vue";

type TabsVm = {
  getActive: () => string;
  setActive: (key: string) => void;
  next: () => void;
  prev: () => void;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as TabsVm;
const tabEls = (w: ReturnType<typeof mount>) => w.findAll(".cu-tabs-tab");
const tab = (w: ReturnType<typeof mount>, label: string) =>
  tabEls(w).find((t) => t.text().trim() === label)!;

const tabs = [
  { key: "first", label: "First" },
  { key: "second", label: "Second" },
  { key: "third", label: "Third" },
];

describe("Tabs — estado activo", () => {
  it("sin v-model arranca en la primera tab habilitada", () => {
    const w = mount(Tabs, { props: { tabs } });
    expect(vm(w).getActive()).toBe("first");
    expect(tab(w, "First").classes()).toContain("cu-tabs-tab--active");
  });

  it("click en otra tab actualiza el activo y emite change", async () => {
    const w = mount(Tabs, { props: { tabs } });
    await tab(w, "Second").trigger("click");
    expect(vm(w).getActive()).toBe("second");
    expect(w.emitted("change")).toEqual([["second"]]);
    expect(tab(w, "Second").classes()).toContain("cu-tabs-tab--active");
  });

  it("v-model (modelValue) controla el tab activo", async () => {
    const w = mount(Tabs, { props: { tabs, modelValue: "third" } });
    await flushPromises();
    expect(vm(w).getActive()).toBe("third");
    expect(tab(w, "Third").classes()).toContain("cu-tabs-tab--active");
    // Al clickear emite update:modelValue con la nueva clave.
    await tab(w, "First").trigger("click");
    expect(w.emitted("update:modelValue")).toEqual([["first"]]);
  });

  it("un modelValue inválido cae a la primera tab habilitada", () => {
    const w = mount(Tabs, { props: { tabs, modelValue: "no-existe" } });
    expect(vm(w).getActive()).toBe("first");
  });
});

describe("Tabs — control programático (expose)", () => {
  it("`setActive()` activa la tab con esa clave", async () => {
    const w = mount(Tabs, { props: { tabs } });
    vm(w).setActive("second");
    await flushPromises();
    expect(vm(w).getActive()).toBe("second");
  });

  it("`next()`/`prev()` avanzan y retroceden entre tabs", async () => {
    const w = mount(Tabs, { props: { tabs } });
    vm(w).next();
    await flushPromises();
    expect(vm(w).getActive()).toBe("second");

    vm(w).prev();
    await flushPromises();
    expect(vm(w).getActive()).toBe("first");
  });

  it("`next()` desde la última vuelve a la primera (cicla)", async () => {
    const w = mount(Tabs, { props: { tabs, modelValue: "third" } });
    await flushPromises();
    vm(w).next();
    await flushPromises();
    expect(vm(w).getActive()).toBe("first");
  });
});

describe("Tabs — tabs deshabilitadas", () => {
  const withDisabled = [
    { key: "a", label: "A" },
    { key: "b", label: "B", disabled: true },
    { key: "c", label: "C" },
  ];

  it("una tab con `disabled` tiene el atributo disabled y no se activa al clickear", async () => {
    const w = mount(Tabs, { props: { tabs: withDisabled } });
    expect(tab(w, "B").attributes("disabled")).toBeDefined();

    await tab(w, "B").trigger("click");
    expect(vm(w).getActive()).toBe("a");
    expect(w.emitted("change")).toBeUndefined();
  });

  it("`setActive()` a una tab deshabilitada no la activa", async () => {
    const w = mount(Tabs, { props: { tabs: withDisabled } });
    vm(w).setActive("b");
    await flushPromises();
    expect(vm(w).getActive()).toBe("a");
  });

  it("la navegación saltea las tabs deshabilitadas", async () => {
    const w = mount(Tabs, { props: { tabs: withDisabled } });
    vm(w).next();
    await flushPromises();
    expect(vm(w).getActive()).toBe("c");

    vm(w).prev();
    await flushPromises();
    expect(vm(w).getActive()).toBe("a");
  });

  it("con `disabled` global no se activa ninguna otra tab", async () => {
    const w = mount(Tabs, { props: { tabs, disabled: true } });
    await tab(w, "Second").trigger("click");
    expect(vm(w).getActive()).toBe("first");
  });
});

describe("Tabs — teclado y accesibilidad", () => {
  it("ArrowRight/ArrowLeft cambian de tab", async () => {
    const w = mount(Tabs, { props: { tabs } });
    await w.find(".cu-tabs-header").trigger("keydown", { key: "ArrowRight" });
    expect(vm(w).getActive()).toBe("second");

    await w.find(".cu-tabs-header").trigger("keydown", { key: "ArrowLeft" });
    expect(vm(w).getActive()).toBe("first");
  });

  it("Home y End van al primero y al último habilitado", async () => {
    const w = mount(Tabs, { props: { tabs } });
    await w.find(".cu-tabs-header").trigger("keydown", { key: "End" });
    expect(vm(w).getActive()).toBe("third");

    await w.find(".cu-tabs-header").trigger("keydown", { key: "Home" });
    expect(vm(w).getActive()).toBe("first");
  });

  it("marca roles ARIA: tablist, tab, tabpanel y aria-selected", () => {
    const w = mount(Tabs, { props: { tabs } });
    expect(w.find('[role="tablist"]').exists()).toBe(true);
    expect(tabEls(w)).toHaveLength(3);
    expect(tab(w, "First").attributes("aria-selected")).toBe("true");
    expect(tab(w, "Second").attributes("aria-selected")).toBe("false");
    expect(w.find('[role="tabpanel"]').exists()).toBe(true);
  });
});

describe("Tabs — paneles y variantes", () => {
  it("solo el panel activo se renderiza (v-if) y usa el slot de su key", async () => {
    const w = mount(Tabs, {
      props: { tabs },
      slots: {
        first: '<span class="panel-first">Uno</span>',
        second: '<span class="panel-second">Dos</span>',
      },
    });
    expect(w.find(".panel-first").exists()).toBe(true);
    expect(w.find(".panel-second").exists()).toBe(false);

    await tab(w, "Second").trigger("click");
    expect(w.find(".panel-second").exists()).toBe(true);
    expect(w.find(".panel-first").exists()).toBe(false);
  });

  it("una tab con `keepAlive` se mantiene montada y se oculta con v-show", async () => {
    const w = mount(Tabs, {
      props: {
        tabs: [
          { key: "a", label: "A" },
          { key: "b", label: "B", keepAlive: true },
        ],
      },
      slots: { b: '<span class="panel-b">B</span>' },
    });
    // El panel keepAlive está montado aunque no esté activo, pero oculto.
    expect(w.find(".panel-b").exists()).toBe(true);
    const hidden = w.find("#cu-tabs-panel-b");
    expect(hidden.attributes("style")).toContain("display: none");
  });

  it("aplica las clases de variante y tamaño", () => {
    const w = mount(Tabs, { props: { tabs, variant: "boxed", size: "lg" } });
    const root = w.find(".cu-tabs");
    expect(root.classes()).toContain("cu-tabs--boxed");
    expect(root.classes()).toContain("cu-tabs--lg");
  });
});
