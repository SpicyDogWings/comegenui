// Comportamiento de Switch según su ficha (docs/componentes/vue/switch.md).
//
// Aserciones escritas a mano desde la prosa: fallan por bugs reales.
import { describe, it, expect } from "vitest";
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

  it("refleja un modelValue externo y aria-checked en el track", async () => {
    const w = mount(Switch, { props: { modelValue: true } });
    await flushPromises();
    expect(vm(w).get()).toBe(true);
    expect(track(w).attributes("aria-checked")).toBe("true");
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
