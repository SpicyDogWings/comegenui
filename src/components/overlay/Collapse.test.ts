// Comportamiento de Collapse según su ficha (docs/componentes/vue/collapse.md).
//
// Sección colapsable con trigger (botón + chevron). Contenido oculto por
// defecto; `default-open` lo muestra al inicio. Emite `toggle` con boolean y
// expone open/close/toggle/isOpen. Aserciones escritas a mano desde la prosa.
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Collapse from "./Collapse.vue";

type CollapseVm = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as CollapseVm;
const content = (w: ReturnType<typeof mount>) => w.find(".cu-collapse-content");

describe("Collapse — estado y visibilidad", () => {
  it("arranca cerrado y oculta el contenido", () => {
    const w = mount(Collapse, { props: { label: "Más información" } });
    expect(vm(w).isOpen()).toBe(false);
    expect(content(w).attributes("style")).toContain("display: none");
  });

  it("defaultOpen arranca abierto y muestra el contenido", () => {
    const w = mount(Collapse, { props: { label: "Opciones", defaultOpen: true } });
    expect(vm(w).isOpen()).toBe(true);
    expect(content(w).attributes("style") ?? "").not.toContain("display: none");
  });

  it("renderiza el label en el trigger", () => {
    const w = mount(Collapse, { props: { label: "Mi collapse" } });
    expect(w.find(".cu-collapse-label").text()).toBe("Mi collapse");
  });

  it("renderiza el slot default como contenido", () => {
    const w = mount(Collapse, { props: { label: "L" }, slots: { default: "<p>Contenido oculto</p>" } });
    expect(content(w).text()).toContain("Contenido oculto");
  });
});

describe("Collapse — descripción del trigger", () => {
  it("renderiza la descripción como <p> bajo el label", () => {
    const w = mount(Collapse, { props: { label: "L", description: "Texto de ayuda" } });
    const desc = w.find(".cu-collapse-description");
    expect(desc.exists()).toBe(true);
    expect(desc.element.tagName).toBe("P");
    expect(desc.text()).toBe("Texto de ayuda");
  });

  it("no renderiza descripción si no se pasa", () => {
    const w = mount(Collapse, { props: { label: "L" } });
    expect(w.find(".cu-collapse-description").exists()).toBe(false);
  });
});

describe("Collapse — control programático", () => {
  it("open()/close()/toggle() controlan isOpen()", async () => {
    const w = mount(Collapse, { props: { label: "L" } });

    vm(w).open();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
    expect(content(w).attributes("style") ?? "").not.toContain("display: none");

    vm(w).close();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(content(w).attributes("style")).toContain("display: none");

    vm(w).toggle();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
  });
});

describe("Collapse — evento toggle", () => {
  it("click en el trigger alterna y emite toggle con el nuevo estado", async () => {
    const w = mount(Collapse, { props: { label: "L" } });
    await w.find(".cu-collapse-trigger").trigger("click");
    await flushPromises();

    expect(vm(w).isOpen()).toBe(true);
    expect(w.emitted("toggle")).toEqual([[true]]);

    await w.find(".cu-collapse-trigger").trigger("click");
    await flushPromises();
    expect(w.emitted("toggle")).toEqual([[true], [false]]);
  });

  it("no emite toggle si el estado no cambia (open() sobre abierto)", async () => {
    const w = mount(Collapse, { props: { label: "L", defaultOpen: true } });
    vm(w).open();
    await flushPromises();
    expect(w.emitted("toggle")).toBeUndefined();
  });

  it("marca el chevron como is-open cuando está abierto", async () => {
    const w = mount(Collapse, { props: { label: "L" } });
    expect(w.find(".cu-collapse-chevron").classes()).not.toContain("is-open");

    vm(w).open();
    await flushPromises();
    expect(w.find(".cu-collapse-chevron").classes()).toContain("is-open");
  });
});

describe("Collapse — disabled", () => {
  it("deshabilita el botón del trigger", () => {
    const w = mount(Collapse, { props: { label: "L", disabled: true } });
    expect(w.find(".cu-collapse-trigger").attributes("disabled")).toBeDefined();
  });

  it("no alterna al clickear el trigger y no emite toggle", async () => {
    const w = mount(Collapse, { props: { label: "L", disabled: true } });
    await w.find(".cu-collapse-trigger").trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("toggle")).toBeUndefined();
  });

  it("toggle() es no-op con disabled y no emite toggle", async () => {
    const w = mount(Collapse, { props: { label: "L", disabled: true } });
    vm(w).toggle();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("toggle")).toBeUndefined();
  });

  it("open() es no-op con disabled", async () => {
    const w = mount(Collapse, { props: { label: "L", disabled: true } });
    vm(w).open();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
  });
});
