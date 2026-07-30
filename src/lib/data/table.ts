import { defineCustomElement } from "vue";
import Table from "@/components/customElements/data/Table.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuTable = defineCustomElement(Table);
customElements.define("cu-table", CuTable);

export default CuTable;
