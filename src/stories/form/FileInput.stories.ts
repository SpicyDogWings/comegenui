import { nextTick } from "vue";
import FileInput from "@/components/form/FileInput.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./FileInput.stories.extras";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const VARIANTS = ["outlined", "soft", "ghost", "subtle"] as const;

const ACCEPT_LABELS: Record<string, string> = {
  ".pdf,.jpg,.png": "PDF",
  "image/*": "Imagen",
  ".csv": "CSV",
};

const vueImport = `<script setup>
import FileInput from '@/components/form/FileInput.vue'
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

export const cuFileInputStories: ComponentStory = {
  component: "cu-file-input",
  vue: FileInput,
  tokens: [
    "--cu-border-color",
    "--cu-border-thin",
    "--cu-color-surface",
    "--cu-font-sans",
    "--cu-font-size-sm",
    "--cu-font-size-xs",
    "--cu-font-weight-medium",
    "--cu-radius",
    "--cu-space-2xs",
    "--cu-space-lg",
    "--cu-space-md",
    "--cu-space-sm",
    "--input-bg",
    "--input-ghost-hover",
    "--input-soft",
    "--input-soft-hover",
    "--input-text"
  ],
  classes: [
    "cu-file-input",
    "cu-file-input--disabled",
    "cu-file-input--drag-over",
    "cu-file-input--ghost",
    "cu-file-input--outlined",
    "cu-file-input--soft",
    "cu-file-input--subtle",
    "cu-file-input-hidden",
    "cu-file-input-icon",
    "cu-file-input-link",
    "cu-file-input-name",
    "cu-file-input-placeholder",
    "cu-file-input-reject",
    "cu-file-input-remove",
    "cu-file-input-size",
    "cu-file-input-wrap"
  ],
  api: {
    "components": [
      {
        "label": "Button",
        "path": "/playground/components/button"
      },
      {
        "label": "Alert",
        "path": "/playground/components/alert"
      }
    ],
    "props": [
      {
        "name": "modelValue",
        "type": "File | null",
        "description": "Archivo seleccionado (v-model)."
      },
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "neutral",
        "description": "primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "variant",
        "type": "outlined | soft | ghost | subtle",
        "default": "outlined",
        "description": "outlined, soft, ghost, subtle"
      },
      {
        "name": "placeholder",
        "type": "string",
        "default": "Seleccionar archivo",
        "description": "Texto cuando no hay archivo; agrega formatos aceptados y tamaño máximo si aplican"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Deshabilita la selección"
      },
      {
        "name": "readOnly",
        "type": "boolean",
        "default": "false",
        "description": "Solo lectura: bloquea click, teclado y drag & drop"
      },
      {
        "name": "accept",
        "type": "string",
        "description": "Tipos aceptados (attr accept): .pdf, image/*, etc; rechaza los que no coinciden"
      },
      {
        "name": "maxSize",
        "type": "number",
        "description": "Tamaño máximo en bytes; rechaza archivos mayores"
      },
      {
        "name": "v-model",
        "type": "File | null",
        "default": "null",
        "description": "Archivo seleccionado (defineModel)"
      }
    ],
    "events": [
      {
        "name": "update:modelValue",
        "type": "() => void",
        "description": "v-model: emite el File seleccionado o null al quitarlo"
      },
      {
        "name": "click",
        "type": "nativo",
        "description": "Click sobre el control (abre el selector de archivos)"
      },
      {
        "name": "keydown",
        "type": "nativo",
        "description": "Enter o Space abren el selector de archivos"
      },
      {
        "name": "focus",
        "type": "nativo",
        "description": "El control recibe foco"
      },
      {
        "name": "blur",
        "type": "nativo",
        "description": "El control pierde foco"
      },
      {
        "name": "dragover",
        "type": "nativo",
        "description": "Un archivo se arrastra sobre el control"
      },
      {
        "name": "drop",
        "type": "nativo",
        "description": "Se suelta un archivo sobre el control"
      }
    ],
    "exposes": [
      {
        "name": "get()",
        "type": "() => void",
        "description": "Devuelve el archivo actual."
      },
      {
        "name": "set()",
        "type": "() => void",
        "description": "Setea el archivo actual."
      },
      {
        "name": "reset()",
        "type": "() => void",
        "description": "Quita el archivo seleccionado."
      },
      {
        "name": "focus()",
        "type": "() => void",
        "description": "Enfoca el contenedor del input."
      },
      {
        "name": "trigger()",
        "type": "() => void",
        "description": "Abre el selector de archivos."
      }
    ]
  },
  extras,
  sections: [
    {
      id: "default",
      title: "Default",
      layout: "col",
      variants: [{ id: "default" }],
      vue: `<script setup>
import { ref } from 'vue'
import FileInput from '@/components/form/FileInput.vue'

const file = ref(null)
<\/script>

<template>
  <FileInput v-model="file" />
</template>`,
      vanilla: `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input></cu-file-input>`,
      checks: {
        l1: [
          {
            name: "renderiza el input file oculto",
            run({ wrapper, expect }) {
              const input = wrapper.find("input[type='file']");
              expect(input.exists()).toBe(true);
              expect(input.classes()).toContain("cu-file-input-hidden");
            },
          },
          {
            name: "muestra el placeholder por defecto",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-file-input-placeholder").text()).toContain("Seleccionar archivo");
            },
          },
        ],
      },
    },

    {
      id: "variants",
      title: "Variants",
      badge: "outlined",
      badgeTitle: "Variante por defecto",
      layout: "col",
      variants: VARIANTS.map((variant) => ({
        id: variant,
        props: { variant, placeholder: variant === "outlined" ? "outlined (default)" : variant },
      })),
      vue: vueSnippet(`  <FileInput variant="outlined" placeholder="outlined (default)" />
  <FileInput variant="soft" placeholder="soft" />
  <FileInput variant="ghost" placeholder="ghost" />
  <FileInput variant="subtle" placeholder="subtle" />`),
      vanilla: `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input variant="outlined" placeholder="outlined (default)"></cu-file-input>
<cu-file-input variant="soft" placeholder="soft"></cu-file-input>
<cu-file-input variant="ghost" placeholder="ghost"></cu-file-input>
<cu-file-input variant="subtle" placeholder="subtle"></cu-file-input>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-file-input",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-file-input").exists()).toBe(true);
            },
          },
          {
            name: "aplica la clase cu-file-input--{variant}",
            run({ wrapper, expect }, variant) {
              const value = variant.props?.variant as string;
              expect(wrapper.find(".cu-file-input").classes()).toContain(`cu-file-input--${value}`);
            },
          },
          {
            name: "muestra el placeholder del variant",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-file-input-placeholder").text()).toContain(String(variant.props?.placeholder));
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
      layout: "col",
      variants: COLORS.map((color) => ({ id: color, props: { color, placeholder: color } })),
      vue: vueSnippet(`  <FileInput color="primary" placeholder="primary" />
  <FileInput color="secondary" placeholder="secondary" />
  <FileInput color="neutral" placeholder="neutral" />
  <FileInput color="success" placeholder="success" />
  <FileInput color="warning" placeholder="warning" />
  <FileInput color="danger" placeholder="danger" />`),
      vanilla: `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input color="primary" placeholder="primary"></cu-file-input>
<cu-file-input color="secondary" placeholder="secondary"></cu-file-input>
<cu-file-input color="neutral" placeholder="neutral"></cu-file-input>
<cu-file-input color="success" placeholder="success"></cu-file-input>
<cu-file-input color="warning" placeholder="warning"></cu-file-input>
<cu-file-input color="danger" placeholder="danger"></cu-file-input>`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-file-input",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-file-input").exists()).toBe(true);
            },
          },
          {
            name: "resuelve --input-bg al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              expect(wrapper.find(".cu-file-input").attributes("style")).toContain(
                `--input-bg: var(--cu-color-${color})`,
              );
            },
          },
        ],
      },
    },

    {
      id: "accept",
      title: "With Accept",
      layout: "col",
      variants: [
        { id: "documents", props: { accept: ".pdf,.jpg,.png", placeholder: "Subir documento" } },
        { id: "images", props: { accept: "image/*", placeholder: "Subir imagen" } },
        { id: "csv-only", props: { accept: ".csv", placeholder: "Subir CSV" } },
      ],
      vue: vueSnippet(`  <FileInput accept=".pdf,.jpg,.png" placeholder="Subir documento" />
  <FileInput accept="image/*" placeholder="Subir imagen" />
  <FileInput accept=".csv" placeholder="Subir CSV" />`),
      vanilla: `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input accept=".pdf,.jpg,.png" placeholder="Subir documento"></cu-file-input>
<cu-file-input accept="image/*" placeholder="Subir imagen"></cu-file-input>
<cu-file-input accept=".csv" placeholder="Subir CSV"></cu-file-input>`,
      checks: {
        l1: [
          {
            name: "propaga accept al input[type=file]",
            run({ wrapper, expect }, variant) {
              const accept = variant.props?.accept as string;
              expect(wrapper.find("input[type='file']").attributes("accept")).toBe(accept);
            },
          },
          {
            name: "muestra formatos legibles a partir de accept",
            run({ wrapper, expect }, variant) {
              const accept = variant.props?.accept as string;
              const label = ACCEPT_LABELS[accept];
              if (!label) return;
              expect(wrapper.find(".cu-file-input-placeholder").text()).toContain(label);
            },
          },
          {
            name: "rechaza un archivo que no coincide con accept",
            async run({ wrapper, expect }, variant) {
              if (variant.props?.accept !== ".csv") return;
              const input = wrapper.find("input[type='file']");
              const bad = new File(["x"], "doc.pdf", { type: "application/pdf" });
              Object.defineProperty(input.element, "files", { value: [bad], configurable: true });
              await input.trigger("change");
              const reject = wrapper.find(".cu-file-input-reject");
              expect(reject.exists()).toBe(true);
              expect(reject.text()).toContain("Formato no permitido");
              expect(reject.text()).toContain(".csv");
              expect(wrapper.emitted("update:modelValue")).toBeUndefined();
            },
          },
          {
            name: "limpia el feedback al seleccionar un archivo válido",
            async run({ wrapper, expect }, variant) {
              if (variant.props?.accept !== ".csv") return;
              const input = wrapper.find("input[type='file']");
              const bad = new File(["x"], "doc.pdf", { type: "application/pdf" });
              Object.defineProperty(input.element, "files", { value: [bad], configurable: true });
              await input.trigger("change");
              expect(wrapper.find(".cu-file-input-reject").exists()).toBe(true);

              const good = new File(["a"], "datos.csv", { type: "text/csv" });
              Object.defineProperty(input.element, "files", { value: [good], configurable: true });
              await input.trigger("change");
              expect(wrapper.find(".cu-file-input-reject").exists()).toBe(false);
              expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toMatchObject({ name: "datos.csv" });
            },
          },
          {
            name: "limpia el feedback al setear un archivo válido por v-model",
            async run({ wrapper, expect }, variant) {
              if (variant.props?.accept !== ".csv") return;
              const input = wrapper.find("input[type='file']");
              const bad = new File(["x"], "doc.pdf", { type: "application/pdf" });
              Object.defineProperty(input.element, "files", { value: [bad], configurable: true });
              await input.trigger("change");
              expect(wrapper.find(".cu-file-input-reject").exists()).toBe(true);

              await wrapper.setProps({ modelValue: new File(["a"], "datos.csv", { type: "text/csv" }) });
              await nextTick();
              expect(wrapper.find(".cu-file-input-reject").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "maxsize",
      title: "With Max Size",
      layout: "col",
      variants: [
        { id: "small-limit", props: { maxSize: 10, placeholder: "Máximo 10 bytes" } },
        { id: "five-mb", props: { maxSize: 5 * 1024 * 1024, placeholder: "Máximo 5MB" } },
      ],
      vue: vueSnippet(`  <FileInput :max-size="10" placeholder="Máximo 10 bytes" />
  <FileInput :max-size="5 * 1024 * 1024" placeholder="Máximo 5MB" />`),
      vanilla: `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input max-size="10" placeholder="Máximo 10 bytes"></cu-file-input>
<cu-file-input max-size="5242880" placeholder="Máximo 5MB"></cu-file-input>`,
      checks: {
        l1: [
          {
            name: "muestra el tamaño máximo en el placeholder",
            run({ wrapper, expect }, variant) {
              const maxSize = variant.props?.maxSize as number;
              if (!maxSize) return;
              expect(wrapper.find(".cu-file-input-placeholder").text()).toContain("(máx");
            },
          },
          {
            name: "rechaza archivos que superan maxSize",
            async run({ wrapper, expect }, variant) {
              const maxSize = variant.props?.maxSize as number;
              const input = wrapper.find("input[type='file']");
              const file = new File([new ArrayBuffer(100)], "grande.csv", { type: "text/csv" });
              Object.defineProperty(input.element, "files", { value: [file], configurable: true });
              await input.trigger("change");
              if (maxSize && file.size > maxSize) {
                expect(wrapper.find(".cu-file-input-reject").text()).toContain("tamaño máximo");
              } else {
                expect(wrapper.find(".cu-file-input-reject").exists()).toBe(false);
              }
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
        { id: "false", props: { disabled: false } },
        { id: "true", props: { disabled: true, placeholder: "No disponible" } },
      ],
      vue: vueSnippet(`  <FileInput />
  <FileInput disabled placeholder="No disponible" />`),
      vanilla: `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input></cu-file-input>
<cu-file-input disabled placeholder="No disponible"></cu-file-input>`,
      checks: {
        l1: [
          {
            name: "aplica cu-file-input--disabled cuando disabled=true",
            run({ wrapper, expect }, variant) {
              const classes = wrapper.find(".cu-file-input").classes();
              if (variant.props?.disabled) expect(classes).toContain("cu-file-input--disabled");
              else expect(classes).not.toContain("cu-file-input--disabled");
            },
          },
          {
            name: "refleja aria-disabled",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-file-input").attributes("aria-disabled")).toBe(
                String(Boolean(variant.props?.disabled)),
              );
            },
          },
          {
            name: "bloquea el click cuando disabled=true",
            async run({ wrapper, expect }, variant) {
              const input = wrapper.find("input[type='file']").element as HTMLInputElement;
              let clicked = 0;
              input.click = () => {
                clicked++;
              };
              await wrapper.find(".cu-file-input").trigger("click");
              expect(clicked).toBe(variant.props?.disabled ? 0 : 1);
            },
          },
        ],
      },
    },

    {
      id: "readonly",
      title: "ReadOnly",
      badge: "false",
      badgeTitle: "Valor por defecto",
      layout: "col",
      variants: [
        { id: "false", props: { readOnly: false } },
        { id: "true", props: { readOnly: true, placeholder: "Solo lectura" } },
      ],
      vue: vueSnippet(`  <FileInput />
  <FileInput read-only placeholder="Solo lectura" />`),
      vanilla: `<script src="dist/CuFileInput.umd.js"><\/script>

<cu-file-input></cu-file-input>
<cu-file-input read-only placeholder="Solo lectura"></cu-file-input>`,
      checks: {
        l1: [
          {
            name: "bloquea el click cuando readOnly=true",
            async run({ wrapper, expect }, variant) {
              const input = wrapper.find("input[type='file']").element as HTMLInputElement;
              let clicked = 0;
              input.click = () => {
                clicked++;
              };
              await wrapper.find(".cu-file-input").trigger("click");
              expect(clicked).toBe(variant.props?.readOnly ? 0 : 1);
            },
          },
        ],
      },
    },
  ],
};
