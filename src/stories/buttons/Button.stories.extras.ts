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
    const loading = ref(false);

    const record = (name: string, info?: string) => {
      log.value = [{ name, info }, ...log.value].slice(0, 8);
    };

    const emulateLoading = () => {
      loading.value = true;
      setTimeout(() => {
        loading.value = false;
      }, 1500);
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
          h(
            Button,
            {
              color: "primary",
              variant: "solid",
              loading: loading.value,
              ...handlers,
              onClick: (event: Event) => {
                handlers.onClick?.(event);
                emulateLoading();
              },
              onLoadingChange: (value: boolean) => record("loading-change", String(value)),
            },
            () => "Guardar",
          ),
        ]),
        h(
          "p",
          { class: "playground-state" },
          "El click dispara un loading de 1.5s: mirá click + loading-change(true/false). Los eventos de UI son nativos; loading-change es el único emit propio del componente.",
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
      "Patio de juegos de eventos: click, foco, teclado y hover (nativos) + `loading-change` (emit propio cuando cambia el estado loading).",
    render: () => h(ButtonEventsPlayground),
    vue: eventsVue,
    vanilla: eventsVanilla,
  },
];
