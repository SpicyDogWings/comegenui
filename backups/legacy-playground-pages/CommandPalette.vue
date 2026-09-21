<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Badge from "@/components/information/Badge.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import CommandPalette, { type CommandItem } from "@/components/overlay/CommandPalette.vue";

const outlineItems = [
  { label: 'Basic', id: 'basic' },
  { label: 'With Categories', id: 'categories' },
  { label: 'With Shortcuts', id: 'shortcuts' },
  { label: 'Programmatic', id: 'programmatic' },
  {
    label: 'Style',
    id: 'style',
    children: [
      { label: 'CSS Variables', id: 'style-variables' },
    ],
  },
  {
    label: 'API',
    id: 'api',
    children: [
      { label: 'Components', id: 'api-components' },
      { label: 'Props', id: 'api-props' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
      { label: 'Interfaces', id: 'api-interfaces' },
    ],
  },
];

const componentTokens = [
  '--cu-font-sans',
  '--cu-font-mono',
  '--cu-font-size-xs',
  '--cu-font-size-sm',
  '--cu-radius-sm',
  '--cu-border-thin',
  '--cu-border-color',
  '--cu-color-neutral',
  '--cu-color-neutral-ghost-hover',
  '--cu-color-surface',
];

const componentDeps = [
  { label: 'Modal', path: '/playground/components/modal' },
  { label: 'Input', path: '/playground/components/input' },
  { label: 'Badge', path: '/playground/components/badge' },
];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'title', type: 'string', default: '""', description: 'Título del modal' },
  { name: 'placeholder', type: 'string', default: '"Buscar comandos…"', description: 'Texto del input de búsqueda' },
  { name: 'size', type: 'string', default: '"auto"', description: 'auto, sm, md, lg, xl, full' },
  { name: 'height', type: 'string', default: '"auto"', description: 'auto, sm, md, lg, xl, full' },
  { name: 'commands', type: 'CommandItem[]', default: '[]', description: 'Lista de comandos (ver interfaz)' },
];

const eventsData = [
  { name: 'select', type: '(cmd: CommandItem) => void', description: 'Se seleccionó un comando' },
  { name: 'close', type: '() => void', description: 'Se cerró el palette' },
];

const exposesData = [
  { name: 'open()', type: '() => void', description: 'Abre el command palette' },
  { name: 'close()', type: '() => void', description: 'Cierra el command palette' },
  { name: 'run(id)', type: '(id: string) => CommandItem | null', description: 'Ejecuta el comando con ese id desde afuera (sin abrir)' },
  { name: 'getCommands()', type: '() => CommandItem[]', description: 'Devuelve la lista actual de comandos' },
  { name: 'isOpen()', type: '() => boolean', description: 'Estado actual' },
];

const interfaceCode = `interface CommandItem {
  id: string;
  label: string;
  description?: string;
  category?: string;
  badges?: string[];
  icon?: string;
  shortcut?: string;
  action: () => void;
}`;

const basicCommands: CommandItem[] = [
  { id: 'new', label: 'Nuevo archivo', action: () => {} },
  { id: 'open', label: 'Abrir archivo', action: () => {} },
  { id: 'save', label: 'Guardar', action: () => {} },
  { id: 'close', label: 'Cerrar', action: () => {} },
];

const categoryCommands: CommandItem[] = [
  { id: 'new', label: 'Nuevo archivo', description: 'Crear un archivo vacío', category: 'Archivo', icon: '📄', badges: ['Nuevo'], action: () => {} },
  { id: 'open', label: 'Abrir archivo', description: 'Abrir un archivo existente', category: 'Archivo', icon: '📂', badges: ['Reciente'], action: () => {} },
  { id: 'save', label: 'Guardar', description: 'Guardar cambios actuales', category: 'Archivo', icon: '💾', badges: ['Auto', 'Ctrl+S'], shortcut: 'Ctrl+S', action: () => {} },
  { id: 'undo', label: 'Deshacer', description: 'Revertir última acción', category: 'Edición', icon: '↩️', badges: ['Edit', 'Undo'], action: () => {} },
  { id: 'redo', label: 'Rehacer', description: 'Reaplicar acción deshecha', category: 'Edición', icon: '↪️', badges: ['Edit'], action: () => {} },
  { id: 'copy', label: 'Copiar', description: 'Copiar selección al portapapeles', category: 'Edición', icon: '📋', badges: ['Clipboard'], action: () => {} },
  { id: 'paste', label: 'Pegar', description: 'Pegar desde el portapapeles', category: 'Edición', icon: '📌', badges: ['Clipboard'], action: () => {} },
  { id: 'find', label: 'Buscar', description: 'Buscar texto en el archivo', category: 'Navegación', icon: '🔍', badges: ['Go'], action: () => {} },
  { id: 'replace', label: 'Reemplazar', description: 'Buscar y reemplazar texto', category: 'Navegación', icon: '🔄', badges: ['Go', 'Replace'], action: () => {} },
];

const shortcutCommands: CommandItem[] = [
  { id: 'new', label: 'Nuevo archivo', icon: '📄', shortcut: 'Ctrl+N', action: () => {} },
  { id: 'open', label: 'Abrir archivo', icon: '📂', shortcut: 'Ctrl+O', action: () => {} },
  { id: 'save', label: 'Guardar', icon: '💾', shortcut: 'Ctrl+S', action: () => {} },
  { id: 'find', label: 'Buscar', icon: '🔍', shortcut: 'Ctrl+F', action: () => {} },
  { id: 'palette', label: 'Command Palette', icon: '⌨️', shortcut: 'Ctrl+K', action: () => {} },
];

const basicRef = ref<InstanceType<typeof CommandPalette> | null>(null);
const categoriesRef = ref<InstanceType<typeof CommandPalette> | null>(null);
const shortcutsRef = ref<InstanceType<typeof CommandPalette> | null>(null);
const programmaticRef = ref<InstanceType<typeof CommandPalette> | null>(null);
const selectedCmd = ref<CommandItem | null>(null);

const programmaticCommands: CommandItem[] = [
  { id: 'new', label: 'Nuevo archivo', description: 'Crea un archivo vacío', category: 'Archivo', icon: '📄', action: () => { selectedCmd.value = { id: 'new', label: 'Nuevo archivo', action: () => {} }; } },
  { id: 'save', label: 'Guardar', description: 'Guarda los cambios', category: 'Archivo', icon: '💾', action: () => { selectedCmd.value = { id: 'save', label: 'Guardar', action: () => {} }; } },
  { id: 'find', label: 'Buscar', description: 'Busca en el archivo', category: 'Navegación', icon: '🔍', action: () => { selectedCmd.value = { id: 'find', label: 'Buscar', action: () => {} }; } },
];

function handleGlobalShortcut(event: KeyboardEvent) {
  if (event.ctrlKey && event.shiftKey && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    programmaticRef.value?.open();
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleGlobalShortcut);
});
onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleGlobalShortcut);
});

const basicVue = `<script setup>
import { ref } from 'vue'
import CommandPalette from '@/components/overlay/CommandPalette.vue'
import Button from '@/components/buttons/Button.vue'

const paletteRef = ref(null)

const commands = [
  { id: 'new', label: 'Nuevo archivo', action: () => {} },
  { id: 'open', label: 'Abrir archivo', action: () => {} },
  { id: 'save', label: 'Guardar', action: () => {} },
]
<\/script>

<template>
  <Button @click="paletteRef?.open()">Abrir Command Palette</Button>
  <CommandPalette ref="paletteRef" :commands="commands" />
</template>`;
const basicVanilla = `<link rel="stylesheet" href="css/themes.css">
<script src="CuCommandPalette.umd.js"><\/script>

<button onclick="document.querySelector('cu-command-palette').open()">
  Abrir Command Palette
</button>

<cu-command-palette id="my-palette"></cu-command-palette>

<script>
  const palette = document.querySelector('#my-palette')
  palette.commands = [
    { id: 'new', label: 'Nuevo archivo', action: () => {} },
    { id: 'open', label: 'Abrir archivo', action: () => {} },
  ]
  palette.addEventListener('select', (e) => console.log('Selected:', e.detail))
<\/script>`;

const categoriesVue = `<script setup>
const commands = [
  { id: 'new', label: 'Nuevo archivo', category: 'Archivo', action: () => {} },
  { id: 'save', label: 'Guardar', category: 'Archivo', action: () => {} },
  { id: 'undo', label: 'Deshacer', category: 'Edición', action: () => {} },
  { id: 'find', label: 'Buscar', category: 'Navegación', action: () => {} },
]
<\/script>

<template>
  <CommandPalette :commands="commands" />
</template>`;
const categoriesVanilla = `<cu-command-palette id="my-palette"></cu-command-palette>

<script>
  document.querySelector('#my-palette').commands = [
    { id: 'new', label: 'Nuevo archivo', category: 'Archivo', action: () => {} },
    { id: 'save', label: 'Guardar', category: 'Archivo', action: () => {} },
    { id: 'undo', label: 'Deshacer', category: 'Edición', action: () => {} },
  ]
<\/script>`;

const shortcutsVue = `<script setup>
const commands = [
  { id: 'new', label: 'Nuevo archivo', shortcut: 'Ctrl+N', action: () => {} },
  { id: 'save', label: 'Guardar', shortcut: 'Ctrl+S', action: () => {} },
  { id: 'find', label: 'Buscar', shortcut: 'Ctrl+F', action: () => {} },
]
<\/script>

<template>
  <CommandPalette :commands="commands" />
</template>`;
const shortcutsVanilla = `<cu-command-palette id="my-palette"></cu-command-palette>

<script>
  document.querySelector('#my-palette').commands = [
    { id: 'new', label: 'Nuevo archivo', shortcut: 'Ctrl+N', action: () => {} },
    { id: 'save', label: 'Guardar', shortcut: 'Ctrl+S', action: () => {} },
  ]
<\/script>`;

const programmaticVue = `<script setup>
import { ref } from 'vue'
import CommandPalette from '@/components/overlay/CommandPalette.vue'
import Button from '@/components/buttons/Button.vue'

const paletteRef = ref(null)
const selected = ref(null)

const commands = [
  { id: 'new', label: 'Nuevo archivo', action: () => { selected.value = 'new' } },
  { id: 'save', label: 'Guardar', action: () => { selected.value = 'save' } },
  { id: 'find', label: 'Buscar', action: () => { selected.value = 'find' } },
]
<\/script>

<template>
  <div class="playground-row">
    <Button color="neutral" @click="paletteRef?.open()">open()</Button>
    <Button color="neutral" @click="paletteRef?.close()">close()</Button>
    <Button color="primary" variant="soft" @click="paletteRef?.run('new')">run('new')</Button>
    <Button color="primary" variant="soft" @click="paletteRef?.run('save')">run('save')</Button>
  </div>
  <p class="playground-state">
    Selected: <strong>{{ selected ?? '—' }}</strong>
  </p>
  <CommandPalette
    ref="paletteRef"
    :commands="commands"
    @select="selected = $event?.id"
  />
</template>`;
</script>

<template>
  <PlaygroundLayout title="CommandPalette" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="basic" class="playground-section">
        <div class="playground-heading">
          <h2>Basic</h2>
          <Badge color="neutral" title="Valor por defecto">[]</Badge>
        </div>
        <SectionDemo :vue-code="basicVue" :vanilla-code="basicVanilla">
          <div class="playground-col">
            <Button @click="basicRef?.open()">Abrir Command Palette</Button>
            <Button variant="link" to="#api-interfaces">Ver interfaz CommandItem ↓</Button>
            <CommandPalette ref="basicRef" :commands="basicCommands" @select="selectedCmd = $event" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="categories" class="playground-section">
        <div class="playground-heading">
          <h2>With Categories</h2>
          <Badge color="neutral" title="Campo de CommandItem, opcional">category?</Badge>
        </div>
        <SectionDemo :vue-code="categoriesVue" :vanilla-code="categoriesVanilla">
          <div class="playground-col">
            <Button @click="categoriesRef?.open()">Abrir con Categorías</Button>
            <CommandPalette ref="categoriesRef" :commands="categoryCommands" @select="selectedCmd = $event" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="shortcuts" class="playground-section">
        <div class="playground-heading">
          <h2>With Shortcuts</h2>
          <Badge color="neutral" title="Campo de CommandItem, opcional">shortcut?</Badge>
        </div>
        <SectionDemo :vue-code="shortcutsVue" :vanilla-code="shortcutsVanilla">
          <div class="playground-col">
            <Button @click="shortcutsRef?.open()">Abrir con Atajos</Button>
            <CommandPalette ref="shortcutsRef" :commands="shortcutCommands" @select="selectedCmd = $event" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <h2>Programmatic</h2>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — el palette cambia en vivo.
          También podés convocarlo con <strong>Ctrl+Shift+K</strong>
          (Ctrl+Shift+P lo reserva el navegador para incógnito).
        </p>
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="programmaticRef?.open()">open()</Button>
              <Button color="neutral" @click="programmaticRef?.close()">close()</Button>
              <Button color="primary" variant="soft" @click="programmaticRef?.run('new')">run('new')</Button>
              <Button color="primary" variant="soft" @click="programmaticRef?.run('save')">run('save')</Button>
              <Button color="primary" variant="soft" @click="programmaticRef?.run('find')">run('find')</Button>
            </div>
            <p class="playground-state">
              Selected: <strong>{{ selectedCmd?.label ?? '—' }}</strong>
            </p>
            <CommandPalette
              ref="programmaticRef"
              :commands="programmaticCommands"
              @select="selectedCmd = $event"
            />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <PlaygroundStyle :tokens="componentTokens" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <PlaygroundApiComponents :deps="componentDeps" />

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" variant="ghost" compact />

        <h3 id="api-interfaces">Interfaces</h3>
        <p class="playground-desc">
          Estructura del <code>CommandItem</code> usado en la prop
          <code>commands</code>.
        </p>
        <CodeBlock :code="interfaceCode" language="ts" />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style>
.playground-desc {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral-text);
  opacity: 0.7;
  margin-bottom: 1rem;
}

.playground-state {
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
  margin: 0;
}

.playground-row {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}
</style>
