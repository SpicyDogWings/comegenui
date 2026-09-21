import { defineComponent, h, ref } from "vue";
import Navbar from "@/components/navigation/Navbar.vue";
import type { StoryExtra } from "@/stories/types";

const ITEMS = [
  { label: "Inicio", path: "/inicio" },
  {
    label: "Componentes",
    children: [
      { label: "Button", path: "/components/button" },
      { label: "Input", path: "/components/input" },
    ],
  },
];

/**
 * Events: log en vivo del evento `search` (el query actual) de una instancia.
 */
const NavbarEvents = defineComponent({
  name: "NavbarEvents",
  setup() {
    const log = ref<string[]>([]);
    const push = (query: string) => {
      log.value = [`search: ${query}`, ...log.value].slice(0, 6);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("p", { class: "playground-state" }, log.value.length ? log.value.join(" · ") : "Sin eventos todavía"),
        h(Navbar, {
          items: ITEMS,
          search: true,
          onSearch: (query: string) => push(query),
        }),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import Navbar from '@/components/navigation/Navbar.vue'

const items = [
  { label: 'Inicio', path: '/inicio' },
  { label: 'Componentes', children: [
    { label: 'Button', path: '/components/button' },
  ]},
]
const log = ref([])
<\/script>

<template>
  <p class="playground-state">{{ log.join(' · ') || 'Sin eventos todavía' }}</p>
  <Navbar :items="items" search @search="log.unshift('search: ' + $event)" />
</template>`;

const eventsVanilla = `<script src="dist/CuNavbar.umd.js"><\/script>

<p id="navbar-events-log">Sin eventos todavía</p>
<cu-navbar id="navbar-events" search></cu-navbar>

<script>
  customElements.whenDefined('cu-navbar').then(() => {
    const el = document.getElementById('navbar-events');
    const log = document.getElementById('navbar-events-log');
    el.items = [
      { label: 'Inicio', path: '/inicio' },
      { label: 'Componentes', children: [
        { label: 'Button', path: '/components/button' },
      ]},
    ];
    el.addEventListener('search', (e) => {
      log.textContent = 'search: ' + e.detail;
    });
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "events",
    title: "Events",
    description: "Log en vivo del evento search (el query actual).",
    render: () => h(NavbarEvents),
    vue: eventsVue,
    vanilla: eventsVanilla,
  },
];
