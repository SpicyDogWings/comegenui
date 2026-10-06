// Comportamiento de Select según su ficha (docs/componentes/vue/select.md).
//
// Aserciones escritas a mano desde la prosa: fallan por bugs reales.
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Select from "./Select.vue";

interface Opt {
  value: string;
  label: string;
  disabled?: boolean;
  color?: string;
  variant?: string;
}

type SelectVm = {
  get: () => string;
  set: (v: string) => void;
  reset: () => void;
  focus: () => void;
  isOpen: () => boolean;
  selectedItem: () => Opt | null;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as SelectVm;

const OPTIONS: Opt[] = [
  { value: "a", label: "A" },
  { value: "b", label: "B" },
  { value: "c", label: "C", disabled: true },
];

const toggle = (w: ReturnType<typeof mount>) => w.find(".cu-select-toggle");

describe("Select — estado y v-model", () => {
  it("arranca con el valor del modelValue y muestra el label de la opción", async () => {
    const w = mount(Select, { props: { options: OPTIONS, modelValue: "b" } });
    await flushPromises();
    expect(vm(w).get()).toBe("b");
    expect(w.find(".cu-select-label").text()).toBe("B");
  });

  it("sin valor muestra el placeholder o 'Seleccionar...'", () => {
    expect(
      mount(Select, { props: { options: OPTIONS, placeholder: "Elegí" } })
        .find(".cu-select-label")
        .text(),
    ).toBe("Elegí");
    expect(mount(Select, { props: { options: OPTIONS } }).find(".cu-select-label").text()).toBe(
      "Seleccionar...",
    );
  });

  it("seleccionar una opción emite update:modelValue + select + change y cierra el panel", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    await toggle(w).trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);

    const options = w.findAll(".cu-select-option");
    await options[1]!.trigger("click"); // opción B
    await flushPromises();

    expect(vm(w).get()).toBe("b");
    expect(vm(w).selectedItem()).toMatchObject({ value: "b", label: "B" });
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["b"]);
    expect(w.emitted("select")?.[0]?.[0]).toMatchObject({ value: "b", label: "B" });
    expect(w.emitted("change")?.at(-1)).toEqual(["b"]);
    expect(vm(w).isOpen()).toBe(false);
  });

  it("una opción disabled no se selecciona al click", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    await toggle(w).trigger("click");
    await flushPromises();

    const disabled = w.findAll(".cu-select-option")[2]!; // opción C (disabled)
    await disabled.trigger("click");
    await flushPromises();

    expect(vm(w).get()).toBe("");
    expect(w.emitted("select")).toBeUndefined();
  });

  it("get()/set()/reset() controlan la selección programáticamente", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    vm(w).set("a");
    await flushPromises();
    expect(vm(w).get()).toBe("a");
    expect(w.find(".cu-select-label").text()).toBe("A");

    vm(w).reset();
    await flushPromises();
    expect(vm(w).get()).toBe("");
    expect(vm(w).selectedItem()).toBeNull();
  });

  it("set()/reset() emiten change con el valor nuevo", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    vm(w).set("a");
    await flushPromises();
    expect(w.emitted("change")?.at(-1)).toEqual(["a"]);

    vm(w).reset();
    await flushPromises();
    expect(w.emitted("change")?.at(-1)).toEqual([""]);
  });

  it("isOpen() refleja el estado del panel con click en el toggle", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    expect(vm(w).isOpen()).toBe(false);
    await toggle(w).trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(true);
    await toggle(w).trigger("click");
    await flushPromises();
    expect(vm(w).isOpen()).toBe(false);
  });
});

describe("Select — contenido y clases", () => {
  it("sin opciones muestra 'Sin opciones'", async () => {
    const w = mount(Select);
    await toggle(w).trigger("click");
    await flushPromises();
    expect(w.find(".cu-select-empty").text()).toBe("Sin opciones");
  });

  it("aplica la clase disabled a las opciones deshabilitadas", async () => {
    const w = mount(Select, { props: { options: OPTIONS } });
    await toggle(w).trigger("click");
    await flushPromises();
    expect(w.findAll(".cu-select-option")[2]!.classes()).toContain("cu-select-option--disabled");
  });
});
