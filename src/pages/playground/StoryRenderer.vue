<script lang="ts">
import { defineComponent, h, type PropType, type VNodeChild } from "vue";
import Badge from "@/components/information/Badge.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import type { ComponentStory, Section, Variant } from "@/stories/types";

function slotFns(variant: Variant): Record<string, () => VNodeChild> {
  const slots: Record<string, () => VNodeChild> = {};
  for (const [name, content] of Object.entries(variant.slots ?? {})) {
    slots[name] = typeof content === "function" ? (content as () => VNodeChild) : () => content;
  }
  return slots;
}

/**
 * Renderiza una story en el playground: secciones, headings, snippets de código
 * y preview (por variantes o con `preview` interactivo). Las mismas stories
 * alimentan los tests de las 3 capas.
 */
export default defineComponent({
  name: "StoryRenderer",
  props: {
    story: { type: Object as PropType<ComponentStory>, required: true },
  },
  setup(props) {
    function renderVariant(variant: Variant): VNodeChild {
      return h(
        props.story.vue,
        { ...(variant.props ?? {}), ...(variant.attrs ?? {}), key: variant.id },
        slotFns(variant),
      );
    }

    function renderSection(section: Section): VNodeChild {
      const layoutClass = section.layout === "col" ? "playground-col" : "playground-row";
      const preview = section.preview
        ? h(section.preview)
        : section.variants.map((variant) => renderVariant(variant));

      return h("section", { id: section.id, class: "playground-section" }, [
        h("div", { class: "playground-heading" }, [
          h("h2", null, section.title),
          section.badge
            ? h(Badge, { color: "neutral", title: section.badgeTitle }, () => section.badge ?? "")
            : null,
        ]),
        h(SectionDemo, { vueCode: section.vue, vanillaCode: section.vanilla }, () =>
          h("div", { class: layoutClass }, preview),
        ),
      ]);
    }

    return () =>
      h(
        "div",
        { class: "story-renderer" },
        props.story.sections.flatMap((section, index) => [
          index > 0 ? h("hr", { class: "playground-separator" }) : null,
          renderSection(section),
        ]),
      );
  },
});
</script>
