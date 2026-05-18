import TestTableData from "../components/TestTableData.vue";

import type { Meta, StoryObj } from "@storybook/vue3";

const meta: Meta<typeof TestTableData> = {
  title: "Components/Test/useTableData",
  component: TestTableData,
  tags: ["autodocs"],
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => ({
    components: { TestTableData },
    setup: () => ({ args }),
    template: "<TestTableData v-bind='args' />",
  }),
};
