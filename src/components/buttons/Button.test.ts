import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Button from "./Button.vue";

describe("Button", () => {
  it("renderiza con props por defecto: tipo button, variante ghost, no disabled", () => {
    const w = mount(Button);
    const btn = w.find("button.cu-button");
    expect(btn.exists()).toBe(true);
    expect(btn.classes()).toContain("cu-button--ghost");
    expect(btn.attributes("type")).toBe("button");
    expect(btn.attributes("disabled")).toBeUndefined();
  });

  it("renderiza el slot como contenido del botón", () => {
    const w = mount(Button, { slots: { default: "Guardar" } });
    expect(w.find("button.cu-button").text()).toContain("Guardar");
  });

  it("emite click al hacer clic", async () => {
    const w = mount(Button);
    await w.find("button.cu-button").trigger("click");
    const em = w.emitted("click");
    expect(em).toBeTruthy();
    expect((em as unknown[][]).length).toBeGreaterThan(0);
  });

  it("disabled: aplica atributo/class y NO emite click", async () => {
    const w = mount(Button, { props: { disabled: true } });
    const btn = w.find("button.cu-button");
    expect(btn.attributes("disabled")).toBeDefined();
    expect(btn.classes()).toContain("cu-button--disabled");
    await btn.trigger("click");
    expect(w.emitted("click")).toBeUndefined();
  });

  it("loading: deshabilita el botón y muestra el spinner", () => {
    const w = mount(Button, { props: { loading: true } });
    const btn = w.find("button.cu-button");
    expect(btn.attributes("disabled")).toBeDefined();
    expect(btn.classes()).toContain("cu-button--disabled");
    expect(w.find(".cu-button-spinner").exists()).toBe(true);
  });

  it("variant: aplica la clase cu-button--{variant}", () => {
    const w = mount(Button, { props: { variant: "solid" } });
    expect(w.find("button.cu-button").classes()).toContain("cu-button--solid");
  });

  it("color: aplica las custom properties de color en el style", () => {
    const w = mount(Button, { props: { color: "primary" } });
    const style = w.find("button.cu-button").attributes("style") ?? "";
    expect(style).toContain("var(--cu-color-primary)");
  });

  it("to: renderiza un wrapper <a> con href/target y el botón adentro", () => {
    const w = mount(Button, { props: { to: "/ruta", target: "_blank" } });
    const link = w.find("a.cu-button-link");
    expect(link.exists()).toBe(true);
    expect(link.attributes("href")).toBe("/ruta");
    expect(link.attributes("target")).toBe("_blank");
    expect(w.find("button.cu-button").exists()).toBe(true);
  });
});
