import Select from "@/components/form/Select.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./Select.stories.extras";

const OPTIONS3 = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
];

const OPTIONS_CUSTOM = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil", color: "primary" },
  { value: "cl", label: "Chile", color: "success", variant: "soft" },
  { value: "py", label: "Paraguay", disabled: true },
];

const UMD = `<script src="dist/CuSelect.umd.js"><\\/script>`;

export const cuSelectStories: ComponentStory = {
  component: "cu-select",
  vue: Select,
  tokens: [
    "--btn-subtle-border",
    "--cu-border-thin",
    "--cu-font-sans",
    "--cu-font-size-sm",
    "--cu-space-md"
  ],
  classes: [
    "cu-dropdown",
    "cu-input",
    "cu-select",
    "cu-select-chevron",
    "cu-select-chevron--open",
    "cu-select-empty",
    "cu-select-hidden-input",
    "cu-select-label",
    "cu-select-label--wrap",
    "cu-select-option",
    "cu-select-option--disabled",
    "cu-select-options",
    "cu-select-toggle"
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
        "description": "Color semántico: primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "variant",
        "type": "outlined | soft | ghost | subtle",
        "default": "soft",
        "description": "outlined, soft, ghost, subtle"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Deshabilita el select"
      },
      {
        "name": "placeholder",
        "type": "string",
        "default": "",
        "description": "Texto cuando no hay selección"
      },
      {
        "name": "placeholderWrap",
        "type": "boolean",
        "default": "false",
        "description": "Permite que el label del toggle haga wrap en vez de ellipsis"
      },
      {
        "name": "position",
        "type": "string",
        "default": "bottom",
        "description": "Posición del panel: bottom, top, left, right"
      },
      {
        "name": "align",
        "type": "string",
        "default": "start",
        "description": "Alineación del panel: start, center, end"
      },
      {
        "name": "textAlign",
        "type": "left | center | right",
        "default": "left",
        "description": "Alineación del texto de las opciones: left, center, right"
      },
      {
        "name": "fixed",
        "type": "boolean",
        "default": "false",
        "description": "Posiciona el panel con position: fixed (útil dentro de contenedores con overflow)"
      },
      {
        "name": "modelValue",
        "type": "string",
        "default": "",
        "description": "Valor seleccionado (v-model)"
      },
      {
        "name": "options",
        "type": "SelectOption[]",
        "default": "[]",
        "description": "Array de opciones: { value, label, disabled?, color?, variant? }"
      },
      {
        "name": "searchEnabled",
        "type": "boolean",
        "default": "false",
        "description": "Búsqueda por teclado como select nativo; hace scroll a la opción que coincide"
      },
      {
        "name": "searchMode",
        "type": "startsWith | includes",
        "default": "startsWith",
        "description": "Modo de coincidencia: startsWith (inicia con) o includes (contiene)"
      },
      {
        "name": "searchResetDelay",
        "type": "number",
        "default": "1000",
        "description": "Ms antes de resetear el texto de búsqueda"
      },
      {
        "name": "loading",
        "type": "boolean",
        "default": "false",
        "description": "Muestra estado de carga en el panel (delegado al Dropdown interno)"
      },
      {
        "name": "cooldownVariant",
        "type": "string",
        "default": "ghost-hover",
        "description": "Variante de la barra de cooldown de la búsqueda"
      }
    ],
    "events": [
      {
        "name": "update:modelValue",
        "type": "() => void",
        "description": "Nuevo valor seleccionado en detail (v-model)"
      },
      {
        "name": "select",
        "type": "() => void",
        "description": "Emite la opción seleccionada completa en detail"
      },
      {
        "name": "close",
        "type": "() => void",
        "description": "El panel se cerró"
      },
      {
        "name": "blur",
        "type": "() => void",
        "description": "El select perdió el foco (focusout fuera del root)"
      }
    ],
    "exposes": [
      {
        "name": "get()",
        "type": "() => void",
        "description": "Devuelve el valor seleccionado."
      },
      {
        "name": "set()",
        "type": "() => void",
        "description": "Setea el valor seleccionado."
      },
      {
        "name": "reset()",
        "type": "() => void",
        "description": "Limpia la selección."
      },
      {
        "name": "focus()",
        "type": "() => void",
        "description": "Enfoca el trigger del select."
      },
      {
        "name": "isOpen()",
        "type": "() => void",
        "description": "Indica si el panel está abierto."
      },
      {
        "name": "selectedItem()",
        "type": "() => void",
        "description": "Devuelve la opción seleccionada o null."
      }
    ],
    "interfaceCode": `interface SelectOption {
    value: string;
    label: string;
    disabled?: boolean;
    color?: string;
    variant?: string;
  }`
  },
  extras,
  setup: () => {
    Element.prototype.scrollIntoView = () => {};
  },
  sections: [
    {
      id: "variants",
      title: "Variants",
      badge: "soft",
      variants: [
        { id: "default", props: { options: OPTIONS3 }, attrs: { style: "max-width:200px" } },
        { id: "soft", props: { options: OPTIONS3, variant: "soft", placeholder: "soft (default)" }, attrs: { style: "max-width:200px" } },
        { id: "outlined", props: { options: OPTIONS3, variant: "outlined", placeholder: "outlined" }, attrs: { style: "max-width:200px" } },
        { id: "ghost", props: { options: OPTIONS3, variant: "ghost", placeholder: "ghost" }, attrs: { style: "max-width:200px" } },
        { id: "subtle", props: { options: OPTIONS3, variant: "subtle", placeholder: "subtle" }, attrs: { style: "max-width:200px" } },
      ],
      vue: `  <Select :options="options" style="max-width:200px" />
  <Select variant="soft" :options="options" placeholder="soft (default)" style="max-width:200px" />
  <Select variant="outlined" :options="options" placeholder="outlined" style="max-width:200px" />
  <Select variant="ghost" :options="options" placeholder="ghost" style="max-width:200px" />
  <Select variant="subtle" :options="options" placeholder="subtle" style="max-width:200px" />`,
      vanilla: `${UMD}

<cu-select id="sel-variant" placeholder="soft (default)" style="max-width:200px"></cu-select>
<script>
  customElements.whenDefined('cu-select').then(() => {
    document.getElementById('sel-variant').options = [
      { value: 'ar', label: 'Argentina' },
      { value: 'br', label: 'Brasil' },
    ]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-select y el toggle",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-select").exists()).toBe(true);
              expect(wrapper.find("button.cu-select-toggle").exists()).toBe(true);
            },
          },
          {
            name: "muestra el placeholder (o Seleccionar... por defecto)",
            run({ wrapper, expect }, variant) {
              const text = wrapper.find("button.cu-select-toggle").text();
              expect(text).toContain(String(variant.props?.placeholder ?? "Seleccionar..."));
            },
          },
          {
            name: "variant aplica la clase cu-button--{variant} al toggle",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.variant as string | undefined;
              if (!value) return;
              expect(wrapper.find("button.cu-select-toggle").classes()).toContain(`cu-button--${value}`);
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "neutral",
      variants: [
        { id: "primary", props: { options: OPTIONS3, color: "primary", placeholder: "primary" }, attrs: { style: "max-width:200px" } },
        { id: "secondary", props: { options: OPTIONS3, color: "secondary", placeholder: "secondary" }, attrs: { style: "max-width:200px" } },
        { id: "neutral", props: { options: OPTIONS3, color: "neutral", placeholder: "neutral" }, attrs: { style: "max-width:200px" } },
        { id: "success", props: { options: OPTIONS3, color: "success", placeholder: "success" }, attrs: { style: "max-width:200px" } },
        { id: "warning", props: { options: OPTIONS3, color: "warning", placeholder: "warning" }, attrs: { style: "max-width:200px" } },
        { id: "danger", props: { options: OPTIONS3, color: "danger", placeholder: "danger" }, attrs: { style: "max-width:200px" } },
      ],
      vue: `  <Select color="primary" :options="options" placeholder="primary" style="max-width:200px" />
  <Select color="secondary" :options="options" placeholder="secondary" style="max-width:200px" />
  <Select color="neutral" :options="options" placeholder="neutral" style="max-width:200px" />
  <Select color="success" :options="options" placeholder="success" style="max-width:200px" />
  <Select color="warning" :options="options" placeholder="warning" style="max-width:200px" />
  <Select color="danger" :options="options" placeholder="danger" style="max-width:200px" />`,
      vanilla: `${UMD}

<cu-select id="sel-color" color="primary" placeholder="primary" style="max-width:200px"></cu-select>
<script>
  customElements.whenDefined('cu-select').then(() => {
    document.getElementById('sel-color').options = [{ value: 'ar', label: 'Argentina' }]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }) {
              expect(wrapper.html()).toContain("var(--cu-color-");
            },
          },
        ],
      },
    },

    {
      id: "options",
      title: "Options",
      layout: "col",
      variants: [
        { id: "custom", props: { options: OPTIONS_CUSTOM, placeholder: "Opciones custom" }, attrs: { style: "max-width:300px" } },
        { id: "empty", props: { options: [], placeholder: "Sin opciones" }, attrs: { style: "max-width:300px" } },
      ],
      vue: `<script setup>
import Select from '@/components/form/Select.vue'

const options = [
  { value: 'ar', label: 'Argentina' },
  { value: 'br', label: 'Brasil', color: 'primary' },
  { value: 'cl', label: 'Chile', color: 'success', variant: 'soft' },
  { value: 'py', label: 'Paraguay', disabled: true },
]
<\/script>

<template>
  <Select :options="options" placeholder="Opciones custom" style="max-width:300px" />
</template>`,
      vanilla: `${UMD}

<cu-select id="sel-options" placeholder="Opciones custom" style="max-width:300px"></cu-select>
<script>
  customElements.whenDefined('cu-select').then(() => {
    document.getElementById('sel-options').options = [
      { value: 'ar', label: 'Argentina' },
      { value: 'br', label: 'Brasil', color: 'primary' },
      { value: 'py', label: 'Paraguay', disabled: true },
    ]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "abre el panel con las opciones",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "custom") return;
              await wrapper.find("button.cu-select-toggle").trigger("click");
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(true);
              expect(wrapper.findAll("button.cu-select-option")).toHaveLength(4);
            },
          },
          {
            name: "al elegir emite update:modelValue + select",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "custom") return;
              await wrapper.find("button.cu-select-toggle").trigger("click");
              await wrapper.findAll("button.cu-select-option")[1]!.trigger("click");
              const modelEm = wrapper.emitted("update:modelValue") as unknown[][] | undefined;
              expect(modelEm?.[0]?.[0]).toBe("br");
              const selectEm = wrapper.emitted("select") as unknown[][] | undefined;
              expect(selectEm?.[0]?.[0]).toMatchObject({ value: "br", label: "Brasil" });
            },
          },
          {
            name: "no renderiza input oculto cuando searchEnabled es false",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "custom") return;
              await wrapper.find("button.cu-select-toggle").trigger("click");
              expect(wrapper.find(".cu-select-hidden-input").exists()).toBe(false);
            },
          },
          {
            name: "muestra 'Sin opciones' cuando no hay options",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "empty") return;
              await wrapper.find("button.cu-select-toggle").trigger("click");
              expect(wrapper.find(".cu-select-empty").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      variants: [
        { id: "primary", props: { options: OPTIONS3, color: "primary", disabled: true, placeholder: "Disabled" }, attrs: { style: "max-width:300px" } },
      ],
      vue: `  <Select color="primary" disabled :options="options" placeholder="Disabled" style="max-width:300px" />`,
      vanilla: `${UMD}

<cu-select id="sel-disabled" color="primary" disabled placeholder="Disabled" style="max-width:300px"></cu-select>
<script>
  customElements.whenDefined('cu-select').then(() => {
    document.getElementById('sel-disabled').options = [{ value: 'ar', label: 'Argentina' }]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "disabled deshabilita el toggle",
            run({ wrapper, expect }) {
              expect(wrapper.find("button.cu-select-toggle").attributes("disabled")).toBeDefined();
            },
          },
        ],
      },
    },

    {
      id: "v-model",
      title: "v-model",
      layout: "col",
      variants: [
        { id: "preselected", props: { options: OPTIONS3, modelValue: "br" }, attrs: { style: "max-width:300px" } },
        { id: "interactive", props: { options: OPTIONS3 }, attrs: { style: "max-width:300px" } },
      ],
      vue: `<script setup>
import { ref } from 'vue'
import Select from '@/components/form/Select.vue'

const options = [
  { value: 'opt1', label: 'Option 1' },
  { value: 'opt2', label: 'Option 2' },
  { value: 'opt3', label: 'Option 3' },
]
const selected = ref('opt1')
<\/script>

<template>
  <Select v-model="selected" :options="options" style="max-width:300px" />
  <p>Selected: {{ selected }}</p>
</template>`,
      vanilla: `<script src="dist/CuSelect.umd.js"><\/script>

<cu-select id="pais" model-value="opt1" placeholder="Seleccionar..." style="max-width:300px"></cu-select>
<p id="out">Selected: opt1</p>

<script>
  // options es una prop Array: se asigna por JS (no por atributo)
  const select = document.getElementById('pais');
  select.options = [
    { value: 'opt1', label: 'Option 1' },
    { value: 'opt2', label: 'Option 2' },
    { value: 'opt3', label: 'Option 3' },
  ];
  select.addEventListener('update:modelValue', (e) => {
    document.getElementById('out').textContent = 'Selected: ' + e.detail;
  });
  select.addEventListener('select', (e) => console.log('select', e.detail));
<\/script>`,
      checks: {
        l1: [
          {
            name: "muestra el label de la opción del modelValue",
            run({ wrapper, expect }, variant) {
              if (variant.props?.modelValue !== "br") return;
              expect(wrapper.find("button.cu-select-toggle").text()).toContain("Brasil");
            },
          },
          {
            name: "get() devuelve la selección tras elegir",
            async run({ wrapper, expect }, variant) {
              if (variant.props?.modelValue !== undefined) return;
              await wrapper.find("button.cu-select-toggle").trigger("click");
              await wrapper.findAll("button.cu-select-option")[1]!.trigger("click");
              expect((wrapper.vm as unknown as { get: () => string }).get()).toBe("br");
            },
          },
        ],
      },
    },

    {
      id: "searchable",
      title: "Searchable",
      badge: "false",
      layout: "col",
      variants: [
        { id: "v1", props: { options: OPTIONS3, searchEnabled: true, placeholder: "Buscar país..." }, attrs: { style: "max-width:300px" } },
      ],
      vue: `<script setup>
import { ref } from 'vue'
import Select from '@/components/form/Select.vue'

const countries = [
  { value: 'ar', label: 'Argentina' },
  { value: 'br', label: 'Brasil' },
  { value: 'cl', label: 'Chile' },
]
const selected = ref('')
<\/script>

<template>
  <Select v-model="selected" :options="countries" search-enabled placeholder="Buscar país..." style="max-width:300px" />
</template>`,
      vanilla: `${UMD}

<cu-select id="sel-search" search-enabled placeholder="Buscar país..." style="max-width:300px"></cu-select>
<script>
  customElements.whenDefined('cu-select').then(() => {
    document.getElementById('sel-search').options = [{ value: 'ar', label: 'Argentina' }]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza input oculto cuando searchEnabled es true",
            async run({ wrapper, expect }) {
              await wrapper.find("button.cu-select-toggle").trigger("click");
              expect(wrapper.find(".cu-select-hidden-input").exists()).toBe(true);
            },
          },
          {
            name: "no filtra las opciones (lista completa visible)",
            async run({ wrapper, expect }) {
              await wrapper.find("button.cu-select-toggle").trigger("click");
              await wrapper.find(".cu-select-hidden-input").trigger("keydown", { key: "a" });
              expect(wrapper.findAll("button.cu-select-option")).toHaveLength(3);
            },
          },
          {
            name: "muestra la barra de cooldown al escribir",
            async run({ wrapper, expect }) {
              await wrapper.find("button.cu-select-toggle").trigger("click");
              await wrapper.find(".cu-select-hidden-input").trigger("keydown", { key: "a" });
              expect(wrapper.find(".cu-loader-bar--cooldown").exists()).toBe(true);
              expect(wrapper.find(".cu-loader-bar--loading").exists()).toBe(false);
            },
          },
          {
            name: "hace scroll al matching option al escribir",
            async run({ wrapper, expect }) {
              let called = false;
              Element.prototype.scrollIntoView = function () {
                called = true;
              };
              try {
                await wrapper.find("button.cu-select-toggle").trigger("click");
                const nativeInput = wrapper.find(".cu-select-hidden-input").element as HTMLInputElement;
                nativeInput.dispatchEvent(new KeyboardEvent("keydown", { key: "b", bubbles: true }));
                await wrapper.vm.$nextTick();
                expect(called).toBe(true);
              } finally {
                Element.prototype.scrollIntoView = () => {};
              }
            },
          },
        ],
      },
    },

    {
      id: "search-mode",
      title: "Search Mode",
      badge: "startsWith",
      layout: "col",
      variants: [
        { id: "startsWith", props: { options: OPTIONS3, searchEnabled: true, searchMode: "startsWith", placeholder: "startsWith (default)" }, attrs: { style: "max-width:300px" } },
        { id: "includes", props: { options: OPTIONS3, searchEnabled: true, searchMode: "includes", placeholder: "includes" }, attrs: { style: "max-width:300px" } },
      ],
      vue: `<script setup>
import Select from '@/components/form/Select.vue'

const countries = [
  { value: 'ar', label: 'Argentina' },
  { value: 'br', label: 'Brasil' },
  { value: 'cl', label: 'Chile' },
]
<\/script>

<template>
  <Select :options="countries" search-enabled search-mode="startsWith" placeholder="startsWith (default)" style="max-width:300px" />
  <Select :options="countries" search-enabled search-mode="includes" placeholder="includes" style="max-width:300px" />
</template>`,
      vanilla: `${UMD}

<cu-select id="sel-mode" search-enabled search-mode="includes" placeholder="includes" style="max-width:300px"></cu-select>
<script>
  customElements.whenDefined('cu-select').then(() => {
    document.getElementById('sel-mode').options = [{ value: 'ar', label: 'Argentina' }]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "abre el panel con el input de búsqueda",
            async run({ wrapper, expect }) {
              await wrapper.find("button.cu-select-toggle").trigger("click");
              expect(wrapper.find(".cu-select-hidden-input").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "cooldown",
      title: "Search Cooldown",
      variants: [
        { id: "primary", props: { options: OPTIONS3, searchEnabled: true, color: "primary", searchResetDelay: 2000, placeholder: "primary" }, attrs: { style: "max-width:200px" } },
        { id: "success", props: { options: OPTIONS3, searchEnabled: true, color: "success", searchResetDelay: 2000, placeholder: "success" }, attrs: { style: "max-width:200px" } },
        { id: "danger", props: { options: OPTIONS3, searchEnabled: true, color: "danger", searchResetDelay: 2000, placeholder: "danger" }, attrs: { style: "max-width:200px" } },
      ],
      vue: `<script setup>
import Select from '@/components/form/Select.vue'

const countries = [
  { value: 'ar', label: 'Argentina' },
  { value: 'br', label: 'Brasil' },
]
<\/script>

<template>
  <Select :options="countries" search-enabled color="primary" :search-reset-delay="2000" placeholder="primary" style="max-width:200px" />
  <Select :options="countries" search-enabled color="success" :search-reset-delay="2000" placeholder="success" style="max-width:200px" />
  <Select :options="countries" search-enabled color="danger" :search-reset-delay="2000" placeholder="danger" style="max-width:200px" />
</template>`,
      vanilla: `${UMD}

<cu-select id="sel-cooldown" search-enabled color="primary" placeholder="primary" style="max-width:200px"></cu-select>
<script>
  customElements.whenDefined('cu-select').then(() => {
    document.getElementById('sel-cooldown').options = [{ value: 'ar', label: 'Argentina' }]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }) {
              expect(wrapper.html()).toContain("var(--cu-color-");
            },
          },
        ],
      },
    },

    {
      id: "loading",
      title: "Loading",
      badge: "false",
      variants: [
        { id: "loading", props: { options: OPTIONS3, loading: true, placeholder: "Cargando opciones..." }, attrs: { style: "max-width:300px" } },
        { id: "idle", props: { options: OPTIONS3, loading: false, placeholder: "Sin carga" }, attrs: { style: "max-width:300px" } },
      ],
      vue: `  <Select :options="options" loading placeholder="Cargando opciones..." style="max-width:300px" />
  <Select :options="options" placeholder="Sin carga" style="max-width:300px" />`,
      vanilla: `${UMD}

<cu-select id="sel-loading" loading placeholder="Cargando opciones..." style="max-width:300px"></cu-select>
<script>
  customElements.whenDefined('cu-select').then(() => {
    document.getElementById('sel-loading').options = [{ value: 'ar', label: 'Argentina' }]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "muestra el loader cuando loading es true",
            async run({ wrapper, expect }, variant) {
              if (!variant.props?.loading) return;
              await wrapper.find("button.cu-select-toggle").trigger("click");
              expect(wrapper.find(".cu-loader-bar--loading").exists()).toBe(true);
            },
          },
          {
            name: "no muestra loader cuando loading es false",
            async run({ wrapper, expect }, variant) {
              if (variant.props?.loading) return;
              await wrapper.find("button.cu-select-toggle").trigger("click");
              expect(wrapper.find(".cu-loader").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "positions",
      title: "Positions",
      badge: "bottom",
      variants: [
        { id: "bottom", props: { options: OPTIONS3, position: "bottom", placeholder: "bottom" }, attrs: { style: "max-width:200px" } },
        { id: "top", props: { options: OPTIONS3, position: "top", placeholder: "top" }, attrs: { style: "max-width:200px" } },
        { id: "left", props: { options: OPTIONS3, position: "left", placeholder: "left" }, attrs: { style: "max-width:200px" } },
        { id: "right", props: { options: OPTIONS3, position: "right", placeholder: "right" }, attrs: { style: "max-width:200px" } },
      ],
      vue: `  <Select position="bottom" :options="options" placeholder="bottom" style="max-width:200px" />
  <Select position="top" :options="options" placeholder="top" style="max-width:200px" />
  <Select position="left" :options="options" placeholder="left" style="max-width:200px" />
  <Select position="right" :options="options" placeholder="right" style="max-width:200px" />`,
      vanilla: `${UMD}

<cu-select id="sel-pos" position="top" placeholder="top" style="max-width:200px"></cu-select>
<script>
  customElements.whenDefined('cu-select').then(() => {
    document.getElementById('sel-pos').options = [{ value: 'ar', label: 'Argentina' }]
  })
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza el select con la posición",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-select").exists()).toBe(true);
            },
          },
        ],
      },
    },
  ],
};
