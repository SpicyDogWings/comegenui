import { nextTick } from "vue";
import { createPinia } from "pinia";
import { init, registerTheme, setTheme } from "@/plugins/cu-tokens";
import ToggleColorSheme from "@/components/buttons/ToggleColorSheme.vue";
import type { ComponentStory } from "@/stories/types";

function stubMatchMedia(): void {
  if (window.matchMedia) return;
  window.matchMedia = ((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  })) as never;
}

export const cuToggleColorShemeStories: ComponentStory = {
  component: "cu-toggle-color-sheme",
  vue: ToggleColorSheme,
  async setup() {
    // El plugin real necesita init(); en jsdom el fetch falla y cae a defaults.
    // Registramos dark y arrancamos siempre en claro.
    stubMatchMedia();
    await init();
    registerTheme("dark", {});
    setTheme("light");
  },
  global: () => ({ plugins: [createPinia()] }),
  sections: [
    {
      id: "variants",
      title: "Variants",
      badge: "ghost",
      badgeTitle: "Variante por defecto",
      variants: [
        { id: "ghost", props: { variant: "ghost" } },
        { id: "soft", props: { variant: "soft" } },
        { id: "outlined", props: { variant: "outlined" } },
        { id: "subtle", props: { variant: "subtle" } },
        { id: "solid", props: { variant: "solid" } },
      ],
      vue: `  <ToggleColorScheme variant="ghost" />
  <ToggleColorScheme variant="soft" />
  <ToggleColorScheme variant="outlined" />
  <ToggleColorScheme variant="subtle" />
  <ToggleColorScheme variant="solid" />`,
      checks: {
        l1: [
          {
            name: "renderiza el Button icon-only",
            run({ wrapper, expect }) {
              const button = wrapper.find("button.cu-button");
              expect(button.exists()).toBe(true);
              expect(button.classes()).toContain("cu-button--icon-only");
            },
          },
          {
            name: "delega la variante al Button (default: ghost)",
            run({ wrapper, expect }, variant) {
              const value = (variant.props?.variant as string) ?? "ghost";
              expect(wrapper.find("button.cu-button").classes()).toContain(`cu-button--${value}`);
            },
          },
          {
            name: "aria-label según el tema activo (claro)",
            run({ wrapper, expect }) {
              expect(wrapper.find("button.cu-button").attributes("aria-label")).toBe("Switch to dark mode");
            },
          },
          {
            name: "clic cambia a dark y un segundo clic vuelve a light",
            async run({ wrapper, expect }) {
              const button = wrapper.find("button.cu-button");
              await button.trigger("click");
              await nextTick();
              expect(button.attributes("aria-label")).toBe("Switch to light mode");
              await button.trigger("click");
              await nextTick();
              expect(button.attributes("aria-label")).toBe("Switch to dark mode");
            },
          },
        ],
      },
    },

    {
      id: "size",
      title: "Size",
      badge: "20",
      badgeTitle: "Tamaño por defecto",
      variants: [
        { id: "size-16", props: { size: 16 } },
        { id: "size-20", props: { size: 20 } },
        { id: "size-24", props: { size: 24 } },
      ],
      vue: `  <ToggleColorScheme :size="16" />
  <ToggleColorScheme :size="20" />
  <ToggleColorScheme :size="24" />`,
      checks: {
        l1: [
          {
            name: "aplica el tamaño al svg del icono",
            run({ wrapper, expect }, variant) {
              const svg = wrapper.find("button.cu-button svg");
              expect(svg.attributes("width")).toBe(String(variant.props?.size));
              expect(svg.attributes("height")).toBe(String(variant.props?.size));
            },
          },
        ],
      },
    },
  ],
};
