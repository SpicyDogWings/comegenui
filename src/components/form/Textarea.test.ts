import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Textarea from "./Textarea.vue";

function factory(props: Record<string, unknown> = {}) {
  return mount(Textarea, { props });
}

describe("Textarea", () => {
  it("renderiza un textarea con clase cu-textarea", () => {
    const w = factory({});
    expect(w.find("textarea.cu-textarea").exists()).toBe(true);
  });

  it("aplica placeholder, rows y variant", () => {
    const w = factory({ placeholder: "Comentario", rows: 5, variant: "outlined" });
    const ta = w.find("textarea.cu-textarea");
    expect(ta.attributes("placeholder")).toBe("Comentario");
    expect(ta.attributes("rows")).toBe("5");
    expect(ta.classes()).toContain("cu-textarea--outlined");
  });

  it("disabled, readOnly y noResize se reflejan en clases y atributos", () => {
    const w = factory({ disabled: true, readOnly: true, noResize: true });
    const ta = w.find("textarea.cu-textarea");
    expect(ta.attributes("disabled")).toBeDefined();
    expect(ta.attributes("readonly")).toBeDefined();
    expect(ta.classes()).toContain("cu-textarea--disabled");
    expect(ta.classes()).toContain("cu-textarea--no-resize");
  });

  it("muestra el valor inicial del v-model", () => {
    const w = factory({ modelValue: "texto inicial" });
    const taEl = w.find("textarea.cu-textarea").element as HTMLTextAreaElement | undefined;
    expect(taEl?.value).toBe("texto inicial");
  });

  it("al escribir emite update:modelValue", async () => {
    const w = factory({});
    await w.find("textarea.cu-textarea").setValue("nueva descripción");
    const modelEm = w.emitted("update:modelValue");
    expect(modelEm).toBeTruthy();
    const value = (modelEm as unknown[][])[0]![0] as string;
    expect(value).toBe("nueva descripción");
  });
});
