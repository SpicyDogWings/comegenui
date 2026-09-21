import { defineComponent, h, ref } from "vue";
import Select from "@/components/form/Select.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

const OPTIONS = [
  { value: "ar", label: "Argentina" },
  { value: "br", label: "Brasil" },
  { value: "cl", label: "Chile" },
];

interface SelectOption {
  value: string;
  label: string;
}

interface SelectInstance {
  get: () => string;
  set: (value: string) => void;
  reset: () => void;
  focus: () => void;
  isOpen: () => boolean;
  selectedItem: () => SelectOption | null;
}

/**
 * Programmatic: patio de juegos de los **exposes** de Select
 * (get/set/reset/focus/isOpen/selectedItem) sobre una instancia en vivo.
 */
const SelectProgrammatic = defineComponent({
  name: "SelectProgrammatic",
  setup() {
    const selectRef = ref<InstanceType<typeof Select> | null>(null);
    const value = ref("");
    const state = ref({ get: "—", isOpen: "—", selectedItem: "—" });

    const instance = () => selectRef.value as unknown as SelectInstance | null;

    const read = () => {
      const select = instance();
      if (!select) return;
      const item = select.selectedItem();
      state.value = {
        get: select.get() || "(vacío)",
        isOpen: String(select.isOpen()),
        selectedItem: item ? JSON.stringify(item) : "(ninguno)",
      };
    };

    const run = (action: (select: SelectInstance) => void) => {
      const select = instance();
      if (select) action(select);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: read }, () => "get()"),
          h(Button, { color: "neutral", onClick: () => { run((s) => s.set("br")); read(); } }, () => "set('br')"),
          h(Button, { color: "neutral", onClick: () => { run((s) => s.reset()); read(); } }, () => "reset()"),
          h(Button, { color: "neutral", onClick: () => run((s) => s.focus()) }, () => "focus()"),
        ]),
        h("p", { class: "playground-state" }, [
          "get(): ",
          h("strong", state.value.get),
          " · isOpen(): ",
          h("strong", state.value.isOpen),
          " · selectedItem(): ",
          h("strong", state.value.selectedItem),
        ]),
        h(Select, {
          ref: selectRef,
          options: OPTIONS,
          modelValue: value.value,
          "onUpdate:modelValue": (next: string) => {
            value.value = next;
          },
          onSelect: () => read(),
          placeholder: "Seleccionar...",
          style: "max-width:300px",
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Select from '@/components/form/Select.vue'
import Button from '@/components/buttons/Button.vue'

const options = [
  { value: 'ar', label: 'Argentina' },
  { value: 'br', label: 'Brasil' },
  { value: 'cl', label: 'Chile' },
]
const selectRef = ref(null)
const value = ref('')
const state = ref({ get: '—', isOpen: '—', selectedItem: '—' })

function read() {
  const el = selectRef.value
  state.value = {
    get: el.get() || '(vacío)',
    isOpen: String(el.isOpen()),
    selectedItem: JSON.stringify(el.selectedItem()),
  }
}
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="read()">get()</Button>
      <Button color="neutral" @click="selectRef.set('br'); read()">set('br')</Button>
      <Button color="neutral" @click="selectRef.reset(); read()">reset()</Button>
      <Button color="neutral" @click="selectRef.focus()">focus()</Button>
    </div>
    <p class="playground-state">
      get(): <strong>{{ state.get }}</strong>
      · isOpen(): <strong>{{ state.isOpen }}</strong>
      · selectedItem(): <strong>{{ state.selectedItem }}</strong>
    </p>
    <Select ref="selectRef" v-model="value" :options="options" placeholder="Seleccionar..." style="max-width:300px" @select="read()" />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuSelect.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <cu-button id="sel-prog-get" color="neutral">get()</cu-button>
    <cu-button id="sel-prog-set" color="neutral">set('br')</cu-button>
    <cu-button id="sel-prog-reset" color="neutral">reset()</cu-button>
    <cu-button id="sel-prog-focus" color="neutral">focus()</cu-button>
  </div>
  <p id="sel-prog-state">get(): — · isOpen(): — · selectedItem(): —</p>
  <cu-select id="sel-prog" placeholder="Seleccionar..." style="max-width:300px"></cu-select>
</div>

<script>
  customElements.whenDefined('cu-select').then(() => {
    const select = document.getElementById('sel-prog');
    select.options = [
      { value: 'ar', label: 'Argentina' },
      { value: 'br', label: 'Brasil' },
      { value: 'cl', label: 'Chile' },
    ];
    const state = document.getElementById('sel-prog-state');
    const read = () => {
      state.textContent = 'get(): ' + (select.get() || '(vacío)')
        + ' · isOpen(): ' + select.isOpen()
        + ' · selectedItem(): ' + JSON.stringify(select.selectedItem());
    };
    document.getElementById('sel-prog-get').addEventListener('click', read);
    document.getElementById('sel-prog-set').addEventListener('click', () => { select.set('br'); read(); });
    document.getElementById('sel-prog-reset').addEventListener('click', () => { select.reset(); read(); });
    document.getElementById('sel-prog-focus').addEventListener('click', () => select.focus());
    select.addEventListener('select', read);
  });
<\/script>`;

/**
 * Events: log en vivo de los eventos propios (`update:modelValue`, `select`,
 * `close`, `blur`) de una instancia.
 */
const SelectEvents = defineComponent({
  name: "SelectEvents",
  setup() {
    const log = ref<string[]>([]);
    const push = (label: string, detail: unknown) => {
      const value = typeof detail === "string" ? detail : JSON.stringify(detail);
      log.value = [`${label}: ${value}`, ...log.value].slice(0, 6);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("p", { class: "playground-state" }, log.value.length ? log.value.join(" · ") : "Sin eventos todavía"),
        h(Select, {
          options: OPTIONS,
          placeholder: "Elegí una opción",
          style: "max-width:300px",
          "onUpdate:modelValue": (value: string) => push("update:modelValue", value),
          onSelect: (option: SelectOption) => push("select", option),
          onClose: () => push("close", ""),
          onBlur: () => push("blur", ""),
        }),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import Select from '@/components/form/Select.vue'

const options = [
  { value: 'ar', label: 'Argentina' },
  { value: 'br', label: 'Brasil' },
  { value: 'cl', label: 'Chile' },
]
const log = ref([])
const push = (label, detail) => log.value.unshift(label + ': ' + JSON.stringify(detail))
<\/script>

<template>
  <p class="playground-state">{{ log.join(' · ') || 'Sin eventos todavía' }}</p>
  <Select
    :options="options"
    placeholder="Elegí una opción"
    style="max-width:300px"
    @update:model-value="push('update:modelValue', $event)"
    @select="push('select', $event)"
    @close="push('close', '')"
    @blur="push('blur', '')"
  />
</template>`;

const eventsVanilla = `<script src="dist/CuSelect.umd.js"><\/script>

<p id="sel-events-log">Sin eventos todavía</p>
<cu-select id="sel-events" placeholder="Elegí una opción" style="max-width:300px"></cu-select>

<script>
  customElements.whenDefined('cu-select').then(() => {
    const select = document.getElementById('sel-events');
    const log = document.getElementById('sel-events-log');
    select.options = [
      { value: 'ar', label: 'Argentina' },
      { value: 'br', label: 'Brasil' },
      { value: 'cl', label: 'Chile' },
    ];
    const push = (label, detail) => {
      log.textContent = label + ': ' + JSON.stringify(detail);
    };
    select.addEventListener('update:modelValue', (e) => push('update:modelValue', e.detail));
    select.addEventListener('select', (e) => push('select', e.detail));
    select.addEventListener('close', () => push('close', ''));
    select.addEventListener('blur', () => push('blur', ''));
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: get(), set(), reset(), focus(), isOpen() y selectedItem() sobre la instancia de abajo.",
    render: () => h(SelectProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
  {
    id: "events",
    title: "Events",
    description: "Log en vivo de update:modelValue, select, close y blur.",
    render: () => h(SelectEvents),
    vue: eventsVue,
    vanilla: eventsVanilla,
  },
];
