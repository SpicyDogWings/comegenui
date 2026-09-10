import { defineComponent, h, ref } from "vue";
import ColorPicker from "@/components/form/ColorPicker.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface ColorPickerInstance {
  get: () => string;
  set: (value: string) => void;
  reset: () => void;
  focus: () => void;
}

/**
 * Programmatic: patio de juegos de los **exposes** de ColorPicker
 * (get/set/reset/focus) sobre una instancia en vivo.
 */
const ColorPickerProgrammatic = defineComponent({
  name: "ColorPickerProgrammatic",
  setup() {
    const pickerRef = ref<InstanceType<typeof ColorPicker> | null>(null);
    const color = ref("#3b82f6");
    const getResult = ref("");

    const instance = () => pickerRef.value as unknown as ColorPickerInstance | null;

    const read = () => {
      const picker = instance();
      if (picker) getResult.value = picker.get();
    };

    const run = (action: (picker: ColorPickerInstance) => void) => {
      const picker = instance();
      if (picker) action(picker);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: read }, () => "get()"),
          h(Button, { color: "neutral", onClick: () => run((picker) => picker.set("#3b82f6")) }, () => "set('#3b82f6')"),
          h(Button, { color: "neutral", onClick: () => run((picker) => picker.reset()) }, () => "reset()"),
          h(Button, { color: "neutral", onClick: () => run((picker) => picker.focus()) }, () => "focus()"),
        ]),
        h("p", { class: "playground-state" }, [
          "get(): ",
          h("strong", getResult.value || "—"),
          " · v-model: ",
          h("strong", color.value),
        ]),
        h(ColorPicker, {
          ref: pickerRef,
          modelValue: color.value,
          "onUpdate:modelValue": (next: string) => {
            color.value = next;
            getResult.value = next;
          },
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import ColorPicker from '@/components/form/ColorPicker.vue'
import Button from '@/components/buttons/Button.vue'

const color = ref('#3b82f6')
const picker = ref(null)
const getResult = ref(null)

const read = () => (getResult.value = picker.value.get())
const run = (action) => action(picker.value)
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="read()">get()</Button>
      <Button color="neutral" @click="run((picker) => picker.set('#3b82f6'))">set('#3b82f6')</Button>
      <Button color="neutral" @click="run((picker) => picker.reset())">reset()</Button>
      <Button color="neutral" @click="run((picker) => picker.focus())">focus()</Button>
    </div>
    <p class="playground-state">
      get(): <strong>{{ getResult || '—' }}</strong>
      · v-model: <strong>{{ color }}</strong>
    </p>
    <ColorPicker ref="picker" v-model="color" @update:model-value="getResult = $event" />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuColorPicker.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <cu-button id="cp-get" color="neutral">get()</cu-button>
    <cu-button id="cp-set" color="neutral">set('#3b82f6')</cu-button>
    <cu-button id="cp-reset" color="neutral">reset()</cu-button>
    <cu-button id="cp-focus" color="neutral">focus()</cu-button>
  </div>
  <p id="cp-state">get(): — · v-model: —</p>
  <cu-color-picker id="cp" model-value="#3b82f6"></cu-color-picker>
</div>

<script>
  customElements.whenDefined('cu-color-picker').then(() => {
    const picker = document.getElementById('cp');
    const state = document.getElementById('cp-state');
    let color = picker.get();

    const render = () => {
      state.textContent = 'get(): ' + picker.get() + ' · v-model: ' + color;
    };

    picker.addEventListener('update:modelValue', (e) => {
      color = e.detail;
      render();
    });

    document.getElementById('cp-get').addEventListener('click', render);
    document.getElementById('cp-set').addEventListener('click', () => {
      picker.set('#3b82f6');
      render();
    });
    document.getElementById('cp-reset').addEventListener('click', () => {
      picker.reset();
      render();
    });
    document.getElementById('cp-focus').addEventListener('click', () => picker.focus());
    render();
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: get(), set(), reset() y focus() sobre la instancia de abajo.",
    render: () => h(ColorPickerProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
];
