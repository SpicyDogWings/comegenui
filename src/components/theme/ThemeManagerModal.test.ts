import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import ThemeManagerModal from "./ThemeManagerModal.vue";

function factory(props: Record<string, any> = {}) {
  return mount(ThemeManagerModal, {
    props: { themeName: "my-theme", cssOutput: ":root { --x: 1; }", ...props },
    global: { stubs: { teleport: true } },
  });
}

describe("ThemeManagerModal", () => {
  it("render smoke: estructura base con Modal interno", () => {
    const w = factory();
    expect(w.find(".tm-modal").exists()).toBe(true);
    expect(w.find(".cu-modal-title").text()).toBe("Theme Manager");
    expect(w.find(".cu-modal").attributes("data-size")).toBe("lg");
  });

  it("prop themeName se muestra en el input", () => {
    const w = factory({ themeName: "dark-v2" });
    const input = w.find("input.cu-input");
    expect((input.element as HTMLInputElement).value).toBe("dark-v2");
  });

  it("prop cssOutput se muestra en el bloque de código", () => {
    const w = factory({ cssOutput: ":root { --cu-color-primary: red; }" });
    expect(w.find(".tm-code").text()).toContain("--cu-color-primary");
  });

  it("escribir en el input emite update:themeName", async () => {
    const w = factory();
    await w.find("input.cu-input").setValue("nuevo-tema");
    await flushPromises();

    const em = w.emitted("update:themeName");
    expect(em).toBeTruthy();
    expect((em as unknown[][])[0]![0]).toBe("nuevo-tema");
  });

  it("botones de acción emiten sus eventos", async () => {
    const w = factory();
    const buttons = w.findAll("button.cu-button");
    const byText = (t: string) => buttons.find((b) => b.text() === t);

    await byText("Export JSON")!.trigger("click");
    expect(w.emitted("export")).toBeTruthy();

    await byText("Reset Defaults")!.trigger("click");
    expect(w.emitted("reset")).toBeTruthy();

    await byText("Copy CSS")!.trigger("click");
    expect(w.emitted("copy-css")).toBeTruthy();

    await byText("Download CSS")!.trigger("click");
    expect(w.emitted("download-css")).toBeTruthy();
  });
});
