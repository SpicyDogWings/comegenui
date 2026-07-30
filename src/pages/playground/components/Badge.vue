<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Badge from "@/components/information/Badge.vue";

const outlineItems = [
  { label: 'Variants', id: 'variants' },
  { label: 'Colors', id: 'colors' },
  { label: 'All Combinations', id: 'combinations' },
];
</script>

<template>
  <PlaygroundLayout title="Badge" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <div class="playground-row">
          <Badge color="primary" variant="solid">solid</Badge>
          <Badge color="primary" variant="soft">soft</Badge>
          <Badge color="primary" variant="ghost">ghost</Badge>
          <Badge color="primary" variant="subtle">subtle</Badge>
          <Badge color="primary" variant="outlined">outlined</Badge>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="playground-row">
          <Badge color="primary">primary</Badge>
          <Badge color="secondary">secondary</Badge>
          <Badge color="neutral">neutral</Badge>
          <Badge color="success">success</Badge>
          <Badge color="warning">warning</Badge>
          <Badge color="danger">danger</Badge>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="combinations" class="playground-section">
        <h2>All Combinations</h2>
        <table class="playground-badge-table">
          <thead>
            <tr>
              <th>variant \ color</th>
              <th v-for="color in ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']" :key="color">{{ color }}</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="variant in ['solid', 'soft', 'ghost', 'subtle', 'outlined']" :key="variant">
              <td class="playground-badge-label">{{ variant }}</td>
              <td v-for="color in ['primary', 'secondary', 'neutral', 'success', 'warning', 'danger']" :key="color">
                <Badge :color="color" :variant="variant">{{ variant }}</Badge>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </div>
  </PlaygroundLayout>
</template>
