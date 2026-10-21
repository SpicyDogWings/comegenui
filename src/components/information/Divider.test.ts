// Comportamiento de Divider según su ficha (docs/versiones/5.1.2/componentes/vue/divider.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Divider from "./Divider.vue";

const root = (w: ReturnType<typeof mount>) => w.find(".cu-divider");

describe("Divider — orientación y semántica", () => {
  it("horizontal sin label ni slot es un <hr> (separador nativo)", () => {
    const w = mount(Divider);
    expect(root(w).element.tagName).toBe("HR");
    expect(root(w).classes()).toContain("cu-divider--horizontal");
    expect(root(w).attributes("role")).toBeUndefined();
  });

  it("vertical es un `role=separator` con `aria-orientation=vertical`", () => {
    const w = mount(Divider, { props: { orientation: "vertical" } });
    expect(root(w).element.tagName).toBe("DIV");
    expect(root(w).classes()).toContain("cu-divider--vertical");
    expect(root(w).attributes("role")).toBe("separator");
    expect(root(w).attributes("aria-orientation")).toBe("vertical");
  });

  it("horizontal con label es `role=separator` y no lleva `aria-orientation`", () => {
    const w = mount(Divider, { props: { label: "o" } });
    expect(root(w).element.tagName).toBe("DIV");
    expect(root(w).attributes("role")).toBe("separator");
    expect(root(w).attributes("aria-orientation")).toBeUndefined();
  });
});

describe("Divider — label y slot", () => {
  it("sin label ni slot no renderiza texto", () => {
    const w = mount(Divider);
    expect(w.find(".cu-divider-label").exists()).toBe(false);
    expect(root(w).text()).toBe("");
  });

  it("con label muestra el texto entre dos líneas decorativas", () => {
    const w = mount(Divider, { props: { label: "Sección" } });
    expect(w.find(".cu-divider-label").text()).toBe("Sección");

    const lines = w.findAll(".cu-divider-line");
    expect(lines).toHaveLength(2);
    for (const line of lines) expect(line.attributes("aria-hidden")).toBe("true");
  });

  it("el slot tiene prioridad sobre label", () => {
    const w = mount(Divider, {
      props: { label: "label" },
      slots: { default: "<strong>slot</strong>" },
    });
    const label = w.find(".cu-divider-label");
    expect(label.find("strong").text()).toBe("slot");
    expect(label.text()).not.toContain("label");
  });

  it("el slot rico solo (sin label) también corta la línea con `role=separator`", () => {
    const w = mount(Divider, { slots: { default: "<span>rico</span>" } });
    expect(root(w).element.tagName).toBe("DIV");
    expect(root(w).attributes("role")).toBe("separator");
    expect(w.text()).toContain("rico");
  });
});

describe("Divider — variantes y color", () => {
  it("cada variante aplica su clase (solid es la default)", () => {
    expect(root(mount(Divider)).classes()).toContain("cu-divider--solid");
    for (const variant of ["solid", "dashed", "dotted"] as const) {
      const w = mount(Divider, { props: { variant } });
      expect(root(w).classes()).toContain(`cu-divider--${variant}`);
    }
  });

  it("el color se resuelve con el token del tema, nunca con un hex", () => {
    const w = mount(Divider, { props: { color: "primary" } });
    const style = root(w).attributes("style") ?? "";
    expect(style).toContain("--cu-color-primary-subtle-border");
    expect(style).not.toMatch(/#[0-9a-f]{3,8}/i);
  });

  it("cada color semántico apunta a su propio token", () => {
    for (const color of ["primary", "secondary", "neutral", "success", "warning", "danger"] as const) {
      const w = mount(Divider, { props: { color } });
      expect(root(w).attributes("style") ?? "").toContain(`--cu-color-${color}-subtle-border`);
    }
  });
});
