import { defineComponent, h, ref } from "vue";
import Dropdown from "@/components/overlay/Dropdown.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface DropdownInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
  get: () => string;
  set: (value: string) => void;
  reset: () => void;
  isOpen: () => boolean;
}

const DropdownProgrammatic = defineComponent({
  name: "DropdownProgrammatic",
  setup() {
    const dropdownRef = ref<InstanceType<typeof Dropdown> | null>(null);
    const state = ref({ get: "—", isOpen: "—" });

    const instance = () => dropdownRef.value as unknown as DropdownInstance | null;

    const read = () => {
      const dropdown = instance();
      if (!dropdown) return;
      state.value = { get: dropdown.get() || "(vacío)", isOpen: String(dropdown.isOpen()) };
    };

    const run = (action: (dropdown: DropdownInstance) => void) => {
      const dropdown = instance();
      if (dropdown) {
        action(dropdown);
        read();
      }
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: read }, () => "get()"),
          h(Button, { color: "neutral", onClick: () => run((d) => d.set("valor")) }, () => "set('valor')"),
          h(Button, { color: "neutral", onClick: () => run((d) => d.reset()) }, () => "reset()"),
          h(Button, { color: "neutral", onClick: () => run((d) => d.open()) }, () => "open()"),
          h(Button, { color: "neutral", onClick: () => run((d) => d.close()) }, () => "close()"),
          h(Button, { color: "neutral", onClick: () => run((d) => d.toggle()) }, () => "toggle()"),
          h(Button, { color: "neutral", onClick: read }, () => "isOpen()"),
        ]),
        h("p", { class: "playground-state" }, [
          "get(): ",
          h("strong", state.value.get),
          " · isOpen(): ",
          h("strong", state.value.isOpen),
        ]),
        h(
          Dropdown,
          {
            ref: dropdownRef,
            label: "Programmatic",
            onOpen: read,
            onClose: read,
          },
          { default: () => h(Button, { variant: "ghost" }, () => "Action") },
        ),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Dropdown from '@/components/overlay/Dropdown.vue'
import Button from '@/components/buttons/Button.vue'

const dropdownRef = ref(null)
const state = ref({ get: '—', isOpen: '—' })

const read = () => {
  const d = dropdownRef.value
  state.value = { get: d.get() || '(vacío)', isOpen: String(d.isOpen()) }
}
const run = (action) => { action(dropdownRef.value); read() }
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="read()">get()</Button>
      <Button color="neutral" @click="run((d) => d.set('valor'))">set('valor')</Button>
      <Button color="neutral" @click="run((d) => d.reset())">reset()</Button>
      <Button color="neutral" @click="run((d) => d.open())">open()</Button>
      <Button color="neutral" @click="run((d) => d.close())">close()</Button>
      <Button color="neutral" @click="run((d) => d.toggle())">toggle()</Button>
    </div>
    <p class="playground-state">get(): <strong>{{ state.get }}</strong> · isOpen(): <strong>{{ state.isOpen }}</strong></p>
    <Dropdown ref="dropdownRef" label="Programmatic" @open="read" @close="read">
      <Button variant="ghost">Action</Button>
    </Dropdown>
  </div>
</template>`;

const DropdownEvents = defineComponent({
  name: "DropdownEvents",
  setup() {
    const log = ref<string[]>([]);
    const push = (label: string) => {
      log.value = [label, ...log.value].slice(0, 6);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("p", { class: "playground-state" }, log.value.length ? log.value.join(" · ") : "Sin eventos todavía"),
        h(
          Dropdown,
          { label: "Eventos", onOpen: () => push("open"), onClose: () => push("close") },
          { default: () => h(Button, { variant: "ghost" }, () => "Action") },
        ),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import Dropdown from '@/components/overlay/Dropdown.vue'
import Button from '@/components/buttons/Button.vue'

const log = ref([])
<\/script>

<template>
  <p class="playground-state">{{ log.join(' · ') || 'Sin eventos todavía' }}</p>
  <Dropdown label="Eventos" @open="log.unshift('open')" @close="log.unshift('close')">
    <Button variant="ghost">Action</Button>
  </Dropdown>
</template>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: open(), close(), toggle(), get(), set(), reset() e isOpen() sobre la instancia de abajo.",
    render: () => h(DropdownProgrammatic),
    vue: programmaticVue,
  },
  {
    id: "events",
    title: "Events",
    description: "Log en vivo de open y close.",
    render: () => h(DropdownEvents),
    vue: eventsVue,
  },
];
