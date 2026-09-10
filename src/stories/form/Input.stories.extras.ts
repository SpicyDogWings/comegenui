import { defineComponent, h, ref } from "vue";
import Input from "@/components/form/Input.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface InputInstance {
  get: () => string;
  set: (value: string | number) => void;
  reset: () => void;
  focus: () => void;
}

/**
 * Programmatic: patio de juegos de los **exposes** de Input
 * (get/set/reset/focus) sobre una instancia en vivo.
 */
const InputProgrammatic = defineComponent({
  name: "InputProgrammatic",
  setup() {
    const inputRef = ref<InstanceType<typeof Input> | null>(null);
    const value = ref("");
    const getResult = ref<string | null>(null);

    const instance = () => inputRef.value as unknown as InputInstance | null;

    const read = () => {
      const input = instance();
      if (input) getResult.value = input.get();
    };

    const run = (action: (input: InputInstance) => void) => {
      const input = instance();
      if (input) action(input);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: read }, () => "get()"),
          h(Button, { color: "neutral", onClick: () => run((input) => input.set("Hola")) }, () => "set('Hola')"),
          h(Button, { color: "neutral", onClick: () => run((input) => input.reset()) }, () => "reset()"),
          h(Button, { color: "neutral", onClick: () => run((input) => input.focus()) }, () => "focus()"),
        ]),
        h("p", { class: "playground-state" }, [
          "get(): ",
          h("strong", getResult.value ?? "—"),
          " · v-model: ",
          h("strong", value.value || "—"),
        ]),
        h(Input, {
          ref: inputRef,
          modelValue: value.value,
          "onUpdate:modelValue": (next: string) => {
            value.value = next;
            getResult.value = next;
          },
          placeholder: "Escribí algo",
          style: "max-width:280px",
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Input from '@/components/form/Input.vue'
import Button from '@/components/buttons/Button.vue'

const value = ref('')
const inputRef = ref(null)
const getResult = ref(null)

const read = () => (getResult.value = inputRef.value.get())
const run = (action) => action(inputRef.value)
</script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="read()">get()</Button>
      <Button color="neutral" @click="run((input) => input.set('Hola'))">set('Hola')</Button>
      <Button color="neutral" @click="run((input) => input.reset())">reset()</Button>
      <Button color="neutral" @click="run((input) => input.focus())">focus()</Button>
    </div>
    <p class="playground-state">
      get(): <strong>{{ getResult ?? '—' }}</strong>
      · v-model: <strong>{{ value || '—' }}</strong>
    </p>
    <Input ref="inputRef" v-model="value" placeholder="Escribí algo" style="max-width:280px" @update:model-value="getResult = $event" />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuInput.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <cu-button id="in-prog-get" color="neutral">get()</cu-button>
    <cu-button id="in-prog-set" color="neutral">set('Hola')</cu-button>
    <cu-button id="in-prog-reset" color="neutral">reset()</cu-button>
    <cu-button id="in-prog-focus" color="neutral">focus()</cu-button>
  </div>
  <p id="in-prog-state">get(): — · v-model: —</p>
  <cu-input id="in-prog" placeholder="Escribí algo" style="max-width:280px"></cu-input>
</div>

<script>
  customElements.whenDefined('cu-input').then(() => {
    const input = document.getElementById('in-prog');
    const state = document.getElementById('in-prog-state');
    let value = '';

    const render = () => {
      state.textContent = 'get(): ' + (input.get() || '—') + ' · v-model: ' + (value || '—');
    };

    input.addEventListener('update:modelValue', (e) => {
      value = e.detail;
      render();
    });

    document.getElementById('in-prog-get').addEventListener('click', render);
    document.getElementById('in-prog-set').addEventListener('click', () => {
      input.set('Hola');
      render();
    });
    document.getElementById('in-prog-reset').addEventListener('click', () => {
      input.reset();
      render();
    });
    document.getElementById('in-prog-focus').addEventListener('click', () => input.focus());
    render();
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: get(), set(), reset() y focus() sobre la instancia de abajo.",
    render: () => h(InputProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
];
