import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Alert from "./Alert.vue";

describe("Alert", () => {
  it("renderiza con props por defecto: cu-alert--soft, role alert y slot", () => {
    const w = mount(Alert, { slots: { default: "Mensaje de alerta" } });
    const alert = w.find(".cu-alert");
    expect(alert.exists()).toBe(true);
    expect(alert.classes()).toContain("cu-alert--soft");
    expect(alert.attributes("role")).toBe("alert");
    expect(alert.text()).toContain("Mensaje de alerta");
  });

  it("title: renderiza el título en el encabezado", () => {
    const w = mount(Alert, { props: { title: "Atención" } });
    expect(w.find(".cu-alert-title-text").text()).toBe("Atención");
  });

  it("variant: aplica la clase cu-alert--{variant}", () => {
    const w = mount(Alert, { props: { variant: "solid" } });
    expect(w.find(".cu-alert").classes()).toContain("cu-alert--solid");
  });

  it("color: aplica las custom properties en el style", () => {
    const w = mount(Alert, { props: { color: "danger" } });
    const style = w.find(".cu-alert").attributes("style") ?? "";
    expect(style).toContain("var(--cu-color-danger)");
  });

  it("show=false: oculta la alerta vía v-show", () => {
    const w = mount(Alert, { props: { show: false } });
    const style = w.find(".cu-alert").attributes("style") ?? "";
    expect(style).toContain("display: none");
  });

  it("close: el botón de cierre emite close y oculta la alerta", async () => {
    const w = mount(Alert, { props: { close: true } });
    const btn = w.find("button.cu-alert-close");
    expect(btn.exists()).toBe(true);
    await btn.trigger("click");
    expect(w.emitted("close")).toBeTruthy();
    const style = w.find(".cu-alert").attributes("style") ?? "";
    expect(style).toContain("display: none");
  });

  it("al cerrar emite update:show con false", async () => {
    const w = mount(Alert, { props: { close: true } });
    await w.find("button.cu-alert-close").trigger("click");
    const em = w.emitted("update:show");
    expect(em).toBeTruthy();
    const payload = (em as unknown[][])[0]![0] as boolean;
    expect(payload).toBe(false);
  });

  it("expone open/close/toggle para control imperativo", () => {
    const w = mount(Alert, { props: { show: false } });
    const vm = w.vm as unknown as {
      toggle: () => void;
      isOpen: () => boolean;
      close: () => void;
    };
    expect(vm.isOpen()).toBe(false);
    vm.toggle();
    expect(vm.isOpen()).toBe(true);
    vm.close();
    expect(vm.isOpen()).toBe(false);
  });
});
