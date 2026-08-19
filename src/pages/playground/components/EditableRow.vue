<script setup lang="ts">
import { ref } from "vue";
import PlaygroundLayout from "@/layouts/PlaygroundLayout.vue";
import AdvancedTable from "@/components/data/AdvancedTable.vue";

const outlineItems = [
  { label: 'Editable Cells', id: 'editable' },
  { label: 'Precio validado', id: 'price-validation' },
  { label: 'Calendario en celda', id: 'date-position' },
  { label: 'Switch en celda', id: 'switch' },
  { label: 'Disabled: filas', id: 'disabled-rows' },
  { label: 'Disabled: columnas', id: 'disabled-columns' },
  { label: 'Disabled: celdas', id: 'disabled-cells' },
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
  {
    key: "fecha",
    label: "Fecha",
    editable: true,
    inputType: "date" as const,
    date: {
      format: "dd/MM/yyyy",
      min: "2026-01-01",
      max: "2026-12-31",
      yearNavigation: true,
      disabledWeekdays: "0,6",
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

// Estado inline POR COLUMNA: cada columna decide si renderiza el editor directo.
const mixedInlineColumns = [
  { key: "name", label: "Name", editable: true },
  { key: "email", label: "Email", editable: true, inlineEdit: true },
  {
    key: "notes",
    label: "Notes",
    editable: true,
    inputType: "textarea" as const,
    textarea: { rows: 2 },
    inlineEdit: true,
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
    inlineEdit: true,
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

const editableData = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", notes: "Team lead", status: "Active", role: "Admin", fecha: "2026-08-14" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", notes: "New hire", status: "Pending", role: "User", fecha: "2026-08-11" },
  { id: 3, name: "Carol White", email: "carol@example.com", notes: "On vacation", status: "Active", role: "Editor", fecha: "2026-08-20" },
];

// ── Precio validado: solo números con exactamente 2 decimales ──
const priceData = [
  { id: 1, producto: "Laptop", precio: "1200.50" },
  { id: 2, producto: "Mouse", precio: "25.99" },
  { id: 3, producto: "Teclado", precio: "45.00" },
  { id: 4, producto: "Monitor", precio: "350.75" },
  { id: 5, producto: "Auriculares", precio: "89.90" },
];

// Acepta "1200.50", "25.99"... Rechaza "1200.5", "1200.555", "abc", "12,50"
const priceRegex = /^\d+\.\d{2}$/;

const priceColumns = [
  { key: "producto", label: "Producto" },
  { key: "precio", label: "Precio", editable: priceRegex },
];

const priceInlineColumns = [
  { key: "producto", label: "Producto" },
  { key: "precio", label: "Precio", editable: priceRegex, inlineEdit: true },
];

// ── Calendario en celda: posición del panel del date-picker (date.position/align/fixed) ──
const dateData = [
  { id: 1, producto: "Laptop", fecha: "2026-08-14" },
  { id: 2, producto: "Mouse", fecha: "2026-08-11" },
  { id: 3, producto: "Teclado", fecha: "2026-08-20" },
  { id: 4, producto: "Monitor", fecha: "2026-08-02" },
  { id: 5, producto: "Auriculares", fecha: "2026-08-27" },
];

// El calendario abre ARRIBA del trigger (position: "top") y centrado con la celda
// (align: "center") para no tapar las filas de abajo. Keys disponibles:
// date.position ("bottom"|"top"|"left"|"right"), date.align ("start"|"center"|"end"),
// date.fixed (default true para no recortarse con el overflow).
const datePositionColumns = [
  { key: "producto", label: "Producto" },
  {
    key: "fecha",
    label: "Fecha",
    editable: true,
    inputType: "date" as const,
    date: { format: "dd/MM/yyyy", position: "top", align: "center" },
  },
];

const datePositionInlineColumns = [
  { key: "producto", label: "Producto" },
  {
    key: "fecha",
    label: "Fecha",
    editable: true,
    inputType: "date" as const,
    inlineEdit: true,
    date: { format: "dd/MM/yyyy", position: "top", align: "center" },
  },
];

// ── Switch en celda: inputType "switch" renderiza el <cu-switch> directo ──
// El valor de la fila es booleano; al alternar se emite edit-save con true/false.
// El switch NO ocupa todo el ancho de la celda (width: fit-content) y por defecto
// queda centrado; editorAlign ("start"|"center"|"end") lo mueve dentro de la celda.
const switchColumns = [
  { key: "producto", label: "Producto" },
  {
    key: "disponible",
    label: "Disponible (centrado, default)",
    editable: true,
    inputType: "switch" as const,
    switch: { color: "success", size: "sm" } as const,
  },
  {
    key: "envio",
    label: "Envío gratis (start)",
    editable: true,
    inputType: "switch" as const,
    editorAlign: "start" as const,
    switch: { color: "primary", size: "md" } as const,
  },
  {
    key: "garantia",
    label: "Garantía (end)",
    editable: true,
    inputType: "switch" as const,
    editorAlign: "end" as const,
    switch: { color: "warning", size: "sm" } as const,
  },
];

const switchData = [
  { id: 1, producto: "Laptop", disponible: true, envio: true, garantia: false },
  { id: 2, producto: "Mouse", disponible: false, envio: false, garantia: true },
  { id: 3, producto: "Teclado", disponible: true, envio: false, garantia: true },
  { id: 4, producto: "Monitor", disponible: false, envio: true, garantia: false },
];

// ── Disabled a nivel fila / columna / celda ──
// Prioridad: fila > columna > celda.
// - rowDisabled: prop de la tabla (boolean o función por fila)
// - column.disabled: boolean o función por fila (toda la columna / columna por fila)
// - column.cellDisabled: función que deshabilita una celda puntual (fila × columna)

const disabledRowsData = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", activo: true, bloqueado: false },
  { id: 2, name: "Bob Smith", email: "bob@example.com", activo: true, bloqueado: true },
  { id: 3, name: "Carol White", email: "carol@example.com", activo: false, bloqueado: false },
  { id: 4, name: "David Brown", email: "david@example.com", activo: true, bloqueado: false },
];

const disabledRowsColumns = [
  { key: "name", label: "Nombre", editable: true },
  { key: "email", label: "Correo", editable: true },
  {
    key: "activo",
    label: "Activo",
    editable: true,
    inputType: "switch" as const,
    switch: { color: "success", size: "sm" } as const,
  },
  {
    key: "bloqueado",
    label: "Bloqueado",
    editable: true,
    inputType: "switch" as const,
    switch: { color: "danger", size: "sm" } as const,
  },
];

const disabledColsData = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", activo: true, rol: "Admin" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", activo: true, rol: "Editor" },
  { id: 3, name: "Carol White", email: "carol@example.com", activo: false, rol: "User" },
  { id: 4, name: "David Brown", email: "david@example.com", activo: true, rol: "Admin" },
];

const disabledColsColumns = [
  { key: "name", label: "Nombre", editable: true },
  {
    key: "email",
    label: "Correo (disabled en todo)",
    editable: true,
    disabled: true,
  },
  {
    key: "activo",
    label: "Activo (disabled solo en Carol)",
    editable: true,
    inputType: "switch" as const,
    switch: { color: "success", size: "sm" } as const,
    disabled: (row: any) => row.name === "Carol White",
  },
  {
    key: "rol",
    label: "Rol (disabled en Admins)",
    editable: true,
    disabled: (row: any) => row.rol === "Admin",
  },
];

const disabledCellsData = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", activo: true, bloqueado: false },
  { id: 2, name: "Bob Smith", email: "bob@example.com", activo: true, bloqueado: true },
  { id: 3, name: "Carol White", email: "carol@example.com", activo: true, bloqueado: false },
  { id: 4, name: "David Brown", email: "david@example.com", activo: true, bloqueado: false },
];

const disabledCellsColumns = [
  {
    key: "name",
    label: "Nombre (celda disabled en Carol)",
    editable: true,
    cellDisabled: (row: any) => row.name === "Carol White",
  },
  {
    key: "email",
    label: "Correo (celda disabled en Bob)",
    editable: true,
    cellDisabled: (row: any) => row.name === "Bob Smith",
  },
  {
    key: "activo",
    label: "Activo (celda disabled en Alice)",
    editable: true,
    inputType: "switch" as const,
    switch: { color: "success", size: "sm" } as const,
    cellDisabled: (row: any) => row.name === "Alice Johnson",
  },
  {
    key: "bloqueado",
    label: "Bloqueado (celda disabled en David)",
    editable: true,
    inputType: "switch" as const,
    switch: { color: "danger", size: "sm" } as const,
    cellDisabled: (row: any) => row.name === "David Brown",
  },
];
</script>

<template>
  <PlaygroundLayout title="Editable Row" :outlineItems="outlineItems">
    <div class="playground-content">
      <section id="editable" class="playground-section">
        <h2>Editable Cells</h2>
        <p>
          Por defecto las celdas editables muestran un <strong>lápiz</strong>; hacé click para editar.
          El estado inline se setea <strong>por columna</strong> (<code>inlineEdit: true</code>) o
          globalmente en la tabla (<code>:inline-editing</code>, por compatibilidad) — acá lo
          togglea el botón en la columna <em>Acciones</em>.
        </p>
        <h3>Modo lápiz (por defecto)</h3>
        <AdvancedTable :columns="editableColumns" :data="editableData" :pagination="false" />
        <h3>Estado inline (toggle desde columna Acciones)</h3>
        <AdvancedTable :columns="editableActionColumns" :data="editableData" :inline-editing="inlineEditing" :pagination="false" />

        <h3>Estado inline por columna (<code>inlineEdit: true</code>)</h3>
        <AdvancedTable :columns="mixedInlineColumns" :data="editableData" :pagination="false" />
      </section>

      <hr class="playground-separator" />

      <section id="price-validation" class="playground-section">
        <h2>Precio validado</h2>
        <p>
          La columna <code>precio</code> usa un regex (<code>^\d+\.\d{2}$</code>): solo números con
          <strong>exactamente 2 decimales</strong> (ej. <code>1200.50</code>). Si ponés más de 2 decimales
          (<code>1200.555</code>), menos (<code>1200.5</code>), letras o comas, el valor <strong>no se guarda</strong>
          y el input se <strong>tiñe de rojo</strong> (color <code>danger</code>).
        </p>
        <div class="price-grid">
          <div>
            <h3>Modo lápiz</h3>
            <AdvancedTable :columns="priceColumns" :data="priceData" :pagination="false" />
          </div>
          <div>
            <h3>Modo inline (<code>inlineEdit: true</code>)</h3>
            <AdvancedTable :columns="priceInlineColumns" :data="priceData" :pagination="false" />
          </div>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="date-position" class="playground-section">
        <h2>Calendario en celda (posición del panel)</h2>
        <p>
          La columna <code>fecha</code> usa <code>inputType: "date"</code>. Las keys
          <code>date.position</code> (<code>"bottom" | "top" | "left" | "right"</code>) y
          <code>date.align</code> (<code>"start" | "center" | "end"</code>) controlan dónde abre el
          calendario — acá <code>position: "top", align: "center"</code>, para que no tape las filas
          de abajo y el panel quede centrado con la celda. Con <code>fixed: false</code> el panel se
          posiciona en <code>absolute</code> respecto al trigger (puede recortarse si la
          celda/tabla tiene <code>overflow</code>); el default es <code>true</code>.
        </p>
        <div class="date-grid">
          <div>
            <h3>Modo lápiz</h3>
            <AdvancedTable :columns="datePositionColumns" :data="dateData" :pagination="false" />
          </div>
          <div>
            <h3>Modo inline (<code>inlineEdit: true</code>)</h3>
            <AdvancedTable :columns="datePositionInlineColumns" :data="dateData" :pagination="false" />
          </div>
        </div>
      </section>

      <hr class="playground-separator" />

      <section id="switch" class="playground-section">
        <h2>Switch en celda</h2>
        <p>
          La columna usa <code>inputType: "switch"</code> con la config
          <code>switch: { size, color }</code>. El switch se renderiza <strong>directo, sin lápiz</strong>,
          <strong>sin estirarse</strong> al ancho de la celda (queda centrado por defecto) y al
          alternarlo se emite <code>edit-save</code> con el valor <strong>booleano</strong>
          (<code>true</code> / <code>false</code>), que actualiza <code>row[key]</code>.
          Con <code>editorAlign: "start" | "center" | "end"</code> podés alinearlo dentro de la celda.
        </p>
        <AdvancedTable :columns="switchColumns" :data="switchData" :pagination="false" @edit-save="(e: any) => console.log('Switch guardado:', e)" />
      </section>

      <hr class="playground-separator" />

      <section id="disabled-rows" class="playground-section">
        <h2>Disabled: filas</h2>
        <p>
          La prop <code>rowDisabled</code> (boolean o función por fila) deshabilita una fila
          completa: se atenúa, no edita, no emite clicks y sus switches se ven deshabilitados.
          Acá Bob (fila 2) está deshabilitado porque <code>bloqueado: true</code>.
        </p>
        <AdvancedTable
          :columns="disabledRowsColumns"
          :data="disabledRowsData"
          :pagination="false"
          :row-disabled="(row: any) => row.bloqueado === true"
        />
      </section>

      <hr class="playground-separator" />

      <section id="disabled-columns" class="playground-section">
        <h2>Disabled: columnas</h2>
        <p>
          <code>column.disabled</code> deshabilita una columna completa (<code>true</code>) o
          solo en ciertas filas (función). Acá <em>Correo</em> está deshabilitada en todas las
          filas; <em>Activo</em> solo en Carol; <em>Rol</em> solo en los Admins.
        </p>
        <AdvancedTable :columns="disabledColsColumns" :data="disabledColsData" :pagination="false" />
      </section>

      <hr class="playground-separator" />

      <section id="disabled-cells" class="playground-section">
        <h2>Disabled: celdas</h2>
        <p>
          <code>column.cellDisabled</code> deshabilita una celda puntual (intersección
          fila × columna). Acá cada columna tiene una celda deshabilitada en una fila distinta:
          <em>Nombre</em> en Carol, <em>Correo</em> en Bob, <em>Activo</em> en Alice y
          <em>Bloqueado</em> en David.
        </p>
        <AdvancedTable :columns="disabledCellsColumns" :data="disabledCellsData" :pagination="false" />
      </section>
    </div>
  </PlaygroundLayout>
</template>

<style scoped>
.price-grid,
.date-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--cu-space-lg);
  align-items: start;
}

/* Espacio para que el panel del calendario en position="top" no tape el contenido de arriba */
.date-grid {
  padding-top: var(--cu-space-xl);
}

@media (max-width: 900px) {
  .price-grid,
  .date-grid {
    grid-template-columns: 1fr;
  }
}
</style>
