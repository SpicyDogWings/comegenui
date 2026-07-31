<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import Pagination from "@/components/Pagination.vue";

const outlineItems = [
  { label: 'Basic', id: 'basic' },
  { label: 'Colors', id: 'colors' },
  { label: 'With Page Size', id: 'page-size' },
  { label: 'First & Last', id: 'first-last' },
];

const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(87);
</script>

<template>
  <PlaygroundLayout title="Pagination" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="basic" class="playground-section">
        <h2>Basic</h2>
        <Pagination
          :current-page="currentPage"
          :total-pages="Math.ceil(totalItems / itemsPerPage)"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
          @update:current-page="currentPage = $event"
        />
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <h2>Colors</h2>
        <div class="playground-col">
          <Pagination color="primary" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
          <Pagination color="secondary" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
          <Pagination color="success" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
          <Pagination color="warning" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
          <Pagination color="danger" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="page-size" class="playground-section">
        <h2>With Page Size Selector</h2>
        <Pagination
          :current-page="currentPage"
          :total-pages="Math.ceil(totalItems / itemsPerPage)"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
          :show-page-size="true"
          :page-size-options="[5, 10, 20, 50]"
          @update:current-page="currentPage = $event"
          @update:items-per-page="itemsPerPage = $event"
        />
      </section>

      <hr class="playground-separator" />

      <section id="first-last" class="playground-section">
        <h2>With First &amp; Last Buttons</h2>
        <Pagination
          :current-page="currentPage"
          :total-pages="Math.ceil(totalItems / itemsPerPage)"
          :total-items="totalItems"
          :items-per-page="itemsPerPage"
          :show-first-and-last="true"
          @update:current-page="currentPage = $event"
        />
      </section>
    </div>
  </PlaygroundLayout>
</template>
