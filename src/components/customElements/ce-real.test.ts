// El caso exacto de #40: consumir el CUSTOM ELEMENT REAL (defineCustomElement,
// shadow DOM), clickear/setear y leer la UI y get() SIN reasignar modelValue.
// Los tests de `ce-parity` montan el `.ce.vue` como componente Vue; acá se
// ejercita el wrapper ya devenido custom element, que es lo que ve vanilla.
import { beforeAll, describe, expect, it } from "vitest";

import "@/lib/form/switch";
import "@/lib/form/checkbox";
import "@/lib/form/color-picker";

async function tick() {
  await new Promise((r) => setTimeout(r, 0));
}

function make<T extends HTMLElement>(tag: string): T {
  const el = document.createElement(tag) as T;
  document.body.appendChild(el);
  return el;
}

type ValueElement = HTMLElement & { get(): unknown; set(v: unknown): void; reset(): void };

describe("cu-switch — custom element real", () => {
  it("set()/reset() reflejan el estado en get() y en el shadow DOM", async () => {
    const el = make<ValueElement>("cu-switch");
    await tick();

    el.set(true);
    await tick();

    expect(el.get()).toBe(true);
    expect(el.shadowRoot!.querySelector(".cu-switch-track")!.className).toContain(
      "cu-switch--checked",
    );

    el.reset();
    await tick();

    expect(el.get()).toBe(false);
    expect(el.shadowRoot!.querySelector(".cu-switch-track")!.className).not.toContain(
      "cu-switch--checked",
    );
  });

  it("el CLICK mantiene el estado sin reasignar modelValue y emite los eventos", async () => {
    const el = make<ValueElement>("cu-switch");
    await tick();

    const updates: boolean[] = [];
    const changes: boolean[] = [];
    el.addEventListener("update:modelValue", (e) =>
      updates.push((e as CustomEvent).detail),
    );
    el.addEventListener("change", (e) => changes.push((e as CustomEvent).detail));

    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await tick();

    expect(el.get()).toBe(true);
    expect(el.shadowRoot!.querySelector(".cu-switch-track")!.className).toContain(
      "cu-switch--checked",
    );
    expect(updates).toEqual([true]);
    expect(changes).toEqual([true]);
  });
});

describe("cu-checkbox — custom element real", () => {
  it("el CLICK mantiene el estado sin reasignar modelValue", async () => {
    const el = make<ValueElement>("cu-checkbox");
    await tick();

    const updates: boolean[] = [];
    el.addEventListener("update:modelValue", (e) =>
      updates.push((e as CustomEvent).detail),
    );

    const input = el.shadowRoot!.querySelector<HTMLInputElement>('input[type="checkbox"]')!;
    input.checked = true;
    input.dispatchEvent(new Event("change", { bubbles: true }));
    await tick();

    expect(el.get()).toBe(true);
    expect(input.checked).toBe(true);
    expect(updates).toEqual([true]);
  });
});

describe("cu-color-picker — custom element real", () => {
  it("set()/reset() reflejan el color en get()", async () => {
    const el = make<ValueElement>("cu-color-picker");
    await tick();

    el.set("#ff0000");
    await tick();
    expect(el.get()).toBe("#ff0000");

    el.reset();
    await tick();
    expect(el.get()).toBe("#000000");
  });
});
