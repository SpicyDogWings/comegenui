import { defineComponent, h, ref } from "vue";
import Alert from "@/components/information/Alert.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface AlertInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

/**
 * Programmatic: patio de juegos de los **exposes** de Alert
 * (open/close/toggle/isOpen) sobre una instancia en vivo.
 */
const AlertProgrammatic = defineComponent({
  name: "AlertProgrammatic",
  setup() {
    const alertRef = ref<InstanceType<typeof Alert> | null>(null);
    const isOpen = ref(true);

    const instance = () => alertRef.value as unknown as AlertInstance | null;

    const sync = () => {
      isOpen.value = instance()?.isOpen() ?? false;
    };

    const run = (action: (alert: AlertInstance) => void) => {
      const alert = instance();
      if (!alert) return;
      action(alert);
      sync();
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: () => run((alert) => alert.open()) }, () => "open()"),
          h(Button, { color: "neutral", onClick: () => run((alert) => alert.close()) }, () => "close()"),
          h(Button, { color: "neutral", onClick: () => run((alert) => alert.toggle()) }, () => "toggle()"),
        ]),
        h("p", { class: "playground-state" }, ["isOpen: ", h("strong", String(isOpen.value))]),
        h(
          Alert,
          {
            ref: alertRef,
            title: "Controlado por API",
            color: "warning",
            close: true,
            onOpen: () => (isOpen.value = true),
            onClose: () => (isOpen.value = false),
            "onUpdate:show": (value: boolean) => (isOpen.value = value),
          },
          () => "Este alert se controla con open()/close()/toggle().",
        ),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Alert from '@/components/information/Alert.vue'
import Button from '@/components/buttons/Button.vue'

const alertRef = ref(null)
const isOpen = ref(true)
<\/script>

<template>
  <Button @click="alertRef?.open()">open()</Button>
  <Button @click="alertRef?.close()">close()</Button>
  <Button @click="alertRef?.toggle()">toggle()</Button>
  <Alert
    ref="alertRef"
    title="Controlado por API"
    color="warning"
    @open="isOpen = true"
    @close="isOpen = false"
  >
    Estado: {{ isOpen ? 'abierto' : 'cerrado' }}
  </Alert>
</template>`;

const programmaticVanilla = `<script src="dist/CuAlert.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<cu-button id="alert-open" color="neutral">open()</cu-button>
<cu-button id="alert-close" color="neutral">close()</cu-button>
<cu-button id="alert-toggle" color="neutral">toggle()</cu-button>

<p>isOpen: <strong id="alert-state">true</strong></p>
<cu-alert id="alert-prog" title="Controlado por API" color="warning" close>
  Este alert se controla con open()/close()/toggle().
</cu-alert>

<script>
  const alert = document.getElementById('alert-prog');
  const state = document.getElementById('alert-state');
  document.getElementById('alert-open').addEventListener('click', () => { alert.open(); state.textContent = alert.isOpen(); });
  document.getElementById('alert-close').addEventListener('click', () => { alert.close(); state.textContent = alert.isOpen(); });
  document.getElementById('alert-toggle').addEventListener('click', () => { alert.toggle(); state.textContent = alert.isOpen(); });
  alert.addEventListener('open', () => (state.textContent = 'true'));
  alert.addEventListener('close', () => (state.textContent = 'false'));
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: open(), close(), toggle() e isOpen() sobre la instancia de abajo.",
    render: () => h(AlertProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
];
