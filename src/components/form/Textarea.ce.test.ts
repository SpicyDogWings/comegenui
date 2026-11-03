// Contrato vanilla de <cu-textarea>: el custom element sincroniza su estado,
// avisa por `update:modelValue` y expone get/set/reset/focus (ficha cu-textarea).
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import "@/lib/form/textarea";

type TextareaHost = HTMLElement & {
  get: () => string;
  set: (value: string | number) => void;
  reset: () => void;
  focus: () => void;
};

const mountCe = async (attrs: Record<string, string> = {}): Promise<TextareaHost> => {
  const host = document.createElement("cu-textarea") as TextareaHost;
  for (const [name, value] of Object.entries(attrs)) host.setAttribute(name, value);
  document.body.appendChild(host);
  await nextTick();
  await nextTick();
  return host;
};

const inner = (host: TextareaHost): HTMLTextAreaElement => {
  const el = host.shadowRoot?.querySelector("textarea");
  if (!el) throw new Error("el shadow root no tiene textarea");
  return el;
};

const typeInto = async (host: TextareaHost, value: string) => {
  const el = inner(host);
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  await nextTick();
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("cu-textarea — valor y eventos", () => {
  it("teclear actualiza get() y emite update:modelValue en el host", async () => {
    const host = await mountCe();
    const updates: string[] = [];
    host.addEventListener("update:modelValue", (event) => {
      updates.push((event as CustomEvent<string>).detail);
    });

    await typeInto(host, "línea 1\nlínea 2");

    expect(host.get()).toBe("línea 1\nlínea 2");
    expect(inner(host).value).toBe("línea 1\nlínea 2");
    expect(updates.at(-1)).toBe("línea 1\nlínea 2");
  });

  it("set() escribe el valor (acepta number) y avisa; reset() limpia y avisa", async () => {
    const host = await mountCe();
    const updates: string[] = [];
    host.addEventListener("update:modelValue", (event) => {
      updates.push((event as CustomEvent<string>).detail);
    });

    host.set(7);
    await nextTick();
    expect(host.get()).toBe("7");
    expect(inner(host).value).toBe("7");
    expect(updates.at(-1)).toBe("7");

    host.reset();
    await nextTick();
    expect(host.get()).toBe("");
    expect(inner(host).value).toBe("");
    expect(updates.at(-1)).toBe("");
  });

  it("focus() enfoca el textarea interno", async () => {
    const host = await mountCe();

    host.focus();
    await nextTick();

    expect(host.shadowRoot?.activeElement).toBe(inner(host));
    expect(document.activeElement).toBe(host);
  });
});

describe("cu-textarea — atributos del host", () => {
  it("rows numérico y atributos HTML llegan al textarea interno", async () => {
    const host = await mountCe({ rows: "5", maxlength: "140", placeholder: "Bio" });

    expect(inner(host).rows).toBe(5);
    expect(inner(host).getAttribute("maxlength")).toBe("140");
    expect(inner(host).getAttribute("placeholder")).toBe("Bio");
  });

  it("rows por defecto es 3", async () => {
    const host = await mountCe();
    expect(inner(host).rows).toBe(3);
  });
});
