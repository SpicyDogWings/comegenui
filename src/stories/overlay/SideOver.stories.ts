import { defineComponent, h, nextTick, ref } from "vue";
import type { VNodeChild } from "vue";
import SideOver from "@/components/overlay/SideOver.vue";
import Button from "@/components/buttons/Button.vue";
import Input from "@/components/form/Input.vue";
import Textarea from "@/components/form/Textarea.vue";
import type { ComponentStory, Variant } from "@/stories/types";

// ── Snippets (copiados de la página del playground) ─────────────────────────

const vueImport = `<script setup lang="ts">
import { ref } from 'vue'
import SideOver from '@/components/overlay/SideOver.vue'

const open = ref(false)
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const vanillaImport = `<link rel="stylesheet" href="dist/css/themes.css">
<script src="dist/CuSideOver.umd.js"><\/script>`;

const positionsVue = vueSnippet(`  <Button @click="open = true">Abrir</Button>
  <SideOver v-model="open" title="Título" position="left">
    <p>Panel que desliza desde la izquierda.</p>
  </SideOver>`);

const positionsVanilla = `${vanillaImport}

<button id="btn">Abrir</button>
<cu-side-over id="side" title="Título" position="left" size="300px">
  <div>
    <p>Panel desde la izquierda.</p>
  </div>
</cu-side-over>
<script>
  const side = document.querySelector('#side')
  document.querySelector('#btn').addEventListener('click', () => side.open = true)
<\/script>`;

const sizesVue = vueSnippet(`  <Button @click="open = true">Abrir</Button>
  <SideOver v-model="open" title="Tamaño md" size="md">
    <p>Los presets de tamaño siguen el mismo esquema que Modal: sm | md | lg | xl | full.</p>
  </SideOver>`);

const sizesVanilla = `${vanillaImport}

<button id="btn">Abrir</button>
<cu-side-over id="side" title="Tamaño md" position="right" size="md">
  <div>
    <p>Presets: sm | md | lg | xl | full</p>
  </div>
</cu-side-over>
<script>
  const side = document.querySelector('#side')
  document.querySelector('#btn').addEventListener('click', () => side.open = true)
<\/script>`;

const fullscreenVue = vueSnippet(`  <SideOver v-model="open" title="Fullscreen" fullscreen position="bottom">
    <p>Ocupa toda la pantalla (100dvh).</p>
  </SideOver>`);

const fullscreenVanilla = `${vanillaImport}

<button id="btn">Abrir</button>
<cu-side-over id="side" title="Fullscreen" position="bottom" fullscreen>
  <div>
    <p>Ocupa toda la pantalla (100dvh).</p>
  </div>
</cu-side-over>
<script>
  const side = document.querySelector('#side')
  document.querySelector('#btn').addEventListener('click', () => side.open = true)
<\/script>`;

const persistentVue = vueSnippet(`  <!-- No se cierra por backdrop, Escape ni el botón de cerrar -->
  <SideOver v-model="open" title="Persistent" persistent>
    <p>Solo se cierra con open=false</p>
    <Button @click="open = false">Cerrar</Button>
  </SideOver>`);

const persistentVanilla = `${vanillaImport}

<button id="btn">Abrir</button>
<cu-side-over id="side" title="Persistent" position="right" persistent>
  <div>
    <p>Se cierra solo programáticamente</p>
    <button onclick="document.querySelector('#side').close()">Cerrar</button>
  </div>
</cu-side-over>
<script>
  const side = document.querySelector('#side')
  document.querySelector('#btn').addEventListener('click', () => side.open = true)
<\/script>`;

const FORM_FIELDS = [
  { placeholder: "Nombre" },
  { placeholder: "Email", type: "email" },
  { placeholder: "Teléfono", type: "tel" },
  { placeholder: "Empresa" },
  { placeholder: "Cargo" },
  { placeholder: "Dirección" },
  { placeholder: "Ciudad" },
  { placeholder: "País" },
] as const;

const formBody = `<form style="display:flex;flex-direction:column;gap:1rem">
    <label>Nombre<br><input type="text" placeholder="Nombre" style="width:100%;padding:0.5rem"></label>
    <label>Email<br><input type="email" placeholder="Email" style="width:100%;padding:0.5rem"></label>
    <label>Teléfono<br><input type="tel" placeholder="Teléfono" style="width:100%;padding:0.5rem"></label>
    <label>Empresa<br><input type="text" placeholder="Empresa" style="width:100%;padding:0.5rem"></label>
    <label>Cargo<br><input type="text" placeholder="Cargo" style="width:100%;padding:0.5rem"></label>
    <label>Dirección<br><input type="text" placeholder="Dirección" style="width:100%;padding:0.5rem"></label>
    <label>Ciudad<br><input type="text" placeholder="Ciudad" style="width:100%;padding:0.5rem"></label>
    <label>País<br><input type="text" placeholder="País" style="width:100%;padding:0.5rem"></label>
    <label>Comentarios<br><textarea placeholder="Comentarios" rows="3" style="width:100%;padding:0.5rem"></textarea></label>
    <button type="submit" style="padding:0.5rem">Guardar</button>
  </form>`;

const formVue = vueSnippet(`  <SideOver v-model="open" title="Nuevo registro" size="md">
${formBody}
  </SideOver>`);

const formVanilla = `${vanillaImport}

<button id="btn">Abrir</button>
<cu-side-over id="side" title="Nuevo registro" position="right" size="md">
${formBody}
</cu-side-over>
<script>
  const side = document.querySelector('#side')
  document.querySelector('#btn').addEventListener('click', () => side.open = true)
<\/script>`;

// ── Slots compartidos por preview y variantes ───────────────────────────────

function demoBody(text: string): () => VNodeChild {
  return () => h("div", { class: "sideover-demo" }, h("p", text));
}

function persistentBody(): VNodeChild {
  return h("div", { class: "sideover-demo" }, [
    h("p", "Se cierra solo con open=false"),
    h(Button, { color: "primary", variant: "soft" }, () => "Cerrar"),
  ]);
}

function formContent(close?: () => void): VNodeChild {
  return h("form", { class: "sideover-form" }, [
    ...FORM_FIELDS.map((field) =>
      h("label", { key: field.placeholder }, [
        field.placeholder,
        h("br"),
        h(Input, { placeholder: field.placeholder, type: "type" in field ? field.type : undefined }),
      ]),
    ),
    h("label", { key: "Comentarios" }, [
      "Comentarios",
      h("br"),
      h(Textarea, { placeholder: "Comentarios", rows: 3 }),
    ]),
    h(Button, { color: "primary", variant: "solid", onClick: close }, () => "Guardar"),
  ]);
}

// ── Previews interactivos (los demos abren el panel con un click) ────────────

interface PanelDemo {
  id: string;
  label: string;
  color?: "primary" | "secondary" | "neutral" | "success" | "warning" | "danger";
  props?: Record<string, unknown>;
  slot?: (close: () => void) => VNodeChild;
}

function panelsPreview(name: string, demos: PanelDemo[]) {
  return defineComponent({
    name,
    setup() {
      const open = ref<Record<string, boolean>>({});
      return () => [
        ...demos.map((demo) =>
          h(
            Button,
            {
              key: `button-${demo.id}`,
              color: demo.color ?? "neutral",
              variant: "soft",
              onClick: () => (open.value[demo.id] = true),
            },
            () => demo.label,
          ),
        ),
        ...demos.map((demo) => {
          const slot = demo.slot;
          const close = () => (open.value[demo.id] = false);
          return h(
            SideOver,
            {
              key: `panel-${demo.id}`,
              modelValue: !!open.value[demo.id],
              "onUpdate:modelValue": (value: boolean) => (open.value[demo.id] = value),
              ...demo.props,
            },
            {
              default: slot
                ? () => slot(close)
                : () =>
                    h(
                      "div",
                      { class: "sideover-demo" },
                      h("p", `${String(demo.props?.title ?? demo.label)} panel.`),
                    ),
            },
          );
        }),
      ];
    },
  });
}

const PositionsPreview = panelsPreview("SideOverPositionsPreview", [
  {
    id: "right",
    label: "Right",
    color: "primary",
    props: { title: "Right", position: "right" },
    slot: demoBody("Panel desde la derecha."),
  },
  {
    id: "left",
    label: "Left",
    props: { title: "Left", position: "left", size: "300px" },
    slot: demoBody("Panel desde la izquierda."),
  },
  {
    id: "top",
    label: "Top",
    props: { title: "Top", position: "top", size: "200px" },
    slot: demoBody("Panel desde arriba."),
  },
  {
    id: "bottom",
    label: "Bottom",
    props: { title: "Bottom", position: "bottom", size: "200px" },
    slot: demoBody("Panel desde abajo."),
  },
]);

const SIZES = ["sm", "md", "lg", "xl"] as const;
const SIZE_PX = { sm: "320px", md: "400px", lg: "512px", xl: "640px" } as const;

const SizesPreview = panelsPreview(
  "SideOverSizesPreview",
  SIZES.map((size) => ({
    id: size,
    label: size,
    color: size === "md" ? "primary" : "neutral",
    props: { title: `${size} — ${SIZE_PX[size]}`, position: "right", size },
    slot: demoBody(`Preset ${size}.`),
  })),
);

const FullscreenPreview = panelsPreview("SideOverFullscreenPreview", [
  {
    id: "fullscreen",
    label: "Abrir fullscreen",
    color: "primary",
    props: { title: "Fullscreen", position: "bottom", fullscreen: true },
    slot: demoBody("Ocupa toda la pantalla."),
  },
]);

const PersistentPreview = panelsPreview("SideOverPersistentPreview", [
  {
    id: "persistent",
    label: "Abrir persistent",
    color: "warning",
    props: { title: "Persistent", position: "right", persistent: true },
    slot: (close) =>
      h("div", { class: "sideover-demo" }, [
        h("p", "Se cierra solo con open=false"),
        h(Button, { color: "primary", variant: "soft", onClick: close }, () => "Cerrar"),
      ]),
  },
]);

const FormPreview = panelsPreview("SideOverFormPreview", [
  {
    id: "form",
    label: "Abrir formulario",
    color: "primary",
    props: { title: "Nuevo registro", position: "right", size: "md" },
    slot: (close) => formContent(close),
  },
]);

// ── Variantes (panel abierto = v-model inicial true) ────────────────────────

const positionVariants: Variant[] = [
  { id: "closed", props: {} },
  {
    id: "right",
    props: { modelValue: true, title: "Right", position: "right" },
    slots: { default: "Panel desde la derecha." },
  },
  {
    id: "left",
    props: { modelValue: true, title: "Left", position: "left", size: "300px" },
    slots: { default: "Panel desde la izquierda." },
  },
  {
    id: "top",
    props: { modelValue: true, title: "Top", position: "top", size: "200px" },
    slots: { default: "Panel desde arriba." },
  },
  {
    id: "bottom",
    props: { modelValue: true, title: "Bottom", position: "bottom", size: "200px" },
    slots: { default: "Panel desde abajo." },
  },
];

const sizeVariants: Variant[] = SIZES.map((size) => ({
  id: size,
  props: { modelValue: true, title: `${size} — ${SIZE_PX[size]}`, position: "right", size },
  slots: { default: `Preset ${size}.` },
}));

export const cuSideOverStories: ComponentStory = {
  component: "cu-side-over",
  vue: SideOver,
  // El panel se teleporta a body; con el stub los checks pueden buscarlo en el wrapper.
  global: () => ({ stubs: { teleport: true } }),
  sections: [
    {
      id: "positions",
      title: "Positions",
      badge: "right",
      badgeTitle: "Valor por defecto",
      layout: "row",
      preview: PositionsPreview,
      variants: positionVariants,
      vue: positionsVue,
      vanilla: positionsVanilla,
      checks: {
        l1: [
          {
            name: "cerrado por defecto no renderiza el panel",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "closed") return;
              expect(wrapper.find(".cu-sideover").exists()).toBe(false);
            },
          },
          {
            name: "aplica la clase cu-sideover-panel--{position}",
            run({ wrapper, expect }, variant) {
              if (variant.id === "closed") return;
              const position = variant.props?.position as string;
              expect(wrapper.find(".cu-sideover-panel").classes()).toContain(
                `cu-sideover-panel--${position}`,
              );
            },
          },
          {
            name: "renderiza el título en el header y el slot en el body",
            run({ wrapper, expect }, variant) {
              if (variant.id === "closed") return;
              expect(wrapper.find(".cu-sideover-title").text()).toBe(String(variant.props?.title));
              expect(wrapper.find(".cu-sideover-body").text()).toContain(
                String(variant.slots?.default),
              );
            },
          },
          {
            name: "size custom define width (left/right) o height (top/bottom)",
            run({ wrapper, expect }, variant) {
              if (variant.id === "closed" || !variant.props?.size) return;
              const position = variant.props?.position as string;
              const dimension = position === "top" || position === "bottom" ? "height" : "width";
              expect(wrapper.find(".cu-sideover-panel").attributes("style")).toContain(
                `${dimension}: ${String(variant.props?.size)}`,
              );
            },
          },
          {
            name: "click en el backdrop emite update:modelValue(false) y close",
            async run({ wrapper, expect }, variant) {
              if (variant.id === "closed") return;
              await wrapper.find(".cu-sideover-backdrop").trigger("click");
              expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
              expect(wrapper.emitted("close")).toHaveLength(1);
            },
          },
          {
            name: "click en el botón de cerrar emite update:modelValue(false) y close",
            async run({ wrapper, expect }, variant) {
              if (variant.id === "closed") return;
              await wrapper.find(".cu-sideover-close").trigger("click");
              expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([false]);
              expect(wrapper.emitted("close")).toHaveLength(1);
            },
          },
          {
            name: "Escape con el panel abierto emite close",
            async run({ wrapper, expect }, variant) {
              if (variant.id === "closed") return;
              document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
              await nextTick();
              expect(wrapper.emitted("close")).toHaveLength(1);
            },
          },
        ],
      },
    },

    {
      id: "sizes",
      title: "Sizes",
      badge: "sm | md | lg | xl | full",
      badgeTitle: "Presets como Modal",
      layout: "row",
      preview: SizesPreview,
      variants: sizeVariants,
      vue: sizesVue,
      vanilla: sizesVanilla,
      checks: {
        l1: [
          {
            name: "aplica data-size={size} y deja la dimensión al CSS",
            run({ wrapper, expect }, variant) {
              const panel = wrapper.find(".cu-sideover-panel");
              expect(panel.attributes("data-size")).toBe(variant.props?.size);
              expect(panel.attributes("style") ?? "").not.toContain("width");
            },
          },
          {
            name: "renderiza la clase del lado right",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-sideover-panel").classes()).toContain(
                "cu-sideover-panel--right",
              );
            },
          },
        ],
      },
    },

    {
      id: "fullscreen",
      title: "Fullscreen",
      badge: "fullscreen",
      badgeTitle: "Ocupa toda la pantalla",
      layout: "row",
      preview: FullscreenPreview,
      variants: [
        {
          id: "fullscreen",
          props: { modelValue: true, title: "Fullscreen", position: "bottom", fullscreen: true },
          slots: { default: "Ocupa toda la pantalla." },
        },
      ],
      vue: fullscreenVue,
      vanilla: fullscreenVanilla,
      checks: {
        l1: [
          {
            name: "aplica cu-sideover-panel--fullscreen y conserva el lado",
            run({ wrapper, expect }) {
              const panel = wrapper.find(".cu-sideover-panel");
              expect(panel.classes()).toContain("cu-sideover-panel--fullscreen");
              expect(panel.classes()).toContain("cu-sideover-panel--bottom");
            },
          },
          {
            name: "ignora size: sin data-size ni dimensión inline",
            run({ wrapper, expect }) {
              const panel = wrapper.find(".cu-sideover-panel");
              expect(panel.attributes("data-size")).toBeUndefined();
              const style = panel.attributes("style") ?? "";
              expect(style).not.toContain("width");
              expect(style).not.toContain("height");
            },
          },
          {
            name: "renderiza el título y el contenido del slot",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-sideover-title").text()).toBe(String(variant.props?.title));
              expect(wrapper.find(".cu-sideover-body").text()).toContain(
                String(variant.slots?.default),
              );
            },
          },
        ],
      },
    },

    {
      id: "persistent",
      title: "Persistent",
      badge: "persistent",
      badgeTitle: "No se cierra por backdrop, Escape ni botón",
      layout: "row",
      preview: PersistentPreview,
      variants: [
        {
          id: "persistent",
          props: { modelValue: true, title: "Persistent", position: "right", persistent: true },
          slots: { default: persistentBody },
        },
      ],
      vue: persistentVue,
      vanilla: persistentVanilla,
      checks: {
        l1: [
          {
            name: "oculta el botón de cerrar pero mantiene el título",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-sideover-close").exists()).toBe(false);
              expect(wrapper.find(".cu-sideover-title").text()).toBe(String(variant.props?.title));
            },
          },
          {
            name: "click en el backdrop no emite close ni update:modelValue",
            async run({ wrapper, expect }) {
              await wrapper.find(".cu-sideover-backdrop").trigger("click");
              expect(wrapper.emitted("update:modelValue")).toBeUndefined();
              expect(wrapper.emitted("close")).toBeUndefined();
            },
          },
          {
            name: "Escape no emite close",
            async run({ wrapper, expect }) {
              document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }));
              await nextTick();
              expect(wrapper.emitted("close")).toBeUndefined();
            },
          },
          {
            name: "renderiza el slot (con su botón interno) en el body",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-sideover-body .sideover-demo").exists()).toBe(true);
              expect(wrapper.find(".cu-sideover-body .sideover-demo button").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "form",
      title: "Formulario",
      badge: "scroll interno",
      badgeTitle: "El contenido scrollea, el header queda fijo",
      layout: "row",
      preview: FormPreview,
      variants: [
        {
          id: "form",
          props: { modelValue: true, title: "Nuevo registro", position: "right", size: "md" },
          slots: { default: () => formContent() },
        },
      ],
      vue: formVue,
      vanilla: formVanilla,
      checks: {
        l1: [
          {
            name: "renderiza el formulario con Input y Textarea en el body",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-sideover-body form.sideover-form").exists()).toBe(true);
              expect(wrapper.findAll(".cu-sideover-body .cu-input")).toHaveLength(
                FORM_FIELDS.length,
              );
              expect(wrapper.findAll(".cu-sideover-body .cu-textarea")).toHaveLength(1);
            },
          },
          {
            name: "mantiene el header con título fuera del body scrolleable",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-sideover-header .cu-sideover-title").text()).toBe(
                "Nuevo registro",
              );
              expect(wrapper.find(".cu-sideover-body .cu-sideover-header").exists()).toBe(false);
            },
          },
          {
            name: "aplica el preset data-size=md",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-sideover-panel").attributes("data-size")).toBe("md");
            },
          },
        ],
      },
    },
  ],
};
