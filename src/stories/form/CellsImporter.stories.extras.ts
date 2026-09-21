import { defineComponent, h, ref } from "vue";
import CellsImporter from "@/components/form/CellsImporter.vue";
import Button from "@/components/buttons/Button.vue";
import type { CellColumn, CellError } from "@/utils/cellsImporter";
import type { StoryExtra } from "@/stories/types";

const COLUMNS: CellColumn[] = [
  { key: "name", label: "Nombre", required: true },
  { key: "age", label: "Edad", type: "integer", min: 0, max: 120 },
  { key: "email", label: "Email", type: "email" },
];

const GOOD_CSV = "Nombre,Edad,Email\nJuan,30,juan@x.com\nAna,25,ana@x.com";
const BAD_CSV = "Nombre,Edad,Email\nJuan,30,juan@x.com\nAna,200,correo-invalido\n,25,pepe@y.com";

function fileFrom(csv: string, name: string): File {
  return new File([csv], name, { type: "text/csv" });
}

interface CellsImporterInstance {
  getRows: () => Record<string, unknown>[];
  getHeaders: () => string[];
  getErrors: () => CellError[];
  getFile: () => File | null;
  validate: () => CellError[];
  downloadTemplate: () => void;
  reset: () => void;
  set: (file: File | null) => void;
  trigger: () => void;
  focus: () => void;
}

const MONO = "var(--cu-font-mono, monospace)";

/**
 * Programmatic: patio de juegos de los **exposes** de CellsImporter
 * (set/getRows/getErrors/getFile/reset) sobre una instancia en vivo.
 */
const CellsImporterProgrammatic = defineComponent({
  name: "CellsImporterProgrammatic",
  setup() {
    const importerRef = ref<InstanceType<typeof CellsImporter> | null>(null);
    const state = ref("Sin archivo");

    const instance = () => importerRef.value as unknown as CellsImporterInstance | null;

    const loadGood = () => {
      instance()?.set(fileFrom(GOOD_CSV, "bueno.csv"));
    };
    const loadBad = () => {
      instance()?.set(fileFrom(BAD_CSV, "con-errores.csv"));
    };
    const read = () => {
      const imp = instance();
      if (!imp) return;
      const rows = imp.getRows();
      const errors = imp.getErrors();
      const file = imp.getFile();
      state.value = `${file?.name ?? "sin archivo"} · ${rows.length} filas · ${errors.length} errores`;
    };
    const reset = () => {
      instance()?.reset();
      state.value = "Limpio";
    };

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(Button, { color: "neutral", onClick: loadGood }, () => "set(bueno.csv)"),
          h(Button, { color: "neutral", onClick: loadBad }, () => "set(con-errores.csv)"),
          h(Button, { color: "neutral", onClick: read }, () => "getRows()/getErrors()"),
          h(Button, { color: "neutral", onClick: reset }, () => "reset()"),
        ]),
        h("p", { class: "playground-state" }, state.value),
        h(CellsImporter, {
          ref: importerRef,
          columns: COLUMNS,
          onParse: read,
          onError: read,
        }),
      ]);
  },
});

const programmaticVue = `<script setup>
import { ref } from 'vue'
import CellsImporter from '@/components/form/CellsImporter.vue'

const columns = [
  { key: 'name', label: 'Nombre', required: true },
  { key: 'age', label: 'Edad', type: 'integer', min: 0, max: 120 },
  { key: 'email', label: 'Email', type: 'email' },
]
const imp = ref(null)
const state = ref('Sin archivo')

function load(name, csv) {
  imp.value.set(new File([csv], name, { type: 'text/csv' }))
}
function read() {
  const rows = imp.value.getRows()
  const errors = imp.value.getErrors()
  const file = imp.value.getFile()
  state.value = (file?.name ?? 'sin archivo') + ' · ' + rows.length + ' filas · ' + errors.length + ' errores'
}
<\/script>

<template>
  <div style="display:flex;flex-direction:column;gap:12px">
    <CellsImporter ref="imp" :columns="columns" @parse="read" @error="read" />
    <p>{{ state }}</p>
  </div>
</template>`;

const programmaticVanilla = `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer id="imp"></cu-cells-importer>

<script>
  customElements.whenDefined('cu-cells-importer').then(() => {
    const imp = document.getElementById('imp');
    imp.columns = [
      { key: 'name', label: 'Nombre', required: true },
      { key: 'age', label: 'Edad', type: 'integer', min: 0, max: 120 },
      { key: 'email', label: 'Email', type: 'email' },
    ];
    const csv = 'Nombre,Edad,Email\\nJuan,30,juan@x.com\\nAna,200,correo-invalido';
    imp.set(new File([csv], 'demo.csv', { type: 'text/csv' }));
    imp.getRows();    // filas parseadas
    imp.getErrors();  // errores de validación
  });
<\/script>`;

interface LogEntry {
  name: string;
  info?: string;
}

/**
 * Events: patio de juegos de los eventos custom (`change`, `parse`, `error`)
 * del importador. Se disparan cargando archivos con `set()`.
 */
const CellsImporterEvents = defineComponent({
  name: "CellsImporterEvents",
  setup() {
    const importerRef = ref<InstanceType<typeof CellsImporter> | null>(null);
    const log = ref<LogEntry[]>([]);

    const record = (name: string, info?: string) => {
      log.value = [{ name, info }, ...log.value].slice(0, 8);
    };

    const instance = () => importerRef.value as unknown as CellsImporterInstance | null;

    return () =>
      h("div", { class: "playground-col" }, [
        h("div", { class: "playground-row" }, [
          h(
            Button,
            { color: "neutral", onClick: () => instance()?.set(fileFrom(GOOD_CSV, "bueno.csv")) },
            () => "Cargar válido",
          ),
          h(
            Button,
            { color: "neutral", onClick: () => instance()?.set(fileFrom(BAD_CSV, "con-errores.csv")) },
            () => "Cargar con errores",
          ),
          h(
            Button,
            { color: "neutral", onClick: () => instance()?.set(null) },
            () => "Quitar archivo",
          ),
          h(Button, { color: "neutral", onClick: () => (log.value = []) }, () => "Limpiar log"),
        ]),
        h(
          "p",
          { class: "playground-state" },
          "Cargá un archivo y mirá el log de eventos (change / parse / error).",
        ),
        h(
          "ul",
          {
            style: `margin:0;padding:0;list-style:none;display:flex;flex-direction:column;gap:2px;font-family:${MONO};font-size:var(--cu-font-size-sm, 14px);min-height:120px`,
          },
          log.value.length
            ? log.value.map((entry, index) =>
                h(
                  "li",
                  { key: index, style: `opacity:${Math.max(0.35, 1 - index * 0.09)}` },
                  `▸ ${entry.name}${entry.info ? ` (${entry.info})` : ""}`,
                ),
              )
            : [h("li", { style: "opacity:.5" }, "— sin eventos —")],
        ),
        h(CellsImporter, {
          ref: importerRef,
          columns: COLUMNS,
          onChange: (file: File | null) => record("change", file?.name ?? "null"),
          onParse: (payload: { rows: unknown[] }) => record("parse", `${payload.rows.length} filas`),
          onError: (errors: CellError[]) => record("error", `${errors.length} errores`),
        }),
      ]);
  },
});

const eventsVue = `<script setup>
import CellsImporter from '@/components/form/CellsImporter.vue'

const columns = [{ key: 'name', label: 'Nombre', required: true }]
const events = []
const log = (name) => (payload) => events.push(name + ' ' + JSON.stringify(payload))
<\/script>

<template>
  <CellsImporter
    :columns="columns"
    @change="log('change')"
    @parse="log('parse')"
    @error="log('error')"
  />
</template>`;

const eventsVanilla = `<script src="dist/CuCellsImporter.umd.js"><\/script>

<cu-cells-importer id="imp" columns='[{"key":"name","label":"Nombre","required":true}]'></cu-cells-importer>

<script>
  customElements.whenDefined('cu-cells-importer').then(() => {
    const imp = document.getElementById('imp');
    imp.addEventListener('change', (e) => console.log('change', e.detail));
    imp.addEventListener('parse', (e) => console.log('parse', e.detail));
    imp.addEventListener('error', (e) => console.log('error', e.detail));
  });
<\/script>`;

export const extras: StoryExtra[] = [
  {
    id: "programmatic",
    title: "Programmatic",
    description:
      "Patio de juegos de los exposes: set(), getRows(), getErrors(), getFile() y reset() sobre la instancia de abajo.",
    render: () => h(CellsImporterProgrammatic),
    vue: programmaticVue,
    vanilla: programmaticVanilla,
  },
  {
    id: "events",
    title: "Events",
    description:
      "Patio de juegos de eventos: cargá archivos y mirá el log en vivo de change / parse / error.",
    render: () => h(CellsImporterEvents),
    vue: eventsVue,
    vanilla: eventsVanilla,
  },
];
