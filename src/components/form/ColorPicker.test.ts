// Comportamiento de ColorPicker según su ficha (docs/versiones/5.2.4/componentes/vue/color-picker.md).
//
// Aserciones escritas a mano desde la prosa: fallan por bugs reales.
import { describe, it, expect } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { defineComponent, ref } from "vue";
import ColorPicker from "./ColorPicker.vue";

type ColorPickerVm = {
  get: () => string;
  set: (v: string) => void;
  reset: () => void;
  focus: () => void;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as ColorPickerVm;
const swatchColor = (w: ReturnType<typeof mount>) =>
  w.find(".cu-color-picker-swatch-color").element as HTMLElement;
const textInput = (w: ReturnType<typeof mount>) => w.find(".cu-color-picker-input");

describe("ColorPicker — valor y v-model", () => {
  it("arranca en #000000 y el swatch refleja el color actual", () => {
    const w = mount(ColorPicker);
    expect(vm(w).get()).toBe("#000000");
    expect(swatchColor(w).style.backgroundColor).toBe("rgb(0, 0, 0)");
  });

  it("un modelValue externo se refleja en get() y en el swatch", async () => {
    const w = mount(ColorPicker, { props: { modelValue: "#ff5733" } });
    await flushPromises();
    expect(vm(w).get()).toBe("#ff5733");
    expect(swatchColor(w).style.backgroundColor).toBe("rgb(255, 87, 51)");
  });

  it("set() actualiza el color y reset() vuelve a negro", async () => {
    const w = mount(ColorPicker);
    vm(w).set("#1774A4");
    await flushPromises();
    expect(vm(w).get()).toBe("#1774A4");

    vm(w).reset();
    await flushPromises();
    expect(vm(w).get()).toBe("#000000");
  });

  it("elegir en el picker nativo emite update:modelValue y change", async () => {
    const w = mount(ColorPicker, { props: { modelValue: "#000000" } });
    const native = w.find("input.cu-color-picker-native");
    await native.setValue("#abcdef");
    await flushPromises();

    expect(vm(w).get()).toBe("#abcdef");
    expect(w.emitted("update:modelValue")?.at(-1)).toEqual(["#abcdef"]);
    expect(w.emitted("change")?.at(-1)).toEqual(["#abcdef"]);
  });
});

describe("ColorPicker — campo de texto hex", () => {
  it("un hex válido escrito confirma el valor y emite change", async () => {
    const w = mount(ColorPicker);
    await textInput(w).setValue("#12ab34");
    await flushPromises();

    expect(vm(w).get()).toBe("#12ab34");
    expect(w.emitted("change")?.at(-1)).toEqual(["#12ab34"]);
  });

  it("un valor inválido al perder el foco se descarta y restaura el último válido", async () => {
    const w = mount(ColorPicker, { props: { modelValue: "#1774A4" } });
    await flushPromises();

    await textInput(w).setValue("#zzz"); // inválido
    await flushPromises();
    expect(vm(w).get()).toBe("#1774A4"); // no confirma

    await textInput(w).trigger("blur");
    await flushPromises();
    expect((textInput(w).element as HTMLInputElement).value).toBe("#1774A4");
  });
});

describe("ColorPicker — disabled y swatch", () => {
  it("el botón swatch queda deshabilitado con disabled", () => {
    const w = mount(ColorPicker, { props: { disabled: true, modelValue: "#dc3545" } });
    expect(w.find(".cu-color-picker").classes()).toContain("cu-color-picker--disabled");
    expect(w.find(".cu-color-picker-swatch").attributes("disabled")).toBeDefined();
  });
});

// El host re-renderiza en el tick siguiente: con `v-model` (o desde el custom
// element) la prop vuelve después. Los métodos ven el valor ya, como en el
// ejemplo de la ficha (`cp.set('#ff8800')` y después `cp.get()`).
describe("ColorPicker — API imperativa con v-model", () => {
  function mountControlled() {
    const Host = defineComponent({
      components: { ColorPicker },
      setup() {
        const value = ref("#000000");
        return { value };
      },
      template: `<ColorPicker v-model="value" />`,
    });
    const w = mount(Host);
    return { w, api: () => w.findComponent(ColorPicker).vm as unknown as ColorPickerVm };
  }

  it("set() se ve en get() en el mismo tick", () => {
    const { api } = mountControlled();

    api().set("#ff8800");

    expect(api().get()).toBe("#ff8800");
  });

  it("dos set() seguidos y reset() dejan el último valor", () => {
    const { api } = mountControlled();

    api().set("#ff8800");
    api().set("#00ff00");
    expect(api().get()).toBe("#00ff00");

    api().reset();
    expect(api().get()).toBe("#000000");
  });
});

describe("ColorPicker — accesibilidad", () => {
  it("el swatch es un botón con nombre accesible", () => {
    const w = mount(ColorPicker);
    const swatch = w.find(".cu-color-picker-swatch");

    expect(swatch.element.tagName).toBe("BUTTON");
    expect(swatch.attributes("aria-label")).toBeTruthy();
  });

  it("el picker nativo queda fuera del árbol de accesibilidad (lo maneja el swatch)", () => {
    const w = mount(ColorPicker);
    expect(w.find("input.cu-color-picker-native").attributes("aria-hidden")).toBe("true");
  });

  it("el click en el swatch abre el picker nativo; con disabled no", async () => {
    const w = mount(ColorPicker, { attachTo: document.body });
    const native = w.find("input.cu-color-picker-native").element as HTMLInputElement;
    let clicks = 0;
    native.click = () => { clicks += 1; };

    await w.find(".cu-color-picker-swatch").trigger("click");
    expect(clicks).toBe(1);

    await w.setProps({ disabled: true });
    await w.find(".cu-color-picker-swatch").trigger("click");
    expect(clicks).toBe(1);

    w.unmount();
  });
});
