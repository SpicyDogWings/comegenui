import { defineComponent, h, ref } from "vue";
import FileInputZone from "@/components/form/FileInputZone.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface FileZoneInstance {
  get: () => File | File[] | null;
  set: (files: File | File[] | null) => void;
  reset: () => void;
  focus: () => void;
  trigger: () => void;
}

const nameOf = (value: File | File[] | null): string => {
  if (!value) return "—";
  if (value instanceof File) return value.name;
  return value.map((file) => file.name).join(", ") || "—";
};

/**
 * Programmatic: patio de juegos de los **exposes** de FileInputZone
 * (get/set/reset/focus/trigger) sobre una instancia en vivo.
 */
const FileInputZoneProgrammatic = defineComponent({
  name: "FileInputZoneProgrammatic",
  setup() {
    const zoneRef = ref<InstanceType<typeof FileInputZone> | null>(null);
    const value = ref<File | File[] | null>(null);
    const getResult = ref<string>("—");

    const instance = () => zoneRef.value as unknown as FileZoneInstance | null;

    const read = () => {
      const zone = instance();
      if (zone) getResult.value = nameOf(zone.get());
    };

    const makeFile = () => new File(["hola"], "ejemplo.csv", { type: "text/csv" });

    const run = (action: (zone: FileZoneInstance) => void) => {
      const zone = instance();
      if (zone) action(zone);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: read }, () => "get()"),
          h(
            Button,
            { color: "neutral", onClick: () => run((zone) => zone.set(makeFile())) },
            () => "set(file)",
          ),
          h(Button, { color: "neutral", onClick: () => run((zone) => zone.reset()) }, () => "reset()"),
          h(Button, { color: "neutral", onClick: () => run((zone) => zone.focus()) }, () => "focus()"),
          h(Button, { color: "neutral", onClick: () => run((zone) => zone.trigger()) }, () => "trigger()"),
        ]),
        h("p", { class: "playground-state" }, [
          "get(): ",
          h("strong", getResult.value),
          " · v-model: ",
          h("strong", nameOf(value.value)),
        ]),
        h(FileInputZone, {
          ref: zoneRef,
          modelValue: value.value,
          "onUpdate:modelValue": (next: File | File[] | null) => {
            value.value = next;
            getResult.value = nameOf(next);
          },
          placeholder: "Selecciona o arrastra un archivo",
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import FileInputZone from '@/components/form/FileInputZone.vue'
import Button from '@/components/buttons/Button.vue'

const value = ref(null)
const zoneRef = ref(null)
const getResult = ref('—')

const read = () => (getResult.value = zoneRef.value.get()?.name ?? '—')
const makeFile = () => new File(['hola'], 'ejemplo.csv', { type: 'text/csv' })
const run = (action) => action(zoneRef.value)
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="read()">get()</Button>
      <Button color="neutral" @click="run((z) => z.set(makeFile()))">set(file)</Button>
      <Button color="neutral" @click="run((z) => z.reset())">reset()</Button>
      <Button color="neutral" @click="run((z) => z.focus())">focus()</Button>
      <Button color="neutral" @click="run((z) => z.trigger())">trigger()</Button>
    </div>
    <p class="playground-state">
      get(): <strong>{{ getResult }}</strong>
    </p>
    <FileInputZone ref="zoneRef" v-model="value" placeholder="Selecciona o arrastra un archivo" />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuFileInputZone.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <cu-button id="fz-get" color="neutral">get()</cu-button>
    <cu-button id="fz-set" color="neutral">set(file)</cu-button>
    <cu-button id="fz-reset" color="neutral">reset()</cu-button>
    <cu-button id="fz-focus" color="neutral">focus()</cu-button>
    <cu-button id="fz-trigger" color="neutral">trigger()</cu-button>
  </div>
  <p id="fz-state">get(): —</p>
  <cu-file-input-zone id="fz" placeholder="Selecciona o arrastra un archivo"></cu-file-input-zone>
</div>

<script>
  customElements.whenDefined('cu-file-input-zone').then(() => {
    const zone = document.getElementById('fz');
    const state = document.getElementById('fz-state');
    const render = () => { state.textContent = 'get(): ' + (zone.get()?.name ?? '—'); };

    document.getElementById('fz-get').addEventListener('click', render);
    document.getElementById('fz-set').addEventListener('click', () => {
      zone.set(new File(['hola'], 'ejemplo.csv', { type: 'text/csv' }));
      render();
    });
    document.getElementById('fz-reset').addEventListener('click', () => { zone.reset(); render(); });
    document.getElementById('fz-focus').addEventListener('click', () => zone.focus());
    document.getElementById('fz-trigger').addEventListener('click', () => zone.trigger());
    render();
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: get(), set(), reset(), focus() y trigger() sobre la instancia de abajo.",
    render: () => h(FileInputZoneProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
];
