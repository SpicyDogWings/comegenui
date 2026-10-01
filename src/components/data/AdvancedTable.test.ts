import { describe, expect, it } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import { defineCustomElement } from "vue";

import AdvancedTable from "@/components/data/AdvancedTable.vue";
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
});
