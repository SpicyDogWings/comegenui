// Comportamiento de Switch según su ficha (docs/componentes/vue/switch.md).
//
// Aserciones escritas a mano desde la prosa: fallan por bugs reales.
import { describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Switch from "./Switch.vue";

type SwitchVm = {
  get: () => boolean;
  set: (v: boolean) => void;
  reset: () => void;
  focus: () => void;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as SwitchVm;
const input = (w: ReturnType<typeof mount>) => w.find("input.cu-switch-input");
const track = (w: ReturnType<typeof mount>) => w.find(".cu-switch-track");

describe("Switch — estado y v-model", () => {
  it("arranca apagado y el click en el input lo prende y emite update:modelValue + change", async () => {
    const w = mount(Switch);
    expect(vm(w).get()).toBe(false);

    await input(w).setValue(true);
    await flushPromises();

    expect(vm(w).get()).toBe(true);
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([true]);
    expect(w.emitted("change")?.at(-1)).toEqual([true]);
    expect(track(w).classes()).toContain("cu-switch--checked");
  });

  it("el control accesible es el input nativo: role=switch y aria-checked", async () => {
    const w = mount(Switch, { props: { modelValue: true } });
    await flushPromises();
    expect(vm(w).get()).toBe(true);
    expect(input(w).attributes("role")).toBe("switch");
    expect(input(w).attributes("aria-checked")).toBe("true");
    expect(track(w).attributes("role")).toBeUndefined();
    expect(track(w).attributes("aria-checked")).toBeUndefined();
  });

  it("set() cambia el estado y emite change", async () => {
    const w = mount(Switch);
    vm(w).set(true);
    await flushPromises();

    expect(vm(w).get()).toBe(true);
    expect(w.emitted("change")?.at(-1)).toEqual([true]);
  });

  it("reset() apaga el switch y emite change(false)", async () => {
    const w = mount(Switch, { props: { modelValue: true } });
    await flushPromises();

    vm(w).reset();
    await flushPromises();

    expect(vm(w).get()).toBe(false);
    expect(w.emitted("change")?.at(-1)).toEqual([false]);
  });

  it("estando disabled, el toggle no cambia el estado", async () => {
    const w = mount(Switch, { props: { disabled: true } });
    await input(w).setValue(true);
    await flushPromises();

    expect(vm(w).get()).toBe(false);
    expect(w.emitted("change")).toBeUndefined();
    expect(input(w).attributes("disabled")).toBeDefined();
  });
});

describe("Switch — label, slot y tamaños", () => {
  it("muestra el label por prop o el contenido del slot default", () => {
    expect(mount(Switch, { props: { label: "Activo" } }).find(".cu-switch-label").text()).toBe(
      "Activo",
    );
    const withSlot = mount(Switch, { slots: { default: "Desde slot" } });
    expect(withSlot.find(".cu-switch-label").text()).toBe("Desde slot");
  });

  it("aplica las clases de tamaño y disabled", () => {
    const w = mount(Switch, { props: { size: "sm", disabled: true } });
    expect(w.find(".cu-switch").classes()).toContain("cu-switch--sm");
    expect(w.find(".cu-switch").classes()).toContain("cu-switch--disabled");
  });
});

describe("Switch — posición del label", () => {
  const root = (w: ReturnType<typeof mount>) => w.find(".cu-switch");

  it("por defecto el label va después del track (end)", () => {
    const w = mount(Switch, { props: { label: "Activo" } });
    expect(root(w).classes()).toContain("cu-switch--label-end");
    expect(root(w).classes()).not.toContain("cu-switch--label-start");
  });

  it("labelPosition='start' aplica la clase que pone el label antes del track", () => {
    const w = mount(Switch, { props: { label: "Activo", labelPosition: "start" } });
    expect(root(w).classes()).toContain("cu-switch--label-start");
    expect(root(w).classes()).not.toContain("cu-switch--label-end");
  });

  it("con labelPosition='start' el click en el label sigue alternando el switch", async () => {
    const w = mount(Switch, {
      props: { label: "Activo", labelPosition: "start" },
      attachTo: document.body,
    });

    await w.find(".cu-switch-label").trigger("click");
    await flushPromises();

    expect(vm(w).get()).toBe(true);
    expect(w.emitted("change")?.at(-1)).toEqual([true]);
    w.unmount();
  });

  it("un labelPosition inválido no rompe el render y cae al layout por defecto", () => {
    const w = mount(Switch, {
      props: { label: "Activo", labelPosition: "middle" as unknown as "end" },
    });
    expect(root(w).classes()).not.toContain("cu-switch--label-start");
    expect(w.find(".cu-switch-label").text()).toBe("Activo");
  });
});

describe("Switch — teclado y clic en el track", () => {
  it("el input nativo es la parada de tab (sin tabindex=-1)", () => {
    const w = mount(Switch, { props: { label: "Activo" } });
    expect((input(w).element as HTMLInputElement).tabIndex).toBe(0);
    expect(input(w).attributes("tabindex")).toBeUndefined();
  });

  it("focus() lleva el foco al input nativo", async () => {
    const w = mount(Switch, { attachTo: document.body, props: { label: "Activo" } });
    vm(w).focus();
    await flushPromises();
    expect(document.activeElement).toBe(input(w).element);
    w.unmount();
  });

  it("el clic en el track alterna una sola vez y emite change con el boolean", async () => {
    const w = mount(Switch, { attachTo: document.body, props: { label: "Activo" } });

    await track(w).trigger("click");
    await flushPromises();

    expect(vm(w).get()).toBe(true);
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([true]);
    expect(w.emitted("change")?.at(-1)).toEqual([true]);
    expect(w.emitted("change")).toHaveLength(1);
    w.unmount();
  });
});

describe("Switch — props fuera del set", () => {
  it("un color inválido cae a neutral (el track encendido no queda transparente)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = mount(Switch, { props: { color: "banana" as never } });
    const style = track(w).attributes("style") ?? "";
    expect(style).toContain("--switch-bg: var(--cu-color-neutral-solid)");
    expect(style).not.toContain("banana");
    warn.mockRestore();
  });

  it("el track encendido usa la variante -solid del color (contraste del thumb)", () => {
    const w = mount(Switch, { props: { color: "success" } });
    const style = track(w).attributes("style") ?? "";
    expect(style).toContain("--switch-bg: var(--cu-color-success-solid)");
    expect(style).toContain("--switch-hover: var(--cu-color-success-solid-hover)");
    expect(style).toContain("--switch-active: var(--cu-color-success-solid-active)");
  });

  it("un size inválido cae a md (el track no queda en 0x0)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = mount(Switch, { props: { size: "lg" as never } });
    expect(w.find(".cu-switch").classes()).toContain("cu-switch--md");
    expect(w.find(".cu-switch").classes()).not.toContain("cu-switch--lg");
    warn.mockRestore();
  });
});
