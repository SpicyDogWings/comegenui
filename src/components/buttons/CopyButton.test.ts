import { describe, it, expect, vi, beforeEach } from "vitest";
import { mount } from "@vue/test-utils";
import CopyButton from "./CopyButton.vue";

describe("CopyButton", () => {
  beforeEach(() => {
    Object.defineProperty(navigator, "clipboard", {
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
      configurable: true,
    });
  });

  it("renderiza solo el icono dentro del Button interno", () => {
    const w = mount(CopyButton, { props: { text: "hola" } });
    expect(w.find("button.cu-button").exists()).toBe(true);
    expect(w.find("button.cu-button svg").exists()).toBe(true);
    expect(w.find("button.cu-button").text()).toBe("");
  });

  it("sin label: icon-only con aria-label de fallback", () => {
    const w = mount(CopyButton, { props: { text: "hola" } });
    const btn = w.find("button.cu-button");
    expect(btn.text()).toBe("");
    expect(btn.attributes("aria-label")).toBe("Copiar");
  });

  it("con label: texto siempre visible sin animación", () => {
    const w = mount(CopyButton, { props: { text: "hola", label: "Copiar JSON" } });
    const btn = w.find("button.cu-button");
    expect(btn.text()).toContain("Copiar JSON");
    expect(btn.attributes("aria-label")).toBe("Copiar JSON");
  });

  it("copiedLabel hace swap out-in con el label y vuelve", async () => {
    vi.useFakeTimers();
    const w = mount(CopyButton, {
      props: { text: "hola", label: "Copiar JSON", copiedLabel: "¡Copiado!" },
      attachTo: document.body,
    });
    const btn = w.find("button.cu-button");
    await btn.trigger("click");
    // out-in: leave del label + enter del copiedLabel
    await vi.advanceTimersByTimeAsync(500);
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith("hola");
    expect(btn.attributes("aria-label")).toBe("¡Copiado!");
    expect(btn.text()).toContain("¡Copiado!");
    expect(btn.text()).not.toContain("Copiar JSON");
    // reset + swap de vuelta
    await vi.advanceTimersByTimeAsync(2500);
    expect(btn.text()).toContain("Copiar JSON");
    expect(btn.text()).not.toContain("¡Copiado!");
    vi.useRealTimers();
  });
});
