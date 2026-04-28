<script setup lang="ts">
import { onMounted, ref } from "vue";
import Table from "./components/Table.ce.vue";

const posts = ref<any[]>([]);

onMounted(async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  posts.value = await response.json();
});

const tableRef = ref();

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Título" },
];

const updateFirstPost = () => {
  tableRef.value?.updateRow(0, { title: "Título actualizado en " + new Date().toLocaleTimeString() });
};
</script>

<template>
  <div class="w-screen h-screen p-6">
    <h1 class="text-2xl font-bold mb-6">Tabla con Input de Búsqueda</h1>

    <div class="max-w-4xl">
      <Table
        ref="tableRef"
        :columns="columns"
        :data="posts"
        :pagination="true"
        :items-per-page="10"
        :searchEnabled="true"
        searchPlaceholder="Buscar posts..."
        :searchFields="['title']"
        empty="No se encontraron posts"
        style="max-height: 25rem"
      />
      <button
        @click="updateFirstPost"
        class="mt-4 p-2 bg-primary-600 text-white rounded"
      >
        Actualizar primer post
      </button>
    </div>
  </div>
</template>
