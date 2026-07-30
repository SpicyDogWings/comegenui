<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Textarea from "@/components/form/Textarea.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'Disabled', id: 'disabled' },
  { label: 'Rows', id: 'rows' },
];
</script>

<template>
  <PlaygroundLayout title="Textarea" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <div class="playground-col">
          <Textarea variant="soft" placeholder="soft (default)" :rows="2" />
          <Textarea variant="outlined" placeholder="outlined" :rows="2" />
          <Textarea variant="ghost" placeholder="ghost" :rows="2" />
          <Textarea variant="subtle" placeholder="subtle" :rows="2" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="playground-col">
          <Textarea color="primary" placeholder="primary" :rows="2" />
          <Textarea color="secondary" placeholder="secondary" :rows="2" />
          <Textarea color="neutral" placeholder="neutral" :rows="2" />
          <Textarea color="success" placeholder="success" :rows="2" />
          <Textarea color="warning" placeholder="warning" :rows="2" />
          <Textarea color="danger" placeholder="danger" :rows="2" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="disabled" class="playground-section">
        <h2>Disabled</h2>
        <Textarea color="primary" disabled placeholder="Disabled" :rows="2" />
      </section>

      <hr class="playground-separator" />

      <section id="rows" class="playground-section">
        <h2>Custom Rows</h2>
        <div class="playground-col">
          <Textarea placeholder="2 rows" :rows="2" />
          <Textarea placeholder="4 rows" :rows="4" />
          <Textarea placeholder="6 rows, no resize" :rows="6" :no-resize="true" />
        </div>
      </section>
    </div>
  </PlaygroundLayout>
</template>
