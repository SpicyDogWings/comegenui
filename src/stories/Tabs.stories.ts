import Tabs from "@/components/Tabs.vue";
import type { ComponentStory, Variant } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const TABS = [
  { key: "a", label: "Tab A" },
  { key: "b", label: "Tab B" },
  { key: "c", label: "Tab C", disabled: true },
];

const PANEL_SLOTS = { a: "Contenido A", b: "Contenido B" };

type TabsVm = {
  getActive: () => string;
  setActive: (key: string) => void;
  next: () => void;
  prev: () => void;
};

function colorVariants(): Variant[] {
  return COLORS.map((color) => ({
    id: color,
    props: { tabs: TABS, variant: "solid", color },
    slots: PANEL_SLOTS,
  }));
}

export const cuTabsStories: ComponentStory = {
  component: "cu-tabs",
  vue: Tabs,
  sections: [
    {
      id: "variants",
      title: "Variants",
      badge: "ghost",
      badgeTitle: "Variante por defecto",
      variants: (["ghost", "solid", "boxed", "soft"] as const).map((variant) => ({
        id: variant,
        props: { tabs: TABS, variant },
        slots: PANEL_SLOTS,
      })),
      vue: `  <Tabs variant="ghost" :tabs="tabs">
    <template #a>Contenido A</template>
    <template #b>Contenido B</template>
  </Tabs>`,
      vanilla: `<script src="dist/CuTabs.umd.js"><\/script>

<cu-tabs variant="ghost">
  <div slot="a">Contenido A</div>
  <div slot="b">Contenido B</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    document.querySelector('cu-tabs').tabs = [
      { key: 'a', label: 'Tab A' },
      { key: 'b', label: 'Tab B' },
      { key: 'c', label: 'Tab C', disabled: true },
    ];
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza 3 tabs, la primera activa y la tercera disabled",
            run({ wrapper, expect }) {
              const tabs = wrapper.findAll(".cu-tabs-tab");
              expect(tabs.length).toBe(3);
              expect(tabs[0]!.classes()).toContain("cu-tabs-tab--active");
              expect(tabs[0]!.attributes("aria-selected")).toBe("true");
              expect((tabs[2]!.element as HTMLButtonElement).disabled).toBe(true);
            },
          },
          {
            name: "el panel de la tab activa muestra su slot",
            run({ wrapper, expect }) {
              expect(wrapper.find("#cu-tabs-panel-a").exists()).toBe(true);
              expect(wrapper.find(".cu-tabs-panel").text()).toContain("Contenido A");
            },
          },
          {
            name: "aplica la clase cu-tabs--{variant}",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-tabs").classes()).toContain(`cu-tabs--${variant.props?.variant}`);
            },
          },
          {
            name: "click en otra tab la activa y emite update:modelValue + change",
            async run({ wrapper, expect }) {
              const tabs = wrapper.findAll(".cu-tabs-tab");
              await tabs[1]!.trigger("click");
              expect(tabs[1]!.classes()).toContain("cu-tabs-tab--active");
              const model = wrapper.emitted("update:modelValue") as unknown[][] | undefined;
              expect(model).toBeTruthy();
              expect(model![0]![0]).toBe("b");
              const change = wrapper.emitted("change") as unknown[][] | undefined;
              expect(change).toBeTruthy();
              expect(change![0]![0]).toBe("b");
            },
          },
          {
            name: "click en la tab activa no emite nada",
            async run({ wrapper, expect }) {
              await wrapper.findAll(".cu-tabs-tab")[0]!.trigger("click");
              expect(wrapper.emitted("change")).toBeUndefined();
              expect(wrapper.emitted("update:modelValue")).toBeUndefined();
            },
          },
          {
            name: "click en tab disabled no cambia la activa ni emite",
            async run({ wrapper, expect }) {
              await wrapper.findAll(".cu-tabs-tab")[2]!.trigger("click");
              expect(wrapper.findAll(".cu-tabs-tab")[0]!.classes()).toContain("cu-tabs-tab--active");
              expect(wrapper.emitted("change")).toBeUndefined();
            },
          },
          {
            name: "expone getActive/setActive/next/prev",
            run({ wrapper, expect }) {
              const vm = wrapper.vm as unknown as TabsVm;
              expect(vm.getActive()).toBe("a");
              vm.setActive("b");
              expect(vm.getActive()).toBe("b");
              vm.prev();
              expect(vm.getActive()).toBe("a");
              vm.next();
              expect(vm.getActive()).toBe("b");
            },
          },
          {
            name: "teclado: ArrowRight avanza y ArrowLeft vuelve",
            async run({ wrapper, expect }) {
              const vm = wrapper.vm as unknown as TabsVm;
              await wrapper.find(".cu-tabs-header").trigger("keydown", { key: "ArrowRight" });
              expect(vm.getActive()).toBe("b");
              await wrapper.find(".cu-tabs-header").trigger("keydown", { key: "ArrowLeft" });
              expect(vm.getActive()).toBe("a");
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "primary",
      badgeTitle: "Color por defecto",
      variants: colorVariants(),
      vue: `  <Tabs v-for="color in ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']" :key="color" variant="solid" :color="color" :tabs="tabs">
    <template #a>Contenido A</template>
  </Tabs>`,
      vanilla: `<script src="dist/CuTabs.umd.js"><\/script>

<cu-tabs variant="solid" color="primary" id="tabs-primary"></cu-tabs>`,
      checks: {
        l1: [
          {
            name: "resuelve --tabs-color al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              expect(wrapper.html()).toContain(`var(--cu-color-${variant.props?.color}`);
            },
          },
        ],
      },
    },

    {
      id: "sizes",
      title: "Sizes",
      badge: "md",
      badgeTitle: "Tamaño por defecto",
      layout: "col",
      variants: (["sm", "md", "lg"] as const).map((size) => ({
        id: size,
        props: { tabs: TABS, variant: "boxed", size },
        slots: PANEL_SLOTS,
      })),
      vue: `  <Tabs v-for="size in ['sm', 'md', 'lg']" :key="size" variant="boxed" :size="size" :tabs="tabs">
    <template #a>Contenido A</template>
  </Tabs>`,
      vanilla: `<script src="dist/CuTabs.umd.js"><\/script>

<cu-tabs variant="boxed" size="md" id="tabs-md"></cu-tabs>`,
      checks: {
        l1: [
          {
            name: "aplica la clase cu-tabs--{size}",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-tabs").classes()).toContain(`cu-tabs--${variant.props?.size}`);
            },
          },
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      badgeTitle: "Valor por defecto",
      layout: "col",
      variants: [
        { id: "all-disabled", props: { tabs: TABS, disabled: true }, slots: PANEL_SLOTS },
        {
          id: "one-disabled",
          props: {
            tabs: [
              { key: "general", label: "General" },
              { key: "locked", label: "Locked", disabled: true },
              { key: "admin", label: "Admin" },
            ],
          },
          slots: { general: "Contenido General", locked: "Contenido Locked", admin: "Contenido Admin" },
        },
      ],
      vue: `  <!-- Todas deshabilitadas -->
  <Tabs variant="ghost" disabled :tabs="tabs">
    <template #a>Contenido A</template>
  </Tabs>

  <!-- Solo una deshabilitada -->
  <Tabs :tabs="[{ key: 'general', label: 'General' }, { key: 'locked', label: 'Locked', disabled: true }]">
    <template #general>Contenido General</template>
  </Tabs>`,
      vanilla: `<script src="dist/CuTabs.umd.js"><\/script>

<cu-tabs variant="ghost" disabled id="tabs-disabled"></cu-tabs>`,
      checks: {
        l1: [
          {
            name: "disabled global: clase y click sin cambio",
            async run({ wrapper, expect }, variant) {
              if (!variant.props?.disabled) return;
              expect(wrapper.find(".cu-tabs").classes()).toContain("cu-tabs--disabled");
              await wrapper.findAll(".cu-tabs-tab")[1]!.trigger("click");
              expect(wrapper.emitted("change")).toBeUndefined();
            },
          },
          {
            name: "disabled por tab: click en locked no cambia",
            async run({ wrapper, expect }, variant) {
              if (variant.props?.disabled) return;
              await wrapper.findAll(".cu-tabs-tab")[1]!.trigger("click");
              const tabs = wrapper.findAll(".cu-tabs-tab");
              expect(tabs[0]!.classes()).toContain("cu-tabs-tab--active");
              expect(wrapper.emitted("change")).toBeUndefined();
            },
          },
        ],
      },
    },

    {
      id: "keep-alive",
      title: "Keep Alive",
      badge: "false",
      badgeTitle: "keepAlive por tab",
      layout: "col",
      variants: [
        {
          id: "keepalive",
          props: {
            tabs: [
              { key: "a", label: "Tab A" },
              { key: "b", label: "Tab B", keepAlive: true },
            ],
          },
          slots: { a: "Contenido A", b: "Estado B" },
        },
      ],
      vue: `<Tabs :tabs="[
    { key: 'alive', label: 'Con keepAlive', keepAlive: true },
    { key: 'normal', label: 'Sin keepAlive' },
  ]">
    <template #alive>
      <input type="text" placeholder="Este texto sobrevive al cambio de tab..." />
    </template>
    <template #normal>
      <input type="text" placeholder="Este texto se pierde al cambiar de tab..." />
    </template>
  </Tabs>`,
      vanilla: `<script src="dist/CuTabs.umd.js"><\/script>

<cu-tabs id="tabs-keepalive">
  <input slot="alive" type="text" placeholder="Sobrevive" />
  <input slot="normal" type="text" placeholder="Se pierde" />
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    document.getElementById('tabs-keepalive').tabs = [
      { key: 'alive', label: 'Con keepAlive', keepAlive: true },
      { key: 'normal', label: 'Sin keepAlive' },
    ];
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "keepAlive: el panel se mantiene montado y oculto al volver",
            async run({ wrapper, expect }) {
              const panelB = wrapper.find("#cu-tabs-panel-b");
              expect(panelB.exists()).toBe(true);
              expect(panelB.attributes("style")).toContain("display: none");

              await wrapper.findAll(".cu-tabs-tab")[1]!.trigger("click");
              expect(wrapper.find("#cu-tabs-panel-b").attributes("style") ?? "").not.toContain("display: none");

              await wrapper.findAll(".cu-tabs-tab")[0]!.trigger("click");
              expect(wrapper.find("#cu-tabs-panel-b").exists()).toBe(true);
              expect(wrapper.find("#cu-tabs-panel-b").attributes("style")).toContain("display: none");
              expect(wrapper.find("#cu-tabs-panel-b").text()).toContain("Estado B");
            },
          },
        ],
      },
    },

    {
      id: "icons",
      title: "With Icons",
      variants: [
        {
          id: "icon-prop",
          props: {
            tabs: [{ key: "a", label: "Tab A", icon: "<b class='icon-prop'>I</b>" }],
          },
          slots: { a: "Contenido A" },
        },
        {
          id: "icon-slot",
          props: {
            tabs: [{ key: "a", label: "Tab A" }],
          },
          slots: { a: "Contenido A", "tab-icon-a": "<i class='icon-slot'>SLOT</i>" },
        },
      ],
      vue: `<script setup>
import Tabs from '@/components/Tabs.vue'

// icon: HTML/SVG string — consistente con label (el slot tab-icon-{key} queda como fallback)
const tabs = [
  { key: 'home', label: 'Home', icon: '<svg ...></svg>' },
]
<\/script>

<template>
  <Tabs variant="ghost" :tabs="tabs">
    <template #home>Contenido Home</template>
  </Tabs>
</template>`,
      vanilla: `<script src="dist/CuTabs.umd.js"><\/script>

<cu-tabs id="tabs-icons" variant="ghost">
  <div slot="home">Contenido Home</div>
</cu-tabs>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    document.getElementById('tabs-icons').tabs = [
      { key: 'home', label: 'Home', icon: '<svg ...></svg>' },
    ];
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "icon: la prop tiene precedencia sobre el slot",
            run({ wrapper, expect }, variant) {
              const tabs = variant.props?.tabs as Array<{ icon?: string }> | undefined;
              if (!tabs?.[0]?.icon) return;
              expect(wrapper.find(".cu-tabs-tab-icon .icon-prop").exists()).toBe(true);
              expect(wrapper.find(".icon-slot").exists()).toBe(false);
              expect(wrapper.find(".cu-tabs-tab").text()).toContain("Tab A");
            },
          },
          {
            name: "icon: sin prop, funciona el slot tab-icon-{key}",
            run({ wrapper, expect }, variant) {
              const tabs = variant.props?.tabs as Array<{ icon?: string }> | undefined;
              if (tabs?.[0]?.icon) return;
              expect(wrapper.find(".cu-tabs-tab-icon").exists()).toBe(false);
              expect(wrapper.find(".icon-slot").exists()).toBe(true);
            },
          },
        ],
      },
    },
  ],
};
