import { defineComponent, h, ref } from "vue";
import Autocomplete from "@/components/form/Autocomplete.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

const ITEMS = [
  { label: "JavaScript", value: "js" },
  { label: "TypeScript", value: "ts" },
  { label: "Python", value: "py" },
];

interface AutocompleteItem {
  label: string;
  icon?: string;
  value?: string;
}

interface AutocompleteInstance {
  get: () => string;
  set: (val: string) => void;
  reset: () => void;
  focus: () => void;
  isOpen: () => boolean;
  selectedItem: () => AutocompleteItem | null;
}

/**
 * Programmatic: patio de juegos de los **exposes** de Autocomplete
 * (get/set/reset/focus/isOpen/selectedItem) sobre una instancia en vivo.
 */
const AutocompleteProgrammatic = defineComponent({
  name: "AutocompleteProgrammatic",
  setup() {
    const autoRef = ref<InstanceType<typeof Autocomplete> | null>(null);
    const getResult = ref<string>("—");
    const isOpenResult = ref<string>("—");
    const selectedResult = ref<string>("—");

    const instance = () => autoRef.value as unknown as AutocompleteInstance | null;

    const read = () => {
      const auto = instance();
      if (!auto) return;
      getResult.value = auto.get() || "(vacío)";
      isOpenResult.value = String(auto.isOpen());
      const item = auto.selectedItem();
      selectedResult.value = item
        ? JSON.stringify({ label: item.label, value: item.value ?? item.label })
        : "(ninguno)";
    };

    const run = (action: (auto: AutocompleteInstance) => void) => {
      const auto = instance();
      if (auto) action(auto);
    };

    const runAndRead = (action: (auto: AutocompleteInstance) => void) => {
      run(action);
      read();
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: read }, () => "get()"),
          h(Button, { color: "neutral", onClick: () => runAndRead((a) => a.set("TypeScript")) }, () => "set('TypeScript')"),
          h(Button, { color: "neutral", onClick: () => runAndRead((a) => a.set("texto libre")) }, () => "set('texto libre')"),
          h(Button, { color: "neutral", onClick: () => runAndRead((a) => a.reset()) }, () => "reset()"),
          h(Button, { color: "neutral", onClick: () => run((a) => a.focus()) }, () => "focus()"),
        ]),
        h("p", { class: "playground-state" }, [
          "get(): ",
          h("strong", getResult.value),
          " · isOpen(): ",
          h("strong", isOpenResult.value),
          " · selectedItem(): ",
          h("strong", selectedResult.value),
        ]),
        h(Autocomplete, {
          ref: autoRef,
          items: ITEMS,
          placeholder: "Autocomplete programático",
          style: "max-width:300px",
          onSelect: () => read(),
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Autocomplete from '@/components/form/Autocomplete.vue'
import Button from '@/components/buttons/Button.vue'

const items = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Python', value: 'py' },
]
const autoRef = ref(null)
const state = ref({ get: '—', isOpen: '—', selectedItem: '—' })

function read() {
  const el = autoRef.value
  state.value = {
    get: el.get() || '(vacío)',
    isOpen: String(el.isOpen()),
    selectedItem: el.selectedItem() ? JSON.stringify(el.selectedItem()) : '(ninguno)',
  }
}
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="read()">get()</Button>
      <Button color="neutral" @click="autoRef.set('TypeScript'); read()">set('TypeScript')</Button>
      <Button color="neutral" @click="autoRef.set('texto libre'); read()">set('texto libre')</Button>
      <Button color="neutral" @click="autoRef.reset(); read()">reset()</Button>
      <Button color="neutral" @click="autoRef.focus()">focus()</Button>
    </div>
    <p class="playground-state">
      get(): <strong>{{ state.get }}</strong>
      · isOpen(): <strong>{{ state.isOpen }}</strong>
      · selectedItem(): <strong>{{ state.selectedItem }}</strong>
    </p>
    <Autocomplete ref="autoRef" :items="items" placeholder="Autocomplete programático" style="max-width:300px" @select="read()" />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuAutocomplete.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;flex-direction:column;gap:12px">
  <div style="display:flex;gap:8px;flex-wrap:wrap">
    <cu-button id="auto-prog-get">get()</cu-button>
    <cu-button id="auto-prog-set">set('TypeScript')</cu-button>
    <cu-button id="auto-prog-setfree">set('texto libre')</cu-button>
    <cu-button id="auto-prog-reset">reset()</cu-button>
    <cu-button id="auto-prog-focus">focus()</cu-button>
  </div>
  <p id="auto-prog-state">get(): — · isOpen(): — · selectedItem(): —</p>
  <cu-autocomplete id="auto" placeholder="Autocomplete programático" style="max-width:300px"></cu-autocomplete>
</div>

<script>
  customElements.whenDefined('cu-autocomplete').then(() => {
    const auto = document.getElementById('auto');
    auto.items = [
      { label: 'JavaScript', value: 'js' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'Python', value: 'py' },
    ];
    const state = document.getElementById('auto-prog-state');
    const read = () => {
      const item = auto.selectedItem();
      state.textContent = 'get(): ' + (auto.get() || '(vacío)')
        + ' · isOpen(): ' + auto.isOpen()
        + ' · selectedItem(): ' + (item ? JSON.stringify(item) : '(ninguno)');
    };
    document.getElementById('auto-prog-get').addEventListener('click', read);
    document.getElementById('auto-prog-set').addEventListener('click', () => { auto.set('TypeScript'); read(); });
    document.getElementById('auto-prog-setfree').addEventListener('click', () => { auto.set('texto libre'); read(); });
    document.getElementById('auto-prog-reset').addEventListener('click', () => { auto.reset(); read(); });
    document.getElementById('auto-prog-focus').addEventListener('click', () => auto.focus());
    auto.addEventListener('select', read);
  });
<\/script>`;

/**
 * Events: log en vivo de los eventos propios (`update:modelValue`, `select`,
 * `blur`) de una instancia.
 */
const AutocompleteEvents = defineComponent({
  name: "AutocompleteEvents",
  setup() {
    const log = ref<string[]>([]);
    const push = (label: string, detail: unknown) => {
      const value = typeof detail === "string" ? detail : JSON.stringify(detail);
      log.value = [`${label}: ${value}`, ...log.value].slice(0, 6);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("p", { class: "playground-state" }, log.value.length ? log.value.join(" · ") : "Sin eventos todavía"),
        h(Autocomplete, {
          items: ITEMS,
          placeholder: "Elegí una opción",
          style: "max-width:300px",
          "onUpdate:modelValue": (value: string) => push("update:modelValue", value),
          onSelect: (item: AutocompleteItem) => push("select", item),
          onBlur: () => push("blur", ""),
        }),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import Autocomplete from '@/components/form/Autocomplete.vue'

const items = [
  { label: 'JavaScript', value: 'js' },
  { label: 'TypeScript', value: 'ts' },
  { label: 'Python', value: 'py' },
]
const log = ref([])
const push = (label, detail) => log.value.unshift(label + ': ' + JSON.stringify(detail))
<\/script>

<template>
  <p>{{ log.join(' · ') || 'Sin eventos todavía' }}</p>
  <Autocomplete
    :items="items"
    placeholder="Elegí una opción"
    style="max-width:300px"
    @update:model-value="push('update:modelValue', $event)"
    @select="push('select', $event)"
    @blur="push('blur', '')"
  />
</template>`;

const eventsVanilla = `<script src="dist/CuAutocomplete.umd.js"><\/script>

<p id="auto-events-log">Sin eventos todavía</p>
<cu-autocomplete id="auto-events" placeholder="Elegí una opción" style="max-width:300px"></cu-autocomplete>

<script>
  customElements.whenDefined('cu-autocomplete').then(() => {
    const auto = document.getElementById('auto-events');
    const log = document.getElementById('auto-events-log');
    auto.items = [
      { label: 'JavaScript', value: 'js' },
      { label: 'TypeScript', value: 'ts' },
      { label: 'Python', value: 'py' },
    ];
    const push = (label, detail) => {
      log.textContent = label + ': ' + JSON.stringify(detail);
    };
    auto.addEventListener('update:modelValue', (e) => push('update:modelValue', e.detail));
    auto.addEventListener('select', (e) => push('select', e.detail));
    auto.addEventListener('blur', (e) => push('blur', e.detail));
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: get(), set(), reset(), focus(), isOpen() y selectedItem() sobre la instancia de abajo.",
    render: () => h(AutocompleteProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
  {
    id: "events",
    title: "Events",
    description: "Log en vivo de update:modelValue, select y blur.",
    render: () => h(AutocompleteEvents),
    vue: eventsVue,
    vanilla: eventsVanilla,
  },
];
