<script setup lang="ts">
import { ref, onMounted } from "vue";
import Table from "./components/Table.ce.vue";

const posts = ref([]);
const loading = ref(true);
const error = ref(null);

const columns = [
  { key: "id", label: "ID" },
  { key: "userId", label: "User" },
  { key: "title", label: "Title" },
  { key: "body", label: "Body" },
];

onMounted(async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/posts");
    if (!response.ok) throw new Error("Failed to fetch");
    posts.value = await response.json();
});
</script>

<template>
  <div
    class="w-screen h-screen flex flex-col justify-center items-center gap-4 p-6"
  >
    <div class="w-1/2 h-1/2 flex gap-1">
      <Table :columns="columns" :data="posts" />
    </div>
  </div>
</template>
