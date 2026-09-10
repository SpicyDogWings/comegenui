import { defineComponent, h, ref } from "vue";
import Autocomplete from "@/components/form/Autocomplete.vue";
import Dropdown from "@/components/overlay/Dropdown.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./Autocomplete.stories.extras";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const VARIANTS = ["outlined", "soft", "ghost", "subtle"] as const;
const POSITIONS = ["bottom", "top", "left", "right"] as const;

const ITEMS = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Python", value: "py" },
  { label: "Rust", value: "rs" },
  { label: "Go", value: "go" },
];

const PENCIL = '<svg class="test-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/></svg>';
const DOWNLOAD = '<svg class="test-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z"/></svg>';
const STAR = '<svg class="test-icon" width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7-6.2-3.7-6.2 3.7 1.6-7L2 9.2l7.1-.6z"/></svg>';

const ITEMS_WITH_ICON = [
  { label: "Editar", value: "edit", icon: PENCIL },
  { label: "Descargar", value: "download", icon: DOWNLOAD },
  { label: "Destacar", value: "star", icon: STAR },
  { label: "JavaScript", value: "js" },
  { label: "Rust", value: "rs" },
];

/** Preview interactiva del v-model: muestra el valor seleccionado en vivo. */
const VModelPreview = defineComponent({
  name: "AutocompleteVModelPreview",
  setup() {
    const selected = ref("ts");
    return () =>
      h("div", { class: "playground-col" }, [
        h(Autocomplete, {
          items: ITEMS,
          modelValue: selected.value,
          "onUpdate:modelValue": (value: string) => {
            selected.value = value;
          },
          placeholder: "Search...",
          style: "max-width:300px",
        }),
        h("p", { class: "playground-code" }, `Selected: ${selected.value || "(ninguno)"}`),
      ]);
  },
});

const vueImport = `<script setup>
import Autocomplete from '@/components/form/Autocomplete.vue'

const items = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Python', value: 'py' },
  { label: 'Rust', value: 'rs' },
  { label: 'Go', value: 'go' },
]
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const assignItemsJs = `  // items es una prop Array: se asigna por JS (no por atributo)
  const items = [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Python', value: 'py' },
    { label: 'Rust', value: 'rs' },
    { label: 'Go', value: 'go' },
  ];
  document.querySelectorAll('cu-autocomplete').forEach((el) => { el.items = items; });`;

const vanillaSnippet = (markup: string, scriptBody: string) => `<script src="dist/CuAutocomplete.umd.js"><\/script>

${markup}

<script>
${scriptBody}
<\/script>`;

export const cuAutocompleteStories: ComponentStory = {
  component: "cu-autocomplete",
  vue: Autocomplete,
  tokens: [
    '--cu-font-sans',
    '--cu-font-size-sm',
    '--cu-radius-md',
    '--cu-border-thin',
    '--cu-space-sm',
    '--cu-space-md',
    '--cu-shadow-md',
    '--cu-color-surface',
    '--cu-color-neutral-text',
  ],
  subComponents: [
    { label: 'Dropdown', path: '/playground/components/dropdown#style' },
    { label: 'Input', path: '/playground/components/input#style' },
    { label: 'Button', path: '/playground/components/button#style' },
  ],
  api: {
    components: [
      { label: 'Dropdown', path: '/playground/components/dropdown' },
      { label: 'Input', path: '/playground/components/input' },
      { label: 'Button', path: '/playground/components/button' },
    ],
    props: [
      { name: 'v-model', type: 'string', default: '""', description: 'Texto/value actual (defineModel)' },
      { name: 'items', type: 'AutocompleteItem[]', default: '[]', description: 'Items: { label, value?, icon? }; icon es un string HTML/SVG (v-html)' },
      { name: 'color', type: 'string', default: '"neutral"', description: 'Color semántico: primary, secondary, neutral, success, warning, danger' },
      { name: 'variant', type: 'string', default: '"soft"', description: 'outlined, soft, ghost, subtle' },
      { name: 'type', type: 'string', default: '"text"', description: 'Tipo del input: text, email, password, etc.' },
      { name: 'placeholder', type: 'string', default: '""', description: 'Texto de ayuda cuando está vacío' },
      { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el input y el panel' },
      { name: 'readOnly', type: 'boolean', default: 'false', description: 'Solo lectura (seleccionable, no editable)' },
      { name: 'minChars', type: 'number', default: '0', description: 'Mínimo de caracteres antes de abrir el panel' },
      { name: 'position', type: 'string', default: '"bottom"', description: 'Posición del panel: bottom, top, left, right' },
      { name: 'align', type: 'string', default: '"start"', description: 'Alineación del panel: start, center, end' },
      { name: 'fixed', type: 'boolean', default: 'false', description: 'Posiciona el panel con position: fixed (útil dentro de contenedores con overflow)' },
    ],
    slots: [],
    events: [
      { name: 'update:modelValue', type: 'custom', description: 'Texto actualizado en detail (v-model)' },
      { name: 'select', type: 'custom', description: 'Emite el item seleccionado completo en detail' },
      { name: 'blur', type: 'custom', description: 'El componente perdió el foco (focusout fuera del root)' },
    ],
    exposes: [
      { name: 'get', type: '() => string', default: '—', description: 'Devuelve el texto actual' },
      { name: 'set', type: '(val: string) => void', default: '—', description: 'Setea el texto (input y modelo)' },
      { name: 'reset', type: '() => void', default: '—', description: 'Limpia el texto' },
      { name: 'focus', type: '() => void', default: '—', description: 'Pone el foco en el input' },
      { name: 'isOpen', type: '() => boolean', default: '—', description: 'Indica si el panel está abierto' },
      { name: 'selectedItem', type: '() => AutocompleteItem | null', default: '—', description: 'Último item seleccionado' },
    ],
    interfaceCode: `interface AutocompleteItem {
  label: string;
  icon?: string;
  value?: string;
}`,
  },
  extras,
  sections: [
    {
      id: "variants",
      title: "Variants",
      badge: "soft",
      badgeTitle: "Variante por defecto",
      layout: "row",
      variants: VARIANTS.map((variant) => ({
        id: variant,
        props: { variant, items: ITEMS, placeholder: variant === "soft" ? "soft (default)" : variant },
      })),
      vue: vueSnippet(`  <Autocomplete variant="soft" :items="items" placeholder="soft (default)" style="max-width:200px" />
  <Autocomplete variant="outlined" :items="items" placeholder="outlined" style="max-width:200px" />
  <Autocomplete variant="ghost" :items="items" placeholder="ghost" style="max-width:200px" />
  <Autocomplete variant="subtle" :items="items" placeholder="subtle" style="max-width:200px" />`),
      vanilla: vanillaSnippet(`<cu-autocomplete id="a1" variant="soft" placeholder="soft (default)" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="a2" variant="outlined" placeholder="outlined" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="a3" variant="ghost" placeholder="ghost" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="a4" variant="subtle" placeholder="subtle" style="max-width:200px"></cu-autocomplete>`, assignItemsJs),
      checks: {
        l1: [
          {
            name: "renderiza input.cu-input con el placeholder",
            run({ wrapper, expect }, variant) {
              const input = wrapper.find("input.cu-input");
              expect(input.exists()).toBe(true);
              expect(input.attributes("placeholder")).toBe(String(variant.props?.placeholder));
            },
          },
          {
            name: "aplica la clase cu-input--{variant}",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find("input.cu-input").classes()).toContain(`cu-input--${variant.props?.variant}`);
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
      layout: "row",
      variants: COLORS.map((color) => ({
        id: color,
        props: { color, items: ITEMS, placeholder: color },
      })),
      vue: vueSnippet(`  <Autocomplete color="primary" :items="items" placeholder="primary" style="max-width:200px" />
  <Autocomplete color="secondary" :items="items" placeholder="secondary" style="max-width:200px" />
  <Autocomplete color="neutral" :items="items" placeholder="neutral" style="max-width:200px" />
  <Autocomplete color="success" :items="items" placeholder="success" style="max-width:200px" />
  <Autocomplete color="warning" :items="items" placeholder="warning" style="max-width:200px" />
  <Autocomplete color="danger" :items="items" placeholder="danger" style="max-width:200px" />`),
      vanilla: vanillaSnippet(`<cu-autocomplete id="c1" color="primary" placeholder="primary" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="c2" color="secondary" placeholder="secondary" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="c3" color="neutral" placeholder="neutral" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="c4" color="success" placeholder="success" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="c5" color="warning" placeholder="warning" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="c6" color="danger" placeholder="danger" style="max-width:200px"></cu-autocomplete>`, assignItemsJs),
      checks: {
        l1: [
          {
            name: "resuelve --btn-bg al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              const style = wrapper.find("input.cu-input").attributes("style") ?? "";
              expect(style).toContain(`--btn-bg: var(--cu-color-${color})`);
            },
          },
        ],
      },
    },

    {
      id: "items",
      title: "Items",
      layout: "col",
      variants: [
        { id: "with-icons", props: { items: ITEMS_WITH_ICON, placeholder: "Buscar..." } },
      ],
      vue: `<script setup>
import Autocomplete from '@/components/form/Autocomplete.vue'

const pencil = '<svg ...>'
const download = '<svg ...>'
const star = '<svg ...>'

const items = [
  { label: 'Editar', value: 'edit', icon: pencil },
  { label: 'Descargar', value: 'download', icon: download },
  { label: 'Destacar', value: 'star', icon: star },
  { label: 'JavaScript', value: 'js' },
  { label: 'Rust' },
]
<\/script>

<template>
  <Autocomplete :items="items" placeholder="Buscar..." style="max-width:300px" />
</template>`,
      vanilla: vanillaSnippet(`<cu-autocomplete id="demo" placeholder="Buscar..." style="max-width:300px"></cu-autocomplete>`, `  // items es una prop Array: se asigna por JS (no por atributo)
  document.getElementById('demo').items = [
    { label: 'Editar', value: 'edit', icon: '<svg ...>' },
    { label: 'Descargar', value: 'download', icon: '<svg ...>' },
    { label: 'JavaScript', value: 'js' },
    { label: 'Rust' },
  ];`),
      checks: {
        l1: [
          {
            name: "abre el panel al enfocar y renderiza una opción por item",
            async run({ wrapper, expect }, variant) {
              await wrapper.find("input.cu-input").trigger("focus");
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(true);
              const items = variant.props?.items as unknown[] | undefined;
              expect(wrapper.findAll("button.cu-autocomplete-option")).toHaveLength(items?.length ?? 0);
            },
          },
          {
            name: "renderiza el icono del item con v-html",
            async run({ wrapper, expect }) {
              await wrapper.find("input.cu-input").trigger("focus");
              const icon = wrapper.find(".cu-autocomplete-icon");
              expect(icon.exists()).toBe(true);
              expect(icon.html()).toContain("<svg");
            },
          },
          {
            name: "filtra las opciones según el texto ingresado",
            async run({ wrapper, expect }) {
              await wrapper.find("input.cu-input").setValue("Desc");
              const options = wrapper.findAll("button.cu-autocomplete-option");
              expect(options).toHaveLength(1);
              expect(options[0]!.text()).toContain("Descargar");
            },
          },
          {
            name: "filtra items que llegan después del mount (prop reactiva)",
            async run({ wrapper, expect }, variant) {
              const items = variant.props?.items;
              await wrapper.setProps({ items: [] });
              await wrapper.find("input.cu-input").setValue("Des");
              expect(wrapper.findAll("button.cu-autocomplete-option")).toHaveLength(0);

              await wrapper.setProps({ items });
              await wrapper.find("input.cu-input").setValue("Desc");
              expect(wrapper.findAll("button.cu-autocomplete-option")).toHaveLength(1);
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
      layout: "row",
      variants: [
        { id: "enabled", props: { items: ITEMS, placeholder: "Enabled" } },
        { id: "disabled", props: { items: ITEMS, disabled: true, color: "primary", placeholder: "Disabled" } },
      ],
      vue: vueSnippet(`  <Autocomplete color="primary" :items="items" placeholder="Enabled" style="max-width:300px" />
  <Autocomplete color="primary" disabled :items="items" placeholder="Disabled" style="max-width:300px" />`),
      vanilla: vanillaSnippet(`<cu-autocomplete id="enabled-demo" color="primary" placeholder="Enabled" style="max-width:300px"></cu-autocomplete>
<cu-autocomplete id="disabled-demo" color="primary" disabled placeholder="Disabled" style="max-width:300px"></cu-autocomplete>`, assignItemsJs),
      checks: {
        l1: [
          {
            name: "disabled refleja el atributo en el input",
            run({ wrapper, expect }, variant) {
              const input = wrapper.find("input.cu-input");
              if (variant.props?.disabled) expect(input.attributes("disabled")).toBeDefined();
              else expect(input.attributes("disabled")).toBeUndefined();
            },
          },
        ],
      },
    },

    {
      id: "min-chars",
      title: "Min Chars",
      badge: "0",
      badgeTitle: "Valor por defecto",
      layout: "col",
      variants: [
        { id: "none", props: { items: ITEMS, placeholder: "Type at least 2 chars..." } },
        { id: "two", props: { items: ITEMS, minChars: 2, placeholder: "Type at least 2 chars..." } },
      ],
      vue: vueSnippet(`  <Autocomplete :items="items" placeholder="Type at least 2 chars..." style="max-width:300px" />
  <Autocomplete :items="items" :min-chars="2" placeholder="Type at least 2 chars..." style="max-width:300px" />`),
      vanilla: vanillaSnippet(`<cu-autocomplete id="min-chars-demo" min-chars="2" placeholder="Type at least 2 chars..." style="max-width:300px"></cu-autocomplete>`, assignItemsJs),
      checks: {
        l1: [
          {
            name: "respeta minChars para abrir el panel",
            async run({ wrapper, expect }, variant) {
              const minChars = (variant.props?.minChars as number) ?? 0;
              const input = wrapper.find("input.cu-input");

              await input.trigger("focus");
              if (minChars > 0) {
                expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(false);
                await input.setValue("Ja");
              }
              expect(wrapper.find(".cu-dropdown-panel").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "v-model",
      title: "v-model",
      layout: "col",
      preview: VModelPreview,
      variants: [
        { id: "default", props: { items: ITEMS, placeholder: "Search..." } },
      ],
      vue: `<script setup>
import { ref } from 'vue'
import Autocomplete from '@/components/form/Autocomplete.vue'

const items = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Python', value: 'py' },
  { label: 'Rust', value: 'rs' },
]
const selected = ref('ts')
<\/script>

<template>
  <Autocomplete v-model="selected" :items="items" placeholder="Search..." style="max-width:300px" />
  <p>Selected: {{ selected }}</p>
</template>`,
      vanilla: `<script src="dist/CuAutocomplete.umd.js"><\/script>

<cu-autocomplete id="leng" model-value="ts" placeholder="Search..." style="max-width:300px"></cu-autocomplete>
<p id="out">Selected: ts</p>

<script>
  // items es una prop Array: se asigna por JS (no por atributo)
  const ac = document.getElementById('leng');
  ac.items = [
    { label: 'JavaScript', value: 'js' },
    { label: 'TypeScript', value: 'ts' },
    { label: 'Python', value: 'py' },
    { label: 'Rust', value: 'rs' },
  ];
  ac.addEventListener('update:modelValue', (e) => {
    document.getElementById('out').textContent = 'Selected: ' + e.detail;
  });
  ac.addEventListener('select', (e) => console.log('select', e.detail));
<\/script>`,
      checks: {
        l1: [
          {
            name: "al elegir una opción emite select y update:modelValue",
            async run({ wrapper, expect }) {
              await wrapper.find("input.cu-input").trigger("focus");
              const option = wrapper.findAll("button.cu-autocomplete-option")[0]!;
              const expected = option.text().trim();
              await option.trigger("click");

              const selectEm = wrapper.emitted("select") as unknown[][] | undefined;
              expect(selectEm).toBeTruthy();
              expect((selectEm![0]![0] as { label: string }).label).toBe(expected);

              const modelEm = wrapper.emitted("update:modelValue") as unknown[][] | undefined;
              expect(modelEm).toBeTruthy();
              expect(modelEm![0]![0]).toBe(expected);
            },
          },
          {
            name: "emite blur al salir del foco",
            async run({ wrapper, expect }) {
              await wrapper.find("div[tabindex='-1']").trigger("focusout", { relatedTarget: null });
              expect(wrapper.emitted("blur")).toBeTruthy();
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
      layout: "row",
      variants: POSITIONS.map((position) => ({
        id: position,
        props: { items: ITEMS, position, placeholder: position },
      })),
      vue: vueSnippet(`  <Autocomplete position="bottom" :items="items" placeholder="bottom" style="max-width:200px" />
  <Autocomplete position="top" :items="items" placeholder="top" style="max-width:200px" />
  <Autocomplete position="left" :items="items" placeholder="left" style="max-width:200px" />
  <Autocomplete position="right" :items="items" placeholder="right" style="max-width:200px" />`),
      vanilla: vanillaSnippet(`<cu-autocomplete id="pos-bottom" position="bottom" placeholder="bottom" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="pos-top" position="top" placeholder="top" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="pos-left" position="left" placeholder="left" style="max-width:200px"></cu-autocomplete>
<cu-autocomplete id="pos-right" position="right" placeholder="right" style="max-width:200px"></cu-autocomplete>`, assignItemsJs),
      checks: {
        l1: [
          {
            name: "pasa position al Dropdown",
            run({ wrapper, expect }, variant) {
              expect(wrapper.findComponent(Dropdown).props("position")).toBe(variant.props?.position);
            },
          },
        ],
      },
    },
  ],
};
