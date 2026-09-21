import { defineComponent, h, ref } from "vue";
import Tabs from "@/components/Tabs.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

const TABS = [
  { key: "first", label: "First" },
  { key: "second", label: "Second" },
  { key: "third", label: "Third" },
];

/**
 * Programmatic: patio de juegos del v-model y los exposes de Tabs
 * (getActive/setActive/next/prev) sobre una instancia en vivo.
 */
const TabsProgrammatic = defineComponent({
  name: "TabsProgrammatic",
  setup() {
    const active = ref("first");
    const tabsRef = ref<InstanceType<typeof Tabs> | null>(null);

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: () => (active.value = "first") }, () => "first"),
          h(Button, { color: "neutral", onClick: () => (active.value = "second") }, () => "second"),
          h(Button, { color: "neutral", onClick: () => (active.value = "third") }, () => "third"),
          h(Button, { color: "neutral", onClick: () => tabsRef.value?.next() }, () => "next()"),
          h(Button, { color: "neutral", onClick: () => tabsRef.value?.prev() }, () => "prev()"),
        ]),
        h("p", { class: "playground-state" }, ["active: ", h("strong", active.value)]),
        h(
          Tabs,
          {
            ref: tabsRef,
            tabs: TABS,
            modelValue: active.value,
            "onUpdate:modelValue": (value: string) => (active.value = value),
          },
          {
            first: () => "Contenido First",
            second: () => "Contenido Second",
            third: () => "Contenido Third",
          },
        ),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Tabs from '@/components/Tabs.vue'
import Button from '@/components/buttons/Button.vue'

const active = ref('first')
const tabsRef = ref(null)
const tabs = [
  { key: 'first', label: 'First' },
  { key: 'second', label: 'Second' },
  { key: 'third', label: 'Third' },
]
<\/script>

<template>
  <div class="playground-col">
    <div class="playground-row">
      <Button color="neutral" @click="active = 'first'">first</Button>
      <Button color="neutral" @click="active = 'second'">second</Button>
      <Button color="neutral" @click="active = 'third'">third</Button>
      <Button color="neutral" @click="tabsRef?.next()">next()</Button>
      <Button color="neutral" @click="tabsRef?.prev()">prev()</Button>
    </div>
    <p class="playground-state">active: <strong>{{ active }}</strong></p>
    <Tabs ref="tabsRef" v-model="active" :tabs="tabs">
      <template #first>Contenido First</template>
      <template #second>Contenido Second</template>
      <template #third>Contenido Third</template>
    </Tabs>
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuTabs.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div class="playground-col">
  <div class="playground-row">
    <cu-button id="tabs-prog-first" color="neutral">first</cu-button>
    <cu-button id="tabs-prog-second" color="neutral">second</cu-button>
    <cu-button id="tabs-prog-third" color="neutral">third</cu-button>
    <cu-button id="tabs-prog-next" color="neutral">next()</cu-button>
    <cu-button id="tabs-prog-prev" color="neutral">prev()</cu-button>
  </div>
  <p class="playground-state">active: <strong id="tabs-prog-state">first</strong></p>
  <cu-tabs id="tabs-prog">
    <div slot="first">Contenido First</div>
    <div slot="second">Contenido Second</div>
    <div slot="third">Contenido Third</div>
  </cu-tabs>
</div>

<script>
  customElements.whenDefined('cu-tabs').then(() => {
    const tabs = document.getElementById('tabs-prog');
    const state = document.getElementById('tabs-prog-state');
    const sync = () => (state.textContent = tabs.modelValue);
    tabs.tabs = [
      { key: 'first', label: 'First' },
      { key: 'second', label: 'Second' },
      { key: 'third', label: 'Third' },
    ];
    tabs.modelValue = 'first';
    document.getElementById('tabs-prog-first').addEventListener('click', () => { tabs.modelValue = 'first'; sync(); });
    document.getElementById('tabs-prog-second').addEventListener('click', () => { tabs.modelValue = 'second'; sync(); });
    document.getElementById('tabs-prog-third').addEventListener('click', () => { tabs.modelValue = 'third'; sync(); });
    document.getElementById('tabs-prog-next').addEventListener('click', () => tabs.next());
    document.getElementById('tabs-prog-prev').addEventListener('click', () => tabs.prev());
    tabs.addEventListener('update:modelValue', (e) => {
      tabs.modelValue = e.detail;
      sync();
    });
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos del v-model y los exposes: first/second/third, next() y prev() sobre la instancia de abajo.",
    render: () => h(TabsProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
];
