import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Badge from "./Badge.vue";

describe("Badge", () => {
  it("renderiza el slot dentro del span cu-badge", () => {
    const w = mount(Badge, { slots: { default: "Nuevo" } });
    const badge = w.find("span.cu-badge");
    expect(badge.exists()).toBe(true);
    expect(badge.text()).toBe("Nuevo");
  });

  it("variante por defecto: cu-badge--soft", () => {
    const w = mount(Badge);
    expect(w.find("span.cu-badge").classes()).toContain("cu-badge--soft");
  });

  it("variant: aplica la clase cu-badge--{variant}", () => {
    const w = mount(Badge, { props: { variant: "solid" } });
    expect(w.find("span.cu-badge").classes()).toContain("cu-badge--solid");
  });

  it("color: aplica las custom properties en el style", () => {
    const w = mount(Badge, { props: { color: "success" } });
    const style = w.find("span.cu-badge").attributes("style") ?? "";
    expect(style).toContain("var(--cu-color-success)");
  });
});
