import { defineCustomElement } from "vue";
import Pagination from "@/components/customElements/controls/Pagination.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuPagination = defineCustomElement(Pagination);
customElements.define("cu-pagination", CuPagination);

export default CuPagination;
