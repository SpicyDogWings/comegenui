import { defineComegenElement } from "@/utils/comegen-element";
import Pagination from "@/components/customElements/controls/Pagination.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuPagination = defineComegenElement("cu-pagination", Pagination);

export default CuPagination;
