import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { flushPromises, mount, type VueWrapper } from "@vue/test-utils";
import { defineCustomElement, nextTick } from "vue";

import AdvancedTable from "@/components/data/AdvancedTable.vue";
import Table from "@/components/data/Table.vue";
import Button from "@/components/buttons/Button.vue";
import DropdownMenu from "@/components/controls/DropdownMenu.vue";
import AdvancedTableCe from "@/components/customElements/data/AdvancedTable.ce.vue";

const columns = [
  { key: "nombre", label: "Nombre" },
  { key: "rol", label: "Rol", sortable: "string" as const },
];
const data = [{ nombre: "Juan", rol: "Admin" }];
const actions = [{ label: "Editar", onClick: () => {} }];

let downloads: HTMLAnchorElement[];
beforeEach(() => {
  downloads = [];
  URL.createObjectURL = vi.fn(() => "blob:mock") as unknown as typeof URL.createObjectURL;
  URL.revokeObjectURL = vi.fn() as unknown as typeof URL.revokeObjectURL;
  vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(function (
    this: HTMLAnchorElement,
  ) {
    downloads.push(this);
  });
});
afterEach(() => {
  vi.restoreAllMocks();
  document.body.innerHTML = "";
});

describe("AdvancedTable (Vue)", () => {
  it("default: el header de acciones queda vacío (no cae a `__actions__`)", () => {
    const w = mount(AdvancedTable, { props: { columns, data, actions } });
    const ths = w.findAll(".cu-table-th");
    expect(ths[ths.length - 1].text()).toBe("");
  });

  it("usa `actionsLabel` como header de la columna de acciones", () => {
    const w = mount(AdvancedTable, {
      props: { columns, data, actions, actionsLabel: "Acciones" },
    });
    const ths = w.findAll(".cu-table-th");
    expect(ths[ths.length - 1].text()).toBe("Acciones");
  });

  it("un `label: ''` explícito deja el header vacío (no cae a la key)", () => {
    const w = mount(AdvancedTable, {
      props: {
        columns: [{ key: "acciones", label: "", buttons: () => [] }],
        data,
      },
    });
    expect(w.find(".cu-table-th").text()).toBe("");
  });

  it("el slot `header-{key}` del usuario gana sobre el header por defecto", () => {
    const w = mount(AdvancedTable, {
      props: { columns, data },
      slots: { "header-rol": '<b class="mi-header">ROL!</b>' },
    });
    expect(w.find(".mi-header").exists()).toBe(true);
    expect(w.find(".mi-header").text()).toBe("ROL!");
  });

  it("forwardea `tableMaxHeight` al Table interno", () => {
    const w = mount(AdvancedTable, {
      props: { columns, data, tableMaxHeight: "20rem" },
    });
    expect(w.findComponent(Table).props("maxHeight")).toBe("20rem");
  });
});

describe("AdvancedTable — botón de exportación", () => {
  const exportButton = (w: VueWrapper) =>
    w.find(".cu-advanced-table-export .cu-button");

  it("sin `exportEnabled` no hay toolbar ni botón", () => {
    const w = mount(AdvancedTable, { props: { columns, data } });
    expect(w.find(".cu-advanced-table-toolbar").exists()).toBe(false);
    expect(w.find(".cu-advanced-table-export").exists()).toBe(false);
  });

  it("sólo export: toolbar sin buscador y botón presente", () => {
    const w = mount(AdvancedTable, {
      props: { columns, data, exportEnabled: true },
    });
    expect(w.find(".cu-advanced-table-toolbar").exists()).toBe(true);
    expect(w.find(".cu-advanced-table-search").exists()).toBe(false);
    expect(exportButton(w).exists()).toBe(true);
  });

  it("con buscador y export, el botón va después del buscador en el DOM", () => {
    const w = mount(AdvancedTable, {
      props: { columns, data, searchEnabled: true, exportEnabled: true },
    });
    const toolbar = w.find(".cu-advanced-table-toolbar");
    const children = Array.from(toolbar.element.children);
    const searchIndex = children.indexOf(w.find(".cu-advanced-table-search").element);
    const exportIndex = children.indexOf(w.find(".cu-advanced-table-export").element);
    expect(searchIndex).toBeGreaterThanOrEqual(0);
    expect(exportIndex).toBeGreaterThan(searchIndex);
    expect(w.find(".cu-advanced-table-search input").exists()).toBe(true);
  });

  it("defaults: solid, tokens de success, label «Descargar Excel» y SVG fijo", () => {
    const w = mount(AdvancedTable, {
      props: { columns, data, exportEnabled: true },
    });
    const button = exportButton(w);
    expect(button.classes()).toContain("cu-button--solid");
    expect(button.attributes("style")).toContain("--btn-solid: var(--cu-color-success-solid)");
    expect(button.text()).toBe("Descargar Excel");
    const svg = button.find("svg");
    expect(svg.exists()).toBe(true);
    expect(svg.attributes("width")).toBe("1em");
    expect(svg.attributes("height")).toBe("1em");
    expect(svg.attributes("aria-hidden")).toBe("true");
    expect(svg.find("rect").exists()).toBe(true);
    expect(svg.findAll("line")).toHaveLength(4);
    expect(button.attributes("aria-label")).toBeUndefined();
  });

  it("aplica label, color, variant y disabled de `exportButton`", () => {
    const w = mount(AdvancedTable, {
      props: {
        columns,
        data,
        exportEnabled: true,
        exportButton: {
          label: "Exportar planilla",
          color: "danger",
          variant: "outlined",
          disabled: true,
        },
      },
    });
    const button = exportButton(w);
    expect(button.text()).toBe("Exportar planilla");
    expect(button.classes()).toContain("cu-button--outlined");
    expect(button.attributes("style")).toContain("--btn-border: var(--cu-color-danger-border)");
    expect(button.attributes("disabled")).toBeDefined();
  });

  it("label vacío deja icon-only con nombre accesible «Descargar Excel»", () => {
    const w = mount(AdvancedTable, {
      props: { columns, data, exportEnabled: true, exportButton: { label: "" } },
    });
    const button = exportButton(w);
    expect(button.classes()).toContain("cu-button--icon-only");
    expect(button.attributes("aria-label")).toBe("Descargar Excel");
    expect(button.text()).toBe("");
    expect(button.find("svg").exists()).toBe(true);
  });
});

describe("AdvancedTable — API de exportación (datos y eventos)", () => {
  type ExportScope = "all" | "visible";
  interface ExportDataLike {
    columns: { key: string; label?: string }[];
    rows: Record<string, any>[];
  }
  interface ExportPayloadLike {
    scope: ExportScope;
    format: "xlsx" | "csv";
    fileName: string;
    rowCount: number;
    columnCount: number;
    cellCount: number;
    heavy: boolean;
  }
  interface ExportVm {
    getExportData: (options?: { scope?: ExportScope }) => ExportDataLike;
    exportToExcel: (options?: { scope?: ExportScope }) => ExportPayloadLike;
  }
  const api = (w: VueWrapper) => w.vm as unknown as ExportVm;

  const columnas = [
    { key: "nombre", label: "Nombre" },
    { key: "rol", label: "Rol" },
    { key: "interno", label: "Interno", exportable: false },
    { key: "__actions__", label: "Acciones" },
  ];
  const filas = [
    { nombre: "Juan", rol: "Admin", interno: "x" },
    { nombre: "Ana", rol: "User", interno: "y" },
  ];

  it("default: todas las columnas exportables; `exportable: false` y `__actions__` quedan fuera", () => {
    const w = mount(AdvancedTable, { props: { columns: columnas, data: filas } });
    const { columns: exportadas, rows } = api(w).getExportData();

    expect(exportadas).toEqual([
      { key: "nombre", label: "Nombre" },
      { key: "rol", label: "Rol" },
    ]);
    // Sólo las keys exportables, con el valor crudo de la fila.
    expect(rows).toEqual([
      { nombre: "Juan", rol: "Admin" },
      { nombre: "Ana", rol: "User" },
    ]);
    expect(Object.keys(rows[0]!)).not.toContain("interno");
  });

  it("`scope: all` usa todas las filas; `visible` usa la página/filtro actual", () => {
    const muchas = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      nombre: `Fila ${i + 1}`,
      estado: i < 8 ? "activo" : "inactivo",
    }));
    const w = mount(AdvancedTable, {
      props: {
        columns: [{ key: "nombre", label: "Nombre" }, { key: "estado", label: "Estado" }],
        data: muchas,
        pagination: true,
        itemsPerPage: 5,
        filters: { estado: "activo" },
      },
    });

    const todas = api(w).getExportData({ scope: "all" });
    expect(todas.rows).toHaveLength(12);
    expect(todas.rows[11]).toEqual({ nombre: "Fila 12", estado: "inactivo" });

    const visibles = api(w).getExportData({ scope: "visible" });
    expect(visibles.rows.map((row) => row.nombre)).toEqual([
      "Fila 1",
      "Fila 2",
      "Fila 3",
      "Fila 4",
      "Fila 5",
    ]);

    // Sin opciones, el default es `all`.
    expect(api(w).getExportData().rows).toHaveLength(12);
  });

  it("`exportToExcel` devuelve el payload y emite `export-click` (sin `export-heavy`)", () => {
    const w = mount(AdvancedTable, {
      props: {
        columns: [{ key: "nombre" }, { key: "rol" }],
        data: [
          { nombre: "A", rol: "x" },
          { nombre: "B", rol: "y" },
          { nombre: "C", rol: "z" },
        ],
        exportEnabled: true,
      },
    });

    const payload = api(w).exportToExcel();
    expect(payload).toEqual({
      scope: "all",
      format: "xlsx",
      fileName: expect.stringMatching(/^export-\d{4}-\d{2}-\d{2}\.xlsx$/),
      rowCount: 3,
      columnCount: 2,
      cellCount: 6,
      heavy: false,
    });
    expect(downloads).toHaveLength(1);
    expect(downloads[0]!.download).toBe(payload.fileName);
    expect(w.emitted("export-click")).toHaveLength(1);
    expect(w.emitted("export-click")![0]![0]).toEqual(payload);
    expect(w.emitted("export-heavy")).toBeFalsy();

    const visible = api(w).exportToExcel({ scope: "visible" });
    expect(visible.scope).toBe("visible");
    expect(w.emitted("export-click")).toHaveLength(2);
  });

  it("`exportButton.disabled` sólo apaga el botón: `exportToExcel` externo sigue disponible", () => {
    const w = mount(AdvancedTable, {
      props: { ...{ columns, data }, exportEnabled: true, exportButton: { disabled: true } },
    });

    expect(api(w).exportToExcel().rowCount).toBe(1);
    expect(w.emitted("export-click")).toHaveLength(1);

    (w.find(".cu-advanced-table-export .cu-button").element as HTMLButtonElement).click();
    expect(w.emitted("export-click")).toHaveLength(1);
  });

  it("`export-heavy` sólo a partir de 10 000 celdas, con el mismo payload", () => {
    const diezColumnas = Array.from({ length: 10 }, (_, i) => ({ key: `c${i}` }));
    const fila = (i: number) => Object.fromEntries(diezColumnas.map((col) => [col.key, i]));

    const justo = mount(AdvancedTable, {
      props: {
        columns: diezColumnas,
        data: Array.from({ length: 1000 }, (_, i) => fila(i)),
      },
    });
    const payload = api(justo).exportToExcel();
    expect(payload).toMatchObject({ rowCount: 1000, columnCount: 10, cellCount: 10_000, heavy: true });
    expect(justo.emitted("export-heavy")).toHaveLength(1);
    expect(justo.emitted("export-heavy")![0]![0]).toEqual(payload);

    const debajo = mount(AdvancedTable, {
      props: {
        columns: diezColumnas,
        data: Array.from({ length: 999 }, (_, i) => fila(i)),
      },
    });
    const chico = api(debajo).exportToExcel();
    expect(chico).toMatchObject({ cellCount: 9990, heavy: false });
    expect(debajo.emitted("export-heavy")).toBeFalsy();
  });

  it("el click del botón exporta con scope `all`", async () => {
    const w = mount(AdvancedTable, {
      props: { columns, data, exportEnabled: true },
    });
    expect(w.emitted("export-click")).toBeFalsy();

    await w.find(".cu-advanced-table-export .cu-button").trigger("click");
    expect(w.emitted("export-click")).toHaveLength(1);
    expect(w.emitted("export-click")![0]![0]).toMatchObject({
      scope: "all",
      rowCount: 1,
      columnCount: 2,
      cellCount: 2,
    });
  });
  it("`exportToExcel` descarga sin botón: funciona con `exportEnabled: false`", () => {
    const w = mount(AdvancedTable, {
      props: {
        columns,
        data,
        exportButton: { filename: "sin-boton" },
      },
    });
    expect(w.find(".cu-advanced-table-export").exists()).toBe(false);

    const payload = api(w).exportToExcel();
    expect(payload.fileName).toBe("sin-boton.xlsx");
    expect(downloads).toHaveLength(1);
    expect(downloads[0]!.download).toBe("sin-boton.xlsx");
  });

  it("`exportButton.format: 'csv'` descarga CSV y el payload lo refleja", () => {
    const w = mount(AdvancedTable, {
      props: {
        columns,
        data,
        exportButton: { format: "csv", filename: "planilla" },
      },
    });
    const payload = api(w).exportToExcel();
    expect(payload).toMatchObject({ format: "csv", fileName: "planilla.csv" });
    expect(downloads[0]!.download).toBe("planilla.csv");
    expect(w.emitted("export-click")![0]![0]).toMatchObject({ format: "csv" });
  });

  it("`before-download` cancelable evita la descarga pero conserva el resumen", () => {
    const w = mount(AdvancedTable, { props: { columns, data } });
    let cancelledPayload: unknown = null;
    w.vm.$.vnode.props = {
      ...w.vm.$.vnode.props,
      onBeforeDownload: (payload: { cancel: () => void }) => {
        cancelledPayload = payload;
        payload.cancel();
      },
    };

    const payload = api(w).exportToExcel();
    expect(downloads).toHaveLength(0);
    expect(cancelledPayload).toMatchObject({ cellCount: payload.cellCount });
    // El resumen y el evento siguen saliendo: lo cancelado es el archivo.
    expect(w.emitted("export-click")).toHaveLength(1);
  });

  it("el botón manual no duplica eventos: un click, una descarga y un `export-click`", async () => {
    const w = mount(AdvancedTable, {
      props: { columns, data, exportEnabled: true, exportButton: { filename: "toolbar" } },
    });
    await w.find(".cu-advanced-table-export .cu-button").trigger("click");

    expect(downloads).toHaveLength(1);
    expect(downloads[0]!.download).toBe("toolbar.xlsx");
    expect(w.emitted("before-download")).toHaveLength(1);
    expect(w.emitted("export-click")).toHaveLength(1);
    expect(w.emitted("download")).toBeUndefined();
  });
});

describe("AdvancedTable.ce (cu-table vanilla) — API de exportación", () => {
  const TAG = "cu-table-export-api-test";
  if (!customElements.get(TAG)) {
    customElements.define(TAG, defineCustomElement(AdvancedTableCe));
  }

  type ExportScope = "all" | "visible";
  interface ExportCeElement extends HTMLElement {
    columns: Record<string, any>[];
    data: Record<string, any>[];
    pagination: boolean;
    exportButton: Record<string, unknown>;
    getExportData: (options?: { scope?: ExportScope }) => {
      columns: { key: string; label?: string }[];
      rows: Record<string, any>[];
    };
    exportToExcel: (options?: { scope?: ExportScope }) => {
      scope: ExportScope;
      format: "xlsx" | "csv";
      fileName: string;
      rowCount: number;
      columnCount: number;
      cellCount: number;
      heavy: boolean;
    };
  }

  const mountCe = async (el: ExportCeElement) => {
    document.body.appendChild(el);
    await flushPromises();
  };

  it("expone los métodos y emite `export-click` con el payload en `e.detail`", async () => {
    const el = document.createElement(TAG) as ExportCeElement;
    el.columns = [
      { key: "nombre", label: "Nombre" },
      { key: "interno", label: "Interno", exportable: false },
    ];
    el.data = [
      { nombre: "A", interno: 1 },
      { nombre: "B", interno: 2 },
    ];
    await mountCe(el);

    expect(typeof el.getExportData).toBe("function");
    expect(typeof el.exportToExcel).toBe("function");
    expect(el.getExportData().columns).toEqual([{ key: "nombre", label: "Nombre" }]);
    expect(el.getExportData().rows).toEqual([{ nombre: "A" }, { nombre: "B" }]);

    const clicks: unknown[] = [];
    el.addEventListener("export-click", (event) => clicks.push((event as CustomEvent).detail));

    const payload = el.exportToExcel({ scope: "all" });
    expect(payload).toEqual({
      scope: "all",
      format: "xlsx",
      fileName: expect.stringMatching(/^export-\d{4}-\d{2}-\d{2}\.xlsx$/),
      rowCount: 2,
      columnCount: 1,
      cellCount: 2,
      heavy: false,
    });
    expect(downloads).toHaveLength(1);
    expect(clicks).toEqual([payload]);
    el.remove();
  });

  it("`visible` respeta la página y `export-heavy` sale con ≥10 000 celdas", async () => {
    const el = document.createElement(TAG) as ExportCeElement;
    el.pagination = true;
    el.columns = [{ key: "a" }, { key: "b" }];
    el.data = Array.from({ length: 5000 }, (_, i) => ({ a: i, b: i }));
    await mountCe(el);

    expect(el.getExportData({ scope: "visible" }).rows).toHaveLength(10);

    const clicks: unknown[] = [];
    const heavies: unknown[] = [];
    el.addEventListener("export-click", (event) => clicks.push((event as CustomEvent).detail));
    el.addEventListener("export-heavy", (event) => heavies.push((event as CustomEvent).detail));

    const payload = el.exportToExcel();
    expect(payload).toEqual({
      scope: "all",
      format: "xlsx",
      fileName: expect.stringMatching(/^export-\d{4}-\d{2}-\d{2}\.xlsx$/),
      rowCount: 5000,
      columnCount: 2,
      cellCount: 10_000,
      heavy: true,
    });
    expect(clicks).toEqual([payload]);
    expect(heavies).toEqual([payload]);
    el.remove();
  });
  it("el host recibe `before-download` y `cancel()` evita la descarga", async () => {
    const el = document.createElement(TAG) as ExportCeElement;
    el.columns = [{ key: "nombre", label: "Nombre" }];
    el.data = [{ nombre: "A" }];
    const payloads: unknown[] = [];
    el.addEventListener("before-download", (event) => {
      const detail = (event as CustomEvent).detail;
      payloads.push(detail);
      detail.cancel();
    });
    await mountCe(el);

    el.exportToExcel();
    expect(payloads).toHaveLength(1);
    expect(payloads[0]).toMatchObject({ scope: "all", rowCount: 1, columnCount: 1 });
    expect(downloads).toHaveLength(0);
    el.remove();
  });

  it("`exportButton.format` viaja al archivo: csv con separador", async () => {
    const el = document.createElement(TAG) as ExportCeElement;
    el.columns = [{ key: "nombre", label: "Nombre" }];
    el.data = [{ nombre: "A" }];
    el.exportButton = { format: "csv", filename: "vanilla" };
    await mountCe(el);

    const payload = el.exportToExcel();
    expect(payload).toMatchObject({ format: "csv", fileName: "vanilla.csv" });
    expect(downloads[0]!.download).toBe("vanilla.csv");
    el.remove();
  });
});

describe("AdvancedTable — acciones condicionales (`actions` por fila, `disabled` y `hidden`)", () => {
  const rows = [
    { nombre: "Juan", premium: true },
    { nombre: "Ana", premium: false },
  ];

  /** Etiquetas de los ítems de cada dropdown de la tabla (una entrada por fila). */
  const dropdownLabels = (w: ReturnType<typeof mount>) =>
    w.findAllComponents(DropdownMenu).map((menu) =>
      (menu.props("items") as { label?: string; divider?: boolean }[]).map(
        (item) => item.label ?? (item.divider ? "—" : ""),
      ),
    );

  it("`actions` como array estático sigue funcionando en todas las filas", () => {
    const w = mount(AdvancedTable, {
      props: { columns, data: rows, actions: [{ label: "Editar", onClick: () => {} }] },
    });
    expect(dropdownLabels(w)).toEqual([["Editar"], ["Editar"]]);
  });

  it("`actions` como función decide los ítems fila por fila", () => {
    const w = mount(AdvancedTable, {
      props: {
        columns,
        data: rows,
        actions: (row: Record<string, any>) =>
          row.premium ? [{ label: "Editar" }, { label: "Duplicar" }] : [{ label: "Editar" }],
      },
    });
    expect(dropdownLabels(w)).toEqual([["Editar", "Duplicar"], ["Editar"]]);
  });

  it("`hidden` por fila descarta el ítem solo en las filas que cumplen", () => {
    const w = mount(AdvancedTable, {
      props: {
        columns,
        data: rows,
        actions: [
          { label: "Editar" },
          { label: "Cancelar suscripción", hidden: (row: Record<string, any>) => !row.premium },
        ],
      },
    });
    expect(dropdownLabels(w)).toEqual([["Editar", "Cancelar suscripción"], ["Editar"]]);
  });

  it("descarta los divisores que quedan huérfanos al ocultar un ítem", () => {
    const w = mount(AdvancedTable, {
      props: {
        columns,
        data: rows,
        actions: [
          { label: "Editar" },
          { divider: true },
          { label: "Eliminar", hidden: (row: Record<string, any>) => !row.premium },
        ],
      },
    });
    expect(dropdownLabels(w)).toEqual([["Editar", "—", "Eliminar"], ["Editar"]]);
  });

  it("`disabled` como función se evalúa por fila (no queda siempre deshabilitado)", () => {
    const w = mount(AdvancedTable, {
      props: {
        columns,
        data: rows,
        actions: [{ label: "Editar", disabled: (row: Record<string, any>) => !row.premium }],
      },
    });
    const flags = w
      .findAllComponents(DropdownMenu)
      .map((menu) => (menu.props("items") as { disabled?: boolean }[])[0].disabled);
    expect(flags).toEqual([false, true]);
  });

  it("oculta el toggle '...' de la fila que no expone ninguna acción", () => {
    const w = mount(AdvancedTable, {
      props: {
        columns,
        data: rows,
        actions: (row: Record<string, any>) => (row.premium ? [{ label: "Editar" }] : []),
      },
    });
    expect(w.findAll(".cu-advanced-table-actions")).toHaveLength(1);
  });

  it("columna `buttons`: `disabled` y `hidden` como función se resuelven por fila", () => {
    const w = mount(AdvancedTable, {
      props: {
        columns: [
          {
            key: "acciones",
            label: "",
            buttons: (row: Record<string, any>) => [
              { label: "Guardar", disabled: (r: Record<string, any>) => !r.premium },
              { label: "Eliminar", hidden: (r: Record<string, any>) => !r.premium },
            ],
          },
        ],
        data: rows,
      },
    });

    const cells = w.findAll(".cu-advanced-table-cell-buttons");
    expect(cells).toHaveLength(2);

    const premium = cells[0].findAllComponents(Button);
    const basico = cells[1].findAllComponents(Button);
    expect(premium).toHaveLength(2);
    expect(basico).toHaveLength(1);
    expect(premium[0].props("disabled")).toBe(false);
    expect(basico[0].props("disabled")).toBe(true);
  });
});

describe("AdvancedTable.ce (cu-table vanilla)", () => {
  const TAG = "cu-table-actions-test";
  if (!customElements.get(TAG)) {
    customElements.define(TAG, defineCustomElement(AdvancedTableCe));
  }

  function mountCe(configure: (el: any) => void = () => {}) {
    const el = document.createElement(TAG) as any;
    el.columns = columns;
    el.data = data;
    configure(el);
    document.body.appendChild(el);
    return el;
  }

  it("`actionsLabel` (propiedad JS) se ve en el header real", async () => {
    const el = mountCe((node) => {
      node.actions = actions;
      node.actionsLabel = "Acciones";
    });
    await flushPromises();
    const ths = el.shadowRoot.querySelectorAll("thead th");
    expect(ths[ths.length - 1].textContent.trim()).toBe("Acciones");
    el.remove();
  });

  it("`actions-label` (atributo HTML) se ve en el header real", async () => {
    const el = document.createElement(TAG) as any;
    el.setAttribute("actions-label", "Operaciones");
    el.columns = columns;
    el.data = data;
    el.actions = actions;
    document.body.appendChild(el);
    await flushPromises();
    const ths = el.shadowRoot.querySelectorAll("thead th");
    expect(ths[ths.length - 1].textContent.trim()).toBe("Operaciones");
    el.remove();
  });

  it("default: header de acciones vacío", async () => {
    const el = mountCe((node) => {
      node.actions = actions;
    });
    await flushPromises();
    const ths = el.shadowRoot.querySelectorAll("thead th");
    expect(ths[ths.length - 1].textContent.trim()).toBe("");
    el.remove();
  });

  it("`actions` como función se resuelve por fila también en el custom element", async () => {
    const el = mountCe((node) => {
      node.data = [
        { nombre: "Juan", rol: "Admin" },
        { nombre: "Ana", rol: "Viewer" },
      ];
      node.actions = (row: Record<string, any>) =>
        row.rol === "Admin" ? [{ label: "Editar" }] : [];
    });
    await flushPromises();
    expect(el.shadowRoot.querySelectorAll(".cu-advanced-table-actions").length).toBe(1);
    el.remove();
  });

  it("renderiza outlets `<slot>` nativos para los slots del host", async () => {
    const el = document.createElement(TAG) as any;
    el.columns = columns;
    el.data = data;
    el.actions = actions;
    const footer = document.createElement("span");
    footer.setAttribute("slot", "footer");
    footer.textContent = "total";
    const header = document.createElement("span");
    header.setAttribute("slot", "header-__actions__");
    header.textContent = "SLOT ACCIONES";
    el.append(footer, header);
    document.body.appendChild(el);
    await nextTick();
    await flushPromises();

    expect(el.shadowRoot.querySelector('slot[name="footer"]')).not.toBeNull();
    expect(el.shadowRoot.querySelector('slot[name="header-__actions__"]')).not.toBeNull();
    el.remove();
  });
});

describe("AdvancedTable.ce (cu-table vanilla) — exportación", () => {
  const TAG = "cu-table-export-test";
  if (!customElements.get(TAG)) {
    customElements.define(TAG, defineCustomElement(AdvancedTableCe));
  }

  it("`exportEnabled` y `exportButton` (propiedades JS) se reflejan en el shadow root", async () => {
    type ExportTableElement = HTMLElement & {
      columns: typeof columns;
      data: typeof data;
      exportEnabled: boolean;
      exportButton: Record<string, unknown>;
    };
    const el = document.createElement(TAG) as ExportTableElement;
    el.columns = columns;
    el.data = data;
    el.exportEnabled = true;
    el.exportButton = { label: "Bajar", color: "warning", variant: "soft", disabled: true };
    document.body.appendChild(el);
    await flushPromises();

    expect(el.shadowRoot).not.toBeNull();
    const root = el.shadowRoot!;
    expect(root.querySelector(".cu-advanced-table-toolbar")).not.toBeNull();
    expect(root.querySelector(".cu-advanced-table-search")).toBeNull();
    const button = root.querySelector(
      ".cu-advanced-table-export .cu-button",
    ) as HTMLButtonElement | null;
    expect(button).not.toBeNull();
    expect(button!.textContent!.trim()).toBe("Bajar");
    expect(button!.classList.contains("cu-button--soft")).toBe(true);
    expect(button!.classList.contains("cu-button--disabled")).toBe(true);
    expect(button!.disabled).toBe(true);
    el.remove();
  });
});

describe("AdvancedTable — edición y paginación", () => {
  const editableColumns = [{ key: "nombre", label: "Nombre", editable: true }];
  const filas = () =>
    Array.from({ length: 14 }, (_, i) => ({ id: i + 1, nombre: `Fila ${i + 1}` }));

  interface TablaExpose {
    getData: () => Record<string, any>[];
    getRow: (index: number) => Record<string, any> | undefined;
  }
  const exposed = (w: VueWrapper) => w.vm as unknown as TablaExpose;

  /** Edita la celda editable de la fila visible `visibleIndex` (0 = primera de la página). */
  async function editarCelda(w: VueWrapper, visibleIndex: number, value: string) {
    await w.findAll(".cu-editable-cell-view")[visibleIndex].trigger("click");
    await flushPromises();
    const input = w.find(".cu-editable-cell-input");
    await input.setValue(value);
    await input.trigger("keydown", { key: "Enter" });
    await flushPromises();
  }

  async function irAPagina(w: VueWrapper, page: number) {
    const boton = w
      .findAll(".cu-pagination-pages button")
      .find((b) => b.text() === String(page));
    await boton!.trigger("click");
    await flushPromises();
  }

  const ultimoEditSave = (w: VueWrapper) =>
    w.emitted("edit-save")!.at(-1)![0] as { index: number; value: string };

  it("sin paginación e itemsPerPage menor que las filas, edita la fila real (no la pierde)", async () => {
    const w = mount(AdvancedTable, {
      props: {
        columns: editableColumns,
        data: filas(),
        pagination: false,
        itemsPerPage: 10,
      },
    });

    expect(w.findAll(".cu-table-row")).toHaveLength(14);
    await editarCelda(w, 12, "EDITADA-13");

    expect(exposed(w).getRow(12)?.nombre).toBe("EDITADA-13");
    expect(ultimoEditSave(w)).toMatchObject({ index: 12, value: "EDITADA-13" });
  });

  it("con paginación, editar en la página 2 guarda en la fila 11 (índice original)", async () => {
    const w = mount(AdvancedTable, {
      props: {
        columns: editableColumns,
        data: filas(),
        pagination: true,
        itemsPerPage: 10,
      },
    });

    await irAPagina(w, 2);
    expect(w.findAll(".cu-table-row")).toHaveLength(4);
    await editarCelda(w, 0, "EDITADA-11");

    expect(exposed(w).getData()[10].nombre).toBe("EDITADA-11");
    expect(ultimoEditSave(w).index).toBe(10);
  });

  it("apagar la paginación estando en la página 2 no desplaza el índice: edita la fila visible", async () => {
    const w = mount(AdvancedTable, {
      props: {
        columns: editableColumns,
        data: filas(),
        pagination: true,
        itemsPerPage: 10,
      },
    });

    await irAPagina(w, 2);
    await w.setProps({ pagination: false });
    await flushPromises();

    expect(w.findAll(".cu-table-row")).toHaveLength(14);
    await editarCelda(w, 0, "EDITADA-1");

    const data = exposed(w).getData();
    expect(data[0].nombre).toBe("EDITADA-1");
    expect(data[10].nombre).toBe("Fila 11");
    expect(ultimoEditSave(w).index).toBe(0);
  });
});

describe("AdvancedTable — Escape cancela de verdad", () => {
  it("Escape no guarda: emite edit-cancel, NO edit-save y deja la fila intacta", async () => {
    const w = mount(AdvancedTable, {
      props: {
        columns: [{ key: "nombre", label: "Nombre", editable: true }],
        data: [{ nombre: "original" }],
      },
    });

    await w.find(".cu-editable-cell-view").trigger("click");
    await flushPromises();
    const input = w.find(".cu-editable-cell-input");
    await input.setValue("cancelado");

    // El handler corre en el mismo tick que el cierre del editor: el navegador
    // despacha `blur` sobre el input que se va de la pantalla.
    input.element.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    input.element.dispatchEvent(new Event("blur"));
    await flushPromises();

    expect(w.emitted("edit-cancel")).toBeTruthy();
    expect(w.emitted("edit-save")).toBeFalsy();
    expect((w.vm as unknown as { getRow: (i: number) => any }).getRow(0).nombre).toBe("original");
  });
});

describe("AdvancedTable — el header ordenable se anuncia", () => {
  const sortableColumns = [
    { key: "nombre", label: "Nombre" },
    { key: "rol", label: "Rol", sortable: "string" as const },
  ];

  it("`aria-sort` refleja el ciclo none → ascending → descending y el botón tiene nombre accesible", async () => {
    const w = mount(AdvancedTable, { props: { columns: sortableColumns, data } });
    const ths = w.findAll("th");

    expect(ths[0].attributes("aria-sort")).toBeUndefined();
    expect(ths[1].attributes("aria-sort")).toBe("none");

    const boton = ths[1].find("button");
    expect(boton.attributes("aria-label")).toBe("Ordenar por Rol");

    await boton.trigger("click");
    expect(w.findAll("th")[1].attributes("aria-sort")).toBe("ascending");

    await w.findAll("th")[1].find("button").trigger("click");
    expect(w.findAll("th")[1].attributes("aria-sort")).toBe("descending");
  });
});

describe("AdvancedTable — itemsPerPage inválido", () => {
  const filas = () => Array.from({ length: 14 }, (_, i) => ({ id: i + 1, nombre: `Fila ${i + 1}` }));

  it("un `itemsPerPage` 0 o negativo en caliente no vacía la tabla: cae al default (10)", async () => {
    const w = mount(AdvancedTable, {
      props: { columns: [{ key: "id", label: "ID" }], data: filas(), pagination: true, itemsPerPage: 5 },
    });
    expect(w.findAll(".cu-table-row")).toHaveLength(5);

    await w.setProps({ itemsPerPage: 0 });
    await flushPromises();
    expect(w.findAll(".cu-table-row")).toHaveLength(10);

    await w.setProps({ itemsPerPage: -3 });
    await flushPromises();
    expect(w.findAll(".cu-table-row")).toHaveLength(10);
    expect(w.text()).not.toContain("-3");
  });
});

describe("AdvancedTable.ce (cu-table vanilla) — estado vacío", () => {
  const TAG = "cu-table-empty-test";
  if (!customElements.get(TAG)) {
    customElements.define(TAG, defineCustomElement(AdvancedTableCe));
  }

  it("sin `empty` usa el texto por defecto (`No hay datos que mostrar`)", async () => {
    const el = document.createElement(TAG) as any;
    el.columns = columns;
    el.data = [];
    document.body.appendChild(el);
    await flushPromises();
    expect(el.shadowRoot.querySelector(".cu-table-empty")!.textContent!.trim()).toBe(
      "No hay datos que mostrar",
    );
    el.remove();
  });

  it("un `empty` explícito gana sobre el texto por defecto", async () => {
    const el = document.createElement(TAG) as any;
    el.columns = columns;
    el.data = [];
    el.empty = "Nada por acá";
    document.body.appendChild(el);
    await flushPromises();
    expect(el.shadowRoot.querySelector(".cu-table-empty")!.textContent!.trim()).toBe("Nada por acá");
    el.remove();
  });
});

describe("AdvancedTable — nombre accesible del toggle de acciones", () => {
  it("el botón '...' de la fila expone un nombre accesible (es solo un ícono)", async () => {
    const w = mount(AdvancedTable, { props: { columns, data, actions } });
    const toggles = w.findAll(".cu-advanced-table-actions-btn");
    expect(toggles).toHaveLength(1);
    expect(toggles[0].attributes("aria-label")).toBe("Acciones de la fila");
  });
});

describe("AdvancedTable.ce (cu-table vanilla) — getData", () => {
  const TAG = "cu-table-getdata-test";
  if (!customElements.get(TAG)) {
    customElements.define(TAG, defineCustomElement(AdvancedTableCe));
  }

  it("`getData()` devuelve todas las filas y `getData(fn)` las filtra (igual que en Vue)", async () => {
    const el = document.createElement(TAG) as any;
    el.columns = [
      { key: "nombre", label: "Nombre" },
      { key: "rol", label: "Rol" },
    ];
    el.data = [
      { nombre: "A", rol: "Admin" },
      { nombre: "B", rol: "User" },
      { nombre: "C", rol: "Admin" },
    ];
    document.body.appendChild(el);
    await flushPromises();

    expect(el.getData()).toHaveLength(3);
    expect(el.getData((row: Record<string, any>) => row.rol === "Admin").map((r: any) => r.nombre)).toEqual([
      "A",
      "C",
    ]);
    el.remove();
  });
});

describe("AdvancedTable — `cell` que devuelve string[]", () => {
  const conCell = (cell: (row: Record<string, any>) => string | string[]) =>
    mount(AdvancedTable, {
      props: {
        columns: [{ key: "nombre", label: "Nombre" }, { key: "detalle", label: "Detalle", cell }],
        data: [{ nombre: "Juan", detalle: "x" }],
      },
    });

  it("renderiza una línea por elemento (no el JSON que Vue aplica a los arrays)", () => {
    const w = conCell(() => ["Juan Pérez", "DNI 12345678", "Admin"]);
    const celda = w.findAll(".cu-table-row td")[1]!;
    const lineas = celda.findAll(".cu-advanced-table-cell-lines > span");

    expect(lineas.map((l) => l.text())).toEqual(["Juan Pérez", "DNI 12345678", "Admin"]);
    expect(celda.text()).not.toContain("[");
    expect(celda.text()).not.toContain('"');
  });

  it("escapa el contenido: el HTML de una línea se ve como texto, no se inyecta", () => {
    const w = conCell(() => ['<b class="xss">negrita</b>']);
    const celda = w.findAll(".cu-table-row td")[1]!;

    expect(celda.find("b").exists()).toBe(false);
    expect(celda.find(".cu-advanced-table-cell-lines > span").text()).toBe('<b class="xss">negrita</b>');
  });

  it("un array vacío deja la celda vacía (no cae al valor crudo de la fila)", () => {
    const w = conCell(() => []);
    const celda = w.findAll(".cu-table-row td")[1]!;

    expect(celda.find(".cu-advanced-table-cell-lines").exists()).toBe(false);
    // "x" es `row.detalle`: el fallback del `Table` no debe aparecer.
    expect(celda.text()).toBe("");
    expect(celda.text()).not.toContain("x");
  });

  it("un `cell` que devuelve string sigue renderizando en un solo nodo", () => {
    const w = conCell(() => "una sola línea");
    const celda = w.findAll(".cu-table-row td")[1]!;

    expect(celda.find(".cu-advanced-table-cell-lines").exists()).toBe(false);
    expect(celda.find("span").text()).toBe("una sola línea");
  });
});

describe("AdvancedTable — iconos de `ButtonConfig` (v-html saneado)", () => {
  const evilIcon = '<img src=x onerror="window.__xss=1"><script>window.__xss=2</script>';
  const legitIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M4 4h16v16H4z"/></svg>';

  it("los botones de celda conservan SVG válidos y no ejecutan handlers", () => {
    type XssWindow = Window & { __xss?: number };
    const probe = window as XssWindow;
    delete probe.__xss;

    const w = mount(AdvancedTable, {
      props: {
        columns: [
          {
            key: "acciones",
            label: "Acciones",
            buttons: () => [
              { label: "Ok", icon: legitIcon },
              { label: "Malo", icon: evilIcon },
            ],
          },
        ],
        data: [{ nombre: "Juan" }],
      },
    });

    const icons = w.findAll(".cu-advanced-table-icon");
    // El SVG legítimo sobrevive; del hostil queda sólo lo inerte (sin handler).
    expect(icons.some((i) => i.find("svg path").exists())).toBe(true);
    expect(w.find(".cu-advanced-table-icon script").exists()).toBe(false);
    expect(w.html()).not.toContain("onerror");
    expect(w.html()).not.toContain("<script");
    expect(probe.__xss).toBeUndefined();
  });

  it("los ítems del dropdown de `actions` llegan saneados", () => {
    const w = mount(AdvancedTable, {
      props: {
        columns,
        data,
        actions: [{ label: "Editar", icon: evilIcon, onClick: () => {} }],
      },
    });
    const items = w.findComponent(DropdownMenu).props("items") as { icon?: string }[];
    expect(items[0]!.icon).not.toContain("onerror");
    expect(items[0]!.icon).not.toContain("<script");
    // Un SVG válido pasa intacto.
    const clean = mount(AdvancedTable, {
      props: { columns, data, actions: [{ label: "Editar", icon: legitIcon }] },
    });
    const cleanItems = clean.findComponent(DropdownMenu).props("items") as { icon?: string }[];
    expect(cleanItems[0]!.icon).toContain("<svg");
    expect(cleanItems[0]!.icon).toContain('d="M4 4h16v16H4z"');
  });
});
