// Comportamiento de Checkbox según su ficha (docs/componentes/vue/checkbox.md).
//
// Aserciones escritas a mano desde la prosa: fallan por bugs reales.
import { describe, it, expect, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Checkbox from "./Checkbox.vue";

type CheckboxVm = {
  get: () => boolean;
  set: (v: boolean) => void;
  reset: () => void;
  focus: () => void;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as CheckboxVm;
const input = (w: ReturnType<typeof mount>) => w.find("input.cu-checkbox-input");
const box = (w: ReturnType<typeof mount>) => w.find(".cu-checkbox-box");

describe("Checkbox — estado", () => {
  it("arranca desmarcado y el click en el input lo marca y emite update:modelValue + change", async () => {
    const w = mount(Checkbox);
    expect(vm(w).get()).toBe(false);

    await input(w).setValue(true);
    await flushPromises();

    expect(vm(w).get()).toBe(true);
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([true]);
    expect(w.emitted("change")).toHaveLength(1);
  });

  it("refleja un modelValue externo como input checked", async () => {
    const w = mount(Checkbox, { props: { modelValue: true } });
    await flushPromises();
    expect((input(w).element as HTMLInputElement).checked).toBe(true);
    expect(box(w).classes()).toContain("cu-checkbox-box--checked");
  });

  it("set() cambia el estado y emite change con el valor nuevo", async () => {
    const w = mount(Checkbox);
    vm(w).set(true);
    await flushPromises();

    expect(vm(w).get()).toBe(true);
    const change = w.emitted("change");
    expect(change).toHaveLength(1);
    expect(change![0]).toEqual([true]);
  });

  it("reset() desmarca y emite change", async () => {
    const w = mount(Checkbox, { props: { modelValue: true } });
    await flushPromises();

    vm(w).reset();
    await flushPromises();

    expect(vm(w).get()).toBe(false);
    expect((input(w).element as HTMLInputElement).checked).toBe(false);
    expect(w.emitted("change")).toHaveLength(1);
  });

  it("un checkbox disabled no responde al toggle del input", async () => {
    const w = mount(Checkbox, { props: { disabled: true } });
    expect(input(w).attributes("disabled")).toBeDefined();
  });
});

describe("Checkbox — label y clases", () => {
  it("renderiza el label y lo oculta cuando no se pasa", () => {
    expect(mount(Checkbox, { props: { label: "Acepto" } }).find(".cu-checkbox-label").text()).toBe(
      "Acepto",
    );
    expect(mount(Checkbox).find(".cu-checkbox-label").exists()).toBe(false);
  });

  it("aplica las clases de tamaño y disabled", () => {
    const w = mount(Checkbox, { props: { size: "sm", disabled: true } });
    expect(w.find(".cu-checkbox").classes()).toContain("cu-checkbox--sm");
    expect(w.find(".cu-checkbox").classes()).toContain("cu-checkbox--disabled");
  });
});

describe("Checkbox — teclado y clic", () => {
  it("el input nativo es la parada de tab (sin tabindex=-1)", () => {
    const w = mount(Checkbox, { props: { label: "Acepto" } });
    expect((input(w).element as HTMLInputElement).tabIndex).toBe(0);
    expect(input(w).attributes("tabindex")).toBeUndefined();
  });

  it("focus() lleva el foco al input nativo", () => {
    const w = mount(Checkbox, { attachTo: document.body });
    vm(w).focus();
    expect(document.activeElement).toBe(input(w).element);
    w.unmount();
  });

  it("el clic en la caja visible alterna una sola vez y emite change con el boolean", async () => {
    const w = mount(Checkbox, { attachTo: document.body, props: { label: "Acepto" } });

    await box(w).trigger("click");
    await flushPromises();

    expect(vm(w).get()).toBe(true);
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([true]);
    expect(w.emitted("change")?.at(-1)).toEqual([true]);
    expect(w.emitted("change")).toHaveLength(1);
    w.unmount();
  });

  it("el clic en el texto del label alterna (el <label> nativo envuelve al input)", async () => {
    const w = mount(Checkbox, { attachTo: document.body, props: { label: "Acepto" } });

    await w.find(".cu-checkbox-label").trigger("click");
    await flushPromises();

    expect(vm(w).get()).toBe(true);
    expect(w.emitted("change")).toHaveLength(1);
    w.unmount();
  });

  it("un checkbox disabled no alterna con el clic en la caja", async () => {
    const w = mount(Checkbox, { attachTo: document.body, props: { label: "Acepto", disabled: true } });

    await box(w).trigger("click");
    await flushPromises();

    expect(vm(w).get()).toBe(false);
    expect(w.emitted("change")).toBeUndefined();
    w.unmount();
  });
});

describe("Checkbox — props fuera del set", () => {
  it("un color inválido cae a neutral (la caja marcada no queda transparente)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = mount(Checkbox, { props: { color: "banana" as never } });
    const style = box(w).attributes("style") ?? "";
    expect(style).toContain("--cb-solid: var(--cu-color-neutral-solid)");
    expect(style).not.toContain("banana");
    warn.mockRestore();
  });

  it("un size inválido cae a md (la caja no queda sin tamaño)", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    const w = mount(Checkbox, { props: { size: "lg" as never } });
    expect(w.find(".cu-checkbox").classes()).toContain("cu-checkbox--md");
    expect(w.find(".cu-checkbox").classes()).not.toContain("cu-checkbox--lg");
    warn.mockRestore();
  });
});
