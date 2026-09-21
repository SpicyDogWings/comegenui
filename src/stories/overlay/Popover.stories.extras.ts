import { defineComponent, h, ref } from "vue";
import Popover from "@/components/overlay/Popover.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface PopoverInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

const PopoverProgrammatic = defineComponent({
  name: "PopoverProgrammatic",
  setup() {
    const popoverRef = ref<InstanceType<typeof Popover> | null>(null);
    const isOpen = ref(false);

    const instance = () => popoverRef.value as unknown as PopoverInstance | null;

    const read = () => {
      const popover = instance();
      if (popover) isOpen.value = popover.isOpen();
    };

    const run = (action: (popover: PopoverInstance) => void) => {
      const popover = instance();
      if (popover) {
        action(popover);
        read();
      }
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: () => run((p) => p.open()) }, () => "open()"),
          h(Button, { color: "neutral", onClick: () => run((p) => p.close()) }, () => "close()"),
          h(Button, { color: "neutral", onClick: () => run((p) => p.toggle()) }, () => "toggle()"),
          h(Button, { color: "neutral", onClick: read }, () => "isOpen()"),
        ]),
        h("p", { class: "playground-state" }, ["isOpen(): ", h("strong", String(isOpen.value))]),
        h(
          Popover,
          {
            ref: popoverRef,
            onOpen: read,
            onClose: read,
          },
          {
            toggle: ({ toggle }: { toggle: () => void }) =>
              h(Button, { color: "primary", onClick: toggle }, () => "Abrir popover"),
            default: () => h("p", {}, "Contenido del panel."),
          },
        ),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Popover from '@/components/overlay/Popover.vue'
import Button from '@/components/buttons/Button.vue'

const popoverRef = ref(null)
const isOpen = ref(false)

const read = () => (isOpen.value = popoverRef.value.isOpen())
const run = (action) => { action(popoverRef.value); read() }
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="run((p) => p.open())">open()</Button>
      <Button color="neutral" @click="run((p) => p.close())">close()</Button>
      <Button color="neutral" @click="run((p) => p.toggle())">toggle()</Button>
    </div>
    <p class="playground-state">isOpen(): <strong>{{ isOpen }}</strong></p>
    <Popover ref="popoverRef" @open="read" @close="read">
      <template #toggle="{ toggle }">
        <Button color="primary" @click="toggle">Abrir popover</Button>
      </template>
      <p>Contenido del panel.</p>
    </Popover>
  </div>
</template>`;

const PopoverEvents = defineComponent({
  name: "PopoverEvents",
  setup() {
    const log = ref<string[]>([]);
    const push = (label: string) => {
      log.value = [label, ...log.value].slice(0, 6);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("p", { class: "playground-state" }, log.value.length ? log.value.join(" · ") : "Sin eventos todavía"),
        h(
          Popover,
          { onOpen: () => push("open"), onClose: () => push("close") },
          {
            toggle: ({ toggle }: { toggle: () => void }) =>
              h(Button, { color: "neutral", onClick: toggle }, () => "Abrir"),
            default: () => h("p", {}, "Contenido del panel."),
          },
        ),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import Popover from '@/components/overlay/Popover.vue'
import Button from '@/components/buttons/Button.vue'

const log = ref([])
<\/script>

<template>
  <p class="playground-state">{{ log.join(' · ') || 'Sin eventos todavía' }}</p>
  <Popover @open="log.unshift('open')" @close="log.unshift('close')">
    <template #toggle="{ toggle }">
      <Button color="neutral" @click="toggle">Abrir</Button>
    </template>
    <p>Contenido del panel.</p>
  </Popover>
</template>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description: "Patio de juegos de los exposes: open(), close(), toggle() e isOpen() sobre la instancia de abajo.",
    render: () => h(PopoverProgrammatic),
    vue: programmaticVue,
  },
  {
    id: "events",
    title: "Events",
    description: "Log en vivo de open y close.",
    render: () => h(PopoverEvents),
    vue: eventsVue,
  },
];
