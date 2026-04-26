import { defineCustomElement } from "vue";
import Table from "./Table.ce.vue";

const comegenTable = defineCustomElement(Table);
customElements.define("cu-table", comegenTable);

export default comegenTable;
