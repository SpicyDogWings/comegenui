// Comportamiento de ToggleColorSheme según su ficha (docs/componentes/vue/toggle-color-sheme.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect, beforeEach } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import ToggleColorSheme from "./ToggleColorSheme.vue";
import { loaded, applyFullConfig, theme } from "@/plugins/cu-tokens";
import { useThemeStore } from "@/stores/theme";

function boot() {
  localStorage.clear();
  setActivePinia(createPinia());
  applyFullConfig({ themes: { light: { primary: "#ff0000" }, dark: { primary: "#0000ff" } } });
  loaded.value = true;
  // El plugin arranca en 'light' (detectTheme depende de matchMedia).
  theme.value = "light";
  return useThemeStore();
}

describe("ToggleColorSheme — icono y aria según el tema", () => {
  it("en modo claro muestra la luna y ofrece cambiar a oscuro", () => {
    boot();
    const w = mount(ToggleColorSheme);
    expect(w.find("button").attributes("aria-label")).toBe("Switch to dark mode");
    expect(w.html()).toContain("<svg");
  });

  it("en modo oscuro muestra el sol y ofrece cambiar a claro", () => {
    const store = boot();
    store.setTheme("dark");
    const w = mount(ToggleColorSheme);
    expect(w.find("button").attributes("aria-label")).toBe("Switch to light mode");
  });
});

describe("ToggleColorSheme — toggle", () => {
  it("click alterna el tema del store a oscuro y vuelta a claro", async () => {
    const store = boot();
    const w = mount(ToggleColorSheme);

    await w.find("button").trigger("click");
    await flushPromises();
    expect(store.current).toBe("dark");

    await w.find("button").trigger("click");
    await flushPromises();
    expect(store.current).toBe("light");
  });

  it("tras el click el aria-label refleja el estado nuevo", async () => {
    boot();
    const w = mount(ToggleColorSheme);
    await w.find("button").trigger("click");
    await flushPromises();
    expect(w.find("button").attributes("aria-label")).toBe("Switch to light mode");
  });
});
