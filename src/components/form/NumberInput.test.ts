// Comportamiento de NumberInput según sus fichas (docs/versiones/5.1.2/componentes/…).
//
// Aserciones escritas a mano desde la prosa: por eso pueden fallar por un bug real
// (ver scripts/mutation-check.mjs).
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import NumberInput from "./NumberInput.vue";
import Select from "./Select.vue";

type NumberInputVm = {
  get: () => number | null;
  set: (value: number | null) => void;
  reset: () => void;
  focus: () => void;
  increment: () => void;
  decrement: () => void;
};

type Wrapper = ReturnType<typeof mount>;

const vm = (w: Wrapper) => w.vm as unknown as NumberInputVm;
const field = (w: Wrapper) => w.find("input.cu-input");
const fieldValue = (w: Wrapper) => (field(w).element as HTMLInputElement).value;
const incButton = (w: Wrapper) => w.find("button.cu-number-input__control--increment");
const decButton = (w: Wrapper) => w.find("button.cu-number-input__control--decrement");
const stepSelect = (w: Wrapper) => w.findComponent(Select);
const stepOptions = (w: Wrapper) =>
  (stepSelect(w).props("options") as { value: string; label: string }[]).map((option) => option.value);

describe("NumberInput — valor y v-model", () => {
  it("arranca vacío (null) y tipear un número actualiza el valor y emite update:modelValue", async () => {
    const w = mount(NumberInput);
    expect(vm(w).get()).toBeNull();
    expect(fieldValue(w)).toBe("");

    await field(w).setValue("12");
    await flushPromises();

    expect(vm(w).get()).toBe(12);
    expect(fieldValue(w)).toBe("12");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([12]);
  });

  it("refleja un modelValue externo en el campo", async () => {
    const Host = defineComponent({
      components: { NumberInput },
      setup() {
        const value = ref<number | null>(7);
        return { value };
      },
      template: `<NumberInput v-model="value" />`,
    });
    const w = mount(Host);
    await flushPromises();
    expect(fieldValue(w)).toBe("7");

    (w.vm as unknown as { value: number | null }).value = 9;
    await flushPromises();
    expect(fieldValue(w)).toBe("9");
    expect((w.findComponent(NumberInput).vm as unknown as NumberInputVm).get()).toBe(9);
  });

  it("vaciar el campo deja el valor en null", async () => {
    const w = mount(NumberInput, { props: { modelValue: 5 } });
    await flushPromises();

    await field(w).setValue("");
    await flushPromises();

    expect(vm(w).get()).toBeNull();
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([null]);
  });

  it("acepta pasos decimales sin arrastrar polvo de coma flotante", async () => {
    const w = mount(NumberInput, { props: { modelValue: 0.2, step: 0.1 } });

    await incButton(w).trigger("click");
    await flushPromises();

    expect(vm(w).get()).toBe(0.3);
  });

  it("normaliza min/max/step que llegan como string (atributos del custom element)", async () => {
    const w = mount(NumberInput, {
      props: {
        modelValue: 0,
        min: "0" as unknown as number,
        max: "10" as unknown as number,
        step: "5" as unknown as number,
      },
    });
    await flushPromises();

    await incButton(w).trigger("click");
    await flushPromises();
    expect(vm(w).get()).toBe(5);

    await field(w).setValue("50");
    await flushPromises();
    expect(vm(w).get()).toBe(10);
  });
});

describe("NumberInput — límites (min / max)", () => {
  it("clampea al máximo mientras se tipea", async () => {
    const w = mount(NumberInput, { props: { max: 10 } });

    await field(w).setValue("50");
    await flushPromises();

    expect(vm(w).get()).toBe(10);
    expect(fieldValue(w)).toBe("10");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([10]);
  });

  it("clampea al mínimo mientras se tipea", async () => {
    const w = mount(NumberInput, { props: { min: 0 } });

    await field(w).setValue("-5");
    await flushPromises();

    expect(vm(w).get()).toBe(0);
    expect(fieldValue(w)).toBe("0");
  });

  it("set() fuera de rango clampea y emite change con el valor final", async () => {
    const w = mount(NumberInput, { props: { max: 10 } });

    vm(w).set(99);
    await flushPromises();

    expect(vm(w).get()).toBe(10);
    expect(fieldValue(w)).toBe("10");
    expect(w.emitted("change")?.at(-1)).toEqual([10]);
  });

  it("en el máximo el botón + queda deshabilitado y no incrementa ni emite", async () => {
    const w = mount(NumberInput, { props: { modelValue: 10, max: 10 } });
    await flushPromises();

    expect(incButton(w).attributes("disabled")).toBeDefined();
    expect(decButton(w).attributes("disabled")).toBeUndefined();

    vm(w).increment();
    await flushPromises();

    expect(vm(w).get()).toBe(10);
    expect(w.emitted("increment")).toBeUndefined();
  });

  it("en el mínimo el botón − queda deshabilitado y no decrementa", async () => {
    const w = mount(NumberInput, { props: { modelValue: 0, min: 0 } });
    await flushPromises();

    expect(decButton(w).attributes("disabled")).toBeDefined();

    vm(w).decrement();
    await flushPromises();

    expect(vm(w).get()).toBe(0);
    expect(w.emitted("decrement")).toBeUndefined();
  });
});

describe("NumberInput — controles y paso", () => {
  it("muestra los botones − / + por defecto y suman o restan el paso", async () => {
    const w = mount(NumberInput, { props: { modelValue: 5 } });
    await flushPromises();

    expect(w.findAll("button")).toHaveLength(2);

    await incButton(w).trigger("click");
    await flushPromises();

    expect(vm(w).get()).toBe(6);
    expect(w.emitted("increment")?.at(-1)).toEqual([6]);
    expect(w.emitted("change")?.at(-1)).toEqual([6]);

    await decButton(w).trigger("click");
    await flushPromises();

    expect(vm(w).get()).toBe(5);
    expect(w.emitted("decrement")?.at(-1)).toEqual([5]);
  });

  it("showControls=false oculta los botones", async () => {
    const w = mount(NumberInput, { props: { showControls: false } });
    expect(w.findAll("button")).toHaveLength(0);
  });

  it("step define cuánto suman y restan los botones", async () => {
    const w = mount(NumberInput, { props: { modelValue: 0, step: 5 } });
    await flushPromises();

    await incButton(w).trigger("click");
    await flushPromises();
    expect(vm(w).get()).toBe(5);

    await decButton(w).trigger("click");
    await flushPromises();
    expect(vm(w).get()).toBe(0);
  });

  it("con el campo vacío los botones parten de min (o 0)", async () => {
    const w = mount(NumberInput, { props: { min: 0 } });

    await incButton(w).trigger("click");
    await flushPromises();
    expect(vm(w).get()).toBe(1);

    vm(w).reset();
    await flushPromises();
    await decButton(w).trigger("click");
    await flushPromises();
    expect(vm(w).get()).toBe(0);
  });

  it("showStepSelect=false (default) no muestra el select de paso", () => {
    const w = mount(NumberInput);
    expect(stepSelect(w).exists()).toBe(false);
  });

  it("showStepSelect muestra steps (con step incluido) y el paso elegido lo usan los botones", async () => {
    const w = mount(NumberInput, { props: { modelValue: 0, showStepSelect: true } });
    await flushPromises();

    expect(stepSelect(w).exists()).toBe(true);
    expect(stepOptions(w)).toEqual(["1", "5", "10"]);

    stepSelect(w).vm.$emit("change", "5");
    await flushPromises();
    expect(vm(w).get()).toBe(0);

    await incButton(w).trigger("click");
    await flushPromises();

    expect(vm(w).get()).toBe(5);
  });

  it("el paso usa el Select de la librería, no un <select> nativo", () => {
    const w = mount(NumberInput, { props: { showStepSelect: true } });

    expect(w.find("select").exists()).toBe(false);
    expect(stepSelect(w).exists()).toBe(true);
  });

  it("steps custom respeta el orden y antepone step si no está en la lista", async () => {
    const w = mount(NumberInput, { props: { step: 10, steps: [2, 4], showStepSelect: true } });
    await flushPromises();

    expect(stepOptions(w)).toEqual(["10", "2", "4"]);
  });
});

describe("NumberInput — estados (disabled / readOnly)", () => {
  it("disabled apaga el campo, los botones y el select, y no cambia el valor", async () => {
    const w = mount(NumberInput, {
      props: { modelValue: 1, disabled: true, showStepSelect: true },
    });
    await flushPromises();

    expect(field(w).attributes("disabled")).toBeDefined();
    expect(incButton(w).attributes("disabled")).toBeDefined();
    expect(decButton(w).attributes("disabled")).toBeDefined();
    expect(stepSelect(w).props("disabled")).toBe(true);

    vm(w).increment();
    await flushPromises();

    expect(vm(w).get()).toBe(1);
    expect(w.emitted("increment")).toBeUndefined();
  });

  it("readOnly deja el campo de solo lectura y bloquea botones y teclado", async () => {
    const w = mount(NumberInput, { props: { modelValue: 1, readOnly: true } });
    await flushPromises();

    expect(field(w).attributes("readonly")).toBeDefined();
    expect(incButton(w).attributes("disabled")).toBeDefined();
    expect(decButton(w).attributes("disabled")).toBeDefined();

    await field(w).trigger("keydown", { key: "ArrowUp" });
    await flushPromises();

    expect(vm(w).get()).toBe(1);
    expect(w.emitted("increment")).toBeUndefined();
  });
});

describe("NumberInput — teclado", () => {
  it("flecha arriba incrementa y flecha abajo decrementa con el paso activo", async () => {
    const w = mount(NumberInput, { props: { modelValue: 1 } });
    await flushPromises();

    await field(w).trigger("keydown", { key: "ArrowUp" });
    await flushPromises();
    expect(vm(w).get()).toBe(2);
    expect(w.emitted("increment")?.at(-1)).toEqual([2]);

    await field(w).trigger("keydown", { key: "ArrowDown" });
    await flushPromises();
    expect(vm(w).get()).toBe(1);
    expect(w.emitted("decrement")?.at(-1)).toEqual([1]);
  });

  it("las flechas usan el paso elegido en el select", async () => {
    const w = mount(NumberInput, { props: { modelValue: 0, showStepSelect: true } });
    await flushPromises();

    stepSelect(w).vm.$emit("change", "10");
    await flushPromises();

    await field(w).trigger("keydown", { key: "ArrowUp" });
    await flushPromises();

    expect(vm(w).get()).toBe(10);
  });
});

describe("NumberInput — evento change", () => {
  it("tipear no emite change; confirmar con blur lo emite una sola vez", async () => {
    const w = mount(NumberInput, { props: { modelValue: 1 } });
    await flushPromises();

    await field(w).setValue("3");
    await flushPromises();
    expect(w.emitted("change")).toBeUndefined();

    await field(w).trigger("blur");
    await flushPromises();
    expect(w.emitted("change")?.at(-1)).toEqual([3]);

    await field(w).trigger("blur");
    await flushPromises();
    expect(w.emitted("change")).toHaveLength(1);
  });

  it("Enter confirma el valor y emite change", async () => {
    const w = mount(NumberInput);

    await field(w).setValue("4");
    await flushPromises();
    await field(w).trigger("keydown", { key: "Enter" });
    await flushPromises();

    expect(vm(w).get()).toBe(4);
    expect(w.emitted("change")?.at(-1)).toEqual([4]);
  });
});

describe("NumberInput — API imperativa", () => {
  it("expone get, set, reset, focus, increment y decrement", () => {
    const w = mount(NumberInput);
    for (const name of ["get", "set", "reset", "focus", "increment", "decrement"] as const) {
      expect(typeof vm(w)[name]).toBe("function");
    }
  });

  it("set() actualiza el valor y emite update:modelValue y change", async () => {
    const w = mount(NumberInput);

    vm(w).set(3);
    await flushPromises();

    expect(vm(w).get()).toBe(3);
    expect(fieldValue(w)).toBe("3");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([3]);
    expect(w.emitted("change")?.at(-1)).toEqual([3]);
  });

  it("reset() vacía el campo y emite change con null", async () => {
    const w = mount(NumberInput, { props: { modelValue: 5 } });
    await flushPromises();

    vm(w).reset();
    await flushPromises();

    expect(vm(w).get()).toBeNull();
    expect(fieldValue(w)).toBe("");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual([null]);
    expect(w.emitted("change")?.at(-1)).toEqual([null]);
  });

  it("focus() enfoca el input real", async () => {
    const w = mount(NumberInput, { attachTo: document.body });

    vm(w).focus();
    await flushPromises();

    expect(document.activeElement).toBe(field(w).element);
    w.unmount();
  });

  it("increment() y decrement() respetan el paso y emiten su evento", async () => {
    const w = mount(NumberInput, { props: { modelValue: 2, step: 2 } });

    vm(w).increment();
    await flushPromises();
    expect(vm(w).get()).toBe(4);
    expect(w.emitted("increment")?.at(-1)).toEqual([4]);

    vm(w).decrement();
    await flushPromises();
    expect(vm(w).get()).toBe(2);
    expect(w.emitted("decrement")?.at(-1)).toEqual([2]);
  });
});

describe("NumberInput — apariencia", () => {
  it("hereda color, variant y size del campo y del tamaño de los botones", () => {
    const w = mount(NumberInput, { props: { color: "primary", variant: "outlined", size: "lg" } });

    expect(field(w).classes()).toContain("cu-input--outlined");
    expect(field(w).classes()).toContain("cu-input--lg");
    expect(incButton(w).classes()).toContain("cu-button--lg");
    expect(decButton(w).classes()).toContain("cu-button--lg");
  });

  it("propaga el placeholder al campo", () => {
    const w = mount(NumberInput, { props: { placeholder: "Cantidad" } });
    expect(field(w).attributes("placeholder")).toBe("Cantidad");
  });
});
