<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";

const outlineItems = [
  { label: 'Basic', id: 'basic' },
  { label: 'Sortable', id: 'sortable' },
  { label: 'With Badges', id: 'badges' },
  { label: 'With Buttons', id: 'buttons' },
  { label: 'Buttons with Icons', id: 'buttons-icons' },
  { label: 'Editable Cells', id: 'editable' },
  { label: 'Pagination', id: 'pagination' },
  { label: 'Search', id: 'search' },
  { label: 'Empty State', id: 'empty' },
];

const sampleData = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", status: "Active", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", status: "Pending", role: "User" },
  { id: 3, name: "Carol White", email: "carol@example.com", status: "Active", role: "Editor" },
  { id: 4, name: "David Brown", email: "david@example.com", status: "Inactive", role: "User" },
  { id: 5, name: "Eva Martinez", email: "eva@example.com", status: "Active", role: "Admin" },
  { id: 6, name: "Frank Lee", email: "frank@example.com", status: "Pending", role: "User" },
  { id: 7, name: "Grace Kim", email: "grace@example.com", status: "Active", role: "Editor" },
  { id: 8, name: "Henry Park", email: "henry@example.com", status: "Inactive", role: "User" },
  { id: 9, name: "Ivy Chen", email: "ivy@example.com", status: "Active", role: "Admin" },
  { id: 10, name: "Jack Wilson", email: "jack@example.com", status: "Pending", role: "User" },
  { id: 11, name: "Kate Brown", email: "kate@example.com", status: "Active", role: "Editor" },
  { id: 12, name: "Leo Garcia", email: "leo@example.com", status: "Inactive", role: "User" },
];

const columns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  { key: "status", label: "Status" },
  { key: "role", label: "Role" },
];

const sortableColumns = [
  { key: "name", label: "Name", sortable: true },
  { key: "email", label: "Email", sortable: true },
  { key: "status", label: "Status", sortable: "string" as const },
  { key: "role", label: "Role" },
];

const badgeColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "status",
    label: "Status",
    badges: (row: any) => [
      {
        value: row.status,
        color: row.status === "Active" ? "success" : row.status === "Pending" ? "warning" : "danger",
        variant: "soft",
      },
    ],
  },
];

const buttonColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "actions",
    label: "Actions",
    buttons: (row: any) => [
      { label: "Edit", color: "primary", variant: "ghost", onClick: () => console.log("edit", row) },
      { label: "Delete", color: "danger", variant: "ghost", onClick: () => console.log("delete", row) },
    ],
  },
];

const iconButtonColumns = [
  { key: "name", label: "Name" },
  { key: "email", label: "Email" },
  {
    key: "actions",
    label: "Actions",
    buttons: (row: any) => [
      {
        color: "primary",
        variant: "ghost",
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>',
        onClick: () => console.log("edit", row),
      },
      {
        color: "neutral",
        variant: "ghost",
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/></svg>',
        onClick: () => console.log("more", row),
      },
      {
        color: "danger",
        variant: "ghost",
        icon: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>',
        onClick: () => console.log("delete", row),
      },
    ],
  },
];

const editableColumns = [
  { key: "name", label: "Name", editable: true },
  { key: "email", label: "Email", editable: true },
  {
    key: "notes",
    label: "Notes",
    editable: true,
    inputType: "textarea" as const,
    textarea: { rows: 2 },
  },
  {
    key: "status",
    label: "Status",
    editable: true,
    inputType: "select" as const,
    select: {
      options: [
        { value: "Active", label: "Active" },
        { value: "Pending", label: "Pending" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  },
  {
    key: "role",
    label: "Role",
    editable: true,
    inputType: "select" as const,
    select: {
      options: [
        { value: "Admin", label: "Admin" },
        { value: "Editor", label: "Editor" },
        { value: "User", label: "User" },
      ],
    },
  },
];

// Estado reactivo: toggle desde el botón lápiz de la columna "Acciones".
const inlineEditing = ref(false);

const editableActionColumns = [
  { key: "name", label: "Name", editable: true },
  { key: "email", label: "Email", editable: true },
  {
    key: "notes",
    label: "Notes",
    editable: true,
    inputType: "textarea" as const,
    textarea: { rows: 2 },
  },
  {
    key: "status",
    label: "Status",
    editable: true,
    inputType: "select" as const,
    select: {
      options: [
        { value: "Active", label: "Active" },
        { value: "Pending", label: "Pending" },
        { value: "Inactive", label: "Inactive" },
      ],
    },
  },
  {
    key: "actions",
    label: "Acciones",
    buttons: () => [
      {
        label: inlineEditing.value ? "Ver valores" : "Editar inline",
        icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z"/><path d="m15 5 4 4"/></svg>',
        color: inlineEditing.value ? "primary" : "neutral",
        variant: inlineEditing.value ? "solid" : "ghost",
        onClick: () => { inlineEditing.value = !inlineEditing.value; },
      },
    ],
  },
];

const editableData = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", notes: "Team lead", status: "Active", role: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", notes: "New hire", status: "Pending", role: "User" },
  { id: 3, name: "Carol White", email: "carol@example.com", notes: "On vacation", status: "Active", role: "Editor" },
];
</script>

<template>
  <PlaygroundLayout title="AdvancedTable" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="basic" class="playground-section">
        <h2>Basic</h2>
        <AdvancedTable :columns="columns" :data="sampleData" :pagination="false" />
      </section>

      <hr class="playground-separator" />

      <section id="sortable" class="playground-section">
        <h2>Sortable</h2>
        <AdvancedTable :columns="sortableColumns" :data="sampleData" :pagination="false" />
      </section>

      <hr class="playground-separator" />

      <section id="badges" class="playground-section">
        <h2>With Badges</h2>
        <AdvancedTable :columns="badgeColumns" :data="sampleData" :pagination="false" />
      </section>

      <hr class="playground-separator" />

      <section id="buttons" class="playground-section">
        <h2>With Buttons</h2>
        <AdvancedTable :columns="buttonColumns" :data="sampleData" :pagination="false" />
      </section>

      <hr class="playground-separator" />

      <section id="buttons-icons" class="playground-section">
        <h2>Buttons with Icons</h2>
        <AdvancedTable :columns="iconButtonColumns" :data="sampleData" :pagination="false" />
      </section>

      <hr class="playground-separator" />

      <section id="editable" class="playground-section">
        <h2>Editable Cells</h2>
        <p>
          Por defecto las celdas editables muestran un <strong>lápiz</strong>; hacé click para editar.
          Con el estado reactivo <code>inlineEditing</code> (prop de la tabla), las celdas renderizan
          el editor directo — acá lo togglea el botón en la columna <em>Acciones</em>.
        </p>
        <h3>Modo lápiz (por defecto)</h3>
        <AdvancedTable :columns="editableColumns" :data="editableData" :pagination="false" />
        <h3>Estado inline (toggle desde columna Acciones)</h3>
        <AdvancedTable :columns="editableActionColumns" :data="editableData" :inline-editing="inlineEditing" :pagination="false" />

        <h3>Estado inline desde el inicio (<code>:inline-editing="true"</code>)</h3>
        <AdvancedTable :columns="editableColumns" :data="editableData" :inline-editing="true" :pagination="false" />
      </section>

      <hr class="playground-separator" />

      <section id="pagination" class="playground-section">
        <h2>Pagination</h2>
        <AdvancedTable :columns="columns" :data="sampleData" :pagination="true" :items-per-page="5" />
      </section>

      <hr class="playground-separator" />

      <section id="search" class="playground-section">
        <h2>With Search</h2>
        <AdvancedTable :columns="columns" :data="sampleData" :pagination="false" :search-enabled="true" />
      </section>

      <hr class="playground-separator" />

      <section id="empty" class="playground-section">
        <h2>Empty State</h2>
        <AdvancedTable :columns="columns" :data="[]" :pagination="false" />
      </section>
    </div>
  </PlaygroundLayout>
</template>
