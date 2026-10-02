import { defineComegenElement } from "@/utils/comegen-element";
import Table from "@/components/customElements/data/AdvancedTable.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuTable = defineComegenElement("cu-table", Table);

export default CuTable;
