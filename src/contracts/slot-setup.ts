// Setups de montaje para el contrato de ficha (`ficha-api.test.ts`).
//
// Algunos slots sólo existen con el componente en cierto estado (panel abierto,
// búsqueda activa, con filas, etc.). Acá se declara, por componente, con qué
// props y tras qué acción el slot queda visible. Sin esto, el test marcaría como
// roto un slot que la ficha documenta y que el componente sí renderiza.
//
//   slotProps: props extra al montar
//   reveal:    acción después de montar (ej. abrir el panel)
//   slots:     overrides por nombre de slot (slotProps/reveal específicos)
type Wrapper = {
  vm: Record<string, unknown> & { open?: () => void };
  findComponent: (c: unknown) => { vm: any };
};

type SlotSetup = {
  slotProps?: Record<string, unknown>;
  reveal?: (w: Wrapper) => void;
  slots?: Record<string, { slotProps?: Record<string, unknown>; reveal?: (w: Wrapper) => void }>;
};

export const SLOT_SETUP: Record<string, SlotSetup> = {
  // Slots dentro del panel: hay que abrirlo tras montar.
  dropdown: { reveal: (w) => w.vm.open?.() },
  "dropdown-menu": { reveal: (w) => w.vm.open?.() },
  popover: { reveal: (w) => w.vm.open?.() },
  "command-palette": { reveal: (w) => w.vm.open?.() },

  // Visibilidad por prop/estado.
  modal: { slotProps: { title: "Título" }, reveal: (w) => w.vm.open?.() },
  "side-over": { slotProps: { modelValue: true } }, // Teleport → se busca en document.body
  // El panel del tooltip vive en el Popover interno: hay que abrirlo.
  tooltip: {
    slotProps: { text: "ayuda" },
    reveal: (w) => {
      const popover = w.findComponent({ name: "Popover" });
      (popover?.vm as { open?: () => void } | undefined)?.open?.();
    },
  },

  // Slots condicionados por datos/props (cada slot puede necesitar su estado).
  "advanced-table": {
    slots: {
      search: { slotProps: { searchEnabled: true, data: [], columns: [] } },
    },
  },
  table: {
    slots: {
      template: { slotProps: { data: [{ id: 1 }], columns: [{ key: "id", label: "ID" }] } },
      empty: { slotProps: { data: [], columns: [{ key: "id", label: "ID" }] } },
    },
  },
  "editable-table-cell": { slotProps: { value: "x" } },
  select: { slotProps: { options: [{ value: "a", label: "A" }] } },
};
