import { defineComponent, h, ref } from "vue";
import Textarea from "@/components/form/Textarea.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface TextareaInstance {
  get: () => string;
  set: (value: string | number) => void;
  reset: () => void;
  focus: () => void;
}

/**
 * Programmatic: patio de juegos de los **exposes** de Textarea
 * (get/set/reset/focus) y su v-model sobre una instancia en vivo.
 */
const TextareaProgrammatic = defineComponent({
  name: "TextareaProgrammatic",
  setup() {
    const textareaRef = ref<InstanceType<typeof Textarea> | null>(null);
    const value = ref("");
    const getResult = ref("—");

    const instance = () => textareaRef.value as unknown as TextareaInstance | null;

    const sync = () => {
      const current = instance()?.get() ?? "";
      value.value = current;
      getResult.value = current || "(vacío)";
    };

    const run = (action: (textareaInstance: TextareaInstance) => void) => {
      const textareaInstance = instance();
      if (!textareaInstance) return;
      action(textareaInstance);
      sync();
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: sync }, () => "get()"),
          h(Button, { color: "neutral", onClick: () => run((ta) => ta.set("Hola mundo")) }, () => "set('Hola mundo')"),
          h(Button, { color: "neutral", onClick: () => run((ta) => ta.reset()) }, () => "reset()"),
          h(Button, { color: "neutral", onClick: () => run((ta) => ta.focus()) }, () => "focus()"),
        ]),
        h("p", { class: "playground-state" }, [
          "get(): ",
          h("strong", getResult.value),
          " · v-model: ",
          h("strong", value.value || "(vacío)"),
        ]),
        h(Textarea, {
          ref: textareaRef,
          placeholder: "Textarea programático",
          rows: 3,
          modelValue: value.value,
          "onUpdate:modelValue": (next: string) => {
            value.value = next;
            getResult.value = next || "(vacío)";
          },
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Textarea from '@/components/form/Textarea.vue'
import Button from '@/components/buttons/Button.vue'

const value = ref('')
const getResult = ref('—')
const textareaRef = ref(null)

const sync = () => {
  getResult.value = textareaRef.value.get() || '(vacío)'
  value.value = textareaRef.value.get()
}
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="sync()">get()</Button>
      <Button color="neutral" @click="textareaRef.set('Hola mundo'); sync()">set('Hola mundo')</Button>
      <Button color="neutral" @click="textareaRef.reset(); sync()">reset()</Button>
      <Button color="neutral" @click="textareaRef.focus()">focus()</Button>
    </div>
    <p>get(): {{ getResult }} · v-model: {{ value || '(vacío)' }}</p>
    <Textarea ref="textareaRef" v-model="value" placeholder="Textarea programático" :rows="3" />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuTextarea.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <cu-textarea id="ta-prog" placeholder="Textarea programático" rows="3"></cu-textarea>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <cu-button id="ta-prog-get">get()</cu-button>
    <cu-button id="ta-prog-set">set('Hola mundo')</cu-button>
    <cu-button id="ta-prog-reset">reset()</cu-button>
    <cu-button id="ta-prog-focus">focus()</cu-button>
  </div>
  <span id="ta-prog-state">get(): (vacío) · v-model: (vacío)</span>
</div>

<script>
  customElements.whenDefined('cu-textarea').then(() => {
    const ta = document.getElementById('ta-prog');
    const state = document.getElementById('ta-prog-state');
    const sync = () => {
      const value = ta.get() || '(vacío)';
      state.textContent = 'get(): ' + value + ' · v-model: ' + value;
    };
    ta.addEventListener('update:modelValue', sync);
    document.getElementById('ta-prog-get').addEventListener('click', sync);
    document.getElementById('ta-prog-set').addEventListener('click', () => { ta.set('Hola mundo'); sync(); });
    document.getElementById('ta-prog-reset').addEventListener('click', () => { ta.reset(); sync(); });
    document.getElementById('ta-prog-focus').addEventListener('click', () => ta.focus());
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: get(), set(), reset() y focus() sobre la instancia de abajo, con el v-model en vivo.",
    render: () => h(TextareaProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
];
