import { defineComponent, h, ref } from "vue";
import FileInput from "@/components/form/FileInput.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface FileInputInstance {
  get: () => File | null;
  set: (file: File | null) => void;
  reset: () => void;
  focus: () => void;
  trigger: () => void;
}

function makeFile() {
  return new File(["contenido de prueba"], "demo.txt", { type: "text/plain" });
}

/**
 * Programmatic: patio de juegos de los **exposes** de FileInput
 * (get/set/reset/focus/trigger) sobre una instancia en vivo.
 */
const FileInputProgrammatic = defineComponent({
  name: "FileInputProgrammatic",
  setup() {
    const fileInputRef = ref<InstanceType<typeof FileInput> | null>(null);
    const file = ref<File | null>(null);
    const getResult = ref<string | null>(null);

    const instance = () => fileInputRef.value as unknown as FileInputInstance | null;

    const read = () => {
      const input = instance();
      if (input) getResult.value = input.get()?.name ?? null;
    };

    const run = (action: (input: FileInputInstance) => void) => {
      const input = instance();
      if (input) action(input);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: read }, () => "get()"),
          h(Button, { color: "neutral", onClick: () => run((input) => input.set(makeFile())) }, () => "set(demo.txt)"),
          h(Button, { color: "neutral", onClick: () => run((input) => input.reset()) }, () => "reset()"),
          h(Button, { color: "neutral", onClick: () => run((input) => input.focus()) }, () => "focus()"),
          h(Button, { color: "neutral", onClick: () => run((input) => input.trigger()) }, () => "trigger()"),
        ]),
        h("p", { class: "playground-state" }, [
          "get(): ",
          h("strong", getResult.value ?? "—"),
          " · v-model: ",
          h("strong", file.value?.name ?? "null"),
        ]),
        h(FileInput, {
          ref: fileInputRef,
          modelValue: file.value,
          "onUpdate:modelValue": (next: File | null) => {
            file.value = next;
            getResult.value = next?.name ?? null;
          },
          placeholder: "Archivo de prueba",
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import FileInput from '@/components/form/FileInput.vue'
import Button from '@/components/buttons/Button.vue'

const file = ref(null)
const fileInputRef = ref(null)
const getResult = ref(null)

const makeFile = () => new File(['contenido de prueba'], 'demo.txt', { type: 'text/plain' })
const read = () => (getResult.value = fileInputRef.value.get()?.name ?? null)
const run = (action) => action(fileInputRef.value)
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="read()">get()</Button>
      <Button color="neutral" @click="run((input) => input.set(makeFile()))">set(demo.txt)</Button>
      <Button color="neutral" @click="run((input) => input.reset())">reset()</Button>
      <Button color="neutral" @click="run((input) => input.focus())">focus()</Button>
      <Button color="neutral" @click="run((input) => input.trigger())">trigger()</Button>
    </div>
    <p class="playground-state">
      get(): <strong>{{ getResult ?? '—' }}</strong>
      · v-model: <strong>{{ file ? file.name : 'null' }}</strong>
    </p>
    <FileInput ref="fileInputRef" v-model="file" placeholder="Archivo de prueba" />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuFileInput.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <cu-button id="fi-prog-get" color="neutral">get()</cu-button>
    <cu-button id="fi-prog-set" color="neutral">set(demo.txt)</cu-button>
    <cu-button id="fi-prog-reset" color="neutral">reset()</cu-button>
    <cu-button id="fi-prog-focus" color="neutral">focus()</cu-button>
    <cu-button id="fi-prog-trigger" color="neutral">trigger()</cu-button>
  </div>
  <p id="fi-prog-state">get(): — · v-model: null</p>
  <cu-file-input id="fi-prog" placeholder="Archivo de prueba"></cu-file-input>
</div>

<script>
  customElements.whenDefined('cu-file-input').then(() => {
    const fi = document.getElementById('fi-prog');
    const state = document.getElementById('fi-prog-state');
    let file = null;

    const render = () => {
      state.textContent = 'get(): ' + (fi.get()?.name || '—') + ' · v-model: ' + (file ? file.name : 'null');
    };

    fi.addEventListener('update:modelValue', (e) => {
      file = e.detail;
      render();
    });

    const makeFile = () => new File(['contenido de prueba'], 'demo.txt', { type: 'text/plain' });
    document.getElementById('fi-prog-get').addEventListener('click', render);
    document.getElementById('fi-prog-set').addEventListener('click', () => { fi.set(makeFile()); render(); });
    document.getElementById('fi-prog-reset').addEventListener('click', () => { fi.reset(); render(); });
    document.getElementById('fi-prog-focus').addEventListener('click', () => fi.focus());
    document.getElementById('fi-prog-trigger').addEventListener('click', () => fi.trigger());
    render();
  });
<\/script>`;

/**
 * Events: log en vivo de `update:modelValue` y eventos nativos relevantes.
 */
const FileInputEvents = defineComponent({
  name: "FileInputEvents",
  setup() {
    const log = ref<string[]>([]);
    const push = (label: string, detail: unknown) => {
      const value = detail instanceof File ? detail.name : detail ? String(detail) : "";
      log.value = [`${label}${value ? `: ${value}` : ""}`, ...log.value].slice(0, 6);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("p", { class: "playground-state" }, log.value.length ? log.value.join(" · ") : "Sin eventos todavía"),
        h(FileInput, {
          placeholder: "Seleccioná un archivo",
          "onUpdate:modelValue": (file: File | null) => push("update:modelValue", file),
          onClick: () => push("click", ""),
          onFocus: () => push("focus", ""),
          onBlur: () => push("blur", ""),
          onDrop: () => push("drop", ""),
        }),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import FileInput from '@/components/form/FileInput.vue'

const file = ref(null)
const log = ref([])
const push = (label, detail) => log.value.unshift(label + (detail ? ': ' + (detail.name ?? detail) : ''))
<\/script>

<template>
  <p class="playground-state">{{ log.join(' · ') || 'Sin eventos todavía' }}</p>
  <FileInput
    placeholder="Seleccioná un archivo"
    @update:model-value="push('update:modelValue', $event)"
    @click="push('click')"
    @focus="push('focus')"
    @blur="push('blur')"
    @drop="push('drop')"
  />
</template>`;

const eventsVanilla = `<script src="dist/CuFileInput.umd.js"><\/script>

<p id="fi-events-log">Sin eventos todavía</p>
<cu-file-input id="fi-events" placeholder="Seleccioná un archivo"></cu-file-input>

<script>
  customElements.whenDefined('cu-file-input').then(() => {
    const fi = document.getElementById('fi-events');
    const log = document.getElementById('fi-events-log');
    const push = (label, name) => { log.textContent = label + (name ? ': ' + name : ''); };
    fi.addEventListener('update:modelValue', (e) => push('update:modelValue', e.detail?.name));
    fi.addEventListener('click', () => push('click'));
    fi.addEventListener('focus', () => push('focus'));
    fi.addEventListener('blur', () => push('blur'));
    fi.addEventListener('drop', () => push('drop'));
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: get(), set(), reset(), focus() y trigger() sobre la instancia de abajo, con el v-model en vivo.",
    render: () => h(FileInputProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
  {
    id: "events",
    title: "Events",
    description: "Log en vivo de update:modelValue y de los eventos nativos click, focus, blur y drop.",
    render: () => h(FileInputEvents),
    vue: eventsVue,
    vanilla: eventsVanilla,
  },
];
