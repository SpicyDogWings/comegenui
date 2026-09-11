import { nextTick } from "vue";
import FileInputZone from "@/components/form/FileInputZone.vue";
import type { ComponentStory } from "@/stories/types";
import { extras } from "./FileInputZone.stories.extras";

const UMD = `<script src="dist/CuFileInputZone.umd.js"><\/script>`;

export const cuFileInputZoneStories: ComponentStory = {
  component: "cu-file-input-zone",
  vue: FileInputZone,
  tokens: [
    "--cu-border-color",
    "--cu-border-thick",
    "--cu-border-thin",
    "--cu-font-sans",
    "--cu-font-size-sm",
    "--cu-font-size-xs",
    "--cu-font-weight-medium",
    "--cu-radius",
    "--cu-space-2xl",
    "--cu-space-2xs",
    "--cu-space-md",
    "--cu-space-xl",
    "--zone-bg",
    "--zone-ghost-hover",
    "--zone-text"
  ],
  classes: [
    "cu-file-zone",
    "cu-file-zone--disabled",
    "cu-file-zone--drag-over",
    "cu-file-zone--empty",
    "cu-file-zone--has-files",
    "cu-file-zone-formats",
    "cu-file-zone-hidden",
    "cu-file-zone-icon",
    "cu-file-zone-placeholder",
    "cu-file-zone-reject",
    "cu-file-zone-reject-item",
    "cu-file-zone-text",
    "cu-file-zone-wrap"
  ],
  subComponents: [
    {
      "label": "FileList",
      "path": "/playground/components/advanced-table#style"
    }
  ],
  api: {
    "components": [
      {
        "label": "FileList",
        "path": "/playground/components/file-list"
      },
      {
        "label": "Alert",
        "path": "/playground/components/alert"
      }
    ],
    "props": [
      {
        "name": "modelValue",
        "type": "File | File[] | null"
      },
      {
        "name": "color",
        "type": "primary | secondary | neutral | success | warning | danger",
        "default": "neutral",
        "description": "primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "placeholder",
        "type": "string",
        "default": "Selecciona un archivo o arrastra aquí",
        "description": "Texto cuando la zona está vacía"
      },
      {
        "name": "disabled",
        "type": "boolean",
        "default": "false",
        "description": "Deshabilita la zona"
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
        "description": "Formatos aceptados; se listan bajo el placeholder y se validan al seleccionar/soltar"
      },
      {
        "name": "multiple",
        "type": "boolean",
        "default": "false",
        "description": "Permite seleccionar múltiples archivos"
      },
      {
        "name": "maxSize",
        "type": "number",
        "description": "Tamaño máximo por archivo en bytes"
      },
      {
        "name": "directory",
        "type": "boolean",
        "default": "false",
        "description": "Selección de carpetas (webkitdirectory); implica multiple"
      },
      {
        "name": "directoryDeep",
        "type": "number",
        "default": "0",
        "description": "Profundidad de subcarpetas incluidas; -1 = ilimitada"
      },
      {
        "name": "maxHeight",
        "type": "string",
        "default": "",
        "description": "Altura máxima (CSS) de la lista de archivos"
      },
      {
        "name": "v-model",
        "type": "File | File[] | null",
        "default": "null",
        "description": "Archivo(s) seleccionado(s)"
      }
    ],
    "events": [
      {
        "name": "update:modelValue",
        "type": "() => void",
        "description": "v-model: emite File | File[] | null según la selección"
      },
      {
        "name": "click",
        "type": "nativo",
        "description": "Click sobre la zona (abre el selector de archivos)"
      },
      {
        "name": "keydown",
        "type": "nativo",
        "description": "Enter o Space abren el selector de archivos"
      },
      {
        "name": "focus",
        "type": "nativo",
        "description": "La zona recibe foco"
      },
      {
        "name": "blur",
        "type": "nativo",
        "description": "La zona pierde foco"
      },
      {
        "name": "dragover",
        "type": "nativo",
        "description": "Archivos se arrastran sobre la zona"
      },
      {
        "name": "drop",
        "type": "nativo",
        "description": "Se sueltan archivos o carpetas sobre la zona"
      }
    ],
    "exposes": [
      {
        "name": "get()",
        "type": "() => void"
      },
      {
        "name": "set()",
        "type": "() => void"
      },
      {
        "name": "reset()",
        "type": "() => void"
      },
      {
        "name": "focus()",
        "type": "() => void"
      },
      {
        "name": "trigger()",
        "type": "() => void"
      },
      {
        "name": "get",
        "type": "method",
        "description": "Devuelve File | File[] | null según la selección"
      },
      {
        "name": "set",
        "type": "method",
        "description": "set(files: File | File[] | null): establece los archivos"
      },
      {
        "name": "reset",
        "type": "method",
        "description": "Limpia la selección"
      },
      {
        "name": "focus",
        "type": "method",
        "description": "Pone el foco en la zona"
      },
      {
        "name": "trigger",
        "type": "method",
        "description": "Abre el diálogo de selección de archivos"
      }
    ]
  },
  extras,
  sections: [
    {
      id: "default",
      title: "Default",
      layout: "col",
      variants: [{ id: "v1" }],
      vue: `<script setup>
import { ref } from 'vue'
import FileInputZone from '@/components/form/FileInputZone.vue'

const files = ref(null)
<\/script>

<template>
  <FileInputZone v-model="files" />
</template>`,
      vanilla: `${UMD}

<cu-file-input-zone></cu-file-input-zone>`,
      checks: {
        l1: [
          {
            name: "renderiza la zona, el input file y el placeholder por defecto",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-file-zone").exists()).toBe(true);
              expect(wrapper.find("input[type='file']").exists()).toBe(true);
              expect(wrapper.find(".cu-file-zone-placeholder").text()).toBe(
                "Selecciona un archivo o arrastra aquí",
              );
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "neutral",
      layout: "col",
      variants: [
        { id: "primary", props: { color: "primary", placeholder: "primary" } },
        { id: "secondary", props: { color: "secondary", placeholder: "secondary" } },
        { id: "neutral", props: { color: "neutral", placeholder: "neutral" } },
        { id: "success", props: { color: "success", placeholder: "success" } },
        { id: "warning", props: { color: "warning", placeholder: "warning" } },
        { id: "danger", props: { color: "danger", placeholder: "danger" } },
      ],
      vue: `  <FileInputZone color="primary" placeholder="primary" />
  <FileInputZone color="secondary" placeholder="secondary" />
  <FileInputZone color="neutral" placeholder="neutral" />
  <FileInputZone color="success" placeholder="success" />
  <FileInputZone color="warning" placeholder="warning" />
  <FileInputZone color="danger" placeholder="danger" />`,
      vanilla: `${UMD}

<cu-file-input-zone color="primary" placeholder="primary"></cu-file-input-zone>
<cu-file-input-zone color="secondary" placeholder="secondary"></cu-file-input-zone>
<cu-file-input-zone color="neutral" placeholder="neutral"></cu-file-input-zone>
<cu-file-input-zone color="success" placeholder="success"></cu-file-input-zone>
<cu-file-input-zone color="warning" placeholder="warning"></cu-file-input-zone>
<cu-file-input-zone color="danger" placeholder="danger"></cu-file-input-zone>`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string | undefined;
              if (!color) return;
              expect(wrapper.html()).toContain(`var(--cu-color-${color}`);
            },
          },
          {
            name: "muestra el placeholder del variant",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-file-zone-placeholder").text()).toBe(
                String(variant.props?.placeholder),
              );
            },
          },
        ],
      },
    },

    {
      id: "multiple",
      title: "Multiple",
      badge: "false",
      layout: "col",
      variants: [{ id: "v1", props: { multiple: true, placeholder: "Sube varios archivos" } }],
      vue: `  <FileInputZone multiple placeholder="Sube varios archivos" />`,
      vanilla: `${UMD}

<cu-file-input-zone multiple placeholder="Sube varios archivos"></cu-file-input-zone>`,
      checks: {
        l1: [
          {
            name: "multiple marca el atributo multiple del input",
            run({ wrapper, expect }, variant) {
              if (!variant.props?.multiple) return;
              expect(wrapper.find("input[type='file']").attributes("multiple")).toBeDefined();
            },
          },
        ],
      },
    },

    {
      id: "accept",
      title: "With Accept",
      layout: "col",
      variants: [{ id: "v1", props: { accept: ".pdf,.jpg,.png", placeholder: "Solo imágenes y PDFs" } }],
      vue: `  <FileInputZone accept=".pdf,.jpg,.png" placeholder="Solo imágenes y PDFs" />`,
      vanilla: `${UMD}

<cu-file-input-zone accept=".pdf,.jpg,.png" placeholder="Solo imágenes y PDFs"></cu-file-input-zone>`,
      checks: {
        l1: [
          {
            name: "muestra el placeholder custom y los formatos aceptados",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-file-zone-placeholder").text()).toBe(
                String(variant.props?.placeholder),
              );
              expect(wrapper.find(".cu-file-zone-formats").text()).toContain(
                String(variant.props?.accept),
              );
            },
          },
        ],
      },
    },

    {
      id: "maxsize",
      title: "With Max Size",
      layout: "col",
      variants: [{ id: "v1", props: { maxSize: 5 * 1024 * 1024, placeholder: "Máximo 5MB por archivo" } }],
      vue: `  <FileInputZone :max-size="5 * 1024 * 1024" placeholder="Máximo 5MB por archivo" />`,
      vanilla: `${UMD}

<cu-file-input-zone max-size="5242880" placeholder="Máximo 5MB por archivo"></cu-file-input-zone>`,
      checks: {
        l1: [
          {
            name: "renderiza la zona con maxSize",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-file-zone").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "directory",
      title: "Directory",
      layout: "col",
      variants: [
        { id: "v1", props: { directory: true, placeholder: "Selecciona una carpeta" } },
        {
          id: "v2",
          props: { directory: true, directoryDeep: 1, placeholder: "Carpeta con 1 nivel de subcarpetas" },
        },
      ],
      vue: `  <FileInputZone directory placeholder="Selecciona una carpeta" />
  <FileInputZone directory :directory-deep="1" placeholder="Carpeta con 1 nivel de subcarpetas" />`,
      vanilla: `${UMD}

<cu-file-input-zone directory placeholder="Selecciona una carpeta"></cu-file-input-zone>
<cu-file-input-zone directory directory-deep="1" placeholder="Carpeta con 1 nivel de subcarpetas"></cu-file-input-zone>`,
      checks: {
        l1: [
          {
            name: "renderiza la zona y el placeholder",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-file-zone").exists()).toBe(true);
              expect(wrapper.find(".cu-file-zone-placeholder").text()).toBe(
                String(variant.props?.placeholder),
              );
            },
          },
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      badge: "false",
      layout: "col",
      variants: [{ id: "v1", props: { disabled: true, placeholder: "No disponible" } }],
      vue: `  <FileInputZone disabled placeholder="No disponible" />`,
      vanilla: `${UMD}

<cu-file-input-zone disabled placeholder="No disponible"></cu-file-input-zone>`,
      checks: {
        l1: [
          {
            name: "disabled agrega la clase y el atributo aria-disabled",
            run({ wrapper, expect }) {
              const zone = wrapper.find(".cu-file-zone");
              expect(zone.classes()).toContain("cu-file-zone--disabled");
              expect(zone.attributes("aria-disabled")).toBe("true");
            },
          },
        ],
      },
    },

    {
      id: "readonly",
      title: "ReadOnly",
      badge: "false",
      layout: "col",
      variants: [{ id: "v1", props: { readOnly: true, placeholder: "Solo lectura" } }],
      vue: `  <FileInputZone read-only placeholder="Solo lectura" />`,
      vanilla: `${UMD}

<cu-file-input-zone read-only placeholder="Solo lectura"></cu-file-input-zone>`,
      checks: {
        l1: [
          {
            name: "renderiza la zona",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-file-zone").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "validation",
      title: "Validation",
      layout: "col",
      variants: [
        { id: "reject", props: { accept: ".csv", multiple: true, placeholder: "Solo CSV" } },
        { id: "max-size", props: { maxSize: 10, placeholder: "Máximo 10 bytes" } },
      ],
      vue: `<script setup>
import { ref } from 'vue'
import FileInputZone from '@/components/form/FileInputZone.vue'

const files = ref(null)
<\/script>

<template>
  <FileInputZone v-model="files" accept=".csv" multiple placeholder="Solo CSV" />
</template>`,
      vanilla: `${UMD}

<cu-file-input-zone accept=".csv" multiple placeholder="Solo CSV"></cu-file-input-zone>`,
      checks: {
        l1: [
          {
            name: "rechaza archivos no permitidos y conserva los válidos",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "reject") return;
              const input = wrapper.find("input[type='file']");
              const good = new File(["a"], "datos.csv", { type: "text/csv" });
              const bad = new File(["x"], "doc.pdf", { type: "application/pdf" });
              Object.defineProperty(input.element, "files", { value: [good, bad], configurable: true });
              await input.trigger("change");
              const reject = wrapper.find(".cu-file-zone-reject-item");
              expect(reject.text()).toContain("doc.pdf");
              expect(reject.text()).toContain("formato no permitido");
              expect(wrapper.emitted("update:modelValue")?.[0]?.[0]).toEqual([good]);
            },
          },
          {
            name: "rechaza archivos que superan maxSize",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "max-size") return;
              const input = wrapper.find("input[type='file']");
              const file = new File([new ArrayBuffer(100)], "grande.csv", { type: "text/csv" });
              Object.defineProperty(input.element, "files", { value: [file], configurable: true });
              await input.trigger("change");
              expect(wrapper.find(".cu-file-zone-reject-item").text()).toContain("tamaño máximo");
              expect(wrapper.emitted("update:modelValue")).toBeUndefined();
            },
          },
          {
            name: "reset() limpia el feedback",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "reject") return;
              const input = wrapper.find("input[type='file']");
              const bad = new File(["x"], "doc.pdf", { type: "application/pdf" });
              Object.defineProperty(input.element, "files", { value: [bad], configurable: true });
              await input.trigger("change");
              expect(wrapper.find(".cu-file-zone-reject").exists()).toBe(true);
              (wrapper.vm as unknown as { reset: () => void }).reset();
              await nextTick();
              expect(wrapper.find(".cu-file-zone-reject").exists()).toBe(false);
            },
          },
          {
            name: "setear un v-model válido limpia el feedback",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "reject") return;
              const input = wrapper.find("input[type='file']");
              const bad = new File(["x"], "doc.pdf", { type: "application/pdf" });
              Object.defineProperty(input.element, "files", { value: [bad], configurable: true });
              await input.trigger("change");
              expect(wrapper.find(".cu-file-zone-reject").exists()).toBe(true);
              await wrapper.setProps({
                modelValue: new File(["a"], "datos.csv", { type: "text/csv" }),
              });
              await nextTick();
              expect(wrapper.find(".cu-file-zone-reject").exists()).toBe(false);
            },
          },
        ],
      },
    },
  ],
};
