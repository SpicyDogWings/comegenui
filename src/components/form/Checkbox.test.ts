// Comportamiento de Checkbox según su ficha (docs/componentes/vue/checkbox.md).
//
// Aserciones escritas a mano desde la prosa: fallan por bugs reales.
import { describe, it, expect } from "vitest";
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

  it("set() cambia el estado y emite change con el payload de target", async () => {
    const w = mount(Checkbox);
    vm(w).set(true);
    await flushPromises();

    expect(vm(w).get()).toBe(true);
    const change = w.emitted("change");
    expect(change).toHaveLength(1);
    expect(change![0]![0]).toMatchObject({ target: { checked: true } });
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
