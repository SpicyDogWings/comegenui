import { defineComponent, h, ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

/**
 * Demo interactiva (Programmatic) de Button: los `Button` neutrales cambian
 * las props de la instancia de abajo en vivo. Button no expone métodos ni
 * v-model, así que se controla por props.
 */
const ButtonProgrammatic = defineComponent({
  name: "ButtonProgrammatic",
  setup() {
    const color = ref<"primary" | "secondary" | "neutral" | "success" | "warning" | "danger">(
      "primary",
    );
    const variant = ref<"solid" | "outlined" | "soft" | "ghost" | "subtle" | "link" | "none">(
      "solid",
    );
    const size = ref<"sm" | "md" | "lg">("md");
    const loading = ref(false);

    const control = (label: string, onClick: () => void) =>
      h(Button, { color: "neutral", onClick }, () => label);

    const emulateLoading = () => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 1500);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          control("variant = solid", () => (variant.value = "solid")),
          control("variant = outlined", () => (variant.value = "outlined")),
          control("color = success", () => (color.value = "success")),
          control("color = danger", () => (color.value = "danger")),
          control("size = lg", () => (size.value = "lg")),
          control("size = sm", () => (size.value = "sm")),
          control("emulateLoading()", emulateLoading),
        ]),
        h("p", { class: "playground-state" }, [
          "color: ",
          h("strong", color.value),
          " · variant: ",
          h("strong", variant.value),
          " · size: ",
          h("strong", size.value),
          " · loading: ",
          h("strong", loading.value ? "true" : "false"),
        ]),
        h(
          Button,
          { color: color.value, variant: variant.value, size: size.value, loading: loading.value },
          () => "Guardar",
        ),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Button from '@/components/buttons/Button.vue'

const color = ref('primary')
const variant = ref('solid')
const size = ref('md')
const loading = ref(false)

function emulateLoading() {
  loading.value = true
  setTimeout(() => (loading.value = false), 1500)
}
<\/script>

<template>
  <Button color="neutral" @click="variant = 'outlined'">variant = outlined</Button>
  <Button color="neutral" @click="color = 'danger'">color = danger</Button>
  <Button color="neutral" @click="size = 'lg'">size = lg</Button>
  <Button color="neutral" @click="emulateLoading()">emulateLoading()</Button>

  <Button :color="color" :variant="variant" :size="size" :loading="loading">
    {{ loading ? 'Guardando...' : 'Guardar' }}
  </Button>
</template>`;

const programmaticVanilla = `<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="btn-solid" color="neutral">variant = solid</cu-button>
  <cu-button id="btn-danger" color="neutral">color = danger</cu-button>
  <cu-button id="btn-lg" color="neutral">size = lg</cu-button>
  <cu-button id="btn-loading" color="neutral">emulateLoading()</cu-button>
</div>

<cu-button id="btn-live" color="primary" variant="solid">Guardar</cu-button>

<script>
  const live = document.getElementById('btn-live');
  document.getElementById('btn-solid').addEventListener('click', () => (live.variant = 'solid'));
  document.getElementById('btn-danger').addEventListener('click', () => (live.color = 'danger'));
  document.getElementById('btn-lg').addEventListener('click', () => (live.size = 'lg'));
  document.getElementById('btn-loading').addEventListener('click', () => {
    live.loading = true;
    setTimeout(() => (live.loading = false), 1500);
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Seguidilla de botones sobre la instancia de abajo — el botón cambia por props en vivo.",
    render: () => h(ButtonProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
];
