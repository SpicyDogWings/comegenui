<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import Table from "./components/Table.ce.vue";
import Pagination from "./components/Pagination.ce.vue";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  role: string;
}

const posts = ref<User[]>([]);
const currentPage = ref(1);
const itemsPerPage = ref(10);

onMounted(async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  posts.value = await response.json();
});

const paginatedData = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return posts.value.slice(start, end);
});

const totalPages = computed(() => {
  return Math.ceil(posts.value.length / itemsPerPage.value);
});

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Título" },
];
</script>

<template>
  <div class="w-screen h-screen p-6">
    <h1 class="text-2xl font-bold mb-6">Tabla con Input de Búsqueda</h1>

    <div class="max-w-4xl">
      <Table
        :columns="columns"
        :data="paginatedData"
        :searchEnabled="true"
        searchPlaceholder="Buscar posts..."
        :searchFields="['title']"
        empty="No se encontraron posts"
        style="max-height: 15rem"
      />
      <Pagination
        :current-page="currentPage"
        :total-pages="totalPages"
        :total-items="posts.length"
        :items-per-page="itemsPerPage"
        @update:current-page="currentPage = $event"
        @update:items-per-page="itemsPerPage = $event"
      />
    </div>
  </div>
</template>
