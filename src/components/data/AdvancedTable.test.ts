import { describe, expect, it } from "vitest";
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
