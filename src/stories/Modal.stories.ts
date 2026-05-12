import Modal from "../components/Modal.vue";
import Button from "../components/Button.vue";
import Input from "../components/form/Input.vue";
import { ref } from "vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof Modal> = {
  title: "Components/Modal",
  component: Modal,
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
      options: ["auto", "sm", "md", "lg", "xl", "full"],
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
    size: "auto",
    height: "auto",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

// 1. Default
export const Default: Story = {
  args: {
    title: "Modal Title",
    description: "This is a default modal dialog",
  },
  render: (args) => ({
    components: { Modal, Button },
    setup: () => {
      const modalRef = ref<InstanceType<typeof Modal> | null>(null);
      return { args, modalRef };
    },
    template: `
      <div>
        <Button @click="modalRef?.open()" color="#3b82f6" variant="solid" class="mb-4">Open Modal</Button>
        <Modal v-bind='args' ref="modalRef">
          <p class="font-sans">Modal content goes here</p>
        </Modal>
      </div>
    `,
  }),
};

// 2. Persistent
export const Persistent: Story = {
  args: {
    title: "Persistent Modal",
    description: "Cannot be closed by clicking outside",
    persistent: true,
  },
  render: (args) => ({
    components: { Modal, Button },
    setup: () => {
      const modalRef = ref<InstanceType<typeof Modal> | null>(null);
      return { args, modalRef };
    },
    template: `
      <div>
        <Button @click="modalRef?.open()" color="#3b82f6" variant="solid" class="mb-4">Open Persistent Modal</Button>
        <Modal v-bind='args' ref="modalRef">
          <p class="font-sans mb-4">This modal cannot be closed by clicking outside.</p>
          <template #footer>
            <Button @click="modalRef?.close()" color="#3b82f6" variant="solid">Close</Button>
          </template>
        </Modal>
      </div>
    `,
  }),
};

// 3. With Sizes
export const WithSizes: Story = {
  render: () => ({
    components: { Modal, Button },
    setup: () => {
      const sizes = ["auto", "sm", "md", "lg", "xl", "full"] as const;
      const modalRefs = ref<(InstanceType<typeof Modal> | null)[]>([]);
      return { sizes, modalRefs };
    },
    template: `
      <div class="flex gap-4 flex-wrap">
        <div v-for="(size, index) in sizes" :key="size">
          <Button @click="modalRefs[index]?.open()" color="#3b82f6" variant="solid">
            Open {{ size }}
          </Button>
          <Modal :size="size" :title="'Modal ' + size" :ref="(el) => modalRefs[index] = el">
            <p class="font-sans">Content for {{ size }} modal</p>
          </Modal>
        </div>
      </div>
    `,
  }),
};

// 4. With Heights
export const WithHeights: Story = {
  render: () => ({
    components: { Modal, Button },
    setup: () => {
      const heights = ["auto", "sm", "md", "lg", "xl", "full"] as const;
      const modalRefs = ref<(InstanceType<typeof Modal> | null)[]>([]);
      return { heights, modalRefs };
    },
    template: `
      <div class="flex gap-4 flex-wrap">
        <div v-for="(height, index) in heights" :key="height">
          <Button @click="modalRefs[index]?.open()" color="#3b82f6" variant="solid">
            Open {{ height }}
          </Button>
          <Modal :height="height" :title="'Height: ' + height" :ref="(el) => modalRefs[index] = el">
            <p class="font-sans">Content with height: {{ height }}</p>
          </Modal>
        </div>
      </div>
    `,
  }),
};

// 5. With Form
export const WithForm: Story = {
  args: {
    title: "Create User",
    persistent: true,
    size: "md",
  },
  render: (args) => ({
    components: { Modal, Button, Input },
    setup: () => {
      const modalRef = ref<InstanceType<typeof Modal> | null>(null);
      const name = ref("");
      const email = ref("");
      return { args, modalRef, name, email };
    },
    template: `
      <div>
        <Button @click="modalRef?.open()" color="#3b82f6" variant="solid" class="mb-4">Open Form Modal</Button>
        <Modal v-bind='args' ref="modalRef">
          <div class="space-y-4 p-4 flex flex-col gap-4">
            <Input v-model="name" placeholder="Name" class="w-full" color="#2c2c2c" variant="ghost" />
            <Input v-model="email" placeholder="Email" class="w-full" color="#2c2c2c" variant="ghost" type="email" />
          </div>
          <template #footer>
            <div class="flex gap-2 justify-end">
              <Button @click="modalRef?.close()" color="#2c2c2c" variant="ghost">Cancel</Button>
              <Button @click="modalRef?.close()" color="#3b82f6" variant="solid">Save</Button>
            </div>
          </template>
        </Modal>
      </div>
    `,
  }),
};

// 6. With Confirm
export const WithConfirm: Story = {
  args: {
    title: "Confirm Action",
    description: "Are you sure you want to delete this item?",
    persistent: true,
    size: "sm",
  },
  render: (args) => ({
    components: { Modal, Button },
    setup: () => {
      const modalRef = ref<InstanceType<typeof Modal> | null>(null);
      return { args, modalRef };
    },
    template: `
      <div>
        <Button @click="modalRef?.open()" color="#ef4444" variant="solid" class="mb-4">Delete Item</Button>
        <Modal v-bind='args' ref="modalRef">
          <p class="font-sans mb-4">This action cannot be undone.</p>
          <template #footer>
            <div class="flex gap-2 justify-end">
              <Button @click="modalRef?.close()" color="#2c2c2c" variant="ghost">Cancel</Button>
              <Button @click="modalRef?.close()" color="#ef4444" variant="solid">Delete</Button>
            </div>
          </template>
        </Modal>
      </div>
    `,
  }),
};
