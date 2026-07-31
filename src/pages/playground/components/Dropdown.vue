<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Dropdown from "@/components/Dropdown.vue";
import Button from "@/components/buttons/Button.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Positions', id: 'positions' },
  { label: 'Aligns', id: 'aligns' },
  { label: 'Fixed', id: 'fixed' },
  { label: 'Disabled', id: 'disabled' },
];


</script>

<template>
  <PlaygroundLayout title="Dropdown" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <div class="playground-row">
          <Dropdown label="Solid" variant="solid">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
          </Dropdown>
          <Dropdown label="Soft" variant="soft">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
          </Dropdown>
          <Dropdown label="Ghost" variant="ghost">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
          </Dropdown>
          <Dropdown label="Outlined" variant="outlined">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
          </Dropdown>
          <Dropdown label="Subtle" variant="subtle">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
          </Dropdown>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="playground-row">
          <Dropdown color="primary" label="Primary">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
          </Dropdown>
          <Dropdown color="secondary" label="Secondary">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
          </Dropdown>
          <Dropdown color="neutral" label="Neutral">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
          </Dropdown>
          <Dropdown color="success" label="Success">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
          </Dropdown>
          <Dropdown color="warning" label="Warning">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
          </Dropdown>
          <Dropdown color="danger" label="Danger">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Action</Button>
          </Dropdown>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="positions" class="playground-section">
        <h2>Positions</h2>
        <div class="playground-row">
          <Dropdown label="Bottom (default)" position="bottom">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Bottom</Button>
          </Dropdown>
          <Dropdown label="Top" position="top">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Top</Button>
          </Dropdown>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="aligns" class="playground-section">
        <h2>Aligns</h2>
        <div class="playground-row">
          <Dropdown label="Start" align="start">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Start</Button>
          </Dropdown>
          <Dropdown label="Center" align="center">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Center</Button>
          </Dropdown>
          <Dropdown label="End" align="end">
            <Button variant="ghost" style="width:100%;justify-content:flex-start">End</Button>
          </Dropdown>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="fixed" class="playground-section">
        <h2>Fixed Position</h2>
        <div class="playground-row">
          <Dropdown label="Fixed Menu" fixed>
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Fixed Item 1</Button>
            <Button variant="ghost" style="width:100%;justify-content:flex-start">Fixed Item 2</Button>
          </Dropdown>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <h2>Disabled</h2>
        <div class="playground-row">
          <Dropdown label="Disabled" disabled />
        </div>
      </section>
    </div>
  </PlaygroundLayout>
</template>
