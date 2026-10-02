// Comportamiento de YearSlider según su ficha (docs/componentes/vue/year-slider.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect, vi, beforeAll } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import YearSlider from "./YearSlider.vue";

beforeAll(() => {
  HTMLElement.prototype.setPointerCapture = vi.fn();
  HTMLElement.prototype.releasePointerCapture = vi.fn();
});

type YearSliderVm = {
  nextYear: () => void;
  prevYear: () => void;
  goToYear: (v: number | string) => void;
  getValue: () => number;
  setValue: (v: number | string | null) => void;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as YearSliderVm;

describe("YearSlider — valor y formato", () => {
  it("sin modelValue arranca en el año actual", () => {
    const w = mount(YearSlider);
    expect(vm(w).getValue()).toBe(new Date().getFullYear());
    expect(w.find(".cu-month-slider-label-month").text()).toBe(String(new Date().getFullYear()));
  });

  it("acepta un año numérico en modelValue", () => {
    const w = mount(YearSlider, { props: { modelValue: 2024 } });
    expect(vm(w).getValue()).toBe(2024);
  });

  it("acepta un año como string y lo normaliza", () => {
    const w = mount(YearSlider, { props: { modelValue: "2024" } });
    expect(vm(w).getValue()).toBe(2024);
  });

  it("acepta una fecha 'YYYY-MM-DD' y toma el año", () => {
    const w = mount(YearSlider, { props: { modelValue: "2024-06-01" } });
    expect(vm(w).getValue()).toBe(2024);
  });
});

describe("YearSlider — navegación", () => {
  it("`nextYear()` avanza un año y emite update:modelValue + change", async () => {
    const w = mount(YearSlider, { props: { modelValue: 2024 } });
    vm(w).nextYear();
    await flushPromises();

    expect(vm(w).getValue()).toBe(2025);
    expect(w.emitted("update:modelValue")!.at(-1)).toEqual([2025]);
    expect(w.emitted("change")!.at(-1)).toEqual([2025]);
  });

  it("`prevYear()` retrocede un año", async () => {
    const w = mount(YearSlider, { props: { modelValue: 2024 } });
    vm(w).prevYear();
    await flushPromises();
    expect(vm(w).getValue()).toBe(2023);
    expect(w.emitted("change")!.at(-1)).toEqual([2023]);
  });

  it("`goToYear()` navega al año indicado", async () => {
    const w = mount(YearSlider, { props: { modelValue: 2024 } });
    vm(w).goToYear(2030);
    await flushPromises();
    expect(vm(w).getValue()).toBe(2030);
  });

  it("`setValue()` acepta string numérico", async () => {
    const w = mount(YearSlider, { props: { modelValue: 2024 } });
    vm(w).setValue("2035");
    await flushPromises();
    expect(vm(w).getValue()).toBe(2035);
  });

  it("los botones de chevron avanzan y retroceden", async () => {
    const w = mount(YearSlider, { props: { modelValue: 2024 } });
    const buttons = w.findAll("button");
    await buttons[buttons.length - 1]!.trigger("click"); // siguiente
    await flushPromises();
    expect(vm(w).getValue()).toBe(2025);

    await buttons[0]!.trigger("click"); // anterior
    await flushPromises();
    expect(vm(w).getValue()).toBe(2024);
  });
});

describe("YearSlider — límites y disabled", () => {
  it("no supera `max`", async () => {
    const w = mount(YearSlider, { props: { modelValue: 2024, max: 2025 } });
    vm(w).nextYear();
    await flushPromises();
    expect(vm(w).getValue()).toBe(2025);

    vm(w).nextYear();
    await flushPromises();
    expect(vm(w).getValue()).toBe(2025);
  });

  it("no baja de `min`", async () => {
    const w = mount(YearSlider, { props: { modelValue: 2024, min: 2023 } });
    vm(w).prevYear();
    await flushPromises();
    vm(w).prevYear();
    await flushPromises();
    expect(vm(w).getValue()).toBe(2023);
  });

  it("el botón siguiente queda deshabilitado al llegar a `max`", async () => {
    const w = mount(YearSlider, { props: { modelValue: 2025, max: 2025 } });
    const buttons = w.findAll("button");
    expect(buttons[buttons.length - 1]!.attributes("disabled")).toBeDefined();
  });

  it("`disabled` bloquea cualquier cambio", async () => {
    const w = mount(YearSlider, { props: { modelValue: 2024, disabled: true } });
    vm(w).nextYear();
    await flushPromises();
    expect(vm(w).getValue()).toBe(2024);
    expect(w.emitted("change")).toBeUndefined();
    expect(w.find(".cu-year-slider").classes()).toContain("is-disabled");
  });
});
