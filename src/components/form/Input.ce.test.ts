// Contrato vanilla de <cu-input>: el custom element sincroniza su estado,
// avisa por `update:modelValue` y expone get/set/reset/focus (ficha cu-input).
// Monta el elemento real registrado por el entry para cubrir el wrapper .ce.
import { afterEach, describe, expect, it } from "vitest";
import { nextTick } from "vue";
import "@/lib/form/input";

type InputHost = HTMLElement & {
  get: () => string;
  set: (value: string | number) => void;
  reset: () => void;
  focus: () => void;
};

const mountCe = async (attrs: Record<string, string> = {}): Promise<InputHost> => {
  const host = document.createElement("cu-input") as InputHost;
  for (const [name, value] of Object.entries(attrs)) host.setAttribute(name, value);
  document.body.appendChild(host);
  await nextTick();
  await nextTick();
  return host;
};

const inner = (host: InputHost): HTMLInputElement => {
  const el = host.shadowRoot?.querySelector("input");
  if (!el) throw new Error("el shadow root no tiene input");
  return el;
};

const typeInto = async (host: InputHost, value: string) => {
  const el = inner(host);
  el.value = value;
  el.dispatchEvent(new Event("input", { bubbles: true, composed: true }));
  await nextTick();
};

afterEach(() => {
  document.body.innerHTML = "";
});

describe("cu-input — valor y eventos", () => {
  it("teclear actualiza get() y emite update:modelValue en el host", async () => {
    const host = await mountCe();
    const updates: string[] = [];
    host.addEventListener("update:modelValue", (event) => {
      updates.push((event as CustomEvent<string>).detail);
    });

    await typeInto(host, "hola");

    expect(host.get()).toBe("hola");
    expect(inner(host).value).toBe("hola");
    expect(updates.at(-1)).toBe("hola");
  });

  it("set() escribe el valor (acepta number) y avisa; reset() limpia y avisa", async () => {
    const host = await mountCe();
    const updates: string[] = [];
    host.addEventListener("update:modelValue", (event) => {
      updates.push((event as CustomEvent<string>).detail);
    });

    host.set(42);
    await nextTick();
    expect(host.get()).toBe("42");
    expect(inner(host).value).toBe("42");
    expect(updates.at(-1)).toBe("42");

    host.reset();
    await nextTick();
    expect(host.get()).toBe("");
    expect(inner(host).value).toBe("");
    expect(updates.at(-1)).toBe("");
  });

  it("focus() enfoca el input interno (el host no es focuseable)", async () => {
    const host = await mountCe();

    host.focus();
    await nextTick();

    expect(host.shadowRoot?.activeElement).toBe(inner(host));
    expect(document.activeElement).toBe(host);
  });
});

describe("cu-input — atributos del host", () => {
  it("los atributos HTML/ARIA que no son props llegan al input interno", async () => {
    const host = await mountCe({
      name: "email",
      autocomplete: "email",
      maxlength: "5",
      required: "",
      "aria-invalid": "true",
    });

    const el = inner(host);
    expect(el.getAttribute("name")).toBe("email");
    expect(el.getAttribute("autocomplete")).toBe("email");
    expect(el.getAttribute("maxlength")).toBe("5");
    expect(el.hasAttribute("required")).toBe(true);
    expect(el.getAttribute("aria-invalid")).toBe("true");
  });

  it("`id` se queda en el host: no duplica el id en el documento", async () => {
    const host = await mountCe({ id: "email-ce" });

    expect(host.id).toBe("email-ce");
    expect(inner(host).hasAttribute("id")).toBe(false);
    expect(document.querySelectorAll("#email-ce")).toHaveLength(1);
  });
});
