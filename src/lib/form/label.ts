import { defineComegenElement } from "@/utils/comegen-element";
import Label from "@/components/customElements/form/Label.ce.vue";
import { initTokens } from "@/plugins/cu-tokens/css";

initTokens();

const CuLabel = defineComegenElement("cu-label", Label);

export default CuLabel;
