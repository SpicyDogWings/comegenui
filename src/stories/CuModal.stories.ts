import CuModal from "../components/Modal.ce.vue";
import CuButton from "../components/Button.ce.vue";
import CuInput from "../components/form/Input.ce.vue";
import CuTable from "../components/Table.ce.vue";
import { ref } from "vue";

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

// 1. Default
export const Default: Story = {
  args: {
    title: "Modal Title",
    description: "This is a default modal dialog",
  },
  render: (args) => ({
    components: { CuModal, CuButton },
    setup: () => {
      const modalRef = ref(null);
      return { args, modalRef };
    },
    template: `
      <div>
        <CuButton @click="modalRef?.open()" color="primary" variant="solid" class="mb-4">Open Modal</CuButton>
        <CuModal v-bind='args' ref="modalRef">
          <p class="font-sans">Modal content goes here</p>
        </CuModal>
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
    components: { CuModal, CuButton },
    setup: () => {
      const modalRef = ref(null);
      return { args, modalRef };
    },
    template: `
      <div>
        <CuButton @click="modalRef?.open()" color="primary" variant="solid" class="mb-4">Open Persistent Modal</CuButton>
        <CuModal v-bind='args' ref="modalRef">
          <p class="font-sans mb-4">This modal cannot be closed by clicking outside.</p>
          <template #footer>
            <CuButton @click="modalRef?.close()" color="primary" variant="solid">Close</CuButton>
          </template>
        </CuModal>
      </div>
    `,
  }),
};

// 3. With Sizes
export const WithSizes: Story = {
  render: () => ({
    components: { CuModal, CuButton },
    setup: () => {
      const sizes = ["sm", "md", "lg", "xl", "full"] as const;
      const modalRefs = ref<any[]>([]);
      return { sizes, modalRefs };
    },
    template: `
      <div class="flex gap-4 flex-wrap">
        <div v-for="(size, index) in sizes" :key="size">
          <CuButton @click="modalRefs[index]?.open()" color="primary" variant="solid">
            Open {{ size }}
          </CuButton>
          <CuModal :size="size" :title="'Modal ' + size" :ref="(el) => modalRefs[index] = el">
            <p class="font-sans">Content for {{ size }} modal</p>
          </CuModal>
        </div>
      </div>
    `,
  }),
};

// 4. With Heights
export const WithHeights: Story = {
  render: () => ({
    components: { CuModal, CuButton },
    setup: () => {
      const heights = ["auto", "sm", "md", "lg", "xl", "full"] as const;
      const modalRefs = ref<any[]>([]);
      return { heights, modalRefs };
    },
    template: `
      <div class="flex gap-4 flex-wrap">
        <div v-for="(height, index) in heights" :key="height">
          <CuButton @click="modalRefs[index]?.open()" color="primary" variant="solid">
            Open {{ height }}
          </CuButton>
          <CuModal :height="height" :title="'Height: ' + height" :ref="(el) => modalRefs[index] = el">
            <p class="font-sans">Content with height: {{ height }}</p>
          </CuModal>
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
    components: { CuModal, CuButton, CuInput },
    setup: () => {
      const modalRef = ref(null);
      const name = ref("");
      const email = ref("");
      return { args, modalRef, name, email };
    },
    template: `
      <div>
        <CuButton @click="modalRef?.open()" color="primary" variant="solid" class="mb-4">Open Form Modal</CuButton>
        <CuModal v-bind='args' ref="modalRef">
          <div class="space-y-4 p-4 flex flex-col gap-4">
            <CuInput v-model="name" placeholder="Name" class="w-full" color="neutral" variant="ghost" />
            <CuInput v-model="email" placeholder="Email" class="w-full" color="neutral" variant="ghost" type="email" />
          </div>
          <template #footer>
            <div class="flex gap-2 justify-end">
              <CuButton @click="modalRef?.close()" color="neutral" variant="ghost">Cancel</CuButton>
              <CuButton @click="modalRef?.close()" color="primary" variant="solid">Save</CuButton>
            </div>
          </template>
        </CuModal>
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
    components: { CuModal, CuButton },
    setup: () => {
      const modalRef = ref(null);
      return { args, modalRef };
    },
    template: `
      <div>
        <CuButton @click="modalRef?.open()" color="danger" variant="solid" class="mb-4">Delete Item</CuButton>
        <CuModal v-bind='args' ref="modalRef">
          <p class="font-sans mb-4">This action cannot be undone.</p>
          <template #footer>
            <div class="flex gap-2 justify-end">
              <CuButton @click="modalRef?.close()" color="neutral" variant="ghost">Cancel</CuButton>
              <CuButton @click="modalRef?.close()" color="danger" variant="solid">Delete</CuButton>
            </div>
          </template>
        </CuModal>
      </div>
    `,
  }),
};

// 7. With Table And Search
export const WithTableAndSearch: Story = {
  args: {
    title: "Search Users",
    size: "lg",
    height: "full",
  },
  render: (args) => ({
    components: { CuModal, CuButton, CuTable },
    setup: () => {
      const modalRef = ref(null);
      const columns = [
        { key: "id", label: "ID" },
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
      ];
      const data = Array.from({ length: 20 }, (_, i) => ({
        id: i + 1,
        name: `User ${i + 1}`,
        email: `user${i + 1}@example.com`,
      }));
      return { args, modalRef, columns, data };
    },
    template: `
      <div>
        <CuButton @click="modalRef?.open()" color="primary" variant="solid" class="mb-4">Open Table Modal</CuButton>
        <CuModal v-bind='args' ref="modalRef">
          <CuTable :columns="columns" :data="data" search-enabled table-max-height="400px" />
          <template #footer>
            <CuButton @click="modalRef?.close()" color="neutral" variant="ghost">Close</CuButton>
          </template>
        </CuModal>
      </div>
    `,
  }),
};
