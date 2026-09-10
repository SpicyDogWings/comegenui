import CopyButton from "@/components/buttons/CopyButton.vue";
import type { ComponentStory, Variant } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const VARIANTS = ["soft", "solid", "outlined", "ghost", "subtle"] as const;

function colorVariants(): Variant[] {
  return COLORS.map((color) => ({
    id: color,
    props: { text: "Contenido copiable", color },
  }));
}

export const cuCopyButtonStories: ComponentStory = {
  component: "cu-copy-button",
  vue: CopyButton,
  sections: [
    {
      id: "variants",
      title: "Variants",
      badge: "soft",
      badgeTitle: "Variante por defecto",
      variants: VARIANTS.map((variant) => ({
        id: variant,
        props: { text: "Contenido a copiar", variant },
      })),
      vue: `<script setup>
import CopyButton from '@/components/buttons/CopyButton.vue'
<\/script>

<template>
  <CopyButton text="Contenido a copiar" variant="soft" />
  <CopyButton text="Contenido a copiar" variant="solid" />
  <CopyButton text="Contenido a copiar" variant="outlined" />
  <CopyButton text="Contenido a copiar" variant="ghost" />
  <CopyButton text="Contenido a copiar" variant="subtle" />
</template>`,
      vanilla: `<script src="dist/CuCopyButton.umd.js"><\/script>

<cu-copy-button text="Contenido a copiar" variant="soft"></cu-copy-button>`,
      checks: {
        l1: [
          {
            name: "renderiza solo el icono (sin texto) en el Button interno",
            run({ wrapper, expect }) {
              const button = wrapper.find("button.cu-button");
              expect(button.exists()).toBe(true);
              expect(button.find("svg").exists()).toBe(true);
              expect(button.text()).toBe("");
            },
          },
          {
            name: "delega la variante al Button (cu-button--{variant})",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-copy-button").classes()).toContain(
                `cu-button--${variant.props?.variant}`,
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
      badgeTitle: "Color por defecto",
      variants: colorVariants(),
      vue: `<script setup>
import CopyButton from '@/components/buttons/CopyButton.vue'
<\/script>

<template>
  <CopyButton text="Contenido" color="primary" />
  <CopyButton text="Contenido" color="secondary" />
  <CopyButton text="Contenido" color="neutral" />
  <CopyButton text="Contenido" color="success" />
  <CopyButton text="Contenido" color="warning" />
  <CopyButton text="Contenido" color="danger" />
</template>`,
      vanilla: `<script src="dist/CuCopyButton.umd.js"><\/script>

<cu-copy-button text="Contenido" color="primary"></cu-copy-button>
<cu-copy-button text="Contenido" color="secondary"></cu-copy-button>
<cu-copy-button text="Contenido" color="neutral"></cu-copy-button>
<cu-copy-button text="Contenido" color="success"></cu-copy-button>
<cu-copy-button text="Contenido" color="warning"></cu-copy-button>
<cu-copy-button text="Contenido" color="danger"></cu-copy-button>`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              expect(wrapper.html()).toContain(`var(--cu-color-${variant.props?.color}`);
            },
          },
        ],
      },
    },

    {
      id: "labels",
      title: "Labels",
      badge: "icon-only",
      badgeTitle: "Sin label",
      variants: [
        { id: "icon-only", props: { text: '{"id": 1, "nombre": "Ana"}' } },
        {
          id: "with-label",
          props: { text: '{"id": 1, "nombre": "Ana"}', label: "Copiar JSON", copiedLabel: "¡JSON copiado!" },
        },
        {
          id: "with-command",
          props: { text: "npm install comegen-ui", label: "Copiar comando", copiedLabel: "¡Comando copiado!" },
        },
      ],
      vue: `<script setup>
import CopyButton from '@/components/buttons/CopyButton.vue'
import Button from '@/components/buttons/Button.vue';
<\/script>

<template>
  <!-- icon-only (label vacío) -->
  <CopyButton text='{"id": 1, "nombre": "Ana"}' />

  <!-- label siempre visible + copiedLabel animado -->
  <CopyButton text='{"id": 1, "nombre": "Ana"}' label="Copiar JSON" copiedLabel="¡JSON copiado!" />
  <CopyButton text="npm install comegen-ui" label="Copiar comando" copiedLabel="¡Comando copiado!" />
</template>`,
      vanilla: `<script src="dist/CuCopyButton.umd.js"><\/script>

<cu-copy-button text='{"id": 1, "nombre": "Ana"}'></cu-copy-button>
<cu-copy-button text='{"id": 1, "nombre": "Ana"}' label="Copiar JSON" copied-label="¡JSON copiado!"></cu-copy-button>
<cu-copy-button text="npm install comegen-ui" label="Copiar comando" copied-label="¡Comando copiado!"></cu-copy-button>`,
      checks: {
        l1: [
          {
            name: "sin label: aria-label de fallback 'Copiar'",
            run({ wrapper, expect }, variant) {
              if (variant.props?.label) return;
              const button = wrapper.find("button.cu-button");
              expect(button.text()).toBe("");
              expect(button.attributes("aria-label")).toBe("Copiar");
            },
          },
          {
            name: "con label: texto visible y aria-label",
            run({ wrapper, expect }, variant) {
              const label = variant.props?.label as string | undefined;
              if (!label) return;
              const button = wrapper.find("button.cu-button");
              expect(button.text()).toContain(label);
              expect(button.attributes("aria-label")).toBe(label);
            },
          },
          {
            name: "al copiar muestra copiedLabel",
            async run({ wrapper, expect }, variant) {
              const copiedLabel = variant.props?.copiedLabel as string | undefined;
              if (!copiedLabel) return;

              Object.defineProperty(navigator, "clipboard", {
                value: { writeText: () => Promise.resolve() },
                configurable: true,
              });

              await wrapper.find("button.cu-button").trigger("click");
              await new Promise((resolve) => setTimeout(resolve, 0));

              const button = wrapper.find("button.cu-button");
              expect(button.attributes("aria-label")).toBe(copiedLabel);
              expect(button.text()).toContain(copiedLabel);
            },
          },
        ],
      },
    },
  ],
};
