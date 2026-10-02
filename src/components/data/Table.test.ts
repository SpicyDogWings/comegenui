// Comportamiento de Table según su ficha (docs/componentes/vue/table.md).
//
// Aserciones escritas a MANO desde la prosa de la ficha (columnas, datos,
// estado vacío, filas deshabilitadas y footer).
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import Table from "./Table.vue";

const columns = [
  { key: "name", label: "Nombre" },
  { key: "role", label: "Rol", align: "right" as const },
];
const data = [
  { name: "Ana", role: "Dev" },
  { name: "Luis", role: "Ops" },
];

describe("Table — columnas y datos", () => {
  it("renderiza un th por columna con su label", () => {
    const w = mount(Table, { props: { columns, data } });
    const ths = w.findAll(".cu-table-th");
    expect(ths).toHaveLength(2);
    expect(ths[0]!.text()).toContain("Nombre");
    expect(ths[1]!.text()).toContain("Rol");
  });

  it("usa la key como label cuando la columna no define label", () => {
    const w = mount(Table, { props: { columns: [{ key: "email" }], data: [] } });
    expect(w.find(".cu-table-th").text()).toContain("email");
  });

  it("renderiza una fila por dato y las celdas con su valor", () => {
    const w = mount(Table, { props: { columns, data } });
    expect(w.findAll(".cu-table-row")).toHaveLength(2);
    const firstRow = w.findAll(".cu-table-row")[0]!;
    const tds = firstRow.findAll(".cu-table-td");
    expect(tds[0]!.text()).toBe("Ana");
    expect(tds[1]!.text()).toBe("Dev");
  });

  it("sin `columns` las deriva de las claves del primer registro", () => {
    const w = mount(Table, { props: { data: [{ a: "1", b: "2" }] } });
    const ths = w.findAll(".cu-table-th").map((t) => t.text().trim());
    expect(ths).toEqual(["a", "b"]);
  });

  it("aplica la clase de alineación según `align`", () => {
    const w = mount(Table, { props: { columns, data } });
    const tds = w.findAll(".cu-table-row")[0]!.findAll(".cu-table-td");
    expect(tds[0]!.classes()).toContain("cu-table-td--left");
    expect(tds[1]!.classes()).toContain("cu-table-td--right");
  });
});

describe("Table — estado vacío", () => {
  it("sin datos muestra el mensaje `empty` por defecto", () => {
    const w = mount(Table, { props: { columns } });
    expect(w.find(".cu-table-empty").text()).toBe("No hay datos que mostrar");
  });

  it("el mensaje `empty` es personalizable", () => {
    const w = mount(Table, { props: { columns, empty: "Nada por acá" } });
    expect(w.find(".cu-table-empty").text()).toBe("Nada por acá");
  });

  it("el slot `empty` reemplaza el mensaje", () => {
    const w = mount(Table, {
      props: { columns },
      slots: { empty: '<span class="mi-empty">vacío</span>' },
    });
    expect(w.find(".mi-empty").exists()).toBe(true);
  });
});

describe("Table — filas deshabilitadas", () => {
  it("`rowDisabled: true` deshabilita todas las filas", () => {
    const w = mount(Table, { props: { columns, data, rowDisabled: true } });
    expect(w.findAll(".cu-table-row--disabled")).toHaveLength(2);
  });

  it("`rowDisabled` como función deshabilita solo las filas que cumplen", () => {
    const w = mount(Table, {
      props: { columns, data, rowDisabled: (row: Record<string, unknown>) => row.role === "Ops" },
    });
    const rows = w.findAll(".cu-table-row");
    expect(rows[0]!.classes()).not.toContain("cu-table-row--disabled");
    expect(rows[1]!.classes()).toContain("cu-table-row--disabled");
  });
});

describe("Table — footer", () => {
  it("la prop `footer` renderiza filas de pie", () => {
    const w = mount(Table, {
      props: {
        columns,
        data,
        footer: [{ cells: [{ value: "Total", colspan: 2 }] }],
      },
    });
    const tfoot = w.find("tfoot");
    expect(tfoot.exists()).toBe(true);
    expect(tfoot.text()).toContain("Total");
  });

  it("sin footer (ni slot ni prop) no renderiza el tfoot", () => {
    const w = mount(Table, { props: { columns, data } });
    expect(w.find("tfoot").exists()).toBe(false);
  });

  it("el slot `footer` tiene prioridad sobre la prop", () => {
    const w = mount(Table, {
      props: { columns, data, footer: [{ cells: [{ value: "Prop" }] }] },
      slots: { footer: '<tr><td class="slot-foot">Slot</td></tr>' },
    });
    expect(w.find(".slot-foot").exists()).toBe(true);
    expect(w.find("tfoot").text()).not.toContain("Prop");
  });
});

describe("Table — loading y htmlCells", () => {
  it("`loading` atenúa el cuerpo y muestra un loader", () => {
    const w = mount(Table, { props: { columns, data, loading: true } });
    expect(w.find(".cu-table-loading").exists()).toBe(true);
  });

  it("`htmlCells` interpreta el contenido de las celdas como HTML", () => {
    const w = mount(Table, {
      props: {
        columns: [{ key: "name" }],
        data: [{ name: "<b>negrita</b>" }],
        htmlCells: true,
      },
    });
    expect(w.find(".cu-table-td b").exists()).toBe(true);
  });

  it("sin `htmlCells` el HTML se escapa (se muestra como texto)", () => {
    const w = mount(Table, {
      props: { columns: [{ key: "name" }], data: [{ name: "<b>negrita</b>" }] },
    });
    expect(w.find(".cu-table-td b").exists()).toBe(false);
    expect(w.find(".cu-table-td").text()).toContain("<b>negrita</b>");
  });
});

describe("Table — slot `template`", () => {
  it("el slot `template` reemplaza las celdas por defecto", () => {
    const w = mount(Table, {
      props: { columns, data },
      slots: {
        template: `<template #template="{ row }"><td class="custom-cell">{{ row.name }}!</td></template>`,
      },
    });
    expect(w.findAll(".custom-cell")).toHaveLength(2);
    expect(w.findAll(".cu-table-row")[0]!.find(".custom-cell").text()).toBe("Ana!");
  });
});
