import { defineComegenElement } from "@/utils/comegen-element";
import Select from "@/components/customElements/form/Select.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuSelect = defineComegenElement("cu-select", Select);

export default CuSelect;
