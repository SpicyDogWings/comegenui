<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Button from "@/components/buttons/Button.vue";
import CodeBlock from "@/components/markdown/CodeBlock.vue";
import Table from "@/components/data/Table.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
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
const programmaticVue = `<script setup>
import { ref } from 'vue'
import DropdownMenu from '@/components/controls/DropdownMenu.vue'
import Button from '@/components/buttons/Button.vue'

const menuRef = ref(null)
const isOpen = ref(false)

function logState() {
  console.log('isOpen():', menuRef.value.isOpen())
}
\/script>

<template>
  <Button color="neutral" @click="menuRef.open(); isOpen = true">open()</Button>
  <Button color="neutral" @click="menuRef.close(); isOpen = false">close()</Button>
  <Button color="neutral" @click="menuRef.toggle(); logState()">toggle()</Button>
  <DropdownMenu ref="menuRef" label="Menú programático" :items="basicItems" @open="isOpen = true" @close="isOpen = false" />
</template>`;

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
        <h2>Variants</h2>
        <Button variant="link" to="#api-interfaces">Ver interfaz DropdownItem ↓</Button>
        <div class="playground-row">
          <DropdownMenu variant="solid" label="Solid" :items="basicItems" />
          <DropdownMenu variant="soft" label="Soft" :items="basicItems" />
          <DropdownMenu variant="ghost" label="Ghost" :items="basicItems" />
          <DropdownMenu variant="outlined" label="Outlined" :items="basicItems" />
          <DropdownMenu variant="subtle" label="Subtle" :items="basicItems" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="playground-row">
          <DropdownMenu color="primary" label="Primary" :items="basicItems" />
          <DropdownMenu color="secondary" label="Secondary" :items="basicItems" />
          <DropdownMenu color="neutral" label="Neutral" :items="basicItems" />
          <DropdownMenu color="success" label="Success" :items="basicItems" />
          <DropdownMenu color="warning" label="Warning" :items="basicItems" />
          <DropdownMenu color="danger" label="Danger" :items="basicItems" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="positions" class="playground-section">
        <h2>Positions</h2>
        <div class="playground-row">
          <DropdownMenu label="Bottom" position="bottom" :items="basicItems" />
          <DropdownMenu label="Top" position="top" :items="basicItems" />
          <DropdownMenu label="Left" position="left" :items="basicItems" />
          <DropdownMenu label="Right" position="right" :items="basicItems" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="aligns" class="playground-section">
        <h2>Aligns</h2>
        <div class="playground-row">
          <DropdownMenu label="Start" align="start" :items="basicItems" />
          <DropdownMenu label="Center" align="center" :items="basicItems" />
          <DropdownMenu label="End" align="end" :items="basicItems" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="icons" class="playground-section">
        <h2>With Icons</h2>
        <DropdownMenu label="File Actions" :items="iconItems" />
      </section>

      <hr class="playground-separator" />

      <section id="dividers" class="playground-section">
        <h2>With Dividers</h2>
        <DropdownMenu label="Edit Menu" :items="dividerItems" />
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <h2>Disabled Items</h2>
        <DropdownMenu label="Mixed" :items="disabledItems" />
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — el panel abre acá al lado.
        </p>
        <SectionDemo :vue-code="programmaticVue">
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

      <section id="api" class="playground-section">
        <h2>API</h2>

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
