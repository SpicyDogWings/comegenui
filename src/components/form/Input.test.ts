// Comportamiento de Input según su ficha (docs/componentes/vue/input.md).
//
// Aserciones escritas a mano desde la prosa: por eso pueden fallar por un bug real
// (ver scripts/mutation-check.mjs).
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, h, nextTick, ref } from "vue";
import Input from "./Input.vue";

type InputVm = {
  get: () => string;
  set: (v: string | number) => void;
  reset: () => void;
  focus: () => void;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as InputVm;
const field = (w: ReturnType<typeof mount>) => w.find("input.cu-input");

describe("Input — valor y v-model", () => {
  it("arranca vacío y escribir actualiza el valor y emite update:modelValue", async () => {
    const w = mount(Input);
    expect(vm(w).get()).toBe("");

    await field(w).setValue("hola");
    await flushPromises();

    expect(vm(w).get()).toBe("hola");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["hola"]);
  });

  it("refleja un modelValue externo y lo emite al teclear", async () => {
    const w = mount(Input, { props: { modelValue: "inicial" } });
    await flushPromises();
    expect((field(w).element as HTMLInputElement).value).toBe("inicial");

    await field(w).setValue("nuevo");
    await flushPromises();
    expect(vm(w).get()).toBe("nuevo");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["nuevo"]);
  });

  it("set() convierte a string y sincroniza get() y el input", async () => {
    const w = mount(Input);
    vm(w).set(42);
    await flushPromises();

    expect(vm(w).get()).toBe("42");
    expect((field(w).element as HTMLInputElement).value).toBe("42");
  });

  it("reset() limpia el campo", async () => {
    const w = mount(Input, { props: { modelValue: "algo" } });
    await flushPromises();

    vm(w).reset();
    await flushPromises();

    expect(vm(w).get()).toBe("");
    expect((field(w).element as HTMLInputElement).value).toBe("");
  });

  it("startValue está declarada pero reset() limpia: no restaura el valor inicial", async () => {
    const w = mount(Input, { props: { startValue: "inicial" } });
    await flushPromises();
    expect(vm(w).get()).toBe("");

    vm(w).set("editado");
    vm(w).reset();
    await flushPromises();

    expect(vm(w).get()).toBe("");
    expect((field(w).element as HTMLInputElement).value).toBe("");
  });

  it("cambiar modelValue desde afuera actualiza el valor mostrado", async () => {
    const model = ref("uno");
    const w = mount(defineComponent({ setup: () => () => h(Input, { modelValue: model.value }) }));
    await flushPromises();
    expect((field(w).element as HTMLInputElement).value).toBe("uno");

    model.value = "dos";
    await nextTick();
    await flushPromises();

    const input = w.findComponent(Input).vm as unknown as InputVm;
    expect(input.get()).toBe("dos");
    expect((field(w).element as HTMLInputElement).value).toBe("dos");
  });

  it("focus() enfoca el input real", async () => {
    const w = mount(Input, { attachTo: document.body });
    vm(w).focus();
    await flushPromises();

    expect(document.activeElement).toBe(field(w).element);
    w.unmount();
  });

  it("no emite valores intermedios durante una composición IME; sí al terminarla", async () => {
    const w = mount(Input);
    const el = field(w).element as HTMLInputElement;

    el.dispatchEvent(new CompositionEvent("compositionstart"));
    el.value = "に";
    el.dispatchEvent(new InputEvent("input", { bubbles: true, data: "に", inputType: "insertCompositionText" }));
    await flushPromises();
    expect(w.emitted("update:modelValue")).toBeUndefined();

    el.value = "日本";
    el.dispatchEvent(new CompositionEvent("compositionend"));
    await flushPromises();

    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["日本"]);
    expect(vm(w).get()).toBe("日本");
  });
});

describe("Input — props nativas", () => {
  it("propaga type, placeholder, disabled y readOnly al input nativo", () => {
    const w = mount(Input, {
      props: { type: "email", placeholder: "correo@ejemplo.com", disabled: true, readOnly: true },
    });
    const el = field(w).element as HTMLInputElement;
    expect(el.type).toBe("email");
    expect(el.placeholder).toBe("correo@ejemplo.com");
    expect(field(w).attributes("disabled")).toBeDefined();
    expect(field(w).attributes("readonly")).toBeDefined();
  });

  it("aplica la clase de variante y la de tamaño no-default", () => {
    const w = mount(Input, { props: { variant: "outlined", size: "lg" } });
    expect(field(w).classes()).toContain("cu-input--outlined");
    expect(field(w).classes()).toContain("cu-input--lg");
  });

  it("size md (default) no agrega clase de tamaño", () => {
    const w = mount(Input);
    expect(field(w).classes()).not.toContain("cu-input--md");
  });
});
