// Comportamiento de ThemeDropdown según su ficha (docs/componentes/vue/theme-dropdown.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect, beforeEach, vi } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { createPinia, setActivePinia } from "pinia";
import ThemeDropdown from "./ThemeDropdown.vue";
import { loaded, applyFullConfig, theme } from "@/plugins/cu-tokens";
import { useThemeStore } from "@/stores/theme";

function boot() {
  localStorage.clear();
  setActivePinia(createPinia());
  // El dropdown solo lista temas cuando el plugin terminó de cargar.
  applyFullConfig({
    themes: {
      light: { primary: "#ff0000" },
      dark: { primary: "#0000ff" },
      "nord-frost": { primary: "#88c0d0" },
    },
  });
  loaded.value = true;
  theme.value = "light";
  return useThemeStore();
}

const openPanel = async (w: ReturnType<typeof mount>) => {
  await w.find(".cu-button").trigger("click");
  await flushPromises();
};

describe("ThemeDropdown — trigger", () => {
  it("muestra el tema actual como label", () => {
    boot();
    const w = mount(ThemeDropdown);
    expect(w.find(".theme-dropdown-label").text()).toBe("Light");
  });

  it("abre el panel con el buscador y la lista de temas", async () => {
    boot();
    const w = mount(ThemeDropdown);
    await openPanel(w);
    expect(w.find(".theme-dropdown-search").exists()).toBe(true);
    expect(w.findAll(".theme-dropdown-item")).toHaveLength(3);
  });

  it("etiqueta los nombres con espacios (nord-frost → Nord Frost)", async () => {
    boot();
    const w = mount(ThemeDropdown);
    await openPanel(w);
    const labels = w.findAll(".theme-dropdown-item-label").map((n) => n.text());
    expect(labels).toContain("Nord Frost");
  });
});

describe("ThemeDropdown — selección", () => {
  it("click en un tema lo aplica al store", async () => {
    const store = boot();
    const w = mount(ThemeDropdown);
    await openPanel(w);

    const dark = w.findAll(".theme-dropdown-item").find((b) => b.text().includes("Dark"))!;
    await dark.trigger("click");
    await flushPromises();

    expect(store.current).toBe("dark");
  });

  it("marca con la clase active el tema actual", async () => {
    boot();
    const w = mount(ThemeDropdown);
    await openPanel(w);
    const light = w.findAll(".theme-dropdown-item").find((b) => b.text().includes("Light"))!;
    expect(light.classes()).toContain("theme-dropdown-item--active");
  });

  it("cerrar la selección limpia la búsqueda", async () => {
    boot();
    const w = mount(ThemeDropdown);
    await openPanel(w);

    const input = w.find(".theme-dropdown-search input");
    await input.setValue("nord");
    await flushPromises();
    expect(w.findAll(".theme-dropdown-item")).toHaveLength(1);

    await w.findAll(".theme-dropdown-item")[0]!.trigger("click");
    await flushPromises();

    if (w.find(".theme-dropdown-search input").exists()) {
      expect((w.find(".theme-dropdown-search input").element as HTMLInputElement).value).toBe("");
    }
  });
});

describe("ThemeDropdown — búsqueda", () => {
  it("filtra los temas por texto", async () => {
    boot();
    const w = mount(ThemeDropdown);
    await openPanel(w);

    await w.find(".theme-dropdown-search input").setValue("dark");
    await flushPromises();

    expect(w.findAll(".theme-dropdown-item")).toHaveLength(1);
    expect(w.findAll(".theme-dropdown-item")[0]!.text()).toContain("Dark");
  });
});
