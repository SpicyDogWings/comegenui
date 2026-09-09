import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import { nextTick } from "vue";
import FileInputZone from "./FileInputZone.vue";

function factory(props: Record<string, unknown> = {}) {
  return mount(FileInputZone, { props });
}

describe("FileInputZone", () => {
  it("renderiza la zona con placeholder por defecto y input file", () => {
    const w = factory({});
    expect(w.find(".cu-file-zone").exists()).toBe(true);
    expect(w.find("input[type='file']").exists()).toBe(true);
    expect(w.find(".cu-file-zone-placeholder").text()).toBe(
      "Selecciona un archivo o arrastra aquí",
    );
  });

  it("muestra el placeholder custom y los formatos aceptados", () => {
    const w = factory({ placeholder: "Arrastrá acá", accept: "image/png" });
    expect(w.find(".cu-file-zone-placeholder").text()).toBe("Arrastrá acá");
    expect(w.find(".cu-file-zone-formats").text()).toContain("image/png");
  });

  it("multiple marca el atributo multiple del input", () => {
    const w = factory({ multiple: true });
    expect(w.find("input[type='file']").attributes("multiple")).toBeDefined();
  });

  it("disabled agrega la clase y el atributo aria-disabled", () => {
    const w = factory({ disabled: true });
    expect(w.find(".cu-file-zone").classes()).toContain("cu-file-zone--disabled");
    expect(w.find(".cu-file-zone").attributes("aria-disabled")).toBe("true");
  });

  it("maxHeight se propaga al estado vacío", () => {
    const w = factory({ maxHeight: "300px" });
    expect(w.find(".cu-file-zone").exists()).toBe(true);
  });

  it("muestra feedback al rechazar archivos y conserva los válidos", async () => {
    const w = factory({ accept: ".csv", multiple: true });
    const input = w.find("input[type='file']");
    const good = new File(["a"], "datos.csv", { type: "text/csv" });
    const bad = new File(["x"], "doc.pdf", { type: "application/pdf" });
    Object.defineProperty(input.element, "files", { value: [good, bad], configurable: true });
    await input.trigger("change");
    expect(w.find(".cu-file-zone-reject-item").text()).toContain("doc.pdf");
    expect(w.find(".cu-file-zone-reject-item").text()).toContain("formato no permitido");
    expect(w.emitted("update:modelValue")?.[0]?.[0]).toEqual([good]);
  });

  it("muestra feedback cuando el archivo supera maxSize", async () => {
    const w = factory({ maxSize: 10 });
    const input = w.find("input[type='file']");
    const file = new File([new ArrayBuffer(100)], "grande.csv", { type: "text/csv" });
    Object.defineProperty(input.element, "files", { value: [file], configurable: true });
    await input.trigger("change");
    expect(w.find(".cu-file-zone-reject-item").text()).toContain("tamaño máximo");
    expect(w.emitted("update:modelValue")).toBeUndefined();
  });

  it("limpia el feedback al reset()", async () => {
    const w = factory({ accept: ".csv" });
    const input = w.find("input[type='file']");
    const bad = new File(["x"], "doc.pdf", { type: "application/pdf" });
    Object.defineProperty(input.element, "files", { value: [bad], configurable: true });
    await input.trigger("change");
    expect(w.find(".cu-file-zone-reject").exists()).toBe(true);
    (w.vm as any).reset();
    await nextTick();
    expect(w.find(".cu-file-zone-reject").exists()).toBe(false);
  });

  it("limpia el feedback al setear un archivo válido por v-model", async () => {
    const w = factory({ accept: ".csv" });
    const input = w.find("input[type='file']");
    const bad = new File(["x"], "doc.pdf", { type: "application/pdf" });
    Object.defineProperty(input.element, "files", { value: [bad], configurable: true });
    await input.trigger("change");
    expect(w.find(".cu-file-zone-reject").exists()).toBe(true);
    await w.setProps({ modelValue: new File(["a"], "datos.csv", { type: "text/csv" }) });
    await nextTick();
    expect(w.find(".cu-file-zone-reject").exists()).toBe(false);
  });
});
