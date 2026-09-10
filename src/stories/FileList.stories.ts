import FileList from "@/components/FileList.vue";
import type { ComponentStory, Variant } from "@/stories/types";

function makeFile(name: string, size: number, type = "text/plain"): File {
  return new File([new ArrayBuffer(size)], name, { type });
}

const FILES = [makeFile("informe.pdf", 1024), makeFile("foto.png", 2048)];
const SINGLE = makeFile("solo.txt", 0);

const COLORS = ["primary", "secondary", "neutral", "success", "warning", "danger"] as const;

function colorVariants(): Variant[] {
  return COLORS.map((color) => ({
    id: color,
    props: { files: FILES, color },
  }));
}

export const cuFileListStories: ComponentStory = {
  component: "cu-file-list",
  vue: FileList,
  sections: [
    {
      id: "items",
      title: "Items",
      variants: [
        { id: "two-files", props: { files: FILES } },
        { id: "single-file", props: { files: SINGLE } },
      ],
      checks: {
        l1: [
          {
            name: "renderiza un item por archivo con nombre, tamaño e icono",
            run({ wrapper, expect }, variant) {
              const files = Array.isArray(variant.props?.files) ? variant.props.files : [variant.props?.files];
              const items = wrapper.findAll(".cu-file-list-item");
              expect(items.length).toBe(files.length);
              expect(wrapper.find(".cu-file-list-name").text()).toBe(files[0].name);
              expect(wrapper.find(".cu-file-list-size").text()).toBe(files[0].size === 0 ? "0 B" : "1.0 KB");
              expect(wrapper.find(".cu-file-list-icon").exists()).toBe(true);
            },
          },
        ],
      },
    },

    {
      id: "empty",
      title: "Empty",
      variants: [{ id: "null", props: { files: null } }],
      checks: {
        l1: [
          {
            name: "sin files no renderiza la lista",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-file-list").exists()).toBe(false);
            },
          },
        ],
      },
    },

    {
      id: "select",
      title: "Select",
      variants: [{ id: "two-files", props: { files: FILES } }],
      checks: {
        l1: [
          {
            name: "click en un item emite select con el índice",
            async run({ wrapper, expect }) {
              const items = wrapper.findAll(".cu-file-list-item");
              await items[1]!.trigger("click");
              const select = wrapper.emitted("select") as unknown[][] | undefined;
              expect(select).toBeTruthy();
              expect(select![0]![0]).toBe(1);
            },
          },
        ],
      },
    },

    {
      id: "remove",
      title: "Remove",
      variants: [{ id: "two-files", props: { files: FILES } }],
      checks: {
        l1: [
          {
            name: "click en remover emite remove y NO select",
            async run({ wrapper, expect }) {
              const removeButtons = wrapper.findAll(".cu-file-list-remove");
              expect(removeButtons.length).toBe(2);
              await removeButtons[0]!.trigger("click");
              const remove = wrapper.emitted("remove") as unknown[][] | undefined;
              expect(remove).toBeTruthy();
              expect(remove![0]![0]).toBe(0);
              expect(wrapper.emitted("select")).toBeUndefined();
            },
          },
        ],
      },
    },

    {
      id: "disabled",
      title: "Disabled",
      variants: [{ id: "disabled", props: { files: FILES, disabled: true } }],
      checks: {
        l1: [
          {
            name: "disabled: sin botones de remover, select sigue funcionando",
            async run({ wrapper, expect }) {
              expect(wrapper.find(".cu-file-list-remove").exists()).toBe(false);
              await wrapper.find(".cu-file-list-item").trigger("click");
              expect(wrapper.emitted("select")).toBeTruthy();
            },
          },
        ],
      },
    },

    {
      id: "max-height",
      title: "Max Height",
      variants: [{ id: "max-height", props: { files: FILES, maxHeight: "300px" } }],
      checks: {
        l1: [
          {
            name: "aplica overflow-y auto al contenedor",
            run({ wrapper, expect }) {
              expect(wrapper.find(".cu-file-list").attributes("style")).toContain("overflow-y: auto");
            },
          },
        ],
      },
    },

    {
      id: "colors",
      title: "Colors",
      variants: colorVariants(),
      checks: {
        l1: [
          {
            name: "resuelve --list-text al token --cu-color-{color}",
            run({ wrapper, expect }, variant) {
              expect(wrapper.html()).toContain(`var(--cu-color-${variant.props?.color}`);
            },
          },
        ],
      },
    },
  ],
};
