import { describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
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
