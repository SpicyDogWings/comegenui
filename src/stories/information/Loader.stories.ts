import { defineComponent, h } from "vue";
import Loader from "@/components/information/Loader.vue";
import type { ComponentStory } from "@/stories/types";

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

const BOX =
  "position:relative;height:3px;min-width:200px;background:var(--cu-color-neutral-subtle, rgba(0,0,0,0.06));border-radius:2px;overflow:hidden";

const LoadingPreview = defineComponent({
  name: "LoaderLoadingPreview",
  setup() {
    return () => h("div", { style: BOX }, [h(Loader, { color: "primary", animation: "loading" })]);
  },
});

const CooldownPreview = defineComponent({
  name: "LoaderCooldownPreview",
  setup() {
    return () => h("div", { style: BOX }, [h(Loader, { animation: "cooldown", delay: 2000 })]);
  },
});

const ColorsPreview = defineComponent({
  name: "LoaderColorsPreview",
  setup() {
    return () =>
      h(
        "div",
        { style: "display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1.5rem" },
        COLORS.map((color) => h("div", { key: color, style: BOX }, [h(Loader, { color, animation: "loading" })])),
      );
  },
});

export const cuLoaderStories: ComponentStory = {
  component: "cu-loader",
  vue: Loader,
  tokens: [
    '--cu-loader-color',
    '--cu-loader-delay',
  ],
  api: {
    props: [
      { name: 'color', type: 'string', default: '"primary"', description: 'primary, secondary, neutral, success, warning, danger' },
      { name: 'animation', type: 'string', default: '"loading"', description: 'loading (slide infinito) | cooldown (se vacía en `delay` ms)' },
      { name: 'delay', type: 'number', default: '2000', description: 'Duración del cooldown en ms (solo animation="cooldown")' },
    ],
    slots: [],
    events: [],
    exposes: [],
  },
  sections: [
    {
      id: "loading",
      title: "Loading",
      badge: "loading",
      badgeTitle: "Animación por defecto",
      preview: LoadingPreview,
      variants: [{ id: "primary", props: { color: "primary", animation: "loading" } }],
      vue: `<script setup>
import Loader from '@/components/information/Loader.vue'
<\/script>

<template>
  <div class="demo-box">
    <Loader color="primary" animation="loading" />
  </div>
</template>

<style>
.demo-box { position: relative; height: 3px; min-width: 200px; }
</style>`,
      vanilla: `<link rel="stylesheet" href="css/themes.css">
<script src="CuLoader.umd.js"><\/script>

<div style="position: relative; height: 3px; min-width: 200px">
  <cu-loader color="primary" animation="loading"></cu-loader>
</div>`,
      checks: {
        l1: [
          {
            name: "aplica cu-loader-bar--loading y el token de color",
            run({ wrapper, expect }, variant) {
              const bar = wrapper.find(".cu-loader-bar");
              expect(bar.classes()).toContain("cu-loader-bar--loading");
              expect(bar.attributes("style")).toContain(
                `--cu-loader-color: var(--cu-color-${variant.props?.color})`,
              );
            },
          },
        ],
      },
    },

    {
      id: "cooldown",
      title: "Cooldown",
      badge: "2000",
      layout: "col",
      preview: CooldownPreview,
      variants: [{ id: "cooldown", props: { animation: "cooldown", delay: 2000 } }],
      vue: `<script setup>
import { ref } from 'vue'
import Loader from '@/components/information/Loader.vue'
import Button from '@/components/buttons/Button.vue'

const key = ref(0)
<\/script>

<template>
  <div class="demo-box">
    <Loader :key="key" animation="cooldown" :delay="2000" />
  </div>
  <Button color="neutral" variant="soft" @click="key++">Reiniciar</Button>
</template>`,
      vanilla: `<link rel="stylesheet" href="css/themes.css">
<script src="CuLoader.umd.js"><\/script>

<div class="demo-box">
  <cu-loader animation="cooldown" delay="2000"></cu-loader>
</div>
<cu-button color="neutral" variant="soft" id="restart">Reiniciar</cu-button>

<script>
  document.getElementById('restart').addEventListener('click', () => {
    const box = document.querySelector('.demo-box');
    const loader = box.querySelector('cu-loader');
    loader.replaceWith(loader.cloneNode(true));
  });
<\/script>`,
      checks: {
        l1: [
          {
            name: "aplica cooldown y --cu-loader-delay",
            run({ wrapper, expect }, variant) {
              const bar = wrapper.find(".cu-loader-bar");
              expect(bar.classes()).toContain("cu-loader-bar--cooldown");
              expect(bar.attributes("style")).toContain(`--cu-loader-delay: ${variant.props?.delay}ms`);
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      badge: "primary",
      badgeTitle: "Color por defecto",
      preview: ColorsPreview,
      variants: COLORS.map((color) => ({ id: color, props: { color, animation: "loading" } })),
      vue: `<script setup>
import Loader from '@/components/information/Loader.vue'
<\/script>

<template>
  <Loader color="primary" animation="loading" />
  <Loader color="secondary" animation="loading" />
  <Loader color="neutral" animation="loading" />
  <Loader color="success" animation="loading" />
  <Loader color="warning" animation="loading" />
  <Loader color="danger" animation="loading" />
</template>`,
      vanilla: `<link rel="stylesheet" href="css/themes.css">
<script src="CuLoader.umd.js"><\/script>

<cu-loader color="primary" animation="loading"></cu-loader>
<cu-loader color="secondary" animation="loading"></cu-loader>
<cu-loader color="neutral" animation="loading"></cu-loader>
<cu-loader color="success" animation="loading"></cu-loader>
<cu-loader color="warning" animation="loading"></cu-loader>
<cu-loader color="danger" animation="loading"></cu-loader>`,
      checks: {
        l1: [
          {
            name: "resuelve --cu-loader-color al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              expect(wrapper.find(".cu-loader-bar").attributes("style")).toContain(
                `--cu-loader-color: var(--cu-color-${variant.props?.color})`,
              );
            },
          },
        ],
      },
    },
  ],
};
