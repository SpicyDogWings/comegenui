import { defineCustomElement } from "vue";
import Pagination from "./Pagination.ce.vue";

const comegenPagination = defineCustomElement(Pagination);
customElements.define("cu-pagination", comegenPagination);

export default comegenPagination;
