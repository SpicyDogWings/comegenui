// Generado por tools/stories/migrate.mjs — revisar y completar los TODO.
// (sin test viejo)
//
// Secciones que quedan en la página (no van a la story): programmatic, api
import Avatar from "@/components/information/Avatar.vue";
import type { ComponentStory } from "@/stories/types";

export const cuAvatarStories: ComponentStory = {
  component: "cu-avatar",
  vue: Avatar,
  sections: [
    {
      id: "default",
      title: "Default",
      badge: "auto",
      variants: [
        { id: "v1", props: {"initials":"JD"} },
        { id: "v2", props: {"initials":"AB"} },
        { id: "v3", props: {"initials":"XY"} },
        { id: "v4", props: {"initials":"MK"} },
        { id: "v5", props: {"initials":"PL"} },
      ],
      vue: `<script setup>
import Avatar from '@/components/information/Avatar.vue'
<\/script>

<template>
  <Avatar initials="JD" />
  <Avatar initials="AB" />
  <Avatar initials="XY" />
</template>`,
      vanilla: `<link rel="stylesheet" href="css/themes.css">
<script src="CuAvatar.umd.js"><\/script>

<cu-avatar initials="JD" />
<cu-avatar initials="AB" />
<cu-avatar initials="XY" />`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-avatar",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-avatar").exists()).toBe(true);
            },
          },
          {
            name: "renderiza las iniciales",
            run({ wrapper, expect }, variant) {
              const initials = variant.props?.initials as string | undefined;
              if (!initials) return;
              expect(wrapper.find(".cu-avatar-initials").text()).toBe(initials);
            },
          },
          {
            name: "resuelve un color de la paleta",
            run({ wrapper, expect }) {
              const style = wrapper.find(".cu-avatar").attributes("style") ?? "";
              expect(style).toContain("--avatar-bg: var(--cu-color-");
            },
          },
        ],
      },
    },

    {
      id: "sizes",
      title: "Sizes",
      badge: "md",
      variants: [
        { id: "v1", props: {"initials":"SM","size":"sm"} },
        { id: "v2", props: {"initials":"MD","size":"md"} },
        { id: "v3", props: {"initials":"LG","size":"lg"} },
      ],
      vue: `<Avatar initials="SM" size="sm" />
<Avatar initials="MD" size="md" />
<Avatar initials="LG" size="lg" />`,
      vanilla: `<cu-avatar initials="SM" size="sm" />
<cu-avatar initials="MD" size="md" />
<cu-avatar initials="LG" size="lg" />`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-avatar",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-avatar").exists()).toBe(true);
            },
          },
          {
            name: "aplica la clase cu-avatar--{size}",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-avatar").classes()).toContain(`cu-avatar--${variant.props?.size}`);
            },
          },
        ],
      },
    },

    {
      id: "with-image",
      title: "With Image",
      badge: "image",
      variants: [
        { id: "v1", props: {"src":"https://i.pravatar.cc/150?img=3"} },
        { id: "v2", props: {"src":"https://i.pravatar.cc/150?img=8"} },
        { id: "v3", props: {"src":"https://i.pravatar.cc/150?img=15"} },
      ],
      vue: `<Avatar src="https://i.pravatar.cc/150?img=3" />
<Avatar src="https://i.pravatar.cc/150?img=8" />
<Avatar src="https://i.pravatar.cc/150?img=15" />`,
      vanilla: `<cu-avatar src="https://i.pravatar.cc/150?img=3" />
<cu-avatar src="https://i.pravatar.cc/150?img=8" />
<cu-avatar src="https://i.pravatar.cc/150?img=15" />`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-avatar",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-avatar").exists()).toBe(true);
            },
          },
          {
            name: "renderiza img.cu-avatar-img con el src",
            run({ wrapper, expect }, variant) {
              const img = wrapper.find("img.cu-avatar-img");
              expect(img.exists()).toBe(true);
              expect(img.attributes("src")).toBe(String(variant.props?.src));
            },
          },
          {
            name: "no muestra iniciales cuando hay imagen",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-avatar-initials").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "explicit",
      variants: [
        { id: "primary", props: {"initials":"PR","color":"primary"} },
        { id: "secondary", props: {"initials":"SC","color":"secondary"} },
        { id: "success", props: {"initials":"SU","color":"success"} },
        { id: "warning", props: {"initials":"WA","color":"warning"} },
        { id: "danger", props: {"initials":"DA","color":"danger"} },
      ],
      vue: `<Avatar initials="PR" color="primary" />
<Avatar initials="SC" color="secondary" />
<Avatar initials="SU" color="success" />
<Avatar initials="WA" color="warning" />
<Avatar initials="DA" color="danger" />`,
      vanilla: `<cu-avatar initials="PR" color="primary" />
<cu-avatar initials="SC" color="secondary" />
<cu-avatar initials="SU" color="success" />
<cu-avatar initials="WA" color="warning" />
<cu-avatar initials="DA" color="danger" />`,
      checks: {
        l1: [
          {
            name: "renderiza .cu-avatar",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-avatar").exists()).toBe(true);
            },
          },
          {
            name: "resuelve el color como token CSS",
            run({ wrapper, expect }, variant) {
              const color = variant.props?.color as string | undefined;
              if (!color) return;
              const html = wrapper.html();
              expect(html).toContain(`var(--cu-color-${color}`);
            },
          },
          {
            name: "aplica el color del prop como token",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-avatar").attributes("style")).toContain(
                `var(--cu-color-${variant.props?.color}`,
              );
            },
          },
        ],
      },
    },
  ],
};
