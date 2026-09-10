import { defineComponent, h, ref } from "vue";
import Checkbox from "@/components/form/Checkbox.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface CheckboxInstance {
  get: () => boolean;
  set: (value: boolean) => void;
  reset: () => void;
  focus: () => void;
}

/**
 * Programmatic: patio de juegos de los **exposes** de Checkbox
 * (get/set/reset/focus) y su v-model sobre una instancia en vivo.
 */
const CheckboxProgrammatic = defineComponent({
  name: "CheckboxProgrammatic",
  setup() {
    const checkboxRef = ref<InstanceType<typeof Checkbox> | null>(null);
    const checked = ref(false);
    const getResult = ref<boolean | null>(null);

    const instance = () => checkboxRef.value as unknown as CheckboxInstance | null;

    const sync = () => {
      const value = instance()?.get() ?? false;
      checked.value = value;
      getResult.value = value;
    };

    const run = (action: (checkboxInstance: CheckboxInstance) => void) => {
      const checkboxInstance = instance();
      if (!checkboxInstance) return;
      action(checkboxInstance);
      sync();
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: sync }, () => "get()"),
          h(Button, { color: "neutral", onClick: () => run((cb) => cb.set(true)) }, () => "set(true)"),
          h(Button, { color: "neutral", onClick: () => run((cb) => cb.set(false)) }, () => "set(false)"),
          h(Button, { color: "neutral", onClick: () => run((cb) => cb.reset()) }, () => "reset()"),
          h(Button, { color: "neutral", onClick: () => run((cb) => cb.focus()) }, () => "focus()"),
        ]),
        h("p", { class: "playground-state" }, [
          "get(): ",
          h("strong", String(getResult.value ?? "—")),
          " · v-model: ",
          h("strong", checked.value ? "checked" : "unchecked"),
        ]),
        h(Checkbox, {
          ref: checkboxRef,
          label: "Términos",
          modelValue: checked.value,
          "onUpdate:modelValue": (value: boolean) => (checked.value = value),
          onChange: sync,
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Checkbox from '@/components/form/Checkbox.vue'
import Button from '@/components/buttons/Button.vue'

const checked = ref(false)
const getResult = ref(null)
const checkboxRef = ref(null)

const sync = () => {
  getResult.value = checkboxRef.value.get()
  checked.value = checkboxRef.value.get()
}
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="sync()">get()</Button>
      <Button color="neutral" @click="checkboxRef.set(true); sync()">set(true)</Button>
      <Button color="neutral" @click="checkboxRef.set(false); sync()">set(false)</Button>
      <Button color="neutral" @click="checkboxRef.reset(); sync()">reset()</Button>
      <Button color="neutral" @click="checkboxRef.focus()">focus()</Button>
    </div>
    <p>get(): {{ getResult ?? '—' }} · v-model: {{ checked ? 'checked' : 'unchecked' }}</p>
    <Checkbox ref="checkboxRef" v-model="checked" label="Términos" />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuCheckbox.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <cu-checkbox id="cb-prog" label="Términos"></cu-checkbox>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <cu-button id="cb-prog-get">get()</cu-button>
    <cu-button id="cb-prog-set-true">set(true)</cu-button>
    <cu-button id="cb-prog-set-false">set(false)</cu-button>
    <cu-button id="cb-prog-reset">reset()</cu-button>
    <cu-button id="cb-prog-focus">focus()</cu-button>
  </div>
  <span id="cb-prog-state">get(): false · v-model: unchecked</span>
</div>

<script>
  customElements.whenDefined('cu-checkbox').then(() => {
    const cb = document.getElementById('cb-prog');
    const state = document.getElementById('cb-prog-state');
    const sync = () => {
      const checked = cb.get();
      state.textContent = 'get(): ' + checked + ' · v-model: ' + (checked ? 'checked' : 'unchecked');
    };
    cb.addEventListener('change', sync);
    document.getElementById('cb-prog-get').addEventListener('click', sync);
    document.getElementById('cb-prog-set-true').addEventListener('click', () => { cb.set(true); sync(); });
    document.getElementById('cb-prog-set-false').addEventListener('click', () => { cb.set(false); sync(); });
    document.getElementById('cb-prog-reset').addEventListener('click', () => { cb.reset(); sync(); });
    document.getElementById('cb-prog-focus').addEventListener('click', () => cb.focus());
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: get(), set(), reset() y focus() sobre la instancia de abajo, con el v-model en vivo.",
    render: () => h(CheckboxProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
];
