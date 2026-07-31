import { defineCustomElement } from "vue";
import Select from "@/components/customElements/form/Select.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuSelect = defineCustomElement(Select);
customElements.define("cu-select", CuSelect);

export default CuSelect;
