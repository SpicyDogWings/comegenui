<script setup lang="ts">
import { ref, onMounted } from "vue";
import Table from "./components/Table.ce.vue";
import Textarea from "./components/Textarea.ce.vue";

const posts = ref<any[]>([]);
const textareaValue = ref("");

onMounted(async () => {
  const response = await fetch("https://jsonplaceholder.typicode.com/posts");
  posts.value = await response.json();
});

const columns = [
  { key: "id", label: "ID" },
  { key: "title", label: "Título", editable: true, singleClick: true },
  { key: "body", label: "Contenido", editable: true, inputType: "textarea" },
];
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">Posts de JSONPlaceholder</h1>

    <Table
      :data="posts"
      :columns="columns"
      :pagination="true"
      :items-per-page="10"
      class="mb-6"
    />
  </div>
</template>
