import { describe, it, expect } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import EditableTableCell from "./EditableTableCell.vue";
import Input from "../form/Input.vue";

const row = { id: 1, name: "Alice Johnson", status: "Active" };

function factory(column: Record<string, any>, value: string | number | boolean = "Alice Johnson", inlineEdit = false) {
  return mount(EditableTableCell, {
    props: {
      value,
      row,
      column: { key: "name", label: "Name", editable: true, ...column },
      index: 0,
      validation: { success: false, error: null },
      inlineEdit,
    },
  });
}

describe("EditableTableCell — modo lápiz (default) y estado inline", () => {
  it("default: muestra el lápiz y NO el input", () => {
    const w = factory({});
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
    expect(w.find("input").exists()).toBe(false);
  });

  it("default: click sobre la celda abre el editor", async () => {
    const w = factory({});
    await w.trigger("click");
    await flushPromises();
    expect(w.find("input").exists()).toBe(true);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
  });

  it("default: Escape cierra y vuelve al lápiz", async () => {
    const w = factory({});
    await w.trigger("click");
    await flushPromises();
    await w.find("input").trigger("keydown", { key: "Escape" });
    await flushPromises();
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
    expect(w.find("input").exists()).toBe(false);
  });

  it("default: Enter guarda (edit-save) y vuelve al lápiz", async () => {
    const w = factory({});
    await w.trigger("click");
    await flushPromises();
    await w.find("input").setValue("Bob Smith");
    await w.find("input").trigger("keydown", { key: "Enter" });
    await flushPromises();
    const saves = w.emitted("edit-save");
    expect(saves).toBeTruthy();
    const payload = (saves as unknown[][])[0]![0] as { value: string };
    expect(payload.value).toBe("Bob Smith");
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
  });

  it("inlineEdit: renderiza el editor directo, sin lápiz", () => {
    const w = factory({}, "Alice Johnson", true);
    expect(w.find("input").exists()).toBe(true);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
  });

  it("inlineEdit: Enter guarda y SIGUE mostrando el editor", async () => {
    const w = factory({}, "Alice Johnson", true);
    await w.find("input").setValue("Bob Smith");
    await w.find("input").trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(w.emitted("edit-save")).toBeTruthy();
    expect(w.find("input").exists()).toBe(true);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
  });

  it("inlineEdit: Escape revierte y sigue mostrando el editor", async () => {
    const w = factory({}, "Alice Johnson", true);
    await w.find("input").setValue("Changed");
    await w.find("input").trigger("keydown", { key: "Escape" });
    await flushPromises();
    expect(w.find("input").exists()).toBe(true);
    const inputEl = w.find("input").element as HTMLInputElement | undefined;
    expect(inputEl?.value).toBe("Alice Johnson");
  });

  it("inlineEdit es un estado: al apagarlo vuelve al lápiz", async () => {
    const w = factory({}, "Alice Johnson", true);
    expect(w.find("input").exists()).toBe(true);
    await w.setProps({ inlineEdit: false });
    await flushPromises();
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
    expect(w.find("input").exists()).toBe(false);
  });

  it("column.inlineEdit: renderiza el editor directo, sin lápiz", () => {
    const w = factory({ inlineEdit: true });
    expect(w.find("input").exists()).toBe(true);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
  });

  it("column.inlineEdit tiene prioridad sobre el inlineEdit de la tabla", () => {
    const w = factory({ inlineEdit: true }, "Alice Johnson", false);
    expect(w.find("input").exists()).toBe(true);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
  });

  it("regex inválido: emite edit-error y NO edit-save (no guarda)", async () => {
    const w = factory({ editable: /^\d+\.\d{2}$/ }, "1200.50", true);
    await w.find("input").setValue("1200.555");
    await w.find("input").trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(w.emitted("edit-save")).toBeFalsy();
    expect(w.emitted("edit-error")).toBeTruthy();
    const payload = (w.emitted("edit-error")![0]![0] as { value: string });
    expect(payload.value).toBe("1200.555");
  });

  it("regex válido: NO emite edit-error y sí edit-save", async () => {
    const w = factory({ editable: /^\d+\.\d{2}$/ }, "1200.50", true);
    await w.find("input").setValue("25.99");
    await w.find("input").trigger("keydown", { key: "Enter" });
    await flushPromises();
    expect(w.emitted("edit-error")).toBeFalsy();
    expect(w.emitted("edit-save")).toBeTruthy();
  });

  it("validation.error: el input recibe color danger (se tiñe de rojo)", async () => {
    const w = factory({}, "Alice Johnson", true);
    await w.setProps({ validation: { success: false, error: "Formato inválido" } });
    await flushPromises();
    expect(w.findComponent(Input).props("color")).toBe("danger");
  });

  it("inputType 'date': muestra la fecha formateada en modo vista", () => {
    const w = factory({ inputType: "date", date: { format: "dd/MM/yyyy" } }, "2026-08-14");
    expect(w.find(".cu-editable-cell-view").text()).toContain("14/08/2026");
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
  });

  it("inputType 'date': al elegir un día guarda 'YYYY-MM-DD' y sale del editor (modo lápiz)", async () => {
    const w = factory({ inputType: "date", date: { format: "dd/MM/yyyy" } }, "2026-08-14");
    await w.find(".cu-editable-cell-view").trigger("click");
    await flushPromises();
    // el editor es el date-picker
    expect(w.find(".cu-date-picker").exists()).toBe(true);
    // abrir el panel y elegir el 20
    await w.find(".cu-date-picker-toggle").trigger("click");
    await flushPromises();
    const day20 = w.findAll(".cu-calendar-day").find((d) => d.text() === "20");
    expect(day20).toBeTruthy();
    await day20!.trigger("click");
    await flushPromises();
    const saves = w.emitted("edit-save");
    expect(saves).toBeTruthy();
    expect((saves![0]![0] as any).value).toBe("2026-08-20");
    // en modo lápiz vuelve a la vista
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
  });

  it("inputType 'switch': renderiza el switch directo, sin lápiz ni input", () => {
    const w = factory({ inputType: "switch" }, true);
    expect(w.find(".cu-switch").exists()).toBe(true);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
    expect(w.find("input[type='checkbox']").exists()).toBe(true);
  });

  it("inputType 'switch': arranca marcado si el valor es true", () => {
    const w = factory({ inputType: "switch" }, true);
    expect(w.find(".cu-switch-track").classes()).toContain("cu-switch--checked");
  });

  it("inputType 'switch': al alternar emite edit-save con valor booleano", async () => {
    const w = factory({ inputType: "switch" }, false);
    await w.find("input[type='checkbox']").setValue(true);
    await flushPromises();
    const saves = w.emitted("edit-save");
    expect(saves).toBeTruthy();
    expect((saves![0]![0] as any).value).toBe(true);
  });

  it("inputType 'switch': NO usa width 100% (no se estira en la celda)", () => {
    const w = factory({ inputType: "switch" });
    const sw = w.find(".cu-switch");
    expect(sw.exists()).toBe(true);
    expect(sw.classes()).not.toContain("cu-editable-cell-input");
    expect(sw.classes()).toContain("cu-editable-cell-switch");
  });

  it("inputType 'switch': por defecto queda centrado en la celda", () => {
    const w = factory({ inputType: "switch" });
    expect((w.find(".cu-editable-cell").element as HTMLElement).style.textAlign).toBe("center");
  });

  it("editorAlign: 'start' y 'end' sobreescriben el centrado default del switch", () => {
    const start = factory({ inputType: "switch", editorAlign: "start" });
    expect((start.find(".cu-editable-cell").element as HTMLElement).style.textAlign).toBe("start");
    const end = factory({ inputType: "switch", editorAlign: "end" });
    expect((end.find(".cu-editable-cell").element as HTMLElement).style.textAlign).toBe("end");
  });

  it("disabled: la celda se atenúa y NO entra en modo edición al hacer click", async () => {
    const w = mount(EditableTableCell, {
      props: {
        value: "Alice",
        row,
        column: { key: "name", label: "Name", editable: true },
        index: 0,
        validation: { success: false, error: null },
        disabled: true,
      },
    });
    const cell = w.find(".cu-editable-cell");
    expect(cell.classes()).toContain("cu-editable-cell--disabled");
    await cell.trigger("click");
    await flushPromises();
    expect(w.find("input").exists()).toBe(false);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
  });

  it("disabled: en modo inline NO renderiza el editor (queda la vista atenuada)", () => {
    const w = mount(EditableTableCell, {
      props: {
        value: "Alice",
        row,
        column: { key: "name", label: "Name", editable: true },
        index: 0,
        validation: { success: false, error: null },
        inlineEdit: true,
        disabled: true,
      },
    });
    expect(w.find("input").exists()).toBe(false);
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(true);
    expect(w.find(".cu-editable-cell").classes()).toContain("cu-editable-cell--disabled");
  });

  it("disabled: un switch disabled SIGUE renderizándose como switch (deshabilitado), sin lápiz", () => {
    const w = mount(EditableTableCell, {
      props: {
        value: true,
        row,
        column: { key: "activo", label: "Activo", editable: true, inputType: "switch" },
        index: 0,
        validation: { success: false, error: null },
        disabled: true,
      },
    });
    const sw = w.find(".cu-switch");
    expect(sw.exists()).toBe(true);
    expect(sw.classes()).toContain("cu-switch--disabled");
    expect(w.find(".cu-editable-cell-icon").exists()).toBe(false);
    expect(w.find(".cu-editable-cell").classes()).toContain("cu-editable-cell--disabled");
  });
});
