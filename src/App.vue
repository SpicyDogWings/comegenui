<script setup lang="ts">
import { onMounted, ref } from "vue";
import Table from "./components/Table.ce.vue";

const posts = ref<any[]>([]);

onMounted(async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  posts.value = (await response.json()).map((post) => ({
    ...post,
    active: Math.random() > 0.5, // Estado aleatorio
    priority: Math.random() > 0.7 ? "Alta" : "Normal", // Prioridad aleatoria
  }));
});

const tableRef = ref();

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Título" },
  {
    key: "status",
    label: "Estado",
    badges: (row) => [
      {
        value: row.active ? "Activo" : "Inactivo",
        color: row.active ? "success" : "danger",
        variant: "subtle"
      },
    ],
  },
  {
    key: "actions",
    label: "Acciones",
    buttons: (row, index) => [
      {
        label: row.active ? "Desactivar" : "Activar",
        color: row.active ? "danger" : "success",
        onClick: () => {
          row.active = !row.active;
          tableRef.value?.updateRow(index, { active: row.active });
        },
      },
    ],
  },
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
