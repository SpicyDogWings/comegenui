import { defineComponent, h, ref } from "vue";
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface DropdownMenuInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => unknown;
}

interface DropdownItem {
  label?: string;
  icon?: string;
  onClick?: () => void;
  color?: string;
  disabled?: boolean;
  divider?: boolean;
}

const programmaticItems: DropdownItem[] = [
  { label: "Edit" },
  { label: "Duplicate" },
  { label: "Archive" },
];

/**
 * Programmatic: patio de juegos de los **exposes** de DropdownMenu
 * (open/close/toggle) sobre una instancia en vivo. El estado se lee de los
 * eventos open/close para reflejarlo en vivo.
 */
const DropdownMenuProgrammatic = defineComponent({
  name: "DropdownMenuProgrammatic",
  setup() {
    const menuRef = ref<InstanceType<typeof DropdownMenu> | null>(null);
    const isOpen = ref(false);

    const instance = () => menuRef.value as unknown as DropdownMenuInstance | null;

    const run = (action: (menu: DropdownMenuInstance) => void) => {
      const menu = instance();
      if (!menu) return;
      action(menu);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: () => run((menu) => menu.open()) }, () => "open()"),
          h(Button, { color: "neutral", onClick: () => run((menu) => menu.close()) }, () => "close()"),
          h(Button, { color: "neutral", onClick: () => run((menu) => menu.toggle()) }, () => "toggle()"),
        ]),
        h("p", { class: "playground-state" }, ["isOpen(): ", h("strong", String(isOpen.value))]),
        h(DropdownMenu, {
          ref: menuRef,
          label: "Menú programático",
          items: programmaticItems,
          onOpen: () => (isOpen.value = true),
          onClose: () => (isOpen.value = false),
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import DropdownMenu from '@/components/controls/DropdownMenu.vue'
import Button from '@/components/buttons/Button.vue'

const menuRef = ref(null)
const isOpen = ref(false)

const items = [{ label: 'Edit' }, { label: 'Duplicate' }, { label: 'Archive' }]
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="menuRef?.open()">open()</Button>
      <Button color="neutral" @click="menuRef?.close()">close()</Button>
      <Button color="neutral" @click="menuRef?.toggle()">toggle()</Button>
    </div>
    <p class="playground-state">isOpen(): <strong>{{ isOpen }}</strong></p>
    <DropdownMenu
      ref="menuRef"
      label="Menú programático"
      :items="items"
      @open="isOpen = true"
      @close="isOpen = false"
    />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuDropdownMenu.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="menu-prog-open" color="neutral">open()</cu-button>
  <cu-button id="menu-prog-close" color="neutral">close()</cu-button>
  <cu-button id="menu-prog-toggle" color="neutral">toggle()</cu-button>
</div>

<p class="playground-state">isOpen(): <strong id="menu-prog-state">false</strong></p>

<cu-dropdown-menu id="menu-prog" label="Menú programático"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    const menu = document.getElementById('menu-prog');
    const state = document.getElementById('menu-prog-state');
    menu.items = [
      { label: 'Edit' },
      { label: 'Duplicate' },
      { label: 'Archive' },
    ];
    document.getElementById('menu-prog-open').addEventListener('click', () => menu.open());
    document.getElementById('menu-prog-close').addEventListener('click', () => menu.close());
    document.getElementById('menu-prog-toggle').addEventListener('click', () => menu.toggle());
    menu.addEventListener('open', () => (state.textContent = 'true'));
    menu.addEventListener('close', () => (state.textContent = 'false'));
  });
<\/script>`;

/**
 * Events: patio de **eventos** de DropdownMenu (open/close + click de items)
 * con log en vivo.
 */
const DropdownMenuEvents = defineComponent({
  name: "DropdownMenuEvents",
  setup() {
    const log = ref<string[]>([]);

    const push = (entry: string) => {
      log.value = [entry, ...log.value].slice(0, 5);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h(DropdownMenu, {
          label: "Menú de eventos",
          items: [
            { label: "Editar", onClick: () => push("click: Editar") },
            { label: "Eliminar", color: "danger", onClick: () => push("click: Eliminar") },
            { label: "Separador", divider: true },
            { label: "Deshabilitado", disabled: true, onClick: () => push("click: Deshabilitado") },
          ],
          onOpen: () => push("open"),
          onClose: () => push("close"),
        }),
        h("div", { class: "playground-state" }, [
          h("p", null, ["Eventos (últimos 5):"]),
          log.value.length
            ? h(
                "ul",
                { style: "margin:0;padding-left:1rem" },
                log.value.map((entry, index) => h("li", { key: index }, entry)),
              )
            : h("p", { style: "margin:0" }, "Abrí el menú y clickeá un item."),
        ]),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import DropdownMenu from '@/components/controls/DropdownMenu.vue'

const log = ref([])
const push = (entry) => {
  log.value = [entry, ...log.value].slice(0, 5)
}

const items = [
  { label: 'Editar', onClick: () => push('click: Editar') },
  { label: 'Eliminar', color: 'danger', onClick: () => push('click: Eliminar') },
  { label: 'Separador', divider: true },
  { label: 'Deshabilitado', disabled: true },
]
<\/script>

<template>
  <DropdownMenu
    label="Menú de eventos"
    :items="items"
    @open="push('open')"
    @close="push('close')"
  />
  <ul>
    <li v-for="(entry, i) in log" :key="i">{{ entry }}</li>
  </ul>
</template>`;

const eventsVanilla = `<script src="dist/CuDropdownMenu.umd.js"><\/script>

<cu-dropdown-menu id="menu-events" label="Menú de eventos"></cu-dropdown-menu>
<ul id="menu-events-log"></ul>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    const menu = document.getElementById('menu-events');
    const log = document.getElementById('menu-events-log');
    const push = (entry) => {
      const li = document.createElement('li');
      li.textContent = entry;
      log.prepend(li);
    };
    menu.items = [
      { label: 'Editar', onClick: () => push('click: Editar') },
      { label: 'Eliminar', color: 'danger', onClick: () => push('click: Eliminar') },
      { label: 'Separador', divider: true },
      { label: 'Deshabilitado', disabled: true },
    ];
    menu.addEventListener('open', () => push('open'));
    menu.addEventListener('close', () => push('close'));
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: open(), close() y toggle() sobre la instancia de abajo.",
    render: () => h(DropdownMenuProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
  {
    id: "events",
    title: "Events",
    description: "Una instancia de DropdownMenu y el log en vivo de open, close y click de items.",
    render: () => h(DropdownMenuEvents),
    vue: eventsVue,
    vanilla: eventsVanilla,
  },
];
