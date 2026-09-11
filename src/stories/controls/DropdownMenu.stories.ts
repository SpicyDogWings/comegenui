// Story de DropdownMenu (componente público cu-dropdown-menu).
// Secciones espejo de la página legacy; los checks migran DropdownMenu.test.ts.
import { nextTick } from "vue";
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./DropdownMenu.stories.extras";

interface DropdownItem {
  label?: string;
  icon?: string;
  href?: string;
  onClick?: () => void;
  color?: string;
  variant?: string;
  disabled?: boolean;
  divider?: boolean;
  target?: string;
}

interface DropdownMenuInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => unknown;
}

function instance(wrapper: { vm: unknown }): DropdownMenuInstance {
  return wrapper.vm as unknown as DropdownMenuInstance;
}

async function openPanel(wrapper: { vm: unknown }): Promise<void> {
  instance(wrapper).open();
  await nextTick();
}

const basicItems: DropdownItem[] = [
  { label: "Edit" },
  { label: "Duplicate" },
  { label: "Archive" },
];

const iconItems: DropdownItem[] = [
  { label: "Copy", icon: "<svg data-icon='copy'></svg>" },
  { label: "Download", icon: "<svg data-icon='download'></svg>" },
  { label: "Delete", icon: "<svg data-icon='delete'></svg>", color: "danger" },
];

const dividerItems: DropdownItem[] = [
  { label: "Cut" },
  { label: "Copy" },
  { divider: true },
  { label: "Paste" },
];

const mixedItems: DropdownItem[] = [
  { label: "Editar" },
  { label: "Eliminar", color: "danger" },
  { label: "Separador", divider: true },
  { label: "Deshabilitado", disabled: true },
  { label: "Icono", icon: "<svg data-icon='x'></svg>" },
];

let clickCount = 0;

function clickableItems(): DropdownItem[] {
  return [{ label: "Editar", onClick: () => (clickCount += 1) }];
}

function disabledClickableItems(): DropdownItem[] {
  return [{ label: "Editar", disabled: true, onClick: () => (clickCount += 1) }];
}

const POSITION_STYLE: Record<string, string> = {
  bottom: "top: 100%",
  top: "bottom: 100%",
  left: "right: 100%",
  right: "left: 100%",
};

const ALIGN_STYLE: Record<string, string> = {
  start: "left: 0",
  end: "right: 0",
  center: "translateX(-50%)",
};

export const cuDropdownMenuStories: ComponentStory = {
  component: "cu-dropdown-menu",
  vue: DropdownMenu,
  tokens: [
    "--cu-border-color",
    "--cu-border-thin",
    "--cu-space-md",
    "--cu-space-xs"
  ],
  classes: [
    "cu-dropdown-chevron",
    "cu-dropdown-chevron--open",
    "cu-dropdown-divider",
    "cu-dropdown-icon",
    "cu-dropdown-item",
    "cu-dropdown-toggle"
  ],
  api: {
    "components": [
      {
        "label": "Dropdown",
        "path": "/playground/components/dropdown"
      },
      {
        "label": "Button",
        "path": "/playground/components/button"
      }
    ],
    "props": [
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "neutral",
        "description": "primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "variant",
        "type": "solid | outlined | soft | ghost | subtle | link | none",
        "default": "ghost",
        "description": "solid, outlined, soft, ghost, subtle, link, none"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Deshabilita el trigger"
      },
      {
        "name": "label",
        "type": "string",
        "default": "",
        "description": "Texto del trigger (si no hay slot)"
      },
      {
        "name": "position",
        "type": "bottom | top | left | right",
        "default": "bottom",
        "description": "bottom, top, left, right"
      },
      {
        "name": "align",
        "type": "start | center | end",
        "default": "start",
        "description": "start, center, end"
      },
      {
        "name": "textAlign",
        "type": "left | center | right",
        "default": "left",
        "description": "Alineación del texto de los items"
      },
      {
        "name": "offset",
        "type": "number",
        "default": "4",
        "description": "Separación del panel (px)"
      },
      {
        "name": "fixed",
        "type": "boolean",
        "default": "false",
        "description": "Panel position: fixed (viewport)"
      },
      {
        "name": "items",
        "type": "Array as () => DropdownItem[]",
        "description": "Items del menú"
      }
    ],
    "slots": [
      {
        "name": "toggle",
        "description": "Contenido del trigger; scoped: { toggle, isOpen }."
      },
      {
        "name": "default",
        "description": "Contenido del panel."
      }
    ],
    "events": [
      {
        "name": "open",
        "type": "() => void",
        "description": "Abre el menú."
      },
      {
        "name": "close",
        "type": "() => void",
        "description": "Cierra el menú."
      }
    ],
    "exposes": [
      {
        "name": "open()",
        "type": "() => void",
        "description": "Abre el menú."
      },
      {
        "name": "close()",
        "type": "() => void",
        "description": "Cierra el menú."
      },
      {
        "name": "toggle()",
        "type": "() => void",
        "description": "Alterna la visibilidad del menú."
      },
      {
        "name": "isOpen()",
        "type": "() => void",
        "description": "Devuelve true si el menú está abierto."
      }
    ],
    "interfaceCode": `interface DropdownItem {
    label?: string;
    icon?: string;
    href?: string;
    onClick?: () => void;
    color?: string;
    variant?: string;
    disabled?: boolean;
    divider?: boolean;
    target?: string;
  }`
  },
  extras,
  sections: [
    {
      id: "default",
      title: "Default",
      variants: [{ id: "default", props: {} }],
      vue: `  <DropdownMenu label="Menú" :items="items" />`,
      vanilla: `  <cu-dropdown-menu label="Menú"></cu-dropdown-menu>`,
      checks: {
        l1: [
          {
            name: "renderiza el contenedor .cu-dropdown",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-dropdown").exists()).toBe(true);
            },
          },
          {
            name: "muestra el label por defecto en .cu-dropdown-toggle",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-dropdown-toggle").text()).toContain("Menú");
            },
          },
          {
            name: "arranca con el panel cerrado y sin emitir open",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(false);
              expect(wrapper.emitted("open")).toBeUndefined();
            },
          },
        ],
      },
    },

    {
      id: "variants",
      title: "Variants",
      badge: "ghost",
      badgeTitle: "Variante por defecto",
      variants: [
        { id: "solid", props: { variant: "solid", label: "Solid" } },
        { id: "soft", props: { variant: "soft", label: "Soft" } },
        { id: "ghost", props: { variant: "ghost", label: "Ghost" } },
        { id: "outlined", props: { variant: "outlined", label: "Outlined" } },
        { id: "subtle", props: { variant: "subtle", label: "Subtle" } },
      ],
      vue: `  <DropdownMenu variant="solid" label="Solid" :items="items" />
  <DropdownMenu variant="soft" label="Soft" :items="items" />
  <DropdownMenu variant="ghost" label="Ghost" :items="items" />
  <DropdownMenu variant="outlined" label="Outlined" :items="items" />
  <DropdownMenu variant="subtle" label="Subtle" :items="items" />`,
      vanilla: `<script src="dist/CuDropdownMenu.umd.js"><\/script>

<cu-dropdown-menu id="menu-solid" variant="solid" label="Solid"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-soft" variant="soft" label="Soft"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-ghost" variant="ghost" label="Ghost"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-outlined" variant="outlined" label="Outlined"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-subtle" variant="subtle" label="Subtle"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    ['menu-solid', 'menu-soft', 'menu-ghost', 'menu-outlined', 'menu-subtle'].forEach((id) => {
      document.getElementById(id).items = [
        { label: 'Edit' },
        { label: 'Duplicate' },
        { label: 'Archive' },
      ];
    });
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "aplica cu-button--{variant} al toggle",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.variant as string;
              expect(wrapper.find(".cu-dropdown-toggle").classes()).toContain(`cu-button--${value}`);
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
      variants: [
        { id: "primary", props: { color: "primary", label: "Primary" } },
        { id: "secondary", props: { color: "secondary", label: "Secondary" } },
        { id: "neutral", props: { color: "neutral", label: "Neutral" } },
        { id: "success", props: { color: "success", label: "Success" } },
        { id: "warning", props: { color: "warning", label: "Warning" } },
        { id: "danger", props: { color: "danger", label: "Danger" } },
      ],
      vue: `  <DropdownMenu color="primary" label="Primary" :items="items" />
  <DropdownMenu color="secondary" label="Secondary" :items="items" />
  <DropdownMenu color="neutral" label="Neutral" :items="items" />
  <DropdownMenu color="success" label="Success" :items="items" />
  <DropdownMenu color="warning" label="Warning" :items="items" />
  <DropdownMenu color="danger" label="Danger" :items="items" />`,
      vanilla: `<script src="dist/CuDropdownMenu.umd.js"><\/script>

<cu-dropdown-menu id="menu-primary" color="primary" label="Primary"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-secondary" color="secondary" label="Secondary"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-neutral" color="neutral" label="Neutral"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-success" color="success" label="Success"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-warning" color="warning" label="Warning"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-danger" color="danger" label="Danger"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    ['menu-primary', 'menu-secondary', 'menu-neutral', 'menu-success', 'menu-warning', 'menu-danger'].forEach((id) => {
      document.getElementById(id).items = [
        { label: 'Edit' },
        { label: 'Duplicate' },
        { label: 'Archive' },
      ];
    });
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "resuelve --btn-bg al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              const style = wrapper.find(".cu-dropdown-toggle").attributes("style") ?? "";
              expect(style).toContain(`--btn-bg: var(--cu-color-${color})`);
            },
          },
        ],
      },
    },

    {
      id: "positions",
      title: "Positions",
      badge: "bottom",
      badgeTitle: "Posición por defecto",
      variants: [
        { id: "bottom", props: { position: "bottom", label: "Bottom" } },
        { id: "top", props: { position: "top", label: "Top" } },
        { id: "left", props: { position: "left", label: "Left" } },
        { id: "right", props: { position: "right", label: "Right" } },
      ],
      vue: `  <DropdownMenu label="Bottom" position="bottom" :items="items" />
  <DropdownMenu label="Top" position="top" :items="items" />
  <DropdownMenu label="Left" position="left" :items="items" />
  <DropdownMenu label="Right" position="right" :items="items" />`,
      vanilla: `<script src="dist/CuDropdownMenu.umd.js"><\/script>

<cu-dropdown-menu id="menu-bottom" label="Bottom"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-top" label="Top" position="top"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-left" label="Left" position="left"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-right" label="Right" position="right"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    ['menu-bottom', 'menu-top', 'menu-left', 'menu-right'].forEach((id) => {
      document.getElementById(id).items = [
        { label: 'Edit' },
        { label: 'Duplicate' },
        { label: 'Archive' },
      ];
    });
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "posiciona el panel según position",
            async run({ wrapper, expect }, variant) {
              await openPanel(wrapper);
              const style = wrapper.find(".cu-dropdown-panel").attributes("style") ?? "";
              expect(style).toContain(POSITION_STYLE[variant.id]);
            },
          },
        ],
      },
    },

    {
      id: "aligns",
      title: "Aligns",
      badge: "start",
      badgeTitle: "Alineación por defecto",
      variants: [
        { id: "start", props: { align: "start", label: "Start" } },
        { id: "center", props: { align: "center", label: "Center" } },
        { id: "end", props: { align: "end", label: "End" } },
      ],
      vue: `  <DropdownMenu label="Start" align="start" :items="items" />
  <DropdownMenu label="Center" align="center" :items="items" />
  <DropdownMenu label="End" align="end" :items="items" />`,
      vanilla: `<script src="dist/CuDropdownMenu.umd.js"><\/script>

<cu-dropdown-menu id="menu-start" label="Start"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-center" label="Center" align="center"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-end" label="End" align="end"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    ['menu-start', 'menu-center', 'menu-end'].forEach((id) => {
      document.getElementById(id).items = [
        { label: 'Edit' },
        { label: 'Duplicate' },
        { label: 'Archive' },
      ];
    });
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "alinea el panel según align",
            async run({ wrapper, expect }, variant) {
              await openPanel(wrapper);
              const style = wrapper.find(".cu-dropdown-panel").attributes("style") ?? "";
              expect(style).toContain(ALIGN_STYLE[variant.id]);
            },
          },
        ],
      },
    },

    {
      id: "label",
      title: "Labels",
      variants: [
        { id: "with-value", props: { label: "Acciones" } },
        { id: "empty", props: {} },
      ],
      vue: `  <DropdownMenu label="Acciones" :items="items" />
  <DropdownMenu :items="items" />`,
      vanilla: `<script src="dist/CuDropdownMenu.umd.js"><\/script>

<cu-dropdown-menu id="menu-labeled" label="Acciones"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-unlabeled"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    ['menu-labeled', 'menu-unlabeled'].forEach((id) => {
      document.getElementById(id).items = [
        { label: 'Edit' },
        { label: 'Duplicate' },
        { label: 'Archive' },
      ];
    });
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "muestra el label en el toggle (o Menú por defecto)",
            run({ wrapper, expect }, variant) {
              const label = (variant.props?.label as string) || "Menú";
              expect(wrapper.find(".cu-dropdown-toggle").text()).toContain(label);
            },
          },
        ],
      },
    },

    {
      id: "items",
      title: "Items",
      variants: [{ id: "mixed", props: { items: mixedItems, label: "Acciones" } }],
      vue: `<script setup>
import DropdownMenu from '@/components/controls/DropdownMenu.vue'

const items = [
  { label: 'Editar' },
  { label: 'Eliminar', color: 'danger' },
  { label: 'Separador', divider: true },
  { label: 'Deshabilitado', disabled: true },
  { label: 'Icono', icon: "<svg data-icon='x'></svg>" },
]
<\/script>

<template>
  <DropdownMenu label="Acciones" :items="items" />
</template>`,
      vanilla: `<script src="dist/CuDropdownMenu.umd.js"><\/script>

<cu-dropdown-menu id="menu-mixed" label="Acciones"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    document.getElementById('menu-mixed').items = [
      { label: 'Editar' },
      { label: 'Eliminar', color: 'danger' },
      { label: 'Separador', divider: true },
      { label: 'Deshabilitado', disabled: true },
      { label: 'Icono', icon: "<svg data-icon='x'></svg>" },
    ];
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "open() abre el panel y emite open",
            async run({ wrapper, expect }) {
              await openPanel(wrapper);
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(true);
              expect(wrapper.emitted("open")).toBeTruthy();
            },
          },
          {
            name: "renderiza un botón por item (el divider no cuenta)",
            async run({ wrapper, expect }) {
              await openPanel(wrapper);
              expect(wrapper.findAll(".cu-dropdown-item").length).toBe(4);
            },
          },
          {
            name: "renderiza el divider",
            async run({ wrapper, expect }) {
              await openPanel(wrapper);
              expect(wrapper.find(".cu-dropdown-divider").exists()).toBe(true);
            },
          },
          {
            name: "deshabilita el item disabled",
            async run({ wrapper, expect }) {
              await openPanel(wrapper);
              const disabled = wrapper
                .findAll(".cu-dropdown-item")
                .find((button) => button.text().includes("Deshabilitado"));
              expect(disabled).toBeTruthy();
              expect((disabled!.element as HTMLButtonElement).disabled).toBe(true);
            },
          },
          {
            name: "renderiza el icono del item",
            async run({ wrapper, expect }) {
              await openPanel(wrapper);
              expect(wrapper.find(".cu-dropdown-icon").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      badgeTitle: "Default: false",
      variants: [
        { id: "false", props: { disabled: false, label: "Enabled" } },
        { id: "true", props: { disabled: true, label: "Disabled" } },
      ],
      vue: `  <DropdownMenu label="Enabled" :items="items" />
  <DropdownMenu label="Disabled" disabled :items="items" />`,
      vanilla: `<script src="dist/CuDropdownMenu.umd.js"><\/script>

<cu-dropdown-menu id="menu-enabled" label="Enabled"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-disabled" label="Disabled" disabled></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    ['menu-enabled', 'menu-disabled'].forEach((id) => {
      document.getElementById(id).items = [
        { label: 'Edit' },
        { label: 'Duplicate' },
        { label: 'Archive' },
      ];
    });
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "disabled: refleja el atributo en el toggle",
            run({ wrapper, expect }, variant) {
              const toggle = wrapper.find(".cu-dropdown-toggle");
              if (variant.props?.disabled) expect(toggle.attributes("disabled")).toBeDefined();
              else expect(toggle.attributes("disabled")).toBeUndefined();
            },
          },
        ],
      },
    },

    {
      id: "slots",
      title: "Custom Toggle",
      variants: [
        {
          id: "custom",
          props: { label: "Ignorado" },
          slots: { toggle: '<button id="custom-toggle">Abrir</button>' },
        },
      ],
      vue: `  <DropdownMenu :items="items">
    <template #toggle>
      <Button color="neutral">Abrir</Button>
    </template>
  </DropdownMenu>`,
      vanilla: `<script src="dist/CuDropdownMenu.umd.js"><\/script>

<cu-dropdown-menu id="menu-custom">
  <button slot="toggle">Abrir</button>
</cu-dropdown-menu>`,
      checks: {
        l1: [
          {
            name: "el slot toggle reemplaza al botón por defecto",
            run({ wrapper, expect }) {
              expect(wrapper.find("#custom-toggle").exists()).toBe(true);
              expect(wrapper.find(".cu-dropdown-toggle").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "exposed",
      title: "Exposed",
      variants: [{ id: "api", props: { items: basicItems, label: "Programático" } }],
      vue: `<script setup>
import { ref } from 'vue'
import DropdownMenu from '@/components/controls/DropdownMenu.vue'

const menu = ref(null)
<\/script>

<template>
  <Button color="neutral" @click="menu.open()">open()</Button>
  <DropdownMenu ref="menu" label="Programático" :items="items" />
</template>`,
      vanilla: `<script src="dist/CuDropdownMenu.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<cu-button id="menu-open">open()</cu-button>
<cu-dropdown-menu id="menu-api" label="Programático"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    document.getElementById('menu-api').items = [
      { label: 'Edit' },
      { label: 'Duplicate' },
      { label: 'Archive' },
    ];
    document.getElementById('menu-open').addEventListener('click', () => {
      document.getElementById('menu-api').open();
    });
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "open(), close() y toggle() controlan el panel",
            async run({ wrapper, expect }) {
              const menu = instance(wrapper);
              menu.open();
              await nextTick();
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(true);
              menu.close();
              await nextTick();
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(false);
              menu.toggle();
              await nextTick();
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "interaction",
      title: "Item Click",
      variants: [
        { id: "enabled", props: { items: clickableItems(), label: "Click" } },
        { id: "disabled", props: { items: disabledClickableItems(), label: "Click" } },
      ],
      vue: `<script setup>
import DropdownMenu from '@/components/controls/DropdownMenu.vue'

const items = [{ label: 'Editar', onClick: () => console.log('edit') }]
<\/script>

<template>
  <DropdownMenu label="Click" :items="items" />
</template>`,
      vanilla: `<script src="dist/CuDropdownMenu.umd.js"><\/script>

<cu-dropdown-menu id="menu-click" label="Click"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    document.getElementById('menu-click').items = [
      { label: 'Editar', onClick: () => console.log('edit') },
    ];
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "click en item ejecuta onClick, cierra el panel y respeta disabled",
            async run({ wrapper, expect }, variant) {
              clickCount = 0;
              await openPanel(wrapper);
              await wrapper.find(".cu-dropdown-item").trigger("click");
              const items = variant.props?.items as DropdownItem[];
              if (items[0]?.disabled) {
                expect(clickCount).toBe(0);
                expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(true);
              } else {
                expect(clickCount).toBe(1);
                expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(false);
                expect(wrapper.emitted("close")).toBeTruthy();
              }
            },
          },
        ],
      },
    },
  ],
};
