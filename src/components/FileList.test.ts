import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FileList from "./FileList.vue";

function makeFile(name: string, size: number, type = "text/plain"): File {
  return new File([new ArrayBuffer(size)], name, { type });
}

const files = [makeFile("informe.pdf", 1024), makeFile("foto.png", 2048)];

function factory(props: Record<string, unknown> = {}) {
  return mount(FileList, { props: { files, ...props } });
}

describe("FileList — lista de archivos", () => {
  it("render smoke: items con nombre, tamaño e icono", () => {
    const w = factory();
    const items = w.findAll(".cu-file-list-item");
    expect(items.length).toBe(2);
    expect(w.find(".cu-file-list-name").text()).toBe("informe.pdf");
    expect(w.find(".cu-file-list-size").text()).toBe("1.0 KB");
    expect(w.find(".cu-file-list-icon").exists()).toBe(true);
  });

  it("acepta un único File (no array)", () => {
    const w = mount(FileList, { props: { files: makeFile("solo.txt", 0) } });
    expect(w.findAll(".cu-file-list-item").length).toBe(1);
    expect(w.find(".cu-file-list-size").text()).toBe("0 B");
  });

  it("sin files: no renderiza la lista", () => {
    const w = mount(FileList, { props: { files: null } });
    expect(w.find(".cu-file-list").exists()).toBe(false);
  });

  it("click en un item emite select con el índice", async () => {
    const w = factory();
    const items = w.findAll(".cu-file-list-item");
    await items[1]!.trigger("click");
    const em = w.emitted("select");
    expect(em).toBeTruthy();
    expect((em as unknown[][])[0]![0] as number).toBe(1);
  });

  it("click en el botón remover emite remove y NO select", async () => {
    const w = factory();
    const removeBtns = w.findAll(".cu-file-list-remove");
    expect(removeBtns.length).toBe(2);
    await removeBtns[0]!.trigger("click");
    const rm = w.emitted("remove");
    expect(rm).toBeTruthy();
    expect((rm as unknown[][])[0]![0] as number).toBe(0);
    expect(w.emitted("select")).toBeUndefined();
  });

  it("disabled: no muestra botones de remover, pero select sigue funcionando", async () => {
    const w = factory({ disabled: true });
    expect(w.find(".cu-file-list-remove").exists()).toBe(false);
    await w.find(".cu-file-list-item").trigger("click");
    expect(w.emitted("select")).toBeTruthy();
  });

  it("maxHeight: aplica overflow-y auto al contenedor", () => {
    const w = factory({ maxHeight: "300px" });
    expect(w.find(".cu-file-list").attributes("style")).toContain("overflow-y: auto");
  });
});
