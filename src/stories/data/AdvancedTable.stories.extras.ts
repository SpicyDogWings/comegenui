import { defineComponent, h, ref } from "vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";
import Button from "@/components/buttons/Button.vue";
import type { StoryExtra } from "@/stories/types";

const COLUMNS = [
  { key: "id", label: "ID" },
  { key: "name", label: "Nombre" },
];

interface TableInstance {
  updateRow: (index: number, patch: Record<string, unknown>) => void;
  getData: () => Record<string, unknown>[];
  getRow: (index: number) => Record<string, unknown> | undefined;
  removeRow: (index: number) => void;
  addRow: (row: Record<string, unknown>) => void;
  pushData: (row: Record<string, unknown>) => void;
}

const AdvancedTableProgrammatic = defineComponent({
  name: "AdvancedTableProgrammatic",
  setup() {
    const tableRef = ref<InstanceType<typeof AdvancedTable> | null>(null);
    const state = ref<string>("—");

    const instance = () => tableRef.value as unknown as TableInstance | null;

    const read = () => {
      const table = instance();
      if (table) state.value = `filas: ${table.getData().length}`;
    };

    const run = (action: (table: TableInstance) => void) => {
      const table = instance();
      if (table) {
        action(table);
        read();
      }
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: read }, () => "getData()"),
          h(Button, { color: "neutral", onClick: () => run((t) => t.pushData({ id: 99, name: "Nuevo" })) }, () => "pushData()"),
          h(Button, { color: "neutral", onClick: () => run((t) => t.removeRow(0)) }, () => "removeRow(0)"),
          h(Button, { color: "neutral", onClick: () => run((t) => t.updateRow(0, { name: "Editado" })) }, () => "updateRow(0)"),
        ]),
        h("p", { class: "playground-state" }, ["getData(): ", h("strong", state.value)]),
        h(AdvancedTable, {
          ref: tableRef,
          columns: COLUMNS,
          data: [
            { id: 1, name: "Alice Johnson" },
            { id: 2, name: "Bob Smith" },
          ],
          pagination: false,
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import AdvancedTable from '@/components/data/AdvancedTable.vue'
import Button from '@/components/buttons/Button.vue'

const tableRef = ref(null)
const state = ref('—')

const read = () => (state.value = 'filas: ' + tableRef.value.getData().length)
const run = (action) => { action(tableRef.value); read() }
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div style="display:flex;gap:8px;flex-wrap:wrap">
      <Button color="neutral" @click="read()">getData()</Button>
      <Button color="neutral" @click="run((t) => t.pushData({ id: 99, name: 'Nuevo' }))">pushData()</Button>
      <Button color="neutral" @click="run((t) => t.removeRow(0))">removeRow(0)</Button>
      <Button color="neutral" @click="run((t) => t.updateRow(0, { name: 'Editado' }))">updateRow(0)</Button>
    </div>
    <p class="playground-state">getData(): <strong>{{ state }}</strong></p>
    <AdvancedTable
      ref="tableRef"
      :columns="[
        { key: 'id', label: 'ID' },
        { key: 'name', label: 'Nombre' },
      ]"
      :data="[
        { id: 1, name: 'Alice Johnson' },
        { id: 2, name: 'Bob Smith' },
      ]"
      :pagination="false"
    />
  </div>
</template>`;

const AdvancedTableEvents = defineComponent({
  name: "AdvancedTableEvents",
  setup() {
    const log = ref<string[]>([]);
    const push = (label: string, value: unknown) => {
      log.value = [`${label}: ${JSON.stringify(value)}`, ...log.value].slice(0, 6);
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("p", { class: "playground-state" }, log.value.length ? log.value.join(" · ") : "Sin eventos todavía"),
        h(AdvancedTable, {
          columns: [
            { key: "id", label: "ID" },
            { key: "name", label: "Nombre", editable: true, sortable: true },
          ],
          data: [
            { id: 2, name: "Bob Smith" },
            { id: 1, name: "Alice Johnson" },
          ],
          inlineEditing: true,
          searchEnabled: true,
          searchPlaceholder: "Buscar...",
          pagination: true,
          itemsPerPage: 5,
          "onUpdate:search": (value: string) => push("update:search", value),
          "onUpdate:currentPage": (value: number) => push("update:currentPage", value),
          "onEditSave": (value: unknown) => push("edit-save", value),
        }),
      ]);
  },
});

const eventsVue = `<script setup>
import { ref } from 'vue'
import AdvancedTable from '@/components/data/AdvancedTable.vue'

const log = ref([])
const push = (label, value) => log.value.unshift(label + ': ' + JSON.stringify(value))
<\/script>

<template>
  <p class="playground-state">{{ log.join(' · ') || 'Sin eventos todavía' }}</p>
  <AdvancedTable
    :columns="[
      { key: 'id', label: 'ID' },
      { key: 'name', label: 'Nombre', editable: true, sortable: true },
    ]"
    :data="[
      { id: 2, name: 'Bob Smith' },
      { id: 1, name: 'Alice Johnson' },
    ]"
    inline-editing
    search-enabled
    search-placeholder="Buscar..."
    :pagination="true"
    :items-per-page="5"
    @update:search="push('update:search', $event)"
    @update:current-page="push('update:currentPage', $event)"
    @edit-save="push('edit-save', $event)"
  />
</template>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: getData(), getRow(), updateRow(), removeRow(), addRow() y pushData() sobre la instancia de abajo.",
    render: () => h(AdvancedTableProgrammatic),
    vue: programmaticVue,
  },
  {
    id: "events",
    title: "Events",
    description: "Log en vivo de update:search, update:currentPage y edit-save.",
    render: () => h(AdvancedTableEvents),
    vue: eventsVue,
  },
];
