import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import type {
  ComponentStory,
  L1Context,
  SectionCheck,
  Variant,
} from "../contract";

/**
 * Runner de la capa L1: monta el `.vue` real con `@vue/test-utils` (jsdom) y
 * corre los `checks.l1` de cada sección y extra de la story.
 *
 * El nombre del test sigue `[componente] bloque › variante › check` y el
 * reporter custom (`src/plugins/cu-playground/vitest/reporter.ts`) lee el `meta`
 * para pintar los resultados en el playground.
 *
 * `src/stories/runner.l1.ts` re-exporta este runner (backwards compat).
 */
export function runL1Story(story: ComponentStory): void {
  describe(`[${story.component}]`, () => {
    function runBlock(
      id: string,
      title: string,
      variants: Variant[],
      checks: SectionCheck<L1Context>[],
    ): void {
      if (checks.length === 0) return;
      describe(title, () => {
        for (const variant of variants) {
          for (const check of checks) {
            const meta = {
              component: story.component,
              section: id,
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

    for (const section of story.sections) {
      runBlock(section.id, section.title, section.variants, section.checks.l1 ?? []);
    }

    for (const extra of story.extras ?? []) {
      const variants = extra.variants?.length ? extra.variants : [{ id: "default" }];
      runBlock(extra.id, extra.title, variants, extra.checks?.l1 ?? []);
    }
  });
}
