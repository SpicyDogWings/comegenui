<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Badge from "@/components/information/Badge.vue";
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

const currentPage = ref(1);
const itemsPerPage = ref(10);
const totalItems = ref(87);

const totalPages = ref(10);

// ── Snippets Vue ──

const basicVue = `<script setup>
import { ref } from 'vue'
import Pagination from '@/components/controls/Pagination.vue'

const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(87)
<\/script>

<template>
  <Pagination
    v-model:current-page="currentPage"
    :total-pages="Math.ceil(totalItems / itemsPerPage)"
    :total-items="totalItems"
    :items-per-page="itemsPerPage"
  />
</template>`;

const colorsVue = `<script setup>
import Pagination from '@/components/controls/Pagination.vue'
<\/script>

<template>
  <Pagination color="primary" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
  <Pagination color="secondary" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
  <Pagination color="success" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
  <Pagination color="warning" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
  <Pagination color="danger" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
</template>`;

const pageSizeVue = `<script setup>
import { ref } from 'vue'
import Pagination from '@/components/controls/Pagination.vue'

const currentPage = ref(1)
const itemsPerPage = ref(10)
<\/script>

<template>
  <Pagination
    v-model:current-page="currentPage"
    v-model:items-per-page="itemsPerPage"
    :total-pages="9"
    :total-items="87"
    show-page-size
    :page-size-options="[5, 10, 20, 50]"
  />
</template>`;

const firstLastVue = `<script setup>
import { ref } from 'vue'
import Pagination from '@/components/controls/Pagination.vue'

const currentPage = ref(1)
<\/script>

<template>
  <Pagination
    v-model:current-page="currentPage"
    :total-pages="9"
    :total-items="87"
    :items-per-page="10"
    show-first-and-last
  />
</template>`;

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
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="setPage(1)">page 1</Button>
      <Button color="neutral" @click="prevPage()">prev()</Button>
      <Button color="neutral" @click="nextPage()">next()</Button>
      <Button color="neutral" @click="setPage(5)">page 5</Button>
    </div>
    <Pagination
      v-model:current-page="page"
      :total-pages="totalPages"
      :total-items="totalItems"
      :items-per-page="itemsPerPage"
      show-first-and-last
      @update:current-page="page = $event"
    />
  </div>
</template>`;

// ── Snippets Vanilla ──

const paginationImportVanilla = `<script src="dist/CuPagination.umd.js"><\/script>`;

const basicVanilla = `${paginationImportVanilla}

<cu-pagination current-page="1" total-pages="9" total-items="87" items-per-page="10"></cu-pagination>`;

const colorsVanilla = `${paginationImportVanilla}

<cu-pagination color="primary" current-page="3" total-pages="8" total-items="80" items-per-page="10"></cu-pagination>
<cu-pagination color="secondary" current-page="3" total-pages="8" total-items="80" items-per-page="10"></cu-pagination>
<cu-pagination color="success" current-page="3" total-pages="8" total-items="80" items-per-page="10"></cu-pagination>
<cu-pagination color="warning" current-page="3" total-pages="8" total-items="80" items-per-page="10"></cu-pagination>
<cu-pagination color="danger" current-page="3" total-pages="8" total-items="80" items-per-page="10"></cu-pagination>`;

const pageSizeVanilla = `${paginationImportVanilla}

<cu-pagination current-page="1" total-pages="9" total-items="87" items-per-page="10" show-page-size></cu-pagination>`;

const firstLastVanilla = `${paginationImportVanilla}

<cu-pagination current-page="1" total-pages="9" total-items="87" items-per-page="10" show-first-and-last></cu-pagination>`;

const programmaticVanilla = `${paginationImportVanilla}
<script src="dist/CuButton.umd.js"><\/script>

<div style="display:flex;gap:8px;flex-wrap:wrap">
  <cu-button id="pag-prog-first">page 1</cu-button>
  <cu-button id="pag-prog-prev">prev()</cu-button>
  <cu-button id="pag-prog-next">next()</cu-button>
  <cu-button id="pag-prog-5">page 5</cu-button>
</div>

<cu-pagination id="pag-prog" current-page="1" total-pages="10" total-items="100" items-per-page="10" show-first-and-last></cu-pagination>

<script>
  customElements.whenDefined('cu-pagination').then(() => {
    const pagination = document.getElementById('pag-prog');
    document.getElementById('pag-prog-first').addEventListener('click', () => (pagination.currentPage = 1));
    document.getElementById('pag-prog-prev').addEventListener('click', () => (pagination.currentPage = Math.max(1, pagination.currentPage - 1)));
    document.getElementById('pag-prog-next').addEventListener('click', () => (pagination.currentPage = Math.min(10, pagination.currentPage + 1)));
    document.getElementById('pag-prog-5').addEventListener('click', () => (pagination.currentPage = 5));
    pagination.addEventListener('update:currentPage', (e) => console.log('current-page:', e.detail));
  });
<\/script>`;

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
</script>

<template>
  <PlaygroundLayout title="Pagination" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="basic" class="playground-section">
        <div class="playground-heading">
          <h2>Basic</h2>
        </div>
        <SectionDemo :vue-code="basicVue" :vanilla-code="basicVanilla">
          <div class="playground-col">
            <Pagination
              :current-page="currentPage"
              :total-pages="Math.ceil(totalItems / itemsPerPage)"
              :total-items="totalItems"
              :items-per-page="itemsPerPage"
              @update:current-page="currentPage = $event"
            />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="colors" class="playground-section">
        <div class="playground-heading">
          <h2>Colors</h2>
          <Badge color="neutral" title="Color por defecto">neutral</Badge>
        </div>
        <SectionDemo :vue-code="colorsVue" :vanilla-code="colorsVanilla">
          <div class="playground-col">
            <Pagination color="primary" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
            <Pagination color="secondary" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
            <Pagination color="success" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
            <Pagination color="warning" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
            <Pagination color="danger" :current-page="3" :total-pages="8" :total-items="80" :items-per-page="10" />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="page-size" class="playground-section">
        <div class="playground-heading">
          <h2>With Page Size Selector</h2>
          <Badge color="neutral" title="showPageSize por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="pageSizeVue" :vanilla-code="pageSizeVanilla">
          <div class="playground-col">
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
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="first-last" class="playground-section">
        <div class="playground-heading">
          <h2>With First &amp; Last Buttons</h2>
          <Badge color="neutral" title="showFirstAndLast por defecto">false</Badge>
        </div>
        <SectionDemo :vue-code="firstLastVue" :vanilla-code="firstLastVanilla">
          <div class="playground-col">
            <Pagination
              :current-page="currentPage"
              :total-pages="Math.ceil(totalItems / itemsPerPage)"
              :total-items="totalItems"
              :items-per-page="itemsPerPage"
              :show-first-and-last="true"
              @update:current-page="currentPage = $event"
            />
          </div>
        </SectionDemo>
      </section>

      <hr class="playground-separator" />

      <section id="programmatic" class="playground-section">
        <div class="playground-heading">
          <h2>Programmatic</h2>
        </div>
        <p class="playground-desc">
          Seguidilla de botones sobre la instancia de abajo — la página cambia en vivo.
        </p>
        <SectionDemo :vue-code="programmaticVue" :vanilla-code="programmaticVanilla">
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
              :total-pages="totalPages"
              :total-items="100"
              :show-first-and-last="true"
            />
          </div>
        </SectionDemo>
      </section>

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

<style scoped>
.playground-desc {
  margin: 0;
  font-size: var(--cu-font-size-sm);
  color: var(--cu-color-neutral);
}

.playground-state {
  font-family: var(--cu-font-mono);
  font-size: var(--cu-font-size-sm);
  margin: 0;
}
</style>
