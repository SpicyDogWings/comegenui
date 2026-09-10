<script setup lang="ts">
import { ref } from "vue";
import PlaygroundStyle from '@/templates/playground/PlaygroundStyle.vue';
import PlaygroundApiComponents from '@/templates/playground/PlaygroundApiComponents.vue';
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import StoryRenderer from "@/pages/playground/StoryRenderer.vue";
import SectionDemo from "@/pages/playground/SectionDemo.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import Pagination from "@/components/controls/Pagination.vue";
import { cuPaginationStories } from "@/stories/controls/Pagination.stories";

const progPage = ref(1);
const progItemsPerPage = ref(10);
const totalPages = ref(10);

const outlineItems = [
  ...cuPaginationStories.sections.map((section) => ({ label: section.title, id: section.id })),
  { label: 'Programmatic', id: 'programmatic' },
  {
    label: 'Style',
    id: 'style',
    children: [
      { label: 'CSS Variables', id: 'style-variables' },
    ],
  },
  {
    label: 'API',
    id: 'api',
    children: [
      { label: 'Components', id: 'api-components' },
      { label: 'Props', id: 'api-props' },
      { label: 'Slots', id: 'api-slots' },
      { label: 'Events', id: 'api-events' },
      { label: 'Exposes', id: 'api-exposes' },
    ],
  },
];

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
      v-model:items-per-page="itemsPerPage"
      :total-pages="totalPages"
      :total-items="totalItems"
      :show-first-and-last="true"
    />
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuPagination.umd.js"><\/script>
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

const componentTokens = [
  '--cu-font-sans',
  '--cu-font-size-sm',
  '--cu-color-neutral-text',
  '--cu-space-xs',
  '--cu-space-sm',
  '--cu-space-md',
  '--cu-space-3xl',
];

const componentDeps = [
  { label: 'Button', path: '/playground/components/button' },
  { label: 'Select', path: '/playground/components/select' },
];

const styleSubComponents = [
  { label: 'Button', path: '/playground/components/button#style' },
  { label: 'Select', path: '/playground/components/select#style' },
];

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
  { name: 'showFirstAndLast', type: 'boolean', default: 'false', description: 'Fija la primera y la última página en la lista' },
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
      <StoryRenderer :story="cuPaginationStories" />

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

      <hr class="playground-separator" />
      <PlaygroundStyle :tokens="componentTokens" :sub-components="styleSubComponents" />

      <section id="api" class="playground-section">
        <h2>API</h2>

        <PlaygroundApiComponents :deps="componentDeps" />

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
