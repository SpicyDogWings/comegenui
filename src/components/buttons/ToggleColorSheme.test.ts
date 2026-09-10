import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { createPinia } from "pinia";
import { setTheme } from "@/plugins/cu-tokens";
import ToggleColorSheme from "./ToggleColorSheme.vue";

// El plugin real necesita init() (fetch + matchMedia, ausente en jsdom) para
// poblar themeNames. Mockeamos el módulo con un ref reactivo real y montamos
// con Pinia (el componente usa el store `theme`) para probar el toggle
// light <-> dark.
vi.mock("@/plugins/cu-tokens", async () => {
  const { ref } = await import("vue");
  const theme = ref("light");
  return {
    theme,
    setTheme: (value: string) => {
      theme.value = value;
    },
    getThemeNames: () => ["light", "dark"],
    allThemes: ref({}),
    builtInNames: ref(["light", "dark"]),
    registerTheme: () => undefined,
    getThemeCSS: () => "",
    getShared: () => ({}),
    setShared: () => undefined,
    applyFullConfig: () => undefined,
  };
});

function factory() {
  return mount(ToggleColorSheme, { global: { plugins: [createPinia()] } });
}

describe("ToggleColorSheme", () => {
  beforeEach(() => {
    setTheme("light");
  });

  it("renderiza un botón con aria-label según tema claro (luna)", () => {
    const w = factory();
    const btn = w.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.attributes("aria-label")).toBe("Switch to dark mode");
  });

  it("clic cambia el tema a dark y actualiza aria-label a 'Switch to light mode'", async () => {
    const w = factory();
    await w.find("button").trigger("click");
    await nextTick();
    expect(w.find("button").attributes("aria-label")).toBe("Switch to light mode");
  });

  it("un segundo clic vuelve al tema claro", async () => {
    const w = factory();
    await w.find("button").trigger("click");
    await nextTick();
    await w.find("button").trigger("click");
    await nextTick();
    expect(w.find("button").attributes("aria-label")).toBe("Switch to dark mode");
  });
});
