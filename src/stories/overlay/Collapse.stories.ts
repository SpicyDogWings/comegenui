import Collapse from "@/components/overlay/Collapse.vue";
import type { ComponentStory, Variant } from "@/stories/types";
import { extras } from "./Collapse.stories.extras";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

function colorVariants(): Variant[] {
  return COLORS.map((color) => ({
    id: color,
    props: { label: "More information", color, defaultOpen: true },
    slots: { default: `The trigger uses the ${color} color token.` },
  }));
}

async function flush(): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 0));
}

export const cuCollapseStories: ComponentStory = {
  component: "cu-collapse",
  vue: Collapse,
  extras,
  tokens: [
    '--cu-space-2xs',
    '--cu-space-lg',
  ],
  api: {
    props: [
      { name: 'label', type: 'string', default: '(required)', description: 'Texto del trigger (required)' },
      { name: 'defaultOpen', type: 'boolean', default: 'false', description: 'Renderiza el contenido expandido al montar' },
      { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
    ],
    slots: [
      { name: 'default', description: 'Contenido colapsable' },
    ],
    events: [
      { name: 'toggle', type: '(value: boolean) => void', description: 'Cambia el estado (payload: isOpen)' },
    ],
    exposes: [
      { name: 'open', type: '() => void', description: 'Expande el contenido' },
      { name: 'close', type: '() => void', description: 'Colapsa el contenido' },
      { name: 'toggle', type: '() => void', description: 'Expande/colapsa' },
      { name: 'isOpen', type: '() => boolean', description: 'Estado del collapse' },
    ],
  },
  sections: [
    {
      id: "default",
      title: "Default",
      badge: "false",
      badgeTitle: "Cerrado por defecto",
      variants: [
        {
          id: "closed",
          props: { label: "More information" },
          slots: { default: "This content is hidden by default and revealed when the trigger is clicked." },
        },
      ],
      vue: `  <Collapse label="More information">
    This content is hidden by default and revealed when the trigger is clicked.
  </Collapse>`,
      vanilla: `<script src="dist/CuCollapse.umd.js"><\/script>

<cu-collapse label="More information">
  This content is hidden by default and revealed when the trigger is clicked.
</cu-collapse>`,
      checks: {
        l1: [
          {
            name: "renderiza el label y el contenido del slot",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-collapse-trigger").text()).toContain(String(variant.props?.label));
              expect(wrapper.text()).toContain(String(variant.slots?.default));
            },
          },
          {
            name: "comienza cerrado (isOpen=false, sin is-open en el chevron)",
            run({ wrapper, expect }) {
              const vm = wrapper.vm as unknown as { isOpen: () => boolean };
              expect(vm.isOpen()).toBe(false);
              expect(wrapper.find(".cu-collapse-chevron").classes()).not.toContain("is-open");
            },
          },
          {
            name: "click abre y emite toggle(true); segundo click cierra con toggle(false)",
            async run({ wrapper, expect }) {
              await wrapper.find(".cu-collapse-trigger").trigger("click");
              await flush();
              const vm = wrapper.vm as unknown as { isOpen: () => boolean };
              expect(vm.isOpen()).toBe(true);
              expect(wrapper.find(".cu-collapse-chevron").classes()).toContain("is-open");

              await wrapper.find(".cu-collapse-trigger").trigger("click");
              await flush();
              expect(vm.isOpen()).toBe(false);

              const toggles = wrapper.emitted("toggle") as unknown[][];
              expect(toggles).toBeTruthy();
              expect(toggles[0]![0]).toBe(true);
              expect(toggles[1]![0]).toBe(false);
            },
          },
          {
            name: "expone open/close/toggle",
            run({ wrapper, expect }) {
              const vm = wrapper.vm as unknown as {
                isOpen: () => boolean;
                open: () => void;
                close: () => void;
                toggle: () => void;
              };
              vm.open();
              expect(vm.isOpen()).toBe(true);
              vm.close();
              expect(vm.isOpen()).toBe(false);
              vm.toggle();
              expect(vm.isOpen()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "default-open",
      title: "Default Open",
      badge: "false",
      badgeTitle: "Valor por defecto",
      variants: [
        {
          id: "open",
          props: { label: "Advanced options", defaultOpen: true },
          slots: { default: "Use default-open to render the content expanded on mount." },
        },
      ],
      vue: `  <Collapse label="Advanced options" default-open>
    Use default-open to render the content expanded on mount.
  </Collapse>`,
      vanilla: `<script src="dist/CuCollapse.umd.js"><\/script>

<cu-collapse label="Advanced options" default-open>
  Use default-open to render the content expanded on mount.
</cu-collapse>`,
      checks: {
        l1: [
          {
            name: "defaultOpen=true: comienza abierto",
            run({ wrapper, expect }) {
              const vm = wrapper.vm as unknown as { isOpen: () => boolean };
              expect(vm.isOpen()).toBe(true);
              expect(wrapper.find(".cu-collapse-chevron").classes()).toContain("is-open");
            },
          },
          {
            name: "click cierra y emite toggle(false)",
            async run({ wrapper, expect }) {
              await wrapper.find(".cu-collapse-trigger").trigger("click");
              await flush();
              expect(wrapper.find(".cu-collapse-chevron").classes()).not.toContain("is-open");
              const toggles = wrapper.emitted("toggle") as unknown[][];
              expect(toggles[0]![0]).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "neutral",
      badgeTitle: "Color por defecto",
      variants: colorVariants(),
      vue: `  <Collapse label="More information" color="primary" default-open>
    The trigger uses the primary color token.
  </Collapse>`,
      vanilla: `<script src="dist/CuCollapse.umd.js"><\/script>

<cu-collapse label="More information" color="primary" default-open>
  The trigger uses the primary color token.
</cu-collapse>`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              expect(wrapper.html()).toContain(`var(--cu-color-${variant.props?.color}`);
            },
          },
          {
            name: "el contenido del slot se renderiza",
            run({ wrapper, expect }, variant) {
              expect(wrapper.text()).toContain(String(variant.slots?.default));
            },
          },
        ],
      },
    },

    {
      id: "nested",
      title: "Nested",
      variants: [
        {
          id: "primary",
          props: { label: "Parent section", color: "primary", defaultOpen: true },
          slots: { default: "Parent content." },
        },
        {
          id: "success",
          props: { label: "Another child", color: "success" },
          slots: { default: "Each level keeps an independent open state." },
        },
      ],
      vue: `  <Collapse label="Parent section" color="primary" default-open>
    Parent content.
    <Collapse label="Another child" color="success">
      Each level keeps an independent open state.
    </Collapse>
  </Collapse>`,
      vanilla: `<script src="dist/CuCollapse.umd.js"><\/script>

<cu-collapse label="Parent section" color="primary" default-open>
  Parent content.
  <cu-collapse label="Another child" color="success">
    Each level keeps an independent open state.
  </cu-collapse>
</cu-collapse>`,
      checks: {
        l1: [
          {
            name: "renderiza el trigger del collapse",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-collapse-trigger").text()).toContain(String(variant.props?.label));
            },
          },
        ],
      },
    },
  ],
};
