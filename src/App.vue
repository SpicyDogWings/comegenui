<script setup lang="ts">
import { ref } from "vue";
import Table from "./components/Table.ce.vue";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  role: string;
}

const users = ref<User[]>([
  { id: 1, name: "Juan Pérez", email: "juan@ejemplo.com", status: "active", role: "admin" },
  { id: 2, name: "María García", email: "maria@ejemplo.com", status: "inactive", role: "user" },
  { id: 3, name: "Carlos Ruiz", email: "carlos@ejemplo.com", status: "active", role: "editor" },
  { id: 4, name: "Ana López", email: "ana@ejemplo.com", status: "pending", role: "user" },
  { id: 5, name: "Luis Martínez", email: "luis@ejemplo.com", status: "active", role: "user" },
]);

const searchQuery = ref("");

const filteredUsers = ref<User[]>(users.value);

const handleSearch = (value: string) => {
  searchQuery.value = value;
  if (!value) {
    filteredUsers.value = users.value;
    return;
  }
  filteredUsers.value = users.value.filter(
    (user) =>
      user.name.toLowerCase().includes(value.toLowerCase()) ||
      user.email.toLowerCase().includes(value.toLowerCase()) ||
      user.status.toLowerCase().includes(value.toLowerCase()) ||
      user.role.toLowerCase().includes(value.toLowerCase()),
  );
};

const columns = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre" },
  { key: "email", label: "Email" },
  {
    key: "status",
    label: "Estado",
    badges: (row: User) => [
      {
        value: row.status,
        color:
          row.status === "active" ? "success" : row.status === "inactive" ? "danger" : "warning",
        variant: "subtle",
      },
    ],
  },
  { key: "role", label: "Rol" },
];
</script>

<template>
  <div class="w-screen h-screen p-6">
    <h1 class="text-2xl font-bold mb-6">Tabla con Input de Búsqueda</h1>
    <div class="max-w-1/2 box">
      <Table
        :columns="columns"
        :data="filteredUsers"
        :showSearch="true"
        searchPlaceholder="Buscar usuarios..."
        @update:search="handleSearch"
        empty="No se encontraron usuarios"
      />
    </div>
  </div>
</template>
