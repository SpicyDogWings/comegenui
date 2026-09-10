import { defineComponent, h, ref } from "vue";
import Collapse from "@/components/overlay/Collapse.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface CollapseInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

/**
 * Programmatic: patio de juegos de los **exposes** de Collapse
 * (open/close/toggle/isOpen) sobre una instancia en vivo.
 */
const CollapseProgrammatic = defineComponent({
  name: "CollapseProgrammatic",
  setup() {
    const collapseRef = ref<InstanceType<typeof Collapse> | null>(null);
    const isOpen = ref(false);

    const instance = () => collapseRef.value as unknown as CollapseInstance | null;

    const sync = () => {
      isOpen.value = instance()?.isOpen() ?? false;
    };

    const run = (action: (collapse: CollapseInstance) => void) => {
      const collapse = instance();
      if (!collapse) return;
      action(collapse);
      sync();
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: () => run((collapse) => collapse.open()) }, () => "open()"),
          h(Button, { color: "neutral", onClick: () => run((collapse) => collapse.close()) }, () => "close()"),
          h(Button, { color: "neutral", onClick: () => run((collapse) => collapse.toggle()) }, () => "toggle()"),
          h(Button, { color: "neutral", onClick: sync }, () => "isOpen()"),
        ]),
        h("p", { class: "playground-state" }, ["isOpen(): ", h("strong", String(isOpen.value))]),
        h(
          Collapse,
          {
            ref: collapseRef,
            label: "Programmatic collapse",
            onToggle: (value: boolean) => (isOpen.value = value),
          },
          () => "Contenido controlado por open(), close() y toggle().",
        ),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Collapse from '@/components/overlay/Collapse.vue'
import Button from '@/components/buttons/Button.vue'

const collapse = ref(null)
const isOpen = ref(false)

const sync = () => (isOpen.value = collapse.value.isOpen())
<\/script>

<template>
  <Button color="neutral" @click="collapse.open(); sync()">open()</Button>
  <Button color="neutral" @click="collapse.close(); sync()">close()</Button>
  <Button color="neutral" @click="collapse.toggle(); sync()">toggle()</Button>

  <p>isOpen(): {{ isOpen }}</p>
  <Collapse ref="collapse" label="Programmatic collapse" @toggle="isOpen = $event">
    Contenido controlado por métodos.
  </Collapse>
</template>`;

const programmaticVanilla = `<script src="dist/CuCollapse.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<cu-button id="col-open" color="neutral">open()</cu-button>
<cu-button id="col-close" color="neutral">close()</cu-button>
<cu-button id="col-toggle" color="neutral">toggle()</cu-button>

<cu-collapse id="col-prog" label="Programmatic collapse">
  Contenido controlado por métodos.
</cu-collapse>

<script>
  const collapse = document.getElementById('col-prog');
  document.getElementById('col-open').addEventListener('click', () => collapse.open());
  document.getElementById('col-close').addEventListener('click', () => collapse.close());
  document.getElementById('col-toggle').addEventListener('click', () => collapse.toggle());
  collapse.addEventListener('toggle', (e) => console.log('isOpen():', e.detail));
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: open(), close(), toggle() e isOpen() sobre la instancia de abajo.",
    render: () => h(CollapseProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
];
