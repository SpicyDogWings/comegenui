// Migrado a mano: tools/migrate.mjs no detecta los <Badge> multilínea de la página.
// (sin test viejo)
//
// Secciones que quedan en la página (no van a la story): programmatic, api
import AuthorCard from "@/components/information/AuthorCard.vue";
import type { ComponentStory } from "@/stories/types";

// Espeja la lógica de iniciales de AuthorCard.vue para asertar el resultado.
function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return ((parts[0]?.[0] ?? "") + (parts[parts.length - 1]?.[0] ?? "")).toUpperCase();
  return (parts[0]?.slice(0, 2) ?? "").toUpperCase();
}

export const cuAuthorCardStories: ComponentStory = {
  component: "cu-author-card",
  vue: AuthorCard,
  sections: [
    {
      id: "default",
      title: "Default",
      badge: "initials",
      badgeTitle: "Sin imagen — muestra iniciales",
      layout: "col",
      variants: [
        { id: "v1", props: { name: "Jane Doe", role: "Product Designer" } },
        { id: "v2", props: { name: "John Smith", role: "Frontend Developer" } },
        { id: "v3", props: { name: "María García", role: "Engineering Manager" } },
      ],
      vue: `<script setup>
import AuthorCard from '@/components/information/AuthorCard.vue'
<\/script>

<template>
  <AuthorCard name="Jane Doe" role="Product Designer" />
  <AuthorCard name="John Smith" role="Frontend Developer" />
</template>`,
      vanilla: `<link rel="stylesheet" href="css/themes.css">
<script src="CuAuthorCard.umd.js"><\/script>

<cu-author-card name="Jane Doe" role="Product Designer" />
<cu-author-card name="John Smith" role="Frontend Developer" />`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-author",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-author").exists()).toBe(true);
            },
          },
          {
            name: "muestra el nombre en .cu-author-name",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-author-name").text()).toBe(variant.props?.name as string);
            },
          },
          {
            name: "muestra el rol en .cu-author-role",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-author-role").text()).toBe(variant.props?.role as string);
            },
          },
          {
            name: "deriva las iniciales del nombre",
            run({ wrapper, expect }, variant) {
              const name = variant.props?.name as string;
              expect(wrapper.find(".cu-avatar-initials").text()).toBe(initialsOf(name));
            },
          },
          {
            name: "aplica el tamaño md por defecto",
            run({ wrapper, expect }, variant) {
              if (variant.props?.size) return;
              expect(wrapper.find(".cu-avatar").classes()).toContain("cu-avatar--md");
            },
          },
          {
            name: "resuelve el color del avatar por hash cuando no se pasa color",
            run({ wrapper, expect }, variant) {
              if (variant.props?.color) return;
              expect(wrapper.find(".cu-avatar").attributes("style")).toContain("--avatar-bg: var(--cu-color-");
            },
          },
          {
            name: "no renderiza imagen sin src",
            run({ wrapper, expect }, variant) {
              if (variant.props?.src) return;
              expect(wrapper.find("img.cu-avatar-img").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "sizes",
      title: "Sizes",
      badge: "md",
      badgeTitle: "Tamaño por defecto",
      variants: [
        { id: "sm", props: { name: "Small Author", role: "sm", size: "sm" } },
        { id: "md", props: { name: "Medium Author", role: "md (default)", size: "md" } },
        { id: "lg", props: { name: "Large Author", role: "lg", size: "lg" } },
      ],
      vue: `<AuthorCard name="Small" role="sm" size="sm" />
<AuthorCard name="Medium" role="md (default)" size="md" />
<AuthorCard name="Large" role="lg" size="lg" />`,
      vanilla: `<cu-author-card name="Small" role="sm" size="sm" />
<cu-author-card name="Medium" role="md (default)" size="md" />
<cu-author-card name="Large" role="lg" size="lg" />`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-author",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-author").exists()).toBe(true);
            },
          },
          {
            name: "aplica la clase cu-avatar--{size}",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-avatar").classes()).toContain(`cu-avatar--${variant.props?.size}`);
            },
          },
          {
            name: "muestra nombre y rol",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-author-name").text()).toBe(variant.props?.name as string);
              expect(wrapper.find(".cu-author-role").text()).toBe(variant.props?.role as string);
            },
          },
        ],
      },
    },

    {
      id: "with-image",
      title: "With Image",
      badge: "image",
      badgeTitle: "Con prop src — muestra foto",
      variants: [
        {
          id: "ada",
          props: { name: "Ada Lovelace", role: "Mathematician", src: "https://i.pravatar.cc/150?img=5" },
        },
        {
          id: "alan",
          props: { name: "Alan Turing", role: "Computer Scientist", src: "https://i.pravatar.cc/150?img=12" },
        },
      ],
      vue: `<AuthorCard name="Ada Lovelace" role="Mathematician"
  src="https://i.pravatar.cc/150?img=5" />
<AuthorCard name="Alan Turing" role="Computer Scientist"
  src="https://i.pravatar.cc/150?img=12" />`,
      vanilla: `<cu-author-card name="Ada Lovelace" role="Mathematician"
  src="https://i.pravatar.cc/150?img=5" />
<cu-author-card name="Alan Turing" role="Computer Scientist"
  src="https://i.pravatar.cc/150?img=12" />`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-author",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-author").exists()).toBe(true);
            },
          },
          {
            name: "renderiza img.cu-avatar-img con el src",
            run({ wrapper, expect }, variant) {
              const img = wrapper.find("img.cu-avatar-img");
              expect(img.exists()).toBe(true);
              expect(img.attributes("src")).toBe(variant.props?.src as string);
            },
          },
          {
            name: "no muestra iniciales cuando hay imagen",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-avatar-initials").exists()).toBe(false);
            },
          },
          {
            name: "muestra nombre y rol",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-author-name").text()).toBe(variant.props?.name as string);
              expect(wrapper.find(".cu-author-role").text()).toBe(variant.props?.role as string);
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "auto",
      badgeTitle: "Color auto por hash si no se pasa",
      layout: "col",
      variants: [
        { id: "primary", props: { name: "Primary Author", role: "primary", color: "primary" } },
        { id: "success", props: { name: "Success Author", role: "success", color: "success" } },
        { id: "warning", props: { name: "Warning Author", role: "warning", color: "warning" } },
        { id: "danger", props: { name: "Danger Author", role: "danger", color: "danger" } },
      ],
      vue: `<AuthorCard name="Primary" role="primary" color="primary" />
<AuthorCard name="Success" role="success" color="success" />
<AuthorCard name="Warning" role="warning" color="warning" />
<AuthorCard name="Danger" role="danger" color="danger" />`,
      vanilla: `<cu-author-card name="Primary" role="primary" color="primary" />
<cu-author-card name="Success" role="success" color="success" />
<cu-author-card name="Warning" role="warning" color="warning" />
<cu-author-card name="Danger" role="danger" color="danger" />`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-author",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-author").exists()).toBe(true);
            },
          },
          {
            name: "pasa el color al avatar como token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string;
              expect(wrapper.find(".cu-avatar").attributes("style")).toContain(
                `--avatar-bg: var(--cu-color-${color}`,
              );
            },
          },
          {
            name: "deriva las iniciales del nombre",
            run({ wrapper, expect }, variant) {
              const name = variant.props?.name as string;
              expect(wrapper.find(".cu-avatar-initials").text()).toBe(initialsOf(name));
            },
          },
        ],
      },
    },
  ],
};
