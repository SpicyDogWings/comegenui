import { defineComponent, h, ref } from "vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface LogEntry {
  name: string;
  info?: string;
}

const EVENT_NAMES = [
  "click",
  "dblclick",
  "focus",
  "blur",
  "mouseenter",
  "mouseleave",
  "keydown",
  "keyup",
  "contextmenu",
] as const;

const MONO = "var(--cu-font-mono, monospace)";

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * Patio de juegos de eventos: interactuá con los botones y mirá el log.
 * Button no emite eventos custom; se muestran los eventos nativos del DOM.
 */
const ButtonEventsPlayground = defineComponent({
  name: "ButtonEventsPlayground",
  setup() {
    const log = ref<LogEntry[]>([]);

    const record = (name: string, info?: string) => {
      log.value = [{ name, info }, ...log.value].slice(0, 8);
    };

    const handlers = Object.fromEntries(
      EVENT_NAMES.map((eventName) => [
        `on${capitalize(eventName)}`,
        (event: Event) => {
          const info = eventName.startsWith("key") ? (event as KeyboardEvent).key : undefined;
          record(eventName, info);
        },
      ]),
    ) as Record<string, (event: Event) => void>;

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "primary", variant: "solid", ...handlers }, () => "Guardar"),
        ]),
        h(
          "p",
          { class: "playground-state" },
          "Button no emite eventos propios (loading es estado, no evento): interactuá con el botón (click, doble click, foco, teclado, hover) y mirá el log.",
        ),
        h(
          "ul",
          {
            style: `margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:2px;font-family:${MONO};font-size:var(--cu-font-size-sm, 14px);min-height:120px`,
          },
          log.value.length
            ? log.value.map((entry, index) =>
                h(
                  "li",
                  { key: index, style: `opacity:${Math.max(0.35, 1 - index * 0.09)}` },
                  `▸ ${entry.name}${entry.info ? ` (${entry.info})` : ""}`,
                ),
              )
            : [h("li", { style: "opacity:.5" }, "— sin eventos —")],
        ),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import Button from '@/components/buttons/Button.vue'

const events = ref([])
const log = (name) => (e) => {
  events.value.unshift(name + (e.key ? ' (' + e.key + ')' : ''))
}
<\/script>

<template>
  <Button
    color="primary"
    @click="log('click')"
    @dblclick="log('dblclick')"
    @focus="log('focus')"
    @blur="log('blur')"
    @mouseenter="log('mouseenter')"
    @mouseleave="log('mouseleave')"
    @keydown="log('keydown')"
    @keyup="log('keyup')"
    @contextmenu="log('contextmenu')"
  >
    Guardar
  </Button>
</template>`;

const eventsVanilla = `<script src="dist/CuButton.umd.js"><\/script>

<cu-button id="btn-events" color="primary" variant="solid">Guardar</cu-button>

<script>
  const btn = document.getElementById('btn-events');
  ['click', 'dblclick', 'focus', 'blur', 'mouseenter', 'mouseleave', 'keydown', 'keyup', 'contextmenu']
    .forEach((name) => btn.addEventListener(name, (e) => console.log(name, e.key ?? '')));
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "events",
    title: "Events",
    description:
      "Patio de juegos de eventos: interactuá con el botón y mirá el log en vivo. Button no emite eventos custom (loading es un estado, no un evento).",
    render: () => h(ButtonEventsPlayground),
    vue: eventsVue,
    vanilla: eventsVanilla,
  },
];
