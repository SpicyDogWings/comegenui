<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import { getTokenDescription } from '@/config/css-tokens';
import Button from "@/components/buttons/Button.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import Table from "@/components/data/Table.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
import { ref } from "vue";

const menuRef = ref<InstanceType<typeof DropdownMenu> | null>(null);
const progIsOpen = ref(false);

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Positions', id: 'positions' },
  { label: 'Aligns', id: 'aligns' },
  { label: 'With Icons', id: 'icons' },
  { label: 'Dividers', id: 'dividers' },
  { label: 'Disabled Items', id: 'disabled' },
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
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
      { label: 'Interfaces', id: 'api-interfaces' },
    ],
  },
];

const basicItems = [
  { label: "Edit", onClick: () => console.log("edit") },
  { label: "Duplicate", onClick: () => console.log("duplicate") },
  { label: "Archive", onClick: () => console.log("archive") },
];

const iconItems = [
  { label: "Copy", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/></svg>', onClick: () => {} },
  { label: "Download", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>', onClick: () => {} },
  { label: "Delete", icon: '<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>', color: "danger", onClick: () => {} },
];

const dividerItems = [
  { label: "Cut", onClick: () => {} },
  { label: "Copy", onClick: () => {} },
  { divider: true },
  { label: "Paste", onClick: () => {} },
];

const disabledItems = [
  { label: "Enabled", onClick: () => console.log("enabled") },
  { label: "Disabled", disabled: true, onClick: () => {} },
  { label: "Also Enabled", onClick: () => console.log("also enabled") },
];

// ── Snippets Vue ──

const vueImport = `<script setup>
import DropdownMenu from '@/components/controls/DropdownMenu.vue'

const items = [
  { label: 'Edit' },
  { label: 'Duplicate' },
  { label: 'Archive' },
]
<\/script>`;

const vueSnippet = (body: string) => `${vueImport}

<template>
${body}
</template>`;

const variantsVue = vueSnippet(`  <DropdownMenu variant="solid" label="Solid" :items="items" />
  <DropdownMenu variant="soft" label="Soft" :items="items" />
  <DropdownMenu variant="ghost" label="Ghost" :items="items" />
  <DropdownMenu variant="outlined" label="Outlined" :items="items" />
  <DropdownMenu variant="subtle" label="Subtle" :items="items" />`);

const colorsVue = vueSnippet(`  <DropdownMenu color="primary" label="Primary" :items="items" />
  <DropdownMenu color="secondary" label="Secondary" :items="items" />
  <DropdownMenu color="neutral" label="Neutral" :items="items" />
  <DropdownMenu color="success" label="Success" :items="items" />
  <DropdownMenu color="warning" label="Warning" :items="items" />
  <DropdownMenu color="danger" label="Danger" :items="items" />`);

const positionsVue = vueSnippet(`  <DropdownMenu label="Bottom" position="bottom" :items="items" />
  <DropdownMenu label="Top" position="top" :items="items" />
  <DropdownMenu label="Left" position="left" :items="items" />
  <DropdownMenu label="Right" position="right" :items="items" />`);

const alignsVue = vueSnippet(`  <DropdownMenu label="Start" align="start" :items="items" />
  <DropdownMenu label="Center" align="center" :items="items" />
  <DropdownMenu label="End" align="end" :items="items" />`);

const iconsVue = `<script setup>
import DropdownMenu from '@/components/controls/DropdownMenu.vue'

const items = [
  { label: 'Copy', icon: '<svg ...></svg>' },
  { label: 'Download', icon: '<svg ...></svg>' },
  { label: 'Delete', icon: '<svg ...></svg>', color: 'danger' },
]
<\/script>

<template>
  <DropdownMenu label="File Actions" :items="items" />
</template>`;

const dividersVue = `<script setup>
import DropdownMenu from '@/components/controls/DropdownMenu.vue'

const items = [
  { label: 'Cut' },
  { label: 'Copy' },
  { divider: true },
  { label: 'Paste' },
]
<\/script>

<template>
  <DropdownMenu label="Edit Menu" :items="items" />
</template>`;

const disabledItemsVue = `<script setup>
import DropdownMenu from '@/components/controls/DropdownMenu.vue'

const items = [
  { label: 'Enabled' },
  { label: 'Disabled', disabled: true },
  { label: 'Also Enabled' },
]
<\/script>

<template>
  <DropdownMenu label="Mixed" :items="items" />
</template>`;

const programmaticVue = `<script setup>
import { ref } from 'vue'
import DropdownMenu from '@/components/controls/DropdownMenu.vue'
import Button from '@/components/buttons/Button.vue'

const menuRef = ref(null)
const isOpen = ref(false)

function logState() {
  console.log('isOpen():', menuRef.value.isOpen())
}
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="menuRef?.open(); isOpen = true">open()</Button>
      <Button color="neutral" @click="menuRef?.close(); isOpen = false">close()</Button>
      <Button color="neutral" @click="menuRef?.toggle(); logState()">toggle()</Button>
    </div>
    <DropdownMenu ref="menuRef" label="Menú programático" :items="items" @open="isOpen = true" @close="isOpen = false" />
  </div>
</template>`;

// ── Snippets Vanilla ──

const dropdownImportVanilla = `<script src="dist/CuDropdown-menu.umd.js"><\/script>`;

const itemsAssignVanilla = `    menu.items = [
      { label: 'Edit' },
      { label: 'Duplicate' },
      { label: 'Archive' },
    ];`;

const variantsVanilla = `${dropdownImportVanilla}

<cu-dropdown-menu id="menu-solid" label="Solid"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-soft" label="Soft"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-ghost" label="Ghost"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-outlined" label="Outlined"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-subtle" label="Subtle"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    ['menu-solid', 'menu-soft', 'menu-ghost', 'menu-outlined', 'menu-subtle'].forEach((id) => {
      const menu = document.getElementById(id);
      ${itemsAssignVanilla}
    });
  });
<\/script>`;

const colorsVanilla = `${dropdownImportVanilla}

<cu-dropdown-menu id="menu-primary" color="primary" label="Primary"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-secondary" color="secondary" label="Secondary"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-neutral" color="neutral" label="Neutral"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-success" color="success" label="Success"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-warning" color="warning" label="Warning"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-danger" color="danger" label="Danger"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    ['menu-primary', 'menu-secondary', 'menu-neutral', 'menu-success', 'menu-warning', 'menu-danger'].forEach((id) => {
      const menu = document.getElementById(id);
      ${itemsAssignVanilla}
    });
  });
<\/script>`;

const positionsVanilla = `${dropdownImportVanilla}

<cu-dropdown-menu id="menu-bottom" label="Bottom"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-top" label="Top" position="top"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-left" label="Left" position="left"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-right" label="Right" position="right"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    ['menu-bottom', 'menu-top', 'menu-left', 'menu-right'].forEach((id) => {
      const menu = document.getElementById(id);
      ${itemsAssignVanilla}
    });
  });
<\/script>`;

const alignsVanilla = `${dropdownImportVanilla}

<cu-dropdown-menu id="menu-start" label="Start"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-center" label="Center" align="center"></cu-dropdown-menu>
<cu-dropdown-menu id="menu-end" label="End" align="end"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    ['menu-start', 'menu-center', 'menu-end'].forEach((id) => {
      const menu = document.getElementById(id);
      ${itemsAssignVanilla}
    });
  });
<\/script>`;

const iconsVanilla = `${dropdownImportVanilla}

<cu-dropdown-menu id="menu-icons" label="File Actions"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    document.getElementById('menu-icons').items = [
      { label: 'Copy', icon: '<svg ...></svg>' },
      { label: 'Download', icon: '<svg ...></svg>' },
      { label: 'Delete', icon: '<svg ...></svg>', color: 'danger' },
    ];
  });
<\/script>`;

const dividersVanilla = `${dropdownImportVanilla}

<cu-dropdown-menu id="menu-dividers" label="Edit Menu"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    document.getElementById('menu-dividers').items = [
      { label: 'Cut' },
      { label: 'Copy' },
      { divider: true },
      { label: 'Paste' },
    ];
  });
<\/script>`;

const disabledItemsVanilla = `${dropdownImportVanilla}

<cu-dropdown-menu id="menu-disabled" label="Mixed"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    document.getElementById('menu-disabled').items = [
      { label: 'Enabled' },
      { label: 'Disabled', disabled: true },
      { label: 'Also Enabled' },
    ];
  });
<\/script>`;

const programmaticVanilla = `${dropdownImportVanilla}
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="menu-prog-open">open()</cu-button>
  <cu-button id="menu-prog-close">close()</cu-button>
  <cu-button id="menu-prog-toggle">toggle()</cu-button>
</div>

<cu-dropdown-menu id="menu-prog" label="Menú programático"></cu-dropdown-menu>

<script>
  customElements.whenDefined('cu-dropdown-menu').then(() => {
    const menu = document.getElementById('menu-prog');
    ${itemsAssignVanilla}
    document.getElementById('menu-prog-open').addEventListener('click', () => menu.open());
    document.getElementById('menu-prog-close').addEventListener('click', () => menu.close());
    document.getElementById('menu-prog-toggle').addEventListener('click', () => {
      menu.toggle();
      console.log('isOpen():', menu.isOpen());
    });
    menu.addEventListener('open', () => console.log('open'));
    menu.addEventListener('close', () => console.log('close'));
  });
<\/script>`;

const styleColumns = [
  { key: 'name', label: 'Variable' },
  { key: 'description', label: 'Uso' },
];

const dropdownmenu_tokens = [
  '--cu-border-color',
  '--cu-border-thin',
  '--cu-space-md',
  '--cu-space-xs',
];

const styleData = dropdownmenu_tokens.map(name => ({ name, description: getTokenDescription(name) }));

const componentDeps = [{ label: 'Dropdown', path: '/playground/components/dropdown' }, { label: 'Button', path: '/playground/components/button' }];

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"ghost"', description: 'solid, outlined, soft, ghost, subtle, link, none' },
  { name: 'disabled', type: 'boolean', default: 'false', description: 'Deshabilita el trigger' },
  { name: 'label', type: 'string', default: '""', description: 'Texto del trigger (si no hay slot)' },
  { name: 'position', type: 'string', default: '"bottom"', description: 'bottom, top, left, right' },
  { name: 'align', type: 'string', default: '"start"', description: 'start, center, end' },
  { name: 'textAlign', type: 'string', default: '"left"', description: 'Alineación del texto de los items' },
  { name: 'offset', type: 'number', default: '4', description: 'Separación del panel (px)' },
  { name: 'fixed', type: 'boolean', default: 'false', description: 'Panel position: fixed (viewport)' },
  { name: 'items', type: 'DropdownItem[]', default: '[]', description: 'Items del menú' },
];

const slotsData: { name: string; description: string }[] = [];

const eventsData = [
  { name: 'open', type: '() => void', description: 'Se abre el panel' },
  { name: 'close', type: '() => void', description: 'Se cierra el panel' },
];

const exposesData = [
  { name: 'open', type: '() => void', description: 'Abre el panel' },
  { name: 'close', type: '() => void', description: 'Cierra el panel' },
  { name: 'toggle', type: '() => void', description: 'Abre/cierra el panel' },
  { name: 'isOpen', type: '() => boolean', description: 'Estado del panel' },
];

const interfaceCode = `interface DropdownItem {
  label?: string
  icon?: string
  href?: string
  onClick?: () => void
  color?: string
  variant?: string
  disabled?: boolean
  divider?: boolean
  target?: string
}`;
</script>

<template>
  <PlaygroundLayout title="DropdownMenu" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <div class="playground-heading">
          <h2>Variants</h2>
          <Badge color="neutral" title="Variante por defecto">ghost</Badge>
        </div>
        <Button variant="link" to="#api-interfaces">Ver interfaz DropdownItem ↓</Button>
        <SectionDemo :vue-code="variantsVue" :vanilla-code="variantsVanilla">
          <div class="playground-row">
            <DropdownMenu variant="solid" label="Solid" :items="basicItems" />
            <DropdownMenu variant="soft" label="Soft" :items="basicItems" />
            <DropdownMenu variant="ghost" label="Ghost" :items="basicItems" />
            <DropdownMenu variant="outlined" label="Outlined" :items="basicItems" />
            <DropdownMenu variant="subtle" label="Subtle" :items="basicItems" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Color por defecto">neutral</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-row">
            <DropdownMenu color="primary" label="Primary" :items="basicItems" />
            <DropdownMenu color="secondary" label="Secondary" :items="basicItems" />
            <DropdownMenu color="neutral" label="Neutral" :items="basicItems" />
            <DropdownMenu color="success" label="Success" :items="basicItems" />
            <DropdownMenu color="warning" label="Warning" :items="basicItems" />
            <DropdownMenu color="danger" label="Danger" :items="basicItems" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="positions" class="playground-section">
        <div class="playground-heading">
          <h2>Positions</h2>
          <Badge color="neutral" title="Posición por defecto">bottom</Badge>
        </div>
        <SectionDemo :vue-code="positionsVue" :vanilla-code="positionsVanilla">
          <div class="playground-row">
            <DropdownMenu label="Bottom" position="bottom" :items="basicItems" />
            <DropdownMenu label="Top" position="top" :items="basicItems" />
            <DropdownMenu label="Left" position="left" :items="basicItems" />
            <DropdownMenu label="Right" position="right" :items="basicItems" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="aligns" class="playground-section">
        <div class="playground-heading">
          <h2>Aligns</h2>
          <Badge color="neutral" title="Alineación por defecto">start</Badge>
        </div>
        <SectionDemo :vue-code="alignsVue" :vanilla-code="alignsVanilla">
          <div class="playground-row">
            <DropdownMenu label="Start" align="start" :items="basicItems" />
            <DropdownMenu label="Center" align="center" :items="basicItems" />
            <DropdownMenu label="End" align="end" :items="basicItems" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="icons" class="playground-section">
        <div class="playground-heading">
          <h2>With Icons</h2>
        </div>
        <SectionDemo :vue-code="iconsVue" :vanilla-code="iconsVanilla">
          <div class="playground-row">
            <DropdownMenu label="File Actions" :items="iconItems" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="dividers" class="playground-section">
        <div class="playground-heading">
          <h2>With Dividers</h2>
        </div>
        <SectionDemo :vue-code="dividersVue" :vanilla-code="dividersVanilla">
          <div class="playground-row">
            <DropdownMenu label="Edit Menu" :items="dividerItems" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <div class="playground-heading">
          <h2>Disabled Items</h2>
        </div>
        <SectionDemo :vue-code="disabledItemsVue" :vanilla-code="disabledItemsVanilla">
          <div class="playground-row">
            <DropdownMenu label="Mixed" :items="disabledItems" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — el panel abre acá al lado.
        </p>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="menuRef?.open(); progIsOpen = true">open()</Button>
              <Button color="neutral" @click="menuRef?.close(); progIsOpen = false">close()</Button>
              <Button color="neutral" @click="menuRef?.toggle(); progIsOpen = menuRef?.isOpen() ?? false">toggle()</Button>
            </div>
            <p class="playground-state">
              isOpen(): <strong>{{ progIsOpen ? 'true' : 'false' }}</strong>
            </p>
            <DropdownMenu ref="menuRef" label="Menú programático" :items="basicItems" @open="progIsOpen = true" @close="progIsOpen = false" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="style" class="playground-section">
        <h2>Style</h2>

        <h3 id="style-variables">CSS Variables</h3>
        <Table :columns="styleColumns" :data="styleData" variant="ghost" compact />

        <h4>Sub-componentes con estilos propios</h4>
        <ul class="playground-component-links">
          <li><a href="/playground/components/dropdown" class="playground-component-link">Dropdown</a> — revisá sus variables CSS en su propia sección Style</li>
          <li><a href="/playground/components/button" class="playground-component-link">Button</a> — revisá sus variables CSS en su propia sección Style</li>
        </ul>
      </section>

      <hr class="playground-separator" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-components">Components</h3>
        <p class="playground-desc">
          Este componente usa los siguientes sub-componentes:
        </p>
        <ul class="playground-component-links">
          <li v-for="dep in [{ label: 'Dropdown', path: '/playground/components/dropdown' }, { label: 'Button', path: '/playground/components/button' }]" :key="dep.label">
            <a :href="dep.path" class="playground-component-link">{ dep.label }</a>
          </li>
        </ul>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" empty="No tiene slots" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" variant="ghost" compact />

        <h3 id="api-interfaces">Interfaces</h3>
        <CodeBlock :code="interfaceCode" language="ts" variant="solid" />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.playground-desc {
  margin: 0;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

.playground-state {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  margin: 0;
}
</style>
