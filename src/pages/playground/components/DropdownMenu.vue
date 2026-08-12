<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import DropdownMenu from "@/components/controls/DropdownMenu.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Positions', id: 'positions' },
  { label: 'Aligns', id: 'aligns' },
  { label: 'With Icons', id: 'icons' },
  { label: 'Dividers', id: 'dividers' },
  { label: 'Disabled Items', id: 'disabled' },
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
</script>

<template>
  <PlaygroundLayout title="DropdownMenu" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
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
    </div>
  </PlaygroundLayout>
</template>
