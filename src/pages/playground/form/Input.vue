<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Input from "@/components/form/Input.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Types', id: 'types' },
  { label: 'With Values', id: 'values' },
];
</script>

<template>
  <PlaygroundLayout title="Input" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <div class="playground-row">
          <Input variant="soft" placeholder="soft (default)" />
          <Input variant="outlined" placeholder="outlined" />
          <Input variant="ghost" placeholder="ghost" />
          <Input variant="subtle" placeholder="subtle" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="playground-row">
          <Input color="primary" placeholder="primary" />
          <Input color="secondary" placeholder="secondary" />
          <Input color="neutral" placeholder="neutral" />
          <Input color="success" placeholder="success" />
          <Input color="warning" placeholder="warning" />
          <Input color="danger" placeholder="danger" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <h2>Disabled</h2>
        <div class="playground-row">
          <Input color="primary" disabled placeholder="Disabled" />
          <Input color="neutral" disabled placeholder="Disabled" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="types" class="playground-section">
        <h2>Types</h2>
        <div class="playground-row">
          <Input type="text" placeholder="Text" />
          <Input type="password" placeholder="Password" />
          <Input type="email" placeholder="Email" />
          <Input type="number" placeholder="Number" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="values" class="playground-section">
        <h2>With Values</h2>
        <div class="playground-row">
          <Input model-value="Default input" />
          <Input variant="outlined" model-value="Outlined input" />
          <Input variant="ghost" model-value="Ghost input" />
        </div>
      </section>
    </div>
  </PlaygroundLayout>
</template>
