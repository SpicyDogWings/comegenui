import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import type { ComponentStory, L1Context } from "./types";

/**
 * Runner de la capa L1: monta el `.vue` real con `@vue/test-utils` (jsdom) y
 * corre los `checks.l1` de cada story/variante.
 *
 * El nombre del test sigue `[componente] sección › variante › check` y el
 * reporter custom (`tools/reporters/playground-reporter.ts`) lee el `meta`
 * para pintar los resultados en el playground.
 */
export function runL1Story(story: ComponentStory): void {
  describe(`[${story.component}]`, () => {
    for (const section of story.sections) {
      const checks = section.checks.l1 ?? [];
      if (checks.length === 0) continue;

      describe(section.title, () => {
        for (const variant of section.variants) {
          for (const check of checks) {
            const meta = {
              component: story.component,
              section: section.id,
              variant: variant.id,
              layer: "l1",
            } as never;

            it(`${variant.id} › ${check.name}`, { meta }, async () => {
              await story.setup?.();

              const wrapper = mount(story.vue, {
                props: variant.props as Record<string, unknown>,
                attrs: variant.attrs,
                slots: variant.slots as never,
                global: story.global?.() as never,
              });

              try {
                const ctx: L1Context = { wrapper, expect, variant };
                await check.run(ctx, variant);
              } finally {
                wrapper.unmount();
              }
            });
          }
        }
      });
    }
  });
}
