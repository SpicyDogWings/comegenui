import { describe, it, expect } from "vitest";
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
});
