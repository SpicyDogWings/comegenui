import { h } from "vue";
import Card from "@/components/information/Card.vue";
import type { ComponentStory, Variant } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;
const VARIANTS = ["ghost", "outlined", "soft", "subtle", "solid"] as const;

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function colorVariants(): Variant[] {
  return COLORS.map((color) => ({
    id: color,
    props: { title: capitalize(color), color, variant: "soft" },
    slots: { default: `Tarjeta ${color}.` },
  }));
}

export const cuCardStories: ComponentStory = {
  component: "cu-card",
  vue: Card,
  tokens: [
    '--card-bg',
    '--card-text',
    '--card-soft',
    '--card-subtle',
    '--card-subtle-border',
    '--cu-font-sans',
    '--cu-font-size-sm',
    '--cu-font-size-lg',
    '--cu-font-weight-bold',
    '--cu-line-height-relaxed',
    '--cu-radius-lg',
    '--cu-shadow-md',
    '--cu-border-thin',
    '--cu-border-color',
    '--cu-space-2xs',
    '--cu-space-sm',
    '--cu-space-md',
    '--cu-space-lg',
  ],
  api: {
    props: [
      { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
      { name: 'variant', type: 'string', default: '"ghost"', description: 'ghost, outlined, soft, subtle, solid' },
      { name: 'layout', type: 'string', default: '"vertical"', description: 'vertical (media arriba) | horizontal (media al costado)' },
      { name: 'title', type: 'string', default: '—', description: 'Título (reemplazado por el slot #header)' },
      { name: 'subtitle', type: 'string', default: '—', description: 'Subtítulo bajo el title' },
      { name: 'image', type: 'string', default: '—', description: 'URL de imagen de la media (alternativa al slot #media)' },
    ],
    slots: [
      { name: 'default', description: 'Contenido principal' },
      { name: 'media', description: 'Media personalizada (reemplaza image)' },
      { name: 'header', description: 'Reemplaza title/subtitle' },
      { name: 'footer', description: 'Acciones o info adicional' },
    ],
    events: [],
    exposes: [],
  },
  sections: [
    {
      id: "default",
      title: "Default",
      variants: [
        {
          id: "v1",
          props: { title: "Tarjeta de información", subtitle: "Subtítulo descriptivo" },
          slots: {
            default:
              "Contenido principal de la tarjeta. Sirve para mostrar información agrupada de forma visual y jerárquica.",
          },
        },
        { id: "v2", props: { title: "Sin subtítulo" }, slots: { default: "Una tarjeta simple sin subtítulo ni footer, solo con su contenido." } },
        { id: "v3", slots: { default: "Sin título tampoco. Solo el contenido directo dentro de la tarjeta." } },
      ],
      vue: `<script setup>
import Card from '@/components/information/Card.vue'
<\/script>

<template>
  <Card title="Tarjeta de información" subtitle="Subtítulo descriptivo">
    Contenido principal de la tarjeta.
  </Card>
</template>`,
      vanilla: `<link rel="stylesheet" href="css/themes.css">
<script src="CuCard.umd.js"><\/script>

<cu-card title="Tarjeta de información" subtitle="Subtítulo descriptivo">
  Contenido principal de la tarjeta.
</cu-card>`,
      checks: {
        l1: [
          {
            name: "clases por defecto: ghost + vertical",
            run({ wrapper, expect }, variant) {
              if (variant.props?.variant || variant.props?.layout) return;
              const classes = wrapper.find("article.cu-card").classes();
              expect(classes).toContain("cu-card--ghost");
              expect(classes).toContain("cu-card--vertical");
            },
          },
          {
            name: "title y subtitle: renderiza el encabezado",
            run({ wrapper, expect }, variant) {
              const title = variant.props?.title as string | undefined;
              const subtitle = variant.props?.subtitle as string | undefined;
              if (title) expect(wrapper.find("h3.cu-card-title").text()).toBe(title);
              if (subtitle) expect(wrapper.find("p.cu-card-subtitle").text()).toBe(subtitle);
            },
          },
        ],
      },
    },

    {
      id: "layouts",
      title: "Layouts",
      variants: [
        {
          id: "v1",
          props: { layout: "horizontal", title: "Horizontal", subtitle: "Imagen al costado", image: "https://picsum.photos/seed/comegen-card-h/400/300" },
          slots: { default: "La media (imagen o slot) se muestra a la izquierda y el contenido a la derecha." },
        },
        {
          id: "media-slot",
          props: { layout: "horizontal", title: "Con slot media", color: "primary", variant: "soft" },
          slots: {
            media: () => h("div", { class: "media-side" }, "Side"),
            default: "Usá layout=\"horizontal\" para media al lado del contenido.",
          },
        },
        {
          id: "v3",
          props: { layout: "vertical", title: "Vertical", subtitle: "Imagen arriba (default)", image: "https://picsum.photos/seed/comegen-card-v/400/300" },
          slots: { default: "Layout vertical: la media se muestra arriba del contenido." },
        },
      ],
      vue: `<Card layout="horizontal" title="Horizontal" subtitle="Imagen al costado"
  image="https://picsum.photos/seed/cu-card-h/400/300">
  Media a la izquierda, contenido a la derecha.
</Card>

<Card layout="horizontal" title="Con slot media" color="primary" variant="soft">
  <template #media>
    <div class="media-side">Side</div>
  </template>
  Media al costado con slot.
</Card>

<Card layout="vertical" title="Vertical" subtitle="Imagen arriba (default)"
  image="https://picsum.photos/seed/cu-card-v/400/300">
  La media se muestra arriba del contenido.
</Card>`,
      vanilla: `<script src="CuCard.umd.js"><\/script>

<cu-card layout="horizontal" title="Horizontal" subtitle="Imagen al costado"
  image="https://picsum.photos/seed/cu-card-h/400/300">
  Media a la izquierda, contenido a la derecha.
</cu-card>

<cu-card layout="vertical" title="Vertical" image="...">
  La media se muestra arriba del contenido.
</cu-card>`,
      checks: {
        l1: [
          {
            name: "layout: aplica la clase cu-card--{layout}",
            run({ wrapper, expect }, variant) {
              const layout = variant.props?.layout as string | undefined;
              if (!layout) return;
              expect(wrapper.find("article.cu-card").classes()).toContain(`cu-card--${layout}`);
            },
          },
          {
            name: "image: renderiza img.cu-card-image dentro de .cu-card-media",
            run({ wrapper, expect }, variant) {
              const image = variant.props?.image as string | undefined;
              if (!image) return;
              const img = wrapper.find("img.cu-card-image");
              expect(img.exists()).toBe(true);
              expect(img.attributes("src")).toBe(image);
              expect(wrapper.find(".cu-card-media").exists()).toBe(true);
            },
          },
          {
            name: "el slot #media se renderiza dentro de .cu-card-media",
            run({ wrapper, expect }, variant) {
              if (!variant.slots?.media) return;
              expect(wrapper.find(".cu-card-media .media-side").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "variants",
      title: "Variants",
      variants: VARIANTS.map((variant, index) => ({
        id: variant,
        props: index === 0 ? { title: "Ghost", variant } : { title: capitalize(variant), variant, color: "primary" },
        slots: { default: `Variante ${variant}.` },
      })),
      vue: `<Card title="Ghost" variant="ghost">Variante por defecto.</Card>
<Card title="Outlined" variant="outlined" color="primary">Variante outlined.</Card>
<Card title="Soft" variant="soft" color="primary">Variante soft.</Card>
<Card title="Subtle" variant="subtle" color="primary">Variante subtle.</Card>
<Card title="Solid" variant="solid" color="primary">Variante solid.</Card>`,
      vanilla: `<cu-card title="Ghost" variant="ghost">Variante por defecto.</cu-card>
<cu-card title="Outlined" variant="outlined" color="primary">Variante outlined.</cu-card>
<cu-card title="Soft" variant="soft" color="primary">Variante soft.</cu-card>
<cu-card title="Subtle" variant="subtle" color="primary">Variante subtle.</cu-card>
<cu-card title="Solid" variant="solid" color="primary">Variante solid.</cu-card>`,
      checks: {
        l1: [
          {
            name: "aplica la clase cu-card--{variant}",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find("article.cu-card").classes()).toContain(`cu-card--${variant.props?.variant}`);
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      variants: colorVariants(),
      vue: `<Card title="Primary" color="primary" variant="soft">Tarjeta primary.</Card>
<Card title="Secondary" color="secondary" variant="soft">Tarjeta secondary.</Card>
<Card title="Success" color="success" variant="soft">Tarjeta success.</Card>`,
      vanilla: `<cu-card title="Primary" color="primary" variant="soft">Tarjeta primary.</cu-card>
<cu-card title="Secondary" color="secondary" variant="soft">Tarjeta secondary.</cu-card>
<cu-card title="Success" color="success" variant="soft">Tarjeta success.</cu-card>`,
      checks: {
        l1: [
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string | undefined;
              if (!color) return;
              const style = wrapper.find("article.cu-card").attributes("style") ?? "";
              expect(style).toContain(`var(--cu-color-${color})`);
            },
          },
        ],
      },
    },

    {
      id: "media",
      title: "With Media",
      variants: [
        {
          id: "v1",
          props: { title: "Con imagen", subtitle: "Usa el prop image", image: "https://picsum.photos/seed/comegen-card/600/300" },
          slots: { default: "La imagen se muestra arriba, con el cuerpo de la tarjeta debajo." },
        },
        {
          id: "media-slot",
          props: { title: "Con slot media", subtitle: "Usa el slot #media" },
          slots: {
            media: () => h("div", { class: "media-block" }, "Contenido personalizado."),
            default: "Contenido personalizado del slot media. El slot permite incrustar cualquier elemento, no solo imágenes.",
          },
        },
      ],
      vue: `<Card title="Con imagen" subtitle="Usa el prop image"
  image="https://picsum.photos/seed/cu-card/600/300">
  La imagen se muestra arriba.
</Card>

<Card title="Con slot media" subtitle="Usa el slot #media">
  <template #media>
    <div class="media-block">Contenido personalizado.</div>
  </template>
  El slot permite cualquier elemento.
</Card>`,
      vanilla: `<script src="CuCard.umd.js"><\/script>

<cu-card title="Con imagen" image="https://picsum.photos/seed/cu-card/600/300">
  La imagen se muestra arriba.
</cu-card>

<cu-card title="Con slot media">
  <div slot="media" class="media-block">Contenido personalizado.</div>
  El slot permite cualquier elemento.
</cu-card>`,
      checks: {
        l1: [
          {
            name: "image: renderiza la imagen en .cu-card-media",
            run({ wrapper, expect }, variant) {
              const image = variant.props?.image as string | undefined;
              if (!image) return;
              expect(wrapper.find(".cu-card-media img.cu-card-image").attributes("src")).toBe(image);
            },
          },
          {
            name: "el slot #media reemplaza a image",
            run({ wrapper, expect }, variant) {
              if (!variant.slots?.media) return;
              expect(wrapper.find(".cu-card-media .media-block").exists()).toBe(true);
              expect(wrapper.find("img.cu-card-image").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "footer",
      title: "With Footer",
      variants: [
        {
          id: "footer-slot",
          props: { title: "Acciones", subtitle: "Botones en el footer" },
          slots: {
            footer: () => h("div", { class: "footer-test" }, "FOOT"),
            default: "Usá el slot #footer para acciones o información adicional.",
          },
        },
        {
          id: "badge",
          props: { title: "Info", color: "success", variant: "soft" },
          slots: {
            footer: () => h("span", { class: "footer-test" }, "Activo"),
            default: "Footer con badge de estado.",
          },
        },
      ],
      vue: `<Card title="Acciones" subtitle="Botones en el footer">
  Usá el slot #footer para acciones.
  <template #footer>
    <Button color="primary" variant="soft">Aceptar</Button>
    <Button color="neutral" variant="ghost">Cancelar</Button>
  </template>
</Card>`,
      vanilla: `<script src="CuCard.umd.js"><\/script>

<cu-card title="Acciones">
  Usá el slot #footer para acciones.
  <div slot="footer">
    <cu-button color="primary" variant="soft">Aceptar</cu-button>
    <cu-button color="neutral" variant="ghost">Cancelar</cu-button>
  </div>
</cu-card>`,
      checks: {
        l1: [
          {
            name: "el slot #footer se renderiza dentro de .cu-card-footer",
            run({ wrapper, expect }, variant) {
              if (!variant.slots?.footer) return;
              expect(wrapper.find(".cu-card-footer .footer-test").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "slots",
      title: "Custom Slots",
      variants: [
        {
          id: "header-slot",
          props: { title: "Header personalizado", color: "primary" },
          slots: {
            header: () => h("h3", { class: "header-test" }, "Título custom"),
            default: "El slot #header reemplaza el título/subtítulo por defecto.",
          },
        },
        {
          id: "media-footer",
          props: { layout: "horizontal" },
          slots: {
            media: () => h("div", { class: "media-test" }, "IMG"),
            footer: () => h("div", { class: "footer-test" }, "Footer minimalista"),
            default: "Combinación de slots media + footer.",
          },
        },
      ],
      vue: `<Card title="Header personalizado" color="primary">
  <template #header>
    <h3>Título custom</h3>
    <Badge color="primary" variant="soft">Custom</Badge>
  </template>
  El slot #header reemplaza título/subtítulo.
</Card>`,
      vanilla: `<script src="CuCard.umd.js"><\/script>

<cu-card title="Header personalizado" color="primary">
  <div slot="header">
    <h3>Título custom</h3>
    <cu-badge color="primary" variant="soft">Custom</cu-badge>
  </div>
  El slot #header reemplaza título/subtítulo.
</cu-card>`,
      checks: {
        l1: [
          {
            name: "el slot #header reemplaza el encabezado",
            run({ wrapper, expect }, variant) {
              if (!variant.slots?.header) return;
              expect(wrapper.find(".cu-card-header .header-test").exists()).toBe(true);
              expect(wrapper.find("h3.cu-card-title").exists()).toBe(false);
            },
          },
          {
            name: "slots #media y #footer se renderizan juntos",
            run({ wrapper, expect }, variant) {
              if (!variant.slots?.media || !variant.slots?.footer) return;
              expect(wrapper.find(".cu-card-media .media-test").exists()).toBe(true);
              expect(wrapper.find(".cu-card-footer .footer-test").exists()).toBe(true);
            },
          },
        ],
      },
    },
  ],
};
