// Comportamiento de Textarea según su ficha (docs/componentes/vue/textarea.md).
//
// Aserciones escritas a mano desde la prosa: fallan por bugs reales.
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import Textarea from "./Textarea.vue";

type TextareaVm = {
  get: () => string;
  set: (v: string | number) => void;
  reset: () => void;
  focus: () => void;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as TextareaVm;
const field = (w: ReturnType<typeof mount>) => w.find("textarea.cu-textarea");

describe("Textarea — valor y v-model", () => {
  it("arranca vacío, escribe, actualiza get() y emite update:modelValue", async () => {
    const w = mount(Textarea);
    expect(vm(w).get()).toBe("");

    await field(w).setValue("línea 1\nlínea 2");
    await flushPromises();

    expect(vm(w).get()).toBe("línea 1\nlínea 2");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["línea 1\nlínea 2"]);
  });

  it("refleja el modelValue externo en el textarea", async () => {
    const w = mount(Textarea, { props: { modelValue: "Texto predefinido" } });
    await flushPromises();
    expect((field(w).element as HTMLTextAreaElement).value).toBe("Texto predefinido");
  });

  it("set() convierte a string y reset() limpia", async () => {
    const w = mount(Textarea);
    vm(w).set(7);
    await flushPromises();
    expect(vm(w).get()).toBe("7");
    expect((field(w).element as HTMLTextAreaElement).value).toBe("7");

    vm(w).reset();
    await flushPromises();
    expect(vm(w).get()).toBe("");
    expect((field(w).element as HTMLTextAreaElement).value).toBe("");
  });
});

describe("Textarea — props y clases", () => {
  it("propaga rows, placeholder, disabled y readOnly", () => {
    const w = mount(Textarea, {
      props: { rows: 5, placeholder: "Escribe aquí...", disabled: true, readOnly: true },
    });
    const el = field(w).element as HTMLTextAreaElement;
    expect(el.rows).toBe(5);
    expect(el.placeholder).toBe("Escribe aquí...");
    expect(field(w).attributes("disabled")).toBeDefined();
    expect(field(w).attributes("readonly")).toBeDefined();
  });

  it("rows por defecto es 3", () => {
    expect((field(mount(Textarea)).element as HTMLTextAreaElement).rows).toBe(3);
  });

  it("aplica variante y no-resize; no aplica no-resize si no se pide", () => {
    const w = mount(Textarea, { props: { variant: "outlined", noResize: true } });
    expect(field(w).classes()).toContain("cu-textarea--outlined");
    expect(field(w).classes()).toContain("cu-textarea--no-resize");

    const plain = mount(Textarea);
    expect(field(plain).classes()).not.toContain("cu-textarea--no-resize");
  });
});
