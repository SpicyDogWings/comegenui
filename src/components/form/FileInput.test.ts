import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import FileInput from "./FileInput.vue";

function factory(props: Record<string, unknown> = {}) {
  return mount(FileInput, { props });
}

describe("FileInput", () => {
  it("renderiza el input file oculto y el placeholder por defecto", () => {
    const w = factory({});
    expect(w.find("input[type='file']").exists()).toBe(true);
    expect(w.find(".cu-file-input-placeholder").text()).toContain("Seleccionar archivo");
  });

  it("muestra el placeholder custom y propaga accept", () => {
    const w = factory({ placeholder: "Subí tu CV", accept: ".pdf,.docx" });
    expect(w.find(".cu-file-input-placeholder").text()).toContain("Subí tu CV");
    expect(w.find("input[type='file']").attributes("accept")).toBe(".pdf,.docx");
  });

  it("variant cambia la clase raíz", () => {
    const w = factory({ variant: "soft" });
    expect(w.find(".cu-file-input").classes()).toContain("cu-file-input--soft");
  });

  it("disabled agrega la clase y el atributo aria-disabled", () => {
    const w = factory({ disabled: true });
    expect(w.find(".cu-file-input").classes()).toContain("cu-file-input--disabled");
    expect(w.find(".cu-file-input").attributes("aria-disabled")).toBe("true");
  });

  it("muestra formatos legibles a partir de accept", () => {
    const w = factory({ accept: "image/*" });
    expect(w.find(".cu-file-input-placeholder").text()).toContain("Imagen");
  });

  it("muestra feedback cuando el archivo no coincide con accept", async () => {
    const w = factory({ accept: ".csv" });
    const input = w.find("input[type='file']");
    const file = new File(["x"], "doc.pdf", { type: "application/pdf" });
    Object.defineProperty(input.element, "files", { value: [file], configurable: true });
    await input.trigger("change");
    expect(w.find(".cu-file-input-reject").text()).toContain("Formato no permitido");
    expect(w.find(".cu-file-input-reject").text()).toContain(".csv");
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });

  it("muestra feedback cuando el archivo supera maxSize", async () => {
    const w = factory({ maxSize: 10 });
    const input = w.find("input[type='file']");
    const file = new File([new ArrayBuffer(100)], "grande.csv", { type: "text/csv" });
    Object.defineProperty(input.element, "files", { value: [file], configurable: true });
    await input.trigger("change");
    expect(w.find(".cu-file-input-reject").text()).toContain("tamaño máximo");
  });

  it("limpia el feedback al seleccionar un archivo válido", async () => {
    const w = factory({ accept: ".csv" });
    const input = w.find("input[type='file']");
    const bad = new File(["x"], "doc.pdf", { type: "application/pdf" });
    Object.defineProperty(input.element, "files", { value: [bad], configurable: true });
    await input.trigger("change");
    expect(w.find(".cu-file-input-reject").exists()).toBe(true);
    const good = new File(["a"], "datos.csv", { type: "text/csv" });
    Object.defineProperty(input.element, "files", { value: [good], configurable: true });
    await input.trigger("change");
    expect(w.find(".cu-file-input-reject").exists()).toBe(false);
    expect(w.emitted("update:modelValue")?.[0]?.[0]).toMatchObject({ name: "datos.csv" });
  });

  it("limpia el feedback al setear un archivo válido por v-model", async () => {
    const w = factory({ accept: ".csv" });
    const input = w.find("input[type='file']");
    const bad = new File(["x"], "doc.pdf", { type: "application/pdf" });
    Object.defineProperty(input.element, "files", { value: [bad], configurable: true });
    await input.trigger("change");
    expect(w.find(".cu-file-input-reject").exists()).toBe(true);
    await w.setProps({ modelValue: new File(["a"], "datos.csv", { type: "text/csv" }) });
    await nextTick();
    expect(w.find(".cu-file-input-reject").exists()).toBe(false);
  });
});
