// Generado por src/plugins/cu-playground/cli/generate.mjs a partir del contrato de ThemeManagerModal.vue.
// Eventos detectados: update:themeName, import, export, reset, copy-css, download-css

import ThemeManagerModal from "@/components/theme/ThemeManagerModal.vue";
import type { ComponentStory } from "@/plugins/cu-playground/contract";

export const cuThemeManagerModalStories: ComponentStory = {
  component: "cu-theme-manager-modal",
  vue: ThemeManagerModal,
  tokens: [
    "--cu-color-neutral",
    "--cu-font-size-sm",
    "--cu-font-weight-semibold",
    "--cu-radius-sm"
  ],
  classes: [
    "cu-code-block",
    "cu-code-block-pre"
  ],
  api: {
    "components": [
      {
        "label": "Modal",
        "path": "/playground/components/modal"
      },
      {
        "label": "Button",
        "path": "/playground/components/button"
      },
      {
        "label": "Input",
        "path": "/playground/components/input"
      },
      {
        "label": "CodeBlock",
        "path": "/playground/components/code-block"
      },
      {
        "label": "FileInput",
        "path": "/playground/components/file-input"
      }
    ],
    "props": [
      {
        "name": "themeName",
        "type": "string"
      },
      {
        "name": "cssOutput",
        "type": "string"
      }
    ],
    "events": [
      {
        "name": "update:themeName",
        "type": "() => void"
      },
      {
        "name": "import",
        "type": "() => void"
      },
      {
        "name": "export",
        "type": "() => void"
      },
      {
        "name": "reset",
        "type": "() => void"
      },
      {
        "name": "copy-css",
        "type": "() => void"
      },
      {
        "name": "download-css",
        "type": "() => void"
      }
    ],
    "exposes": [
      {
        "name": "open()",
        "type": "() => void"
      },
      {
        "name": "close()",
        "type": "() => void"
      }
    ],
    "interfaceCode": `interface ThemeConfig {
    themes: Record<string, Record<string, string>>
    typography: Record<string, any>
    spacing: Record<string, string>
    borderRadius: Record<string, string>
    shadows: { color: string }
    borders: { width: Record<string, string>, color: Record<string, string> }
  }`
  },
  sections: [
    {
      id: "default",
      title: "Default",
      variants: [
        { id: "default", props: {"themeName":"ThemeManagerModal","cssOutput":"ThemeManagerModal"} },
      ],
      vue: `  <ThemeManagerModal theme-name="ThemeManagerModal" css-output="ThemeManagerModal"></ThemeManagerModal>`,
      checks: {
        l1: [
          {
            name: "renderiza el componente",
            run({ wrapper, expect }) {
              expect(wrapper.html()).not.toBe("");
            },
          },
          // TODO: checks específicos (eventos, exposes) — emite: update:themeName, import, export, reset, copy-css, download-css.
        ],
      },
    },
  ],
};
