import { defineComponent, h } from "vue";
import Label from "@/components/form/Label.vue";
import Input from "@/components/form/Input.vue";
import Select from "@/components/form/Select.vue";
import Textarea from "@/components/form/Textarea.vue";
import type { ComponentStory } from "@/stories/types";

const paises = [
  { value: "ar", label: "Argentina" },
  { value: "mx", label: "México" },
  { value: "es", label: "España" },
];

const NativeLabelPreview = defineComponent({
  name: "NativeLabelPreview",
  setup() {
    const field = (label: string, control: ReturnType<typeof h>) =>
      [h("label", { for: `native-${label}` }, label), control];
    return () =>
      h("div", { class: "playground-col", style: "display:flex;flex-direction:column;gap:12px;max-width:320px" }, [
        ...field("Usuario", h("input", { id: "native-usuario", type: "text", placeholder: "Input nativo" })),
        ...field("País", h("select", { id: "native-pais" }, ["Argentina", "México", "España"].map((p) => h("option", { key: p }, p)))),
        ...field("Comentarios", h("textarea", { id: "native-comentarios", rows: 3, placeholder: "Textarea nativo" })),
      ]);
  },
});

export const cuLabelStories: ComponentStory = {
  component: "cu-label",
  vue: Label,
  tokens: [
    "--cu-font-sans",
    "--cu-space-xs",
    "--label-fg"
  ],
  classes: [
    "cu-label",
    "cu-label-text"
  ],
  api: {
    "props": [
      {
        "name": "for",
        "type": "string",
        "default": "",
        "description": "ID del elemento a enfocar al hacer click en el texto del label"
      },
      {
        "name": "label",
        "type": "string",
        "default": "",
        "description": "Texto del label; si está vacío no se renderiza el span"
      },
      {
        "name": "color",
        "type": "'primary' | 'secondary' | 'neutral' | 'success' | 'warning' | 'danger'",
        "default": "neutral",
        "description": "Color semántico del texto; se resuelve vía el token --cu-color-{color}"
      },
      {
        "name": "hightContrast",
        "type": "boolean",
        "default": "false",
        "description": "Alto contraste. Typo persistente del codebase (documentado tal cual); declarado pero sin efecto visual en la versión actual"
      }
    ],
    "slots": [
      {
        "name": "default",
        "description": "Contenido bajo el texto del label: inputs, selects, textareas, etc."
      }
    ],
    "events": [
      {
        "name": "click",
        "type": "() => void",
        "description": "Click en el texto del label; antes enfoca el elemento for si está definido"
      }
    ]
  },
  sections: [
    {
      id: "default",
      title: "Default",
      layout: "col",
      variants: [
        { id: "label-only", props: { label: "Correo electrónico" }, slots: { default: "" } },
        {
          id: "with-input",
          props: { label: "Nombre de usuario" },
          slots: { default: () => h(Input, { placeholder: "Escribe tu nombre" }) },
        },
        { id: "sin-label", props: {}, slots: { default: "" } },
        { id: "contrast", props: { label: "Alto contraste", hightContrast: true }, slots: { default: "" } },
      ],
      vue: `<script setup>
import Label from '@/components/form/Label.vue'
import Input from '@/components/form/Input.vue'
<\/script>

<template>
  <Label label="Correo electrónico" />
  <Label label="Nombre de usuario">
    <Input placeholder="Escribe tu nombre" />
  </Label>
</template>`,
      vanilla: `<script src="dist/CuLabel.umd.js"><\/script>
<script src="dist/CuInput.umd.js"><\/script>

<cu-label label="Correo electrónico"></cu-label>
<cu-label label="Nombre de usuario">
  <cu-input placeholder="Escribe tu nombre"></cu-input>
</cu-label>`,
      checks: {
        l1: [
          {
            name: "renderiza el span con el texto de label (o nada si está vacío)",
            run({ wrapper, expect }, variant) {
              const label = variant.props?.label as string | undefined;
              const span = wrapper.find("span.cu-label-text");
              if (label) {
                expect(span.exists()).toBe(true);
                expect(span.text()).toBe(label);
              } else {
                expect(span.exists()).toBe(false);
              }
            },
          },
          {
            name: "acepta hightContrast sin romper el render",
            run({ wrapper, expect }) {
              expect(wrapper.find("label.cu-label").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "for",
      title: "With For",
      layout: "col",
      variants: [
        { id: "with-for", props: { label: "Enfoca el input", for: "label-demo-input" } },
        { id: "sin-for", props: { label: "Sin for" } },
      ],
      vue: `<script setup>
import Label from '@/components/form/Label.vue'
import Input from '@/components/form/Input.vue'
<\/script>

<template>
  <Label label="Enfoca el input" for="label-demo-input" />
  <Input id="label-demo-input" placeholder="Recibo el foco al hacer click en el label" />
  <Label label="Sin for" />
  <Input placeholder="No recibo foco" />
</template>`,
      vanilla: `<script src="dist/CuLabel.umd.js"><\/script>
<script src="dist/CuInput.umd.js"><\/script>

<cu-label label="Enfoca el input" for="label-demo-input"></cu-label>
<cu-input id="label-demo-input" placeholder="Recibo el foco al hacer click en el label"></cu-input>
<cu-label label="Sin for"></cu-label>
<cu-input placeholder="No recibo foco"></cu-input>`,
      checks: {
        l1: [
          {
            name: "click en el texto enfoca el target de for",
            async run({ wrapper, expect }, variant) {
              const id = variant.props?.for as string | undefined;
              let target: HTMLInputElement | null = null;
              if (id) {
                target = document.createElement("input");
                target.id = id;
                document.body.appendChild(target);
              }

              await wrapper.find("span.cu-label-text").trigger("click");

              if (target) expect(document.activeElement).toBe(target);
              target?.remove();
            },
          },
          {
            name: "click emite el evento click",
            async run({ wrapper, expect }) {
              await wrapper.find("span.cu-label-text").trigger("click");
              expect(wrapper.emitted("click")).toBeTruthy();
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
      variants: [
        { id: "default", props: { label: "Default" } },
        { id: "primary", props: { label: "Primary", color: "primary" } },
        { id: "secondary", props: { label: "Secondary", color: "secondary" } },
        { id: "success", props: { label: "Success", color: "success" } },
        { id: "warning", props: { label: "Warning", color: "warning" } },
        { id: "danger", props: { label: "Danger", color: "danger" } },
      ],
      vue: `  <Label label="Default" />
  <Label label="Primary" color="primary" />
  <Label label="Secondary" color="secondary" />
  <Label label="Success" color="success" />
  <Label label="Warning" color="warning" />
  <Label label="Danger" color="danger" />`,
      vanilla: `<script src="dist/CuLabel.umd.js"><\/script>

<cu-label label="Default"></cu-label>
<cu-label label="Primary" color="primary"></cu-label>
<cu-label label="Secondary" color="secondary"></cu-label>
<cu-label label="Success" color="success"></cu-label>
<cu-label label="Warning" color="warning"></cu-label>
<cu-label label="Danger" color="danger"></cu-label>`,
      checks: {
        l1: [
          {
            name: "resuelve --label-fg al token --cu-color-{color} (default: neutral)",
            run({ wrapper, expect }, variant) {
              const color = (variant.props?.color as string) ?? "neutral";
              expect(wrapper.find("label.cu-label").attributes("style")).toContain(
                `--label-fg: var(--cu-color-${color})`,
              );
            },
          },
        ],
      },
    },

    {
      id: "slot",
      title: "With Slot",
      layout: "col",
      variants: [
        {
          id: "input",
          props: { label: "Usuario" },
          slots: { default: () => h(Input, { placeholder: "Nombre de usuario" }) },
        },
        {
          id: "select",
          props: { label: "País" },
          slots: { default: () => h(Select, { options: paises }) },
        },
        {
          id: "textarea",
          props: { label: "Comentarios" },
          slots: { default: () => h(Textarea, { rows: 3, placeholder: "Escribe aquí..." }) },
        },
      ],
      vue: `<script setup>
import Label from '@/components/form/Label.vue'
import Input from '@/components/form/Input.vue'
import Select from '@/components/form/Select.vue'
import Textarea from '@/components/form/Textarea.vue'

const paises = [
  { value: 'ar', label: 'Argentina' },
  { value: 'mx', label: 'México' },
  { value: 'es', label: 'España' },
]
<\/script>

<template>
  <Label label="Usuario">
    <Input placeholder="Nombre de usuario" />
  </Label>
  <Label label="País">
    <Select :options="paises" />
  </Label>
  <Label label="Comentarios">
    <Textarea :rows="3" placeholder="Escribe aquí..." />
  </Label>
</template>`,
      vanilla: `<script src="dist/CuLabel.umd.js"><\/script>
<script src="dist/CuInput.umd.js"><\/script>
<script src="dist/CuSelect.umd.js"><\/script>
<script src="dist/CuTextarea.umd.js"><\/script>

<cu-label label="Usuario">
  <cu-input placeholder="Nombre de usuario"></cu-input>
</cu-label>
<cu-label label="País">
  <cu-select id="label-pais"></cu-select>
</cu-label>
<cu-label label="Comentarios">
  <cu-textarea rows="3" placeholder="Escribe aquí..."></cu-textarea>
</cu-label>

<script>
  customElements.whenDefined('cu-select').then(() => {
    document.getElementById('label-pais').options = [
      { value: 'ar', label: 'Argentina' },
      { value: 'mx', label: 'México' },
      { value: 'es', label: 'España' },
    ];
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "renderiza el control del slot dentro del label",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-label input, .cu-label textarea, .cu-label button").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "native",
      title: "Native",
      description:
        "Los elementos HTML nativos que CuLabel envuelve: label + input / select / textarea, sin estilos de la lib.",
      preview: NativeLabelPreview,
      variants: [],
      vue: `<template>
  <label for="native-usuario">Usuario</label>
  <input id="native-usuario" type="text" placeholder="Input nativo" />

  <label for="native-pais">País</label>
  <select id="native-pais">
    <option>Argentina</option>
    <option>México</option>
    <option>España</option>
  </select>

  <label for="native-comentarios">Comentarios</label>
  <textarea id="native-comentarios" rows="3" placeholder="Textarea nativo"></textarea>
</template>`,
      vanilla: `<label for="native-usuario">Usuario</label>
<input id="native-usuario" type="text" placeholder="Input nativo" />

<label for="native-pais">País</label>
<select id="native-pais">
  <option>Argentina</option>
  <option>México</option>
  <option>España</option>
</select>

<label for="native-comentarios">Comentarios</label>
<textarea id="native-comentarios" rows="3" placeholder="Textarea nativo"></textarea>`,
      checks: {},
    },
  ],
};
