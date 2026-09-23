import { defineComponent, h, ref } from "vue";
import Switch from "@/components/form/Switch.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface SwitchInstance {
  get: () => boolean;
  set: (value: boolean) => void;
  reset: () => void;
  focus: () => void;
}

/**
 * Programmatic: patio de juegos de los **exposes** de Switch
 * (get/set/reset/focus) y su v-model sobre una instancia en vivo.
 */
const SwitchProgrammatic = defineComponent({
  name: "SwitchProgrammatic",
  setup() {
    const switchRef = ref<InstanceType<typeof Switch> | null>(null);
    const checked = ref(false);
    const getResult = ref<boolean | null>(null);

    const instance = () => switchRef.value as unknown as SwitchInstance | null;

    const read = () => {
      const value = instance()?.get() ?? false;
      checked.value = value;
      getResult.value = value;
    };

    const run = (action: (switchInstance: SwitchInstance) => void) => {
      const switchInstance = instance();
      if (switchInstance) action(switchInstance);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: read }, () => "get()"),
          h(Button, { color: "neutral", onClick: () => run((sw) => sw.set(true)) }, () => "set(true)"),
          h(Button, { color: "neutral", onClick: () => run((sw) => sw.set(false)) }, () => "set(false)"),
          h(Button, { color: "neutral", onClick: () => run((sw) => sw.reset()) }, () => "reset()"),
          h(Button, { color: "neutral", onClick: () => run((sw) => sw.focus()) }, () => "focus()"),
        ]),
        h("p", { class: "playground-state" }, [
          "get(): ",
          h("strong", String(getResult.value ?? "—")),
          " · v-model: ",
          h("strong", checked.value ? "ON" : "OFF"),
        ]),
        h(Switch, {
          ref: switchRef,
          label: "Términos",
          modelValue: checked.value,
          "onUpdate:modelValue": (value: boolean) => {
            checked.value = value;
            getResult.value = value;
          },
          onChange: (value: boolean) => {
            checked.value = value;
            getResult.value = value;
          },
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Switch from '@/components/form/Switch.vue'
import Button from '@/components/buttons/Button.vue'

const checked = ref(false)
const getResult = ref(null)
const switchRef = ref(null)

const read = () => (getResult.value = switchRef.value.get())
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="read()">get()</Button>
      <Button color="neutral" @click="switchRef.set(true)">set(true)</Button>
      <Button color="neutral" @click="switchRef.set(false)">set(false)</Button>
      <Button color="neutral" @click="switchRef.reset()">reset()</Button>
      <Button color="neutral" @click="switchRef.focus()">focus()</Button>
    </div>
    <p>get(): {{ getResult ?? '—' }} · v-model: {{ checked ? 'ON' : 'OFF' }}</p>
    <Switch ref="switchRef" v-model="checked" label="Términos" @update:model-value="getResult = $event" />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuSwitch.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <cu-switch id="sw-prog" label="Términos"></cu-switch>
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <cu-button id="sw-prog-get">get()</cu-button>
    <cu-button id="sw-prog-set-true">set(true)</cu-button>
    <cu-button id="sw-prog-set-false">set(false)</cu-button>
    <cu-button id="sw-prog-reset">reset()</cu-button>
    <cu-button id="sw-prog-focus">focus()</cu-button>
  </div>
  <span id="sw-prog-state">get(): false · v-model: OFF</span>
</div>

<script>
  customElements.whenDefined('cu-switch').then(() => {
    const sw = document.getElementById('sw-prog');
    const state = document.getElementById('sw-prog-state');
    const sync = () => {
      state.textContent = 'get(): ' + sw.get() + ' · v-model: ' + (sw.get() ? 'ON' : 'OFF');
    };
    sw.addEventListener('change', sync);
    document.getElementById('sw-prog-get').addEventListener('click', sync);
    document.getElementById('sw-prog-set-true').addEventListener('click', () => { sw.set(true); sync(); });
    document.getElementById('sw-prog-set-false').addEventListener('click', () => { sw.set(false); sync(); });
    document.getElementById('sw-prog-reset').addEventListener('click', () => { sw.reset(); sync(); });
    document.getElementById('sw-prog-focus').addEventListener('click', () => sw.focus());
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: get(), set(), reset() y focus() sobre la instancia de abajo, con el v-model en vivo.",
    render: () => h(SwitchProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
];
