// Comportamiento de FileInputZone según su ficha (docs/componentes/vue/file-input-zone.md).
//
// Aserciones escritas a mano desde la prosa: fallan por bugs reales.
import { describe, it, expect, vi, beforeAll } from "vitest";
import { flushPromises, mount } from "@vue/test-utils";
import FileInputZone from "./FileInputZone.vue";

type ZoneVm = {
  get: () => File | File[] | null;
  set: (f: File | File[] | null) => void;
  reset: () => void;
  focus: () => void;
  trigger: () => void;
};

const vm = (w: ReturnType<typeof mount>) => w.vm as unknown as ZoneVm;
const zone = (w: ReturnType<typeof mount>) => w.find(".cu-file-zone");
const hiddenInput = (w: ReturnType<typeof mount>) =>
  w.find("input.cu-file-zone-hidden").element as HTMLInputElement;

beforeAll(() => {
  if (!URL.createObjectURL) URL.createObjectURL = vi.fn(() => "blob:mock");
  if (!URL.revokeObjectURL) URL.revokeObjectURL = vi.fn();
});

function makeFile(name: string, opts: { type?: string } = {}): File {
  return new File(["contenido"], name, opts);
}

function setInputFiles(w: ReturnType<typeof mount>, files: File[]) {
  Object.defineProperty(hiddenInput(w), "files", { value: files, configurable: true });
  hiddenInput(w).dispatchEvent(new Event("change"));
}

/** Entrada de archivo del File System API que entrega el `File` cuando el test lo pide. */
function controlledEntry(file: File) {
  let deliver: ((f: File) => void) | null = null;
  const entry = {
    isFile: true,
    isDirectory: false,
    file: (cb: (f: File) => void) => {
      deliver = cb;
    },
  };
  return {
    entry,
    resolve: () => deliver?.(file),
  };
}

/** Entrada que no se puede leer (permiso, archivo borrado): llama al callback de error. */
function failingEntry() {
  return {
    isFile: true,
    isDirectory: false,
    file: (_cb: (f: File) => void, onError?: () => void) => {
      onError?.();
    },
  };
}

function entryItem(entry: unknown) {
  return { webkitGetAsEntry: () => entry, getAsFile: () => null };
}

/** Espía el `value` del input nativo (jsdom prohíbe asignarle una ruta real). */
function trackInputValue(input: HTMLInputElement) {
  let stored = "C:\\fakepath\\elegido.txt";
  Object.defineProperty(input, "value", {
    configurable: true,
    get: () => stored,
    set: (v: string) => {
      stored = v;
    },
  });
  return {
    get value() {
      return stored;
    },
  };
}

function dispatchDragLeave(el: Element, relatedTarget: Node | null) {
  const event = new Event("dragleave", { bubbles: true, cancelable: true });
  Object.defineProperty(event, "relatedTarget", { value: relatedTarget });
  el.dispatchEvent(event);
}

describe("FileInputZone — selección", () => {
  it("arranca vacío y muestra el placeholder", () => {
    const w = mount(FileInputZone, { props: { placeholder: "Arrastra un archivo" } });
    expect(vm(w).get()).toBeNull();
    expect(w.find(".cu-file-zone-placeholder").text()).toBe("Arrastra un archivo");
    expect(zone(w).classes()).toContain("cu-file-zone--empty");
  });

  it("selection simple guarda un File y emite update:modelValue", async () => {
    const w = mount(FileInputZone);
    setInputFiles(w, [makeFile("uno.txt", { type: "text/plain" })]);
    await flushPromises();

    expect(vm(w).get()).toBeInstanceOf(File);
    expect((vm(w).get() as File).name).toBe("uno.txt");
    expect(w.emitted("update:modelValue")).toBeTruthy();
  });

  it("con multiple guarda un array con todos los archivos", async () => {
    const w = mount(FileInputZone, { props: { multiple: true } });
    setInputFiles(w, [
      makeFile("a.txt", { type: "text/plain" }),
      makeFile("b.txt", { type: "text/plain" }),
    ]);
    await flushPromises();

    const value = vm(w).get();
    expect(Array.isArray(value)).toBe(true);
    expect((value as File[]).map((f) => f.name)).toEqual(["a.txt", "b.txt"]);
  });

  it("directory activa multiple y marca webkitdirectory en el input", () => {
    const w = mount(FileInputZone, { props: { directory: true } });
    expect(zone(w).classes()).not.toContain("cu-file-zone--has-files");
    expect(hiddenInput(w).multiple).toBe(true);
    expect(hiddenInput(w).hasAttribute("webkitdirectory")).toBe(true);
  });

  it("rechaza un archivo inválido por accept y muestra el motivo", async () => {
    const w = mount(FileInputZone, { props: { accept: "image/*" } });
    setInputFiles(w, [makeFile("nota.txt", { type: "text/plain" })]);
    await flushPromises();

    expect(vm(w).get()).toBeNull();
    expect(w.find(".cu-file-zone-reject").text()).toContain("formato no permitido");
  });

  it("rechaza un archivo que supera maxSize", async () => {
    const w = mount(FileInputZone, { props: { maxSize: 2 } });
    setInputFiles(w, [makeFile("grande.txt", { type: "text/plain" })]);
    await flushPromises();

    expect(vm(w).get()).toBeNull();
    expect(w.find(".cu-file-zone-reject").text()).toContain("tamaño máximo");
  });
});

describe("FileInputZone — lista de archivos", () => {
  it("con archivos renderiza la lista y permite quitar uno individual", async () => {
    const w = mount(FileInputZone, { props: { multiple: true } });
    vm(w).set([
      makeFile("a.txt", { type: "text/plain" }),
      makeFile("b.txt", { type: "text/plain" }),
    ]);
    await flushPromises();

    expect(w.findAll(".cu-file-list-item")).toHaveLength(2);
    expect(w.find(".cu-file-zone").classes()).toContain("cu-file-zone--has-files");

    await w.findAll(".cu-file-list-remove")[0]!.trigger("click");
    await flushPromises();

    const value = vm(w).get() as File[];
    expect(value.map((f) => f.name)).toEqual(["b.txt"]);
  });

  it("set() y reset() controlan los archivos programáticamente", async () => {
    const w = mount(FileInputZone);
    vm(w).set(makeFile("solo.txt", { type: "text/plain" }));
    await flushPromises();
    expect((vm(w).get() as File).name).toBe("solo.txt");

    vm(w).reset();
    await flushPromises();
    expect(vm(w).get()).toBeNull();
    expect(w.find(".cu-file-zone--empty").exists()).toBe(true);
  });
});

describe("FileInputZone — drag & drop y disabled", () => {
  it("dragOver marca la clase y dragLeave la quita", async () => {
    const w = mount(FileInputZone);
    await zone(w).trigger("dragover");
    expect(zone(w).classes()).toContain("cu-file-zone--drag-over");
    await zone(w).trigger("dragleave");
    expect(zone(w).classes()).not.toContain("cu-file-zone--drag-over");
  });

  it("cruzar un hijo de la zona no apaga el resaltado; salir sí", async () => {
    const w = mount(FileInputZone, { props: { placeholder: "Arrastra" } });
    await zone(w).trigger("dragover");
    const child = w.find(".cu-file-zone-text").element;

    dispatchDragLeave(zone(w).element, child);
    await flushPromises();
    expect(zone(w).classes()).toContain("cu-file-zone--drag-over");

    dispatchDragLeave(zone(w).element, document.body);
    await flushPromises();
    expect(zone(w).classes()).not.toContain("cu-file-zone--drag-over");
  });

  it("soltar archivos sin items (fallback dataTransfer.files) los agrega", async () => {
    const w = mount(FileInputZone);
    const file = makeFile("drop.txt", { type: "text/plain" });
    await zone(w).trigger("drop", { dataTransfer: { items: [], files: [file] } });
    await flushPromises();

    expect(vm(w).get()).toBe(file);
  });

  it("conserva el orden del drop aunque las lecturas terminen en otro orden", async () => {
    const w = mount(FileInputZone, { props: { multiple: true } });
    const primero = controlledEntry(makeFile("primero.txt", { type: "text/plain" }));
    const segundo = controlledEntry(makeFile("segundo.txt", { type: "text/plain" }));
    const items = [entryItem(primero.entry), entryItem(segundo.entry)];

    await zone(w).trigger("drop", { dataTransfer: { items, files: [] } });
    segundo.resolve();
    primero.resolve();
    await flushPromises();

    expect((vm(w).get() as File[]).map((f) => f.name)).toEqual(["primero.txt", "segundo.txt"]);
  });

  it("sin multiple, el archivo elegido es el primero soltado (no el que se leyó antes)", async () => {
    const w = mount(FileInputZone);
    const primero = controlledEntry(makeFile("primero.txt", { type: "text/plain" }));
    const segundo = controlledEntry(makeFile("segundo.txt", { type: "text/plain" }));
    const items = [entryItem(primero.entry), entryItem(segundo.entry)];

    await zone(w).trigger("drop", { dataTransfer: { items, files: [] } });
    segundo.resolve();
    primero.resolve();
    await flushPromises();

    expect((vm(w).get() as File).name).toBe("primero.txt");
  });

  it("un ítem que no se puede leer no deja el drop colgado", async () => {
    const w = mount(FileInputZone, { props: { multiple: true } });
    const ok = controlledEntry(makeFile("ok.txt", { type: "text/plain" }));
    const roto = failingEntry();
    const items = [entryItem(roto), entryItem(ok.entry)];

    await zone(w).trigger("drop", { dataTransfer: { items, files: [] } });
    ok.resolve();
    await flushPromises();

    expect((vm(w).get() as File[]).map((f) => f.name)).toEqual(["ok.txt"]);
  });

  it("no dispara el selector si está disabled", () => {
    const w = mount(FileInputZone, { props: { disabled: true } });
    const click = vi.spyOn(hiddenInput(w), "click");
    vm(w).trigger();
    expect(click).not.toHaveBeenCalled();
  });
});

describe("FileInputZone — control de selección y teclado", () => {
  it("la zona es un grupo y el control de selección un <button> real y vacío", async () => {
    const w = mount(FileInputZone, { props: { placeholder: "Arrastra un archivo" } });
    expect(zone(w).attributes("role")).toBe("group");

    const trigger = w.find(".cu-file-zone-trigger");
    expect(trigger.element.tagName).toBe("BUTTON");
    expect(trigger.attributes("type")).toBe("button");
    expect(trigger.text()).toBe("");
    expect(trigger.attributes("aria-label")).toBe("Arrastra un archivo");

    const click = vi.spyOn(hiddenInput(w), "click");
    await trigger.trigger("click");
    expect(click).toHaveBeenCalled();
  });

  it("con archivos el control invita a agregar o cambiar", async () => {
    const multi = mount(FileInputZone, {
      props: { multiple: true, modelValue: [makeFile("a.txt", { type: "text/plain" })] },
    });
    await flushPromises();
    expect(multi.find(".cu-file-zone-trigger").attributes("aria-label")).toBe("Agregar archivos");

    const simple = mount(FileInputZone, {
      props: { modelValue: makeFile("a.txt", { type: "text/plain" }) },
    });
    await flushPromises();
    expect(simple.find(".cu-file-zone-trigger").attributes("aria-label")).toBe("Cambiar archivo");
  });

  it("los controles de las filas no quedan dentro del botón de la zona", async () => {
    const w = mount(FileInputZone, {
      props: { multiple: true, modelValue: [makeFile("a.txt", { type: "text/plain" })] },
    });
    await flushPromises();
    expect(w.find(".cu-file-zone-trigger").findAll("button, a, input")).toHaveLength(0);
    expect(zone(w).find(".cu-file-list-name").element.tagName).toBe("BUTTON");
  });

  it("el botón de quitar de una fila no abre el selector", async () => {
    const w = mount(FileInputZone, {
      props: { modelValue: makeFile("a.txt", { type: "text/plain" }) },
    });
    await flushPromises();
    const click = vi.spyOn(hiddenInput(w), "click");

    await w.find(".cu-file-list-remove").trigger("click");

    expect(click).not.toHaveBeenCalled();
  });

  it("focus() enfoca el control de selección", () => {
    const w = mount(FileInputZone, { attachTo: document.body });
    vm(w).focus();
    expect(document.activeElement).toBe(w.find(".cu-file-zone-trigger").element);
    w.unmount();
  });

  it("con readOnly no se puede quitar y el control queda deshabilitado", async () => {
    const w = mount(FileInputZone, {
      props: { multiple: true, readOnly: true, modelValue: [makeFile("a.txt", { type: "text/plain" })] },
    });
    await flushPromises();
    expect(w.find(".cu-file-zone-trigger").attributes("disabled")).toBeDefined();
    expect(w.find(".cu-file-list-remove").exists()).toBe(false);
  });
});

describe("FileInputZone — input nativo", () => {
  it("se vacía al procesar la selección, para poder volver a elegir el mismo archivo", async () => {
    const w = mount(FileInputZone);
    const input = hiddenInput(w);
    Object.defineProperty(input, "files", {
      value: [makeFile("repetido.txt", { type: "text/plain" })],
      configurable: true,
    });
    const state = trackInputValue(input);

    input.dispatchEvent(new Event("change"));
    await flushPromises();

    expect(state.value).toBe("");
    expect((vm(w).get() as File).name).toBe("repetido.txt");
  });
});
