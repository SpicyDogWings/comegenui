import CuModal from "../components/Modal.ce.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof CuModal> = {
  title: "Components/Modal",
  component: CuModal,
  tags: ["autodocs"],
  argTypes: {
    title: {
      control: "text",
      description: "The title of the modal",
    },
    description: {
      control: "text",
      description: "The description text",
    },
    persistent: {
      control: "boolean",
      description: "Whether the modal cannot be closed by clicking outside",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg", "xl", "full"],
      description: "The width size of the modal",
    },
    height: {
      control: "select",
      options: ["auto", "sm", "md", "lg", "xl", "full"],
      description: "The height of the modal",
    },
  },
  args: {
    title: "Modal Title",
    description: "This is a modal dialog",
    persistent: false,
    size: "md",
    height: "auto",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    title: "Primary Modal",
    description: "This is a primary modal dialog",
  },
  render: (args) => ({
    components: { CuModal },
    setup: () => {
      const modalRef = ref(null);
      return { args, modalRef };
    },
    template: `
      <div>
        <CuModal v-bind='args' ref="modalRef">
          <template #trigger>
            <button @click="modalRef?.open()" class="bg-primary text-white px-4 py-2 rounded">Open Modal</button>
          </template>
          Modal content goes here
        </CuModal>
      </div>
    `,
  }),
};

export const Sizes: Story = {
  render: () => ({
    components: { CuModal },
    setup: () => {
      const sizes = ["sm", "md", "lg", "xl"] as const;
      const modals = ref([]);
      return { sizes, modals };
    },
    template: `
      <div class="flex gap-4 flex-wrap">
        <div v-for="(size, index) in sizes" :key="size">
          <CuModal :size="size" :title="'Modal ' + size" ref="modals[index]">
            <template #trigger>
              <button @click="modals[index]?.open()" class="bg-primary text-white px-4 py-2 rounded">
                Open {{ size }}
              </button>
            </template>
            Content for {{ size }} modal
          </CuModal>
        </div>
      </div>
    `,
  }),
};

export const Persistent: Story = {
  args: {
    persistent: true,
    title: "Persistent Modal",
    description: "Cannot be closed by clicking outside",
  },
  render: (args) => ({
    components: { CuModal },
    setup: () => {
      const modalRef = ref(null);
      return { args, modalRef };
    },
    template: `
      <div>
        <CuModal v-bind='args' ref="modalRef">
          <template #trigger>
            <button @click="modalRef?.open()" class="bg-primary text-white px-4 py-2 rounded">Open Persistent Modal</button>
          </template>
          This modal cannot be closed by clicking outside.
        </CuModal>
      </div>
    `,
  }),
};
