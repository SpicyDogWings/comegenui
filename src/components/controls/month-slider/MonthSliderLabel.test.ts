// Comportamiento de MonthSliderLabel según su ficha (docs/componentes/vue/month-slider-label.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect, vi, beforeAll } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import MonthSliderLabel from "./MonthSliderLabel.vue";

beforeAll(() => {
  // jsdom no implementa la captura de puntero que usa el drag.
  HTMLElement.prototype.setPointerCapture = vi.fn();
  HTMLElement.prototype.releasePointerCapture = vi.fn();
});

const root = (w: ReturnType<typeof mount>) => w.find(".cu-month-slider-label");

// jsdom no trae `PointerEvent`, así que se sintetiza un MouseEvent con las
// propiedades que lee el drag (`pointerId` y `clientX`).
function dispatchPointer(el: Element, type: string, pointerId: number, clientX: number) {
  const event = new MouseEvent(type, { bubbles: true });
  Object.defineProperty(event, "pointerId", { value: pointerId });
  Object.defineProperty(event, "clientX", { value: clientX });
  el.dispatchEvent(event);
}

describe("MonthSliderLabel — label y año", () => {
  it("muestra el texto del label", () => {
    const w = mount(MonthSliderLabel, { props: { label: "septiembre" } });
    expect(w.find(".cu-month-slider-label-month").text()).toBe("septiembre");
  });

  it("muestra el año como badge cuando se especifica", () => {
    const w = mount(MonthSliderLabel, { props: { label: "septiembre", year: "2026" } });
    const badge = w.find(".cu-month-slider-label-year");
    expect(badge.exists()).toBe(true);
    expect(badge.text()).toBe("2026");
  });

  it("no muestra badge de año sin la prop", () => {
    const w = mount(MonthSliderLabel, { props: { label: "septiembre" } });
    expect(w.find(".cu-month-slider-label-year").exists()).toBe(false);
  });

  it("el aria-label combina label y año", () => {
    const w = mount(MonthSliderLabel, { props: { label: "septiembre", year: "2026" } });
    expect(root(w).attributes("aria-label")).toBe("septiembre 2026");
  });
});

describe("MonthSliderLabel — roles y variantes", () => {
  it("con `draggable` (default) es role button y tabindex 0", () => {
    const w = mount(MonthSliderLabel, { props: { label: "x" } });
    expect(root(w).attributes("role")).toBe("button");
    expect(root(w).attributes("tabindex")).toBe("0");
  });

  it("sin `draggable` es role group y tabindex -1", () => {
    const w = mount(MonthSliderLabel, { props: { label: "x", draggable: false } });
    expect(root(w).attributes("role")).toBe("group");
    expect(root(w).attributes("tabindex")).toBe("-1");
  });

  it("aplica la clase de la variante y el color al badge", () => {
    const w = mount(MonthSliderLabel, {
      props: { label: "x", variant: "outlined", color: "success", year: "2026" },
    });
    expect(root(w).classes()).toContain("cu-month-slider-label--outlined");
    const badge = w.find(".cu-month-slider-label-year");
    expect(badge.classes()).toContain("cu-badge--solid");
    expect(badge.attributes("style")).toContain("--badge-bg: var(--cu-color-success)");
  });

  it("`disabled` agrega is-disabled", () => {
    const w = mount(MonthSliderLabel, { props: { label: "x", disabled: true } });
    expect(root(w).classes()).toContain("is-disabled");
  });
});

describe("MonthSliderLabel — navegación por drag", () => {
  it("arrastrar a la izquierda más del umbral emite navigate positivo", async () => {
    const w = mount(MonthSliderLabel, { props: { label: "x", threshold: 96 } });
    const el = root(w).element;
    dispatchPointer(el, "pointerdown", 1, 300);
    dispatchPointer(el, "pointermove", 1, 100); // dx = -200
    await flushPromises();
    expect(w.emitted("navigate")!.at(-1)).toEqual([1]);
  });

  it("arrastrar a la derecha más del umbral emite navigate negativo", async () => {
    const w = mount(MonthSliderLabel, { props: { label: "x", threshold: 96 } });
    const el = root(w).element;
    dispatchPointer(el, "pointerdown", 2, 100);
    dispatchPointer(el, "pointermove", 2, 300); // dx = +200
    await flushPromises();
    expect(w.emitted("navigate")!.at(-1)).toEqual([-1]);
  });

  it("respeta `steps` en la dirección emitida", async () => {
    const w = mount(MonthSliderLabel, { props: { label: "x", threshold: 96, steps: 3 } });
    const el = root(w).element;
    dispatchPointer(el, "pointerdown", 3, 300);
    dispatchPointer(el, "pointermove", 3, 100);
    await flushPromises();
    expect(w.emitted("navigate")!.at(-1)).toEqual([3]);
  });

  it("un gesto emite una sola vez aunque se supere el umbral varias veces", async () => {
    const w = mount(MonthSliderLabel, { props: { label: "x", threshold: 96 } });
    const el = root(w).element;
    dispatchPointer(el, "pointerdown", 4, 500);
    dispatchPointer(el, "pointermove", 4, 300);
    dispatchPointer(el, "pointermove", 4, 100);
    dispatchPointer(el, "pointermove", 4, -100);
    await flushPromises();
    expect(w.emitted("navigate")).toHaveLength(1);
  });

  it("no emite si `disabled` está activo", async () => {
    const w = mount(MonthSliderLabel, { props: { label: "x", threshold: 96, disabled: true } });
    const el = root(w).element;
    dispatchPointer(el, "pointerdown", 5, 300);
    dispatchPointer(el, "pointermove", 5, 100);
    await flushPromises();
    expect(w.emitted("navigate")).toBeUndefined();
  });

  it("no emite si `canNavigateNext` es false", async () => {
    const w = mount(MonthSliderLabel, {
      props: { label: "x", threshold: 96, canNavigateNext: false },
    });
    const el = root(w).element;
    dispatchPointer(el, "pointerdown", 6, 300);
    dispatchPointer(el, "pointermove", 6, 100);
    await flushPromises();
    expect(w.emitted("navigate")).toBeUndefined();
  });
});

describe("MonthSliderLabel — navegación por teclado", () => {
  it("flecha derecha emite +steps", async () => {
    const w = mount(MonthSliderLabel, { props: { label: "x" } });
    await root(w).trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("navigate")!.at(-1)).toEqual([1]);
  });

  it("flecha izquierda emite -steps", async () => {
    const w = mount(MonthSliderLabel, { props: { label: "x", steps: 2 } });
    await root(w).trigger("keydown", { key: "ArrowLeft" });
    expect(w.emitted("navigate")!.at(-1)).toEqual([-2]);
  });

  it("no emite flecha siguiente si canNavigateNext es false", async () => {
    const w = mount(MonthSliderLabel, { props: { label: "x", canNavigateNext: false } });
    await root(w).trigger("keydown", { key: "ArrowRight" });
    expect(w.emitted("navigate")).toBeUndefined();
  });
});
