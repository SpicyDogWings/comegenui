<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Table from "@/components/data/Table.vue";

const outlineItems = [
  { label: 'Basic', id: 'basic' },
  { label: 'Colors', id: 'colors' },
  { label: 'Variants', id: 'variants' },
  { label: 'Scroll', id: 'scroll' },
  { label: 'Scroll (Sticky)', id: 'scroll-sticky' },
  { label: 'Empty State', id: 'empty' },
  { label: 'Footer', id: 'footer' },
  { label: 'Loading', id: 'loading' },
];

const sampleData = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "Active", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", status: "Pending", role: "User" },
  { id: 3, name: "Carol White", email: "carol@example.com", status: "Active", role: "Editor" },
  { id: 4, name: "David Brown", email: "david@example.com", status: "Inactive", role: "User" },
  { id: 5, name: "Eva Martinez", email: "eva@example.com", status: "Active", role: "Admin" },
  { id: 6, name: "Frank Lee", email: "frank@example.com", status: "Pending", role: "User" },
  { id: 7, name: "Grace Kim", email: "grace@example.com", status: "Active", role: "Editor" },
  { id: 8, name: "Henry Park", email: "henry@example.com", status: "Inactive", role: "User" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "role", label: "Role" },
];

const colors = ["primary", "secondary", "neutral", "success", "warning", "danger"];
const variants = ["soft", "solid", "outlined", "ghost"];
</script>

<template>
  <PlaygroundLayout title="Table (Base)" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="basic" class="playground-section">
        <h2>Basic</h2>
        <Table :columns="columns" :data="sampleData" />
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="playground-grid">
          <div v-for="color in colors" :key="color">
            <span class="playground-label">{{ color }}</span>
            <Table :color="color" :columns="columns" :data="sampleData.slice(0, 3)" />
          </div>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="variants" class="playground-section">
        <h2>Variants</h2>
        <div class="playground-grid">
          <div v-for="variant in variants" :key="variant">
            <span class="playground-label">{{ variant }}</span>
            <Table :variant="variant" :columns="columns" :data="sampleData.slice(0, 3)" />
          </div>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="scroll" class="playground-section">
        <h2>Scroll</h2>
        <div style="max-height: 300px; overflow-y: auto; border: var(--cu-border-thin) solid var(--cu-border-color); border-radius: var(--cu-radius-md);">
          <Table :columns="columns" :data="sampleData" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="scroll-sticky" class="playground-section">
        <h2>Scroll (Sticky Header)</h2>
        <Table :columns="columns" :data="sampleData" max-height="300px" />
      </section>

      <hr class="playground-separator" />

      <section id="empty" class="playground-section">
        <h2>Empty State</h2>
        <Table :columns="columns" :data="[]" />
      </section>

      <hr class="playground-separator" />

      <section id="footer" class="playground-section">
        <h2>Footer (Totals)</h2>
        <Table :columns="columns" :data="sampleData.slice(0, 3)" color="primary" variant="soft">
          <template #footer="{ columns: cols }">
            <tr>
              <td :colspan="cols.length - 1" style="font-weight: 600;">Total</td>
              <td style="font-weight: 600; text-align: right;">$1,500.00</td>
            </tr>
          </template>
        </Table>
      </section>

      <hr class="playground-separator" />

      <section id="loading" class="playground-section">
        <h2>Loading</h2>
        <Table :columns="columns" :data="sampleData.slice(0, 3)" loading />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style>
.playground-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 1.5rem;
}

.playground-label {
  display: block;
  font-size: var(--cu-font-size-sm);
  font-weight: var(--cu-font-weight-medium);
  color: var(--cu-color-neutral-text);
  opacity: 0.6;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
}
</style>
