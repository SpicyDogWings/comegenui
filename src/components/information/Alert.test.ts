// Comportamiento de Alert según su ficha (docs/componentes/vue/alert.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Alert from "./Alert.vue";

type AlertVm = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as AlertVm;
const root = (w: ReturnType<typeof mount>) => w.find(".cu-alert");

describe("Alert — visibilidad (show / programática)", () => {
  it("arranca visible por default (show = true)", () => {
    const w = mount(Alert);
    expect(vm(w).isOpen()).toBe(true);
    expect(root(w).attributes("style") ?? "").not.toContain("display: none");
  });

  it("`show: false` la oculta", async () => {
    const w = mount(Alert, { props: { show: false } });
    await flushPromises();
    expect(root(w).attributes("style")).toContain("display: none");
  });

  it("`close()` la oculta y emite `close`", async () => {
    const w = mount(Alert);
    vm(w).close();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(root(w).attributes("style")).toContain("display: none");
    expect(w.emitted("close")).toHaveLength(1);
  });

  it("`open()` la vuelve a mostrar y emite `open`", async () => {
    const w = mount(Alert, { props: { show: false } });
    await flushPromises();
    vm(w).open();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
    expect(w.emitted("open")).toHaveLength(1);
  });

  it("`toggle()` alterna y emite open/close", async () => {
    const w = mount(Alert);
    vm(w).toggle();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
    expect(w.emitted("close")).toHaveLength(1);

    vm(w).toggle();
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
    expect(w.emitted("open")).toHaveLength(1);
  });

  it("emitir `update:show` cuando cambia el estado interno", async () => {
    const w = mount(Alert);
    vm(w).close();
    await flushPromises();
    expect(w.emitted("update:show")?.at(-1)).toEqual([false]);
  });
});

describe("Alert — botón de cerrar", () => {
  it("el botón solo aparece con `close`", () => {
    expect(mount(Alert).find(".cu-alert-close").exists()).toBe(false);
    expect(mount(Alert, { props: { close: true } }).find(".cu-alert-close").exists()).toBe(true);
  });

  it("click en el botón oculta la alerta", async () => {
    const w = mount(Alert, { props: { close: true } });
    await w.find(".cu-alert-close").trigger("click");
    await flushPromises();

    expect(vm(w).isOpen()).toBe(false);
    expect(root(w).attributes("style")).toContain("display: none");
  });
});

describe("Alert — contenido", () => {
  it("renderiza el título y el contenido del slot default", () => {
    const w = mount(Alert, { props: { title: "Atención" }, slots: { default: "Cuidado" } });
    expect(w.find(".cu-alert-title-text").text()).toBe("Atención");
    expect(w.find(".cu-alert-content").text()).toContain("Cuidado");
  });

  it("aplica la clase de variante al contenedor", () => {
    const w = mount(Alert, { props: { variant: "solid" } });
    expect(root(w).classes()).toContain("cu-alert--solid");
  });
});
