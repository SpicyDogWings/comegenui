<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Pagination from "@/components/controls/Pagination.vue";

const outlineItems = [
  { label: 'Basic', id: 'basic' },
  { label: 'Colors', id: 'colors' },
  { label: 'With Page Size', id: 'page-size' },
  { label: 'First & Last', id: 'first-last' },
  { label: 'Programmatic', id: 'programmatic' },
  {
    label: 'API',
    id: 'api',
    children: [
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
    ],
  },
];

const progPage = ref(1);
const progItemsPerPage = ref(10);

const apiColumns = [
  { key: 'name', label: 'Nombre' },
  { key: 'type', label: 'Tipo' },
  { key: 'default', label: 'Default' },
  { key: 'description', label: 'Descripción' },
];

const propsData = [
  { name: 'color', type: 'string', default: '"neutral"', description: 'primary, secondary, neutral, success, warning, danger' },
  { name: 'variant', type: 'string', default: '"soft"', description: 'outlined, soft, ghost, subtle, none' },
  { name: 'currentPage', type: 'number', default: '1', description: 'Página actual (v-model:current-page)' },
  { name: 'totalPages', type: 'number', default: '1', description: 'Total de páginas' },
  { name: 'totalItems', type: 'number', default: '0', description: 'Total de items (texto "X–Y de Z")' },
  { name: 'itemsPerPage', type: 'number', default: '10', description: 'Items por página (v-model:items-per-page)' },
  { name: 'showPageSize', type: 'boolean', default: 'false', description: 'Muestra el select de items por página' },
  { name: 'pageSizeOptions', type: 'number[]', default: '[5, 10, 20, 50]', description: 'Opciones del select de items por página' },
  { name: 'showFirstAndLast', type: 'boolean', default: 'false', description: 'Muestra botones primera/última' },
];

const slotsData: { name: string; description: string }[] = [];

const eventsData = [
  { name: 'update:currentPage', type: '(page: number) => void', description: 'Cambia la página (v-model:current-page)' },
  { name: 'update:itemsPerPage', type: '(n: number) => void', description: 'Cambia items por página (v-model:items-per-page)' },
];

const exposesData: { name: string; type: string; description: string }[] = [];

const currentPage = ref(1);

const programmaticVue = `<script setup>
import { ref } from 'vue'
import Pagination from '@/components/controls/Pagination.vue'
import Button from '@/components/buttons/Button.vue'

const page = ref(1)
const itemsPerPage = ref(10)
const totalPages = ref(10)
const totalItems = ref(100)

function nextPage() {
  if (page.value < totalPages.value) page.value++
}
function prevPage() {
  if (page.value > 1) page.value--
}
function setPage(n: number) {
  page.value = n
}
\/script>

<template>
  <Button color="neutral" @click="setPage(1)">page 1</Button>
  <Button color="neutral" @click="prevPage()">prev()</Button>
  <Button color="neutral" @click="nextPage()">next()</Button>
  <Button color="neutral" @click="setPage(5)">page 5</Button>
  <Pagination
    v-model:current-page="page"
    :total-pages="totalPages"
    :total-items="totalItems"
    :items-per-page="itemsPerPage"
    @update:current-page="page = $event"
  />
</template>`;
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
      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — la página cambia en vivo.
        </p>
        <SectionDemo :vue-code="programmaticVue">
          <div class="playground-col">
            <div class="playground-row">
              <Button color="neutral" @click="progPage = 1">page 1</Button>
              <Button color="neutral" @click="progPage = Math.max(1, progPage - 1)">prev()</Button>
              <Button color="neutral" @click="progPage = Math.min(10, progPage + 1)">next()</Button>
              <Button color="neutral" @click="progPage = 5">page 5</Button>
            </div>
            <p class="playground-state">
              current-page: <strong>{{ progPage }}</strong>
              · items-per-page: <strong>{{ progItemsPerPage }}</strong>
            </p>
            <Pagination
              v-model:current-page="progPage"
              v-model:items-per-page="progItemsPerPage"
              :total-pages="10"
              :total-items="100"
              :show-first-and-last="true"
            />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <h3 id="api-props">Props</h3>
        <Table :columns="apiColumns" :data="propsData" variant="ghost" compact />

        <h3 id="api-slots">Slots</h3>
        <Table :columns="apiColumns" :data="slotsData" empty="No tiene slots" variant="ghost" compact />

        <h3 id="api-events">Events</h3>
        <Table :columns="apiColumns" :data="eventsData" variant="ghost" compact />

        <h3 id="api-exposes">Exposes</h3>
        <Table :columns="apiColumns" :data="exposesData" empty="No expone métodos (usa v-model)" variant="ghost" compact />
      </section>
    </div>
  </PlaygroundLayout>
</template>
