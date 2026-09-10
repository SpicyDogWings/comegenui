import { defineComponent, h, ref } from "vue";
import Modal from "@/components/overlay/Modal.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface ModalInstance {
  open: () => void;
  close: () => void;
  toggle: () => void;
  isOpen: () => boolean;
}

const ModalProgrammatic = defineComponent({
  name: "ModalProgrammatic",
  setup() {
    const modalRef = ref<InstanceType<typeof Modal> | null>(null);
    const isOpen = ref(false);

    const instance = () => modalRef.value as unknown as ModalInstance | null;

    const read = () => {
      const modal = instance();
      if (modal) isOpen.value = modal.isOpen();
    };

    const run = (action: (modal: ModalInstance) => void) => {
      const modal = instance();
      if (modal) {
        action(modal);
        read();
      }
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: () => run((m) => m.open()) }, () => "open()"),
          h(Button, { color: "neutral", onClick: () => run((m) => m.close()) }, () => "close()"),
          h(Button, { color: "neutral", onClick: () => run((m) => m.toggle()) }, () => "toggle()"),
          h(Button, { color: "neutral", onClick: read }, () => "isOpen()"),
        ]),
        h("p", { class: "playground-state" }, ["isOpen(): ", h("strong", String(isOpen.value))]),
        h(Modal, {
          ref: modalRef,
          title: "Programmatic Modal",
          description: "open(), close(), toggle() e isOpen().",
          onOpened: read,
          onClosed: read,
        }, {
          default: () => h("p", {}, "Contenido del modal."),
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Modal from '@/components/overlay/Modal.vue'
import Button from '@/components/buttons/Button.vue'

const modalRef = ref(null)
const isOpen = ref(false)

const read = () => (isOpen.value = modalRef.value.isOpen())
const run = (action) => { action(modalRef.value); read() }
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="run((m) => m.open())">open()</Button>
      <Button color="neutral" @click="run((m) => m.close())">close()</Button>
      <Button color="neutral" @click="run((m) => m.toggle())">toggle()</Button>
    </div>
    <p class="playground-state">isOpen(): <strong>{{ isOpen }}</strong></p>
    <Modal ref="modalRef" title="Programmatic Modal" description="open(), close(), toggle() e isOpen()." @opened="read" @closed="read">
      <p>Contenido del modal.</p>
    </Modal>
  </div>
</template>`;

const ModalEvents = defineComponent({
  name: "ModalEvents",
  setup() {
    const log = ref<string[]>([]);
    const push = (label: string) => {
      log.value = [label, ...log.value].slice(0, 8);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("p", { class: "playground-state" }, log.value.length ? log.value.join(" · ") : "Sin eventos todavía"),
        h(Modal, {
          title: "Events Modal",
          persistent: true,
          color: "primary",
          onOpened: () => push("opened"),
          onClosed: () => push("closed"),
          onClose: () => push("close"),
          onAccept: () => push("accept"),
          onCancel: () => push("cancel"),
        }, {
          default: () => h("p", {}, "Aceptá, cancelá o cerrá para ver los eventos."),
        }),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import Modal from '@/components/overlay/Modal.vue'

const log = ref([])
const push = (label) => log.value.unshift(label)
<\/script>

<template>
  <p class="playground-state">{{ log.join(' · ') || 'Sin eventos todavía' }}</p>
  <Modal
    title="Events Modal"
    persistent
    color="primary"
    @opened="push('opened')"
    @closed="push('closed')"
    @close="push('close')"
    @accept="push('accept')"
    @cancel="push('cancel')"
  >
    <p>Aceptá, cancelá o cerrá para ver los eventos.</p>
  </Modal>
</template>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description: "Patio de juegos de los exposes: open(), close(), toggle() e isOpen() sobre la instancia de abajo.",
    render: () => h(ModalProgrammatic),
    vue: programmaticVue,
  },
  {
    id: "events",
    title: "Events",
    description: "Log en vivo de opened, closed, close, accept y cancel.",
    render: () => h(ModalEvents),
    vue: eventsVue,
  },
];
