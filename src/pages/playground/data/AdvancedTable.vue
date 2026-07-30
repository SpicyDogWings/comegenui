<script setup lang="ts">
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";

const outlineItems = [
  { label: 'Basic', id: 'basic' },
  { label: 'Sortable', id: 'sortable' },
  { label: 'With Badges', id: 'badges' },
  { label: 'With Buttons', id: 'buttons' },
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
