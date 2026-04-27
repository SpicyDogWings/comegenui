<script setup lang="ts">
import Table from "./components/Table.ce.vue";

interface User {
  id: number;
  name: string;
  email: string;
  status: string;
  role: string;
}

const users: User[] = [
  { id: 1, name: "Juan Pérez", email: "juan@ejemplo.com", status: "active", role: "admin" },
  { id: 2, name: "María García", email: "maria@ejemplo.com", status: "inactive", role: "user" },
  { id: 3, name: "Carlos Ruiz", email: "carlos@ejemplo.com", status: "active", role: "editor" },
  { id: 4, name: "Ana López", email: "ana@ejemplo.com", status: "pending", role: "user" },
  { id: 5, name: "Luis Martínez", email: "luis@ejemplo.com", status: "active", role: "user" },
];

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

    <div class="max-w-4xl">
      <Table
        :data="users"
        :searchEnabled="true"
        searchPlaceholder="Buscar usuarios..."
        :searchFields="['name']"
        empty="No se encontraron usuarios"
        style="max-height: 15rem"
      />
    </div>
  </div>
</template>
