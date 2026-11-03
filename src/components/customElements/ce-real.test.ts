// El caso exacto de #40: consumir el CUSTOM ELEMENT REAL (defineCustomElement,
// shadow DOM), clickear/setear y leer la UI y get() SIN reasignar modelValue.
// Los tests de `ce-parity` montan el `.ce.vue` como componente Vue; acá se
// ejercita el wrapper ya devenido custom element, que es lo que ve vanilla.
import { beforeAll, describe, expect, it } from "vitest";

import "@/lib/form/switch";
import "@/lib/form/checkbox";
import "@/lib/form/color-picker";
import "@/lib/controls/dropdown-menu";

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

describe("cu-dropdown-menu — custom element real", () => {
  type MenuElement = HTMLElement & { open(): void; close(): void; toggle(): void; isOpen(): boolean };

  it("el trigger del shadow DOM anuncia menu/expanded/controls y las filas son menuitem", async () => {
    const el = make<MenuElement & { items: unknown }>("cu-dropdown-menu");
    el.items = [{ label: "Uno" }];
    await tick();
    await tick();

    const trigger = el.shadowRoot!.querySelector(".cu-dropdown-toggle")!;
    expect(trigger.getAttribute("aria-haspopup")).toBe("menu");
    expect(trigger.getAttribute("aria-expanded")).toBe("false");

    el.open();
    await tick();
    await tick();

    const panel = el.shadowRoot!.querySelector(".cu-popover-panel")!;
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(trigger.getAttribute("aria-controls")).toBe(panel.id);
    expect(panel.getAttribute("role")).toBe("menu");
    expect(panel.querySelector(".cu-dropdown-item")!.getAttribute("role")).toBe("menuitem");
    el.remove();
  });

  it("items nulos o que no son un array no rompen el menú", async () => {
    const el = make<MenuElement & { items: unknown }>("cu-dropdown-menu");
    el.items = "hola";
    await tick();
    expect(el.shadowRoot!.querySelector(".cu-dropdown-toggle")).toBeTruthy();

    el.items = [null, { label: "Uno" }];
    el.open();
    await tick();
    await tick();
    expect(el.shadowRoot!.querySelectorAll(".cu-dropdown-item")).toHaveLength(1);
    el.remove();
  });

  it("el toggle del light DOM recibe aria-haspopup/expanded del wrapper", async () => {
    const el = make<MenuElement>("cu-dropdown-menu");
    const button = document.createElement("button");
    button.setAttribute("slot", "toggle");
    button.type = "button";
    button.textContent = "abrir";
    el.appendChild(button);
    await tick();
    await tick();

    expect(button.getAttribute("aria-haspopup")).toBe("menu");
    expect(button.getAttribute("aria-expanded")).toBe("false");

    el.open();
    await tick();
    await tick();
    expect(button.getAttribute("aria-expanded")).toBe("true");

    el.close();
    await tick();
    expect(button.getAttribute("aria-expanded")).toBe("false");
    el.remove();
  });
});
