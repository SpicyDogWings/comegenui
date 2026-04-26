import { defineCustomElement } from "vue";
import Table from "./Table.ce.vue";

const comegenTable = defineCustomElement(Table);
customElements.define("cu-badge", comegenTable);

export default comegenTable;
