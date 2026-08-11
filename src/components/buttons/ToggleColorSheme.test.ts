import { describe, it, expect, vi, beforeEach } from "vitest";
import { nextTick } from "vue";
import { mount } from "@vue/test-utils";
import { setTheme } from "@/plugins/cu-tokens";
import ToggleColorSheme from "./ToggleColorSheme.vue";

// El plugin real necesita init() (fetch + matchMedia, ausente en jsdom) para
// poblar themeNames. Mockeamos el módulo con un ref reactivo real para probar
// el comportamiento del componente: toggle light <-> dark.
vi.mock("@/plugins/cu-tokens", async () => {
  const { ref } = await import("vue");
  const theme = ref("light");
  return {
    theme,
    loaded: ref(true),
    setTheme: (value: string) => {
      theme.value = value;
    },
    getThemeNames: () => ["light", "dark"],
    default: { install: () => undefined },
  };
});

describe("ToggleColorSheme", () => {
  beforeEach(() => {
    setTheme("light");
  });

  it("renderiza un botón con aria-label según tema claro (luna)", () => {
    const w = mount(ToggleColorSheme);
    const btn = w.find("button");
    expect(btn.exists()).toBe(true);
    expect(btn.attributes("aria-label")).toBe("Switch to dark mode");
  });

  it("clic cambia el tema a dark y actualiza aria-label a 'Switch to light mode'", async () => {
    const w = mount(ToggleColorSheme);
    await w.find("button").trigger("click");
    await nextTick();
    expect(w.find("button").attributes("aria-label")).toBe("Switch to light mode");
  });

  it("un segundo clic vuelve al tema claro", async () => {
    const w = mount(ToggleColorSheme);
    await w.find("button").trigger("click");
    await nextTick();
    await w.find("button").trigger("click");
    await nextTick();
    expect(w.find("button").attributes("aria-label")).toBe("Switch to dark mode");
  });
});
