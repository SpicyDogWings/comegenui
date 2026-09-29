<script setup lang="ts">
import { ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import Button from "@/components/buttons/Button.vue";

const columns = ref([
  { key: "nombre", label: "Nombre", sortable: "string" },
  { key: "email", label: "Correo" },
  { key: "rol", label: "Rol" },
  { key: "ciudad", label: "Ciudad" },
]);

const data = ref([
  { nombre: "Ana Torres", email: "ana@ejemplo.com", rol: "Admin", ciudad: "Buenos Aires" },
  { nombre: "Luis Gómez", email: "luis@ejemplo.com", rol: "Editor", ciudad: "Córdoba" },
  { nombre: "Sofía Ruiz", email: "sofia@ejemplo.com", rol: "Visor", ciudad: "Rosario" },
  { nombre: "Carlos Vera", email: "carlos@ejemplo.com", rol: "Editor", ciudad: "Mendoza" },
  { nombre: "Ana Molina", email: "ana.molina@ejemplo.com", rol: "Admin", ciudad: "La Plata" },
  { nombre: "Diego Sosa", email: "diego@ejemplo.com", rol: "Visor", ciudad: "Salta" },
  { nombre: "María Pérez", email: "maria@ejemplo.com", rol: "Editor", ciudad: "Tucumán" },
  { nombre: "Julián Ríos", email: "julian@ejemplo.com", rol: "Visor", ciudad: "Neuquén" },
  { nombre: "Ana Clara Díaz", email: "clara@ejemplo.com", rol: "Admin", ciudad: "Bahía Blanca" },
  { nombre: "Pablo Ledesma", email: "pablo@ejemplo.com", rol: "Editor", ciudad: "Mar del Plata" },
  { nombre: "Valentina Cruz", email: "valen@ejemplo.com", rol: "Visor", ciudad: "Santa Fe" },
  { nombre: "Federico Paz", email: "fede@ejemplo.com", rol: "Admin", ciudad: "Posadas" },
]);

const searchValue = ref("");
const itemsPerPage = ref(5);
const lastEvent = ref("Todavía no se emitió ningún evento");

function onSearch(value: string) {
  searchValue.value = value;
  lastEvent.value = `update:search → "${value}"`;
}
function onPage(page: number) {
  lastEvent.value = `update:currentPage → ${page}`;
}
function onPageSize(size: number) {
  itemsPerPage.value = size;
  lastEvent.value = `update:itemsPerPage → ${size}`;
}
</script>

<template>
  <div class="cu-demo-controls">
    <Button variant="soft" @click="searchValue = 'ana'">searchValue = "ana"</Button>
    <Button variant="ghost" @click="searchValue = ''">Limpiar búsqueda</Button>
  </div>
  <AdvancedTable
    :columns="columns"
    :data="data"
    search-enabled
    search-placeholder="Buscar por nombre o correo…"
    :search-fields="['nombre', 'email']"
    :search-value="searchValue"
    :items-per-page="itemsPerPage"
    show-page-size
    :page-size-options="[5, 10, 20]"
    @update:search="onSearch"
    @update:current-page="onPage"
    @update:items-per-page="onPageSize"
  />
  <pre class="cu-demo-output">{{ lastEvent }}</pre>
</template>
