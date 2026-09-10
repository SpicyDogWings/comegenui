import { defineComponent, h, ref } from "vue";
import CommandPalette, { type CommandItem } from "@/components/overlay/CommandPalette.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

interface CommandPaletteInstance {
  open: () => void;
  close: () => void;
  run: (id: string) => CommandItem | null;
  getCommands: () => CommandItem[];
  isOpen: () => boolean;
}

/**
 * Programmatic: patio de juegos de los **exposes** de CommandPalette
 * (open/close/run/getCommands/isOpen) sobre una instancia en vivo.
 */
const CommandPaletteProgrammatic = defineComponent({
  name: "CommandPaletteProgrammatic",
  setup() {
    const paletteRef = ref<InstanceType<typeof CommandPalette> | null>(null);
    const selected = ref<string | null>(null);
    const isOpen = ref(false);

    const commands: CommandItem[] = [
      { id: "new", label: "Nuevo archivo", action: () => (selected.value = "new") },
      { id: "save", label: "Guardar", action: () => (selected.value = "save") },
      { id: "find", label: "Buscar", action: () => (selected.value = "find") },
    ];

    const instance = () => paletteRef.value as unknown as CommandPaletteInstance | null;

    const withInstance = (action: (palette: CommandPaletteInstance) => void) => {
      const palette = instance();
      if (!palette) return;
      action(palette);
      isOpen.value = palette.isOpen();
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(
            Button,
            { color: "neutral", onClick: () => withInstance((palette) => palette.open()) },
            () => "open()",
          ),
          h(
            Button,
            { color: "neutral", onClick: () => withInstance((palette) => palette.close()) },
            () => "close()",
          ),
          h(
            Button,
            {
              color: "primary",
              variant: "soft",
              onClick: () => withInstance((palette) => palette.run("new")),
            },
            () => "run('new')",
          ),
          h(
            Button,
            {
              color: "primary",
              variant: "soft",
              onClick: () => withInstance((palette) => palette.run("save")),
            },
            () => "run('save')",
          ),
          h(
            Button,
            { color: "neutral", onClick: () => withInstance((palette) => palette.getCommands()) },
            () => "getCommands()",
          ),
          h(
            Button,
            { color: "neutral", onClick: () => withInstance(() => {}) },
            () => "isOpen()",
          ),
        ]),
        h("p", { class: "playground-state" }, [
          "Selected: ",
          h("strong", selected.value ?? "—"),
          " · isOpen(): ",
          h("strong", String(isOpen.value)),
        ]),
        h(CommandPalette, {
          ref: paletteRef,
          commands,
          title: "Programmatic Command Palette",
          onSelect: (cmd: CommandItem) => (selected.value = cmd.id),
          onClose: () => (isOpen.value = false),
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import CommandPalette from '@/components/overlay/CommandPalette.vue'
import Button from '@/components/buttons/Button.vue'

const palette = ref(null)
const selected = ref(null)

const commands = [
  { id: 'new', label: 'Nuevo archivo', action: () => { selected.value = 'new' } },
  { id: 'save', label: 'Guardar', action: () => { selected.value = 'save' } },
  { id: 'find', label: 'Buscar', action: () => { selected.value = 'find' } },
]
<\/script>

<template>
  <Button color="neutral" @click="palette?.open()">open()</Button>
  <Button color="neutral" @click="palette?.close()">close()</Button>
  <Button color="primary" variant="soft" @click="palette?.run('new')">run('new')</Button>

  <p>Selected: {{ selected ?? '—' }}</p>
  <CommandPalette
    ref="palette"
    :commands="commands"
    @select="selected = $event?.id"
  />
</template>`;

const programmaticVanilla = `<link rel="stylesheet" href="dist/css/themes.css">
<script src="dist/CuCommandPalette.umd.js"><\/script>
<script src="dist/CuButton.umd.js"><\/script>

<cu-button id="cp-open" color="neutral">open()</cu-button>
<cu-button id="cp-close" color="neutral">close()</cu-button>
<cu-button id="cp-run" color="primary" variant="soft">run('new')</cu-button>

<cu-command-palette id="cp-prog" title="Programmatic Command Palette"></cu-command-palette>

<script>
  const palette = document.getElementById('cp-prog')
  palette.commands = [
    { id: 'new', label: 'Nuevo archivo', action: () => {} },
    { id: 'save', label: 'Guardar', action: () => {} },
  ]
  document.getElementById('cp-open').addEventListener('click', () => palette.open())
  document.getElementById('cp-close').addEventListener('click', () => palette.close())
  document.getElementById('cp-run').addEventListener('click', () => palette.run('new'))
  palette.addEventListener('select', (e) => console.log('Selected:', e.detail))
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: open(), close(), run(id), getCommands() e isOpen() sobre la instancia de abajo.",
    render: () => h(CommandPaletteProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
];
