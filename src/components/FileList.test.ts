// Comportamiento de FileList según su ficha (docs/componentes/vue/file-list.md).
// Aserciones escritas a mano desde la prosa (fallan por bugs reales).
import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import FileList from "./FileList.vue";

const f = (name: string, size = 1024, type = "text/plain") =>
  new File([new Uint8Array(size)], name, { type });

const files = [f("informe.pdf", 2048), f("foto.png", 4096), f("datos.csv", 1024)];

describe("FileList — render", () => {
  it("no renderiza nada si no hay archivos", () => {
    expect(mount(FileList).find(".cu-file-list").exists()).toBe(false);
    expect(mount(FileList, { props: { files: [] } }).find(".cu-file-list").exists()).toBe(false);
  });

  it("renderiza una fila por archivo con su nombre", () => {
    const w = mount(FileList, { props: { files } });
    const rows = w.findAll(".cu-file-list-item");
    expect(rows).toHaveLength(3);
    expect(rows.map((r) => r.find(".cu-file-list-name").text())).toEqual([
      "informe.pdf",
      "foto.png",
      "datos.csv",
    ]);
  });

  it("muestra el tamaño formateado de cada archivo", () => {
    const w = mount(FileList, { props: { files } });
    const sizes = w.findAll(".cu-file-list-size").map((n) => n.text());
    expect(sizes[0]).toBe("2.0 KB");
    expect(sizes[2]).toBe("1.0 KB");
  });

  it("acepta un único `File` (no array) y lo renderiza", () => {
    const w = mount(FileList, { props: { files: f("solo.txt") } });
    expect(w.findAll(".cu-file-list-item")).toHaveLength(1);
    expect(w.find(".cu-file-list-name").text()).toBe("solo.txt");
  });

  it("renderiza el ícono según el tipo de archivo", () => {
    const w = mount(FileList, { props: { files } });
    const icon = w.find(".cu-file-list-icon");
    expect(icon.exists()).toBe(true);
    expect(icon.html()).toContain("<svg");
  });
});

describe("FileList — eventos", () => {
  it("click en una fila emite `select` con su índice", async () => {
    const w = mount(FileList, { props: { files } });
    await w.findAll(".cu-file-list-item")[1]!.trigger("click");
    expect(w.emitted("select")!.at(-1)).toEqual([1]);
  });

  it("click en el botón de quitar emite `remove` con su índice (no `select`)", async () => {
    const w = mount(FileList, { props: { files } });
    await w.findAll(".cu-file-list-remove")[2]!.trigger("click");
    expect(w.emitted("remove")!.at(-1)).toEqual([2]);
    expect(w.emitted("select")).toBeUndefined();
  });

  it("con `disabled` no hay botones de quitar", () => {
    const w = mount(FileList, { props: { files, disabled: true } });
    expect(w.findAll(".cu-file-list-remove")).toHaveLength(0);
  });
});

describe("FileList — estilos", () => {
  it("aplica el color semántico como variables CSS", () => {
    const w = mount(FileList, { props: { files, color: "danger" } });
    const style = w.find(".cu-file-list").attributes("style");
    expect(style).toContain("--list-text: var(--cu-color-danger-text)");
  });

  it("`maxHeight` fija el alto máximo y activa el scroll", () => {
    const w = mount(FileList, { props: { files, maxHeight: "10rem" } });
    const style = w.find(".cu-file-list").attributes("style");
    expect(style).toContain("10rem");
    expect(style).toContain("overflow-y: auto");
  });
});
