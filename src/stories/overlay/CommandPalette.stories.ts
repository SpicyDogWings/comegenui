import { defineComponent, h, nextTick, ref } from "vue";
import CommandPalette, { type CommandItem } from "@/components/overlay/CommandPalette.vue";
import Button from "@/components/buttons/Button.vue";
import type { ComponentStory, Variant } from "@/stories/types";
import { extras } from "./CommandPalette.stories.extras";

async function flush(): Promise<void> {
  await nextTick();
}

// Registro externo para verificar que la `action` de un comando se ejecuta.
const actionLog: string[] = [];

const BASIC_COMMANDS: CommandItem[] = [
  { id: "new", label: "Nuevo archivo", action: () => actionLog.push("new") },
  { id: "open", label: "Abrir archivo", action: () => actionLog.push("open") },
  { id: "save", label: "Guardar", action: () => actionLog.push("save") },
  { id: "close", label: "Cerrar", action: () => actionLog.push("close") },
];

const CATEGORY_COMMANDS: CommandItem[] = [
  {
    id: "new",
    label: "Nuevo archivo",
    description: "Crear un archivo vacío",
    category: "Archivo",
    icon: "📄",
    badges: ["Nuevo"],
    action: () => {},
  },
  {
    id: "open",
    label: "Abrir archivo",
    description: "Abrir un archivo existente",
    category: "Archivo",
    icon: "📂",
    badges: ["Reciente"],
    action: () => {},
  },
  {
    id: "undo",
    label: "Deshacer",
    description: "Revertir última acción",
    category: "Edición",
    icon: "↩️",
    badges: ["Edit", "Undo"],
    action: () => {},
  },
  {
    id: "find",
    label: "Buscar",
    description: "Buscar texto en el archivo",
    category: "Navegación",
    icon: "🔍",
    badges: ["Go"],
    action: () => {},
  },
];

const SHORTCUT_COMMANDS: CommandItem[] = [
  { id: "new", label: "Nuevo archivo", icon: "📄", shortcut: "Ctrl+N", action: () => {} },
  { id: "open", label: "Abrir archivo", icon: "📂", shortcut: "Ctrl+O", action: () => {} },
  { id: "save", label: "Guardar", icon: "💾", shortcut: "Ctrl+S", action: () => {} },
  { id: "find", label: "Buscar", icon: "🔍", shortcut: "Ctrl+F", action: () => {} },
  { id: "palette", label: "Command Palette", icon: "⌨️", shortcut: "Ctrl+K", action: () => {} },
];

// ── Previews interactivos (hay que abrir el palette para verlo) ──────────────

function openablePreview(
  name: string,
  commands: CommandItem[],
  extraProps: Record<string, unknown> = {},
) {
  return defineComponent({
    name,
    setup() {
      const palette = ref<InstanceType<typeof CommandPalette> | null>(null);
      return () =>
        h("div", { class: "playground-col" }, [
          h(
            Button,
            { color: "primary", variant: "soft", onClick: () => palette.value?.open() },
            () => "Abrir Command Palette",
          ),
          h(CommandPalette, { ref: palette, commands, ...extraProps }),
        ]);
    },
  });
}

const BasicPreview = openablePreview("CommandPaletteBasicPreview", BASIC_COMMANDS);
const CategoriesPreview = openablePreview(
  "CommandPaletteCategoriesPreview",
  CATEGORY_COMMANDS,
  { title: "Comandos por categoría" },
);
const ShortcutsPreview = openablePreview(
  "CommandPaletteShortcutsPreview",
  SHORTCUT_COMMANDS,
);
const HeaderPreview = openablePreview("CommandPaletteHeaderPreview", BASIC_COMMANDS, {
  title: "Comandos",
  placeholder: "Escribí un comando…",
  color: "primary",
});

const SIZES = ["sm", "md", "lg", "xl", "full"] as const;
const HEIGHTS = ["sm", "md", "lg"] as const;

const SizesPreview = defineComponent({
  name: "CommandPaletteSizesPreview",
  setup() {
    const refs = ref<Record<string, InstanceType<typeof CommandPalette> | null>>({});
    return () =>
      h("div", { class: "playground-col" }, [
        h(
          "div",
          { class: "playground-row" },
          SIZES.map((size) =>
            h(
              Button,
              {
                key: `btn-size-${size}`,
                color: "neutral",
                onClick: () => refs.value[`size-${size}`]?.open(),
              },
              () => `size: ${size}`,
            ),
          ),
        ),
        h(
          "div",
          { class: "playground-row" },
          HEIGHTS.map((height) =>
            h(
              Button,
              {
                key: `btn-height-${height}`,
                color: "neutral",
                onClick: () => refs.value[`height-${height}`]?.open(),
              },
              () => `height: ${height}`,
            ),
          ),
        ),
        ...SIZES.map((size) =>
          h(CommandPalette, {
            key: `size-${size}`,
            ref: (el: unknown) => {
              refs.value[`size-${size}`] = el as InstanceType<typeof CommandPalette>;
            },
            commands: BASIC_COMMANDS,
            size,
            title: `size ${size}`,
          }),
        ),
        ...HEIGHTS.map((height) =>
          h(CommandPalette, {
            key: `height-${height}`,
            ref: (el: unknown) => {
              refs.value[`height-${height}`] = el as InstanceType<typeof CommandPalette>;
            },
            commands: BASIC_COMMANDS,
            height,
            title: `height ${height}`,
          }),
        ),
      ]);
  },
});

// ── Snippets ─────────────────────────────────────────────────────────────────

const vueImport = `<script setup>
import { ref } from 'vue'
import CommandPalette from '@/components/overlay/CommandPalette.vue'
import Button from '@/components/buttons/Button.vue'

const palette = ref(null)
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const basicVue = vueSnippet(`  <Button @click="palette?.open()">Abrir Command Palette</Button>
  <CommandPalette
    ref="palette"
    :commands="[
      { id: 'new', label: 'Nuevo archivo', action: () => {} },
      { id: 'open', label: 'Abrir archivo', action: () => {} },
      { id: 'save', label: 'Guardar', action: () => {} },
    ]"
  />`);

const basicVanilla = `<link rel="stylesheet" href="dist/css/themes.css">
<script src="dist/CuCommandPalette.umd.js"><\/script>

<button id="open">Abrir Command Palette</button>
<cu-command-palette id="my-palette" title="Command Palette"></cu-command-palette>

<script>
  const palette = document.querySelector('#my-palette')
  palette.commands = [
    { id: 'new', label: 'Nuevo archivo', action: () => {} },
    { id: 'open', label: 'Abrir archivo', action: () => {} },
  ]
  document.querySelector('#open').addEventListener('click', () => palette.open())
  palette.addEventListener('select', (e) => console.log('Selected:', e.detail))
<\/script>`;

const categoriesVue = vueSnippet(`  <Button @click="palette?.open()">Abrir con Categorías</Button>
  <CommandPalette
    ref="palette"
    :commands="[
      { id: 'new', label: 'Nuevo archivo', category: 'Archivo', icon: '📄', action: () => {} },
      { id: 'save', label: 'Guardar', category: 'Archivo', icon: '💾', action: () => {} },
      { id: 'undo', label: 'Deshacer', category: 'Edición', icon: '↩️', action: () => {} },
      { id: 'find', label: 'Buscar', category: 'Navegación', icon: '🔍', action: () => {} },
    ]"
  />`);

const categoriesVanilla = `<cu-command-palette id="my-palette"></cu-command-palette>

<script>
  document.querySelector('#my-palette').commands = [
    { id: 'new', label: 'Nuevo archivo', category: 'Archivo', action: () => {} },
    { id: 'save', label: 'Guardar', category: 'Archivo', action: () => {} },
    { id: 'undo', label: 'Deshacer', category: 'Edición', action: () => {} },
  ]
<\/script>`;

const shortcutsVue = vueSnippet(`  <Button @click="palette?.open()">Abrir con Atajos</Button>
  <CommandPalette
    ref="palette"
    :commands="[
      { id: 'new', label: 'Nuevo archivo', shortcut: 'Ctrl+N', action: () => {} },
      { id: 'save', label: 'Guardar', shortcut: 'Ctrl+S', action: () => {} },
      { id: 'find', label: 'Buscar', shortcut: 'Ctrl+F', action: () => {} },
    ]"
  />`);

const shortcutsVanilla = `<cu-command-palette id="my-palette"></cu-command-palette>

<script>
  document.querySelector('#my-palette').commands = [
    { id: 'new', label: 'Nuevo archivo', shortcut: 'Ctrl+N', action: () => {} },
    { id: 'save', label: 'Guardar', shortcut: 'Ctrl+S', action: () => {} },
  ]
<\/script>`;

const headerVue = vueSnippet(`  <Button @click="palette?.open()">Abrir</Button>
  <CommandPalette
    ref="palette"
    color="primary"
    title="Comandos"
    placeholder="Escribí un comando…"
    :commands="commands"
  />`);

const headerVanilla = `<cu-command-palette
  id="my-palette"
  color="primary"
  title="Comandos"
  placeholder="Escribí un comando…"
></cu-command-palette>`;

const sizesVue = vueSnippet(`  <CommandPalette title="size md" size="md" :commands="commands" />
  <CommandPalette title="size full" size="full" :commands="commands" />
  <CommandPalette title="height md" height="md" :commands="commands" />`);

const sizesVanilla = `<cu-command-palette title="size md" size="md"></cu-command-palette>
<cu-command-palette title="size full" size="full"></cu-command-palette>
<cu-command-palette title="height md" height="md"></cu-command-palette>`;

// ── Story ────────────────────────────────────────────────────────────────────

export const cuCommandPaletteStories: ComponentStory = {
  component: "cu-command-palette",
  vue: CommandPalette,
  tokens: [
    "--cu-border-color",
    "--cu-border-thin",
    "--cu-color-neutral",
    "--cu-color-neutral-ghost-hover",
    "--cu-font-mono",
    "--cu-font-size-sm",
    "--cu-font-size-xs",
    "--cu-font-weight-semibold",
    "--cu-radius-sm"
  ],
  classes: [
    "cu-command-palette",
    "cu-command-palette-empty",
    "cu-command-palette-group-label",
    "cu-command-palette-input",
    "cu-command-palette-item",
    "cu-command-palette-item--active",
    "cu-command-palette-item-badge",
    "cu-command-palette-item-desc",
    "cu-command-palette-item-icon",
    "cu-command-palette-item-label",
    "cu-command-palette-item-shortcut",
    "cu-command-palette-results",
    "cu-command-palette-search"
  ],
  api: {
    "components": [
      {
        "label": "Modal",
        "path": "/playground/components/modal"
      },
      {
        "label": "Input",
        "path": "/playground/components/input"
      },
      {
        "label": "Button",
        "path": "/playground/components/button"
      }
    ],
    "props": [
      {
        "name": "color",
        "type": "string",
        "default": "neutral",
        "description": "primary, secondary, neutral, success, warning, danger"
      },
      {
        "name": "title",
        "type": "string",
        "default": "",
        "description": "Título del modal"
      },
      {
        "name": "placeholder",
        "type": "string",
        "default": "Buscar comandos…",
        "description": "Texto del input de búsqueda"
      },
      {
        "name": "size",
        "type": "auto | sm | md | lg | xl | full",
        "default": "auto",
        "description": "auto, sm, md, lg, xl, full"
      },
      {
        "name": "height",
        "type": "auto | sm | md | lg | xl | full",
        "default": "auto",
        "description": "auto, sm, md, lg, xl, full"
      },
      {
        "name": "commands",
        "type": "Array as () => CommandItem[]",
        "description": "Lista de comandos (ver interfaz)"
      }
    ],
    "events": [
      {
        "name": "select",
        "type": "() => void",
        "description": "Se seleccionó un comando"
      },
      {
        "name": "close",
        "type": "() => void",
        "description": "Se cerró el palette"
      }
    ],
    "exposes": [
      {
        "name": "open()",
        "type": "() => void",
        "description": "Abre el command palette"
      },
      {
        "name": "close()",
        "type": "() => void",
        "description": "Cierra el command palette"
      },
      {
        "name": "run()",
        "type": "() => void",
        "description": "Ejecuta el comando con ese id."
      },
      {
        "name": "getCommands()",
        "type": "() => void",
        "description": "Devuelve la lista actual de comandos"
      },
      {
        "name": "isOpen()",
        "type": "() => void",
        "description": "Estado actual"
      },
      {
        "name": "run(id)",
        "type": "(id: string) => CommandItem | null",
        "description": "Ejecuta el comando con ese id desde afuera (sin abrir)"
      }
    ],
    "interfaceCode": `export interface CommandItem {
    id: string;
    label: string;
    description?: string;
    category?: string;
    badges?: string[];
    icon?: string;
    shortcut?: string;
    action: () => void;
  }`
  },
  extras,
  sections: [
    {
      id: "basic",
      title: "Basic",
      badge: "[]",
      badgeTitle: "commands por defecto",
      description:
        "El palette arranca cerrado; abrirlo con open() o el botón. La búsqueda filtra por label y category, y admite navegación con flechas + Enter.",
      layout: "col",
      preview: BasicPreview,
      variants: [
        { id: "basic", props: { commands: BASIC_COMMANDS } },
        { id: "empty", props: { commands: [] } },
      ],
      vue: basicVue,
      vanilla: basicVanilla,
      checks: {
        l1: [
          {
            name: "renderiza el input de búsqueda con el placeholder por defecto",
            run({ wrapper, expect }) {
              const input = wrapper.find("input.cu-input");
              expect(input.exists()).toBe(true);
              expect(input.attributes("placeholder")).toBe("Buscar comandos…");
            },
          },
          {
            name: "lista un botón por comando con su label",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "basic") return;
              const commands = variant.props?.commands as CommandItem[];
              const items = wrapper.findAll(".cu-command-palette-item");
              expect(items).toHaveLength(commands.length);
              expect(items[0]!.text()).toContain(commands[0]!.label);
            },
          },
          {
            name: "sin comandos muestra el mensaje vacío y ningún item",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "empty") return;
              expect(wrapper.find(".cu-command-palette-empty").text()).toContain(
                "No se encontraron comandos",
              );
              expect(wrapper.findAll(".cu-command-palette-item")).toHaveLength(0);
            },
          },
          {
            name: "arranca cerrado y open()/close() cambian isOpen() y la visibilidad",
            async run({ wrapper, expect }) {
              const vm = wrapper.vm as unknown as {
                isOpen: () => boolean;
                open: () => void;
                close: () => void;
              };
              expect(vm.isOpen()).toBe(false);
              expect(wrapper.find(".cu-modal-backdrop").attributes("style") ?? "").toContain(
                "display: none",
              );

              vm.open();
              await flush();
              expect(vm.isOpen()).toBe(true);
              expect(wrapper.find(".cu-modal-backdrop").attributes("style") ?? "").not.toContain(
                "display: none",
              );

              vm.close();
              await flush();
              expect(vm.isOpen()).toBe(false);
            },
          },
          {
            name: "click en un comando ejecuta su action, emite select y cierra",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "basic") return;
              const vm = wrapper.vm as unknown as { open: () => void; isOpen: () => boolean };
              vm.open();
              await flush();
              actionLog.length = 0;
              await wrapper.find(".cu-command-palette-item").trigger("click");
              await flush();

              expect(actionLog).toEqual(["new"]);
              const selects = wrapper.emitted("select") as unknown[][];
              expect(selects).toBeTruthy();
              expect((selects[0]![0] as CommandItem).id).toBe("new");
              expect(vm.isOpen()).toBe(false);
              expect(wrapper.emitted("close")).toHaveLength(1);
            },
          },
          {
            name: "escribir filtra la lista y sin coincidencias muestra el vacío",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "basic") return;

              await wrapper.find("input.cu-input").setValue("nue");
              await flush();
              const filtered = wrapper.findAll(".cu-command-palette-item");
              expect(filtered).toHaveLength(1);
              expect(filtered[0]!.text()).toContain("Nuevo archivo");

              await wrapper.find("input.cu-input").setValue("zzz");
              await flush();
              expect(wrapper.findAll(".cu-command-palette-item")).toHaveLength(0);
              expect(wrapper.find(".cu-command-palette-empty").exists()).toBe(true);
            },
          },
          {
            name: "ArrowDown mueve el activo y Enter lo selecciona",
            async run({ wrapper, expect }, variant) {
              if (variant.id !== "basic") return;
              const palette = wrapper.find(".cu-command-palette");

              expect(wrapper.findAll(".cu-command-palette-item")[0]!.classes()).toContain(
                "cu-command-palette-item--active",
              );

              await palette.trigger("keydown", { key: "ArrowDown" });
              expect(wrapper.findAll(".cu-command-palette-item")[1]!.classes()).toContain(
                "cu-command-palette-item--active",
              );

              await palette.trigger("keydown", { key: "Enter" });
              const selects = wrapper.emitted("select") as unknown[][];
              expect(selects).toBeTruthy();
              expect((selects[0]![0] as CommandItem).id).toBe("open");
            },
          },
          {
            name: "getCommands() devuelve la lista y run(id) ejecuta sin abrir",
            run({ wrapper, expect }, variant) {
              if (variant.id !== "basic") return;
              const vm = wrapper.vm as unknown as {
                getCommands: () => CommandItem[];
                run: (id: string) => CommandItem | null;
                isOpen: () => boolean;
              };
              const commands = variant.props?.commands as CommandItem[];
              expect(vm.getCommands()).toHaveLength(commands.length);

              actionLog.length = 0;
              const cmd = vm.run("save");
              expect(cmd?.id).toBe("save");
              expect(actionLog).toEqual(["save"]);
              expect(wrapper.emitted("select")?.[0]?.[0]).toMatchObject({ id: "save" });
              expect(vm.isOpen()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "categories",
      title: "With Categories",
      badge: "category?",
      badgeTitle: "Campo opcional de CommandItem",
      layout: "col",
      preview: CategoriesPreview,
      variants: [{ id: "categories", props: { commands: CATEGORY_COMMANDS } }],
      vue: categoriesVue,
      vanilla: categoriesVanilla,
      checks: {
        l1: [
          {
            name: "renderiza una etiqueta por categoría en orden",
            run({ wrapper, expect }) {
              const labels = wrapper
                .findAll(".cu-command-palette-group-label")
                .map((el) => el.text());
              expect(labels).toEqual(["Archivo", "Edición", "Navegación"]);
            },
          },
          {
            name: "agrupa todos los comandos bajo su categoría",
            run({ wrapper, expect }, variant) {
              const commands = variant.props?.commands as CommandItem[];
              expect(wrapper.findAll(".cu-command-palette-item")).toHaveLength(commands.length);
            },
          },
          {
            name: "renderiza icono, descripción y badges del comando",
            run({ wrapper, expect }) {
              const first = wrapper.find(".cu-command-palette-item");
              expect(first.find(".cu-command-palette-item-icon").text()).toBe("📄");
              expect(first.find(".cu-command-palette-item-desc").text()).toBe(
                "Crear un archivo vacío",
              );
              expect(first.find(".cu-command-palette-item-badge").text()).toBe("Nuevo");
            },
          },
          {
            name: "la búsqueda también matchea por categoría",
            async run({ wrapper, expect }) {
              await wrapper.find("input.cu-input").setValue("Edición");
              await flush();
              const items = wrapper.findAll(".cu-command-palette-item");
              expect(items).toHaveLength(1);
              expect(items[0]!.text()).toContain("Deshacer");
            },
          },
        ],
      },
    },

    {
      id: "shortcuts",
      title: "With Shortcuts",
      badge: "shortcut?",
      badgeTitle: "Campo opcional de CommandItem",
      layout: "col",
      preview: ShortcutsPreview,
      variants: [{ id: "shortcuts", props: { commands: SHORTCUT_COMMANDS } }],
      vue: shortcutsVue,
      vanilla: shortcutsVanilla,
      checks: {
        l1: [
          {
            name: "renderiza el atajo de cada comando",
            run({ wrapper, expect }, variant) {
              const commands = variant.props?.commands as CommandItem[];
              const shortcuts = wrapper
                .findAll(".cu-command-palette-item-shortcut")
                .map((el) => el.text());
              expect(shortcuts).toEqual(commands.map((c) => c.shortcut));
            },
          },
          {
            name: "renderiza el icono junto al label",
            run({ wrapper, expect }) {
              const first = wrapper.find(".cu-command-palette-item");
              expect(first.find(".cu-command-palette-item-icon").text()).toBe("📄");
              expect(first.find(".cu-command-palette-item-label").text()).toBe("Nuevo archivo");
            },
          },
        ],
      },
    },

    {
      id: "header",
      title: "Header & Color",
      badge: "neutral",
      badgeTitle: "Color por defecto",
      layout: "col",
      preview: HeaderPreview,
      variants: [
        { id: "default", props: {} },
        { id: "titled", props: { title: "Comandos", placeholder: "Escribí un comando…" } },
        { id: "colored", props: { color: "primary", title: "Primary" } },
      ],
      vue: headerVue,
      vanilla: headerVanilla,
      checks: {
        l1: [
          {
            name: "propaga el placeholder al input de búsqueda",
            run({ wrapper, expect }, variant) {
              const expected = (variant.props?.placeholder as string) ?? "Buscar comandos…";
              expect(wrapper.find("input.cu-input").attributes("placeholder")).toBe(expected);
            },
          },
          {
            name: "muestra el title en el header del modal",
            run({ wrapper, expect }, variant) {
              if (!variant.props?.title) return;
              expect(wrapper.find(".cu-modal-title").text()).toBe(String(variant.props?.title));
            },
          },
          {
            name: "resuelve --modal-color al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              const color = (variant.props?.color as string) ?? "neutral";
              expect(wrapper.find(".cu-modal").attributes("style")).toContain(
                `--modal-color: var(--cu-color-${color})`,
              );
            },
          },
        ],
      },
    },

    {
      id: "sizes",
      title: "Sizes",
      badge: "auto",
      badgeTitle: "Tamaño por defecto",
      layout: "col",
      preview: SizesPreview,
      variants: [
        ...SIZES.map<Variant>((size) => ({ id: `size-${size}`, props: { size } })),
        ...HEIGHTS.map<Variant>((height) => ({ id: `height-${height}`, props: { height } })),
      ],
      vue: sizesVue,
      vanilla: sizesVanilla,
      checks: {
        l1: [
          {
            name: "propaga size al data-size del Modal",
            run({ wrapper, expect }, variant) {
              const size = (variant.props?.size as string) ?? "auto";
              expect(wrapper.find(".cu-modal").attributes("data-size")).toBe(size);
            },
          },
          {
            name: "propaga height al data-height del Modal",
            run({ wrapper, expect }, variant) {
              const height = (variant.props?.height as string) ?? "auto";
              expect(wrapper.find(".cu-modal").attributes("data-height")).toBe(height);
            },
          },
        ],
      },
    },
  ],
};
