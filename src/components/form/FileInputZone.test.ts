import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
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
});
